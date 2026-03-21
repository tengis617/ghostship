import { NextRequest } from "next/server";
import { captureScreenshot } from "@/lib/screenshot";
import { analyzePageAndGeneratePersonas } from "@/lib/generate-personas";
import { evaluatePage } from "@/lib/evaluate";
import { synthesizeEvaluations } from "@/lib/synthesize";

// Sequential + Parallel workflow (AI SDK pattern)
// Step 1: Screenshot (capture)
// Step 2: Analyze (agent describes page + generates personas)
// Step 3: Evaluate (parallel — each persona evaluates independently)
// Step 4: Synthesize (aggregate all evaluations into report)

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== "string") {
    return new Response(JSON.stringify({ error: "URL is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    new URL(url);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid URL" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      }

      try {
        // Step 1: Screenshot
        send("step", { id: "screenshot", status: "active" });
        const png = await captureScreenshot(url);
        const thumbnail = `data:image/png;base64,${png.toString("base64")}`;
        send("screenshot", { thumbnail });
        send("step", { id: "screenshot", status: "complete" });

        // Step 2: Analyze — agent describes page + generates personas
        send("step", { id: "analyze", status: "active" });
        const analysis = await analyzePageAndGeneratePersonas(png, url);
        send("analysis", {
          description: analysis.description,
          pageType: analysis.pageType,
        });
        for (const persona of analysis.personas) {
          send("persona", persona);
        }
        send("step", { id: "analyze", status: "complete" });

        // Step 3: Evaluate — parallel processing, each persona independently
        send("step", { id: "evaluate", status: "active" });
        const evaluationPromises = analysis.personas.map(async (persona) => {
          const evaluation = await evaluatePage(persona, png, url);
          send("evaluation", evaluation);
          return evaluation;
        });
        const results = await Promise.all(evaluationPromises);
        send("step", { id: "evaluate", status: "complete" });

        // Step 4: Synthesize — aggregate all results
        send("step", { id: "synthesize", status: "active" });
        const synthesis = await synthesizeEvaluations(
          analysis.description,
          results,
          url
        );
        send("synthesis", synthesis);
        send("step", { id: "synthesize", status: "complete" });

        send("done", {});
      } catch (error) {
        send("error", {
          message:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
