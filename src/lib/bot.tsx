/** @jsxImportSource chat */
import { createMemoryState } from "@chat-adapter/state-memory";
import { createRedisState } from "@chat-adapter/state-redis";
import {
  Actions,
  type AiMessage,
  Button,
  Card,
  CardLink,
  Chat,
  Divider,
  emoji,
  Field,
  Fields,
  LinkButton,
  Modal,
  RadioSelect,
  Section,
  Select,
  SelectOption,
  Table,
  CardText as Text,
  TextInput,
  toAiMessages,
} from "chat";
import { createGhostshipAgent, type PrContext } from "./agent";
import { buildAdapters } from "./adapters";

const state = process.env.REDIS_URL
  ? createRedisState({
      url: process.env.REDIS_URL,
      keyPrefix: "ghostship-webhooks",
    })
  : createMemoryState();
const adapters = buildAdapters();

// Define thread state type
interface ThreadState {
  aiMode?: boolean;
  history?: AiMessage[];
}

// Create the bot instance with typed thread state
// @ts-expect-error Adapters type lacks string index signature
export const bot = new Chat<typeof adapters, ThreadState>({
  userName: process.env.BOT_USERNAME || "ghostship",
  adapters,
  state,
  logger: "debug",
});

// Parse GitHub thread ID → PR context (github:owner/repo:prNumber)
function parseGitHubThreadId(threadId: string): PrContext | undefined {
  const match = threadId.match(/^github:([^/]+)\/([^:]+):(\d+)/);
  if (!match) return undefined;
  return { owner: match[1], repo: match[2], prNumber: parseInt(match[3], 10) };
}

// Create a per-request agent with the thread bound for plan block streaming
function createAgent(thread?: { id: string; adapter: unknown }) {
  return createGhostshipAgent(
    thread as Parameters<typeof createGhostshipAgent>[0]
  );
}

// Acknowledge a mention with an eyes reaction (best-effort, no-op on failure)
async function ackWithReaction(thread: { adapter: { addReaction(threadId: string, messageId: string, emojiVal: unknown): Promise<void> }; id: string }, messageId: string) {
  try {
    await thread.adapter.addReaction(thread.id, messageId, emoji.eyes);
  } catch {
    // Some platforms don't support reactions — ignore
  }
}

// Build conversation history from thread messages
async function getHistory(thread: { adapter: { fetchMessages(threadId: string, options?: unknown): Promise<{ messages: unknown[] }> }; id: string; state: Promise<ThreadState | null> }): Promise<AiMessage[]> {
  try {
    const result = await thread.adapter.fetchMessages(thread.id, { limit: 20 });
    if (result.messages.length > 0) {
      return toAiMessages(result.messages as Parameters<typeof toAiMessages>[0]);
    }
  } catch { /* fetchMessages not supported */ }
  // Fallback to stored history
  const threadState = await thread.state;
  return threadState?.history ?? [];
}

// Handle new @mentions of the bot
bot.onNewMention(async (thread, message) => {
  await thread.subscribe();
  await ackWithReaction(thread, message.id);

  // Build prompt with optional PR context
  const pr =
    thread.adapter.name === "github"
      ? parseGitHubThreadId(thread.id)
      : undefined;
  const contextHint = pr
    ? `\n[Context: You are on GitHub PR #${pr.prNumber} on ${pr.owner}/${pr.repo}. Use get_pr_changed_files and find_vercel_preview_url to analyze it.]`
    : "";

  const history = await toAiMessages([message]);
  if (contextHint) {
    history[history.length - 1] = {
      ...history[history.length - 1],
      content: history[history.length - 1].content + contextHint,
    };
  }

  await thread.startTyping("👻 Thinking...");
  try {
    const agent = createAgent(thread);
    const result = await agent.stream({ prompt: history });
    await thread.post(result.fullStream);
  } catch (err) {
    console.error("GhostShip error:", err);
    await thread.post(
      `${emoji.warning} ${err instanceof Error ? err.message : "Something went wrong"}`
    );
  }
});

// Post a welcome message when the bot is added to a channel
bot.onMemberJoinedChannel(async (event) => {
  // Only post when the bot itself joins
  if (event.userId !== event.adapter.botUserId) {
    return;
  }

  await event.adapter.postMessage(
    event.channelId,
    "*ghostship is available in this channel.* Tag @ghostship to begin."
  );
});

// Handle direct messages — conversational GhostShip agent
bot.onDirectMessage(async (_thread, message, channel) => {
  await channel.startTyping("👻 Thinking...");
  let history: AiMessage[];
  try {
    const messages: (typeof message)[] = [];
    for await (const msg of channel.messages) {
      messages.push(msg);
      if (messages.length >= 20) break;
    }
    history =
      messages.length > 0
        ? await toAiMessages(messages)
        : await toAiMessages([message]);
  } catch {
    history = await toAiMessages([message]);
  }
  try {
    const agent = createAgent(channel);
    const result = await agent.stream({ prompt: history });
    await channel.post(result.fullStream);
  } catch (err) {
    console.error("GhostShip DM error:", err);
    await channel.post(
      `${emoji.warning} ${
        err instanceof Error ? err.message : "Something went wrong"
      }`
    );
  }
});

bot.onAction("show_channel_help", async (event) => {
  if (!event.thread) {
    return;
  }
  const platforms = Object.keys(adapters).join(", ") || "none configured";
  await event.thread.post(
    <Card title={`${emoji.question} Help`}>
      <Text>{`Here's how I can help:`}</Text>
      <Divider />
      <Section>
        <Text>{`${emoji.star} **Mention me** to start a conversation`}</Text>
        <Text>{`${emoji.sparkles} **Mention me with "AI"** to enable AI assistant mode`}</Text>
        <Text>{`${emoji.eyes} I'll respond to messages in threads where I'm mentioned`}</Text>
        <Text>{`${emoji.fire} React to my messages and I'll react back!`}</Text>
        <Text>{`${emoji.rocket} Active platforms: ${platforms}`}</Text>
      </Section>
    </Card>
  );
});

bot.onAction("ephemeral", async (event) => {
  if (!event.thread) {
    return;
  }
  await event.thread.postEphemeral(
    event.user,
    <Card title={`${emoji.eyes} Ephemeral Message`}>
      <Text>
        Only you can see this message. It will disappear when you reload.
      </Text>
      <Text>Try opening a modal from this ephemeral:</Text>
      <Actions>
        <Button id="ephemeral_modal" style="primary">
          Open Modal
        </Button>
      </Actions>
    </Card>,
    { fallbackToDM: true }
  );
});

bot.onAction("ephemeral_modal", async (event) => {
  await event.openModal(
    <Modal
      callbackId="ephemeral_modal_form"
      closeLabel="Cancel"
      submitLabel="Submit"
      title="Ephemeral Modal"
    >
      <TextInput
        id="response"
        label="Your Response"
        placeholder="Type something..."
      />
    </Modal>
  );
});

// @ts-expect-error async void handler vs ModalSubmitHandler return type
bot.onModalSubmit("ephemeral_modal_form", async (event) => {
  await event.relatedMessage?.edit(
    <Card title={`${emoji.check} Submitted!`}>
      <Text>Your response: **{event.values.response}**</Text>
      <Text>The original ephemeral message was updated.</Text>
    </Card>
  );
});

bot.onAction("quick_action", async (event) => {
  if (!event.thread) {
    return;
  }
  const action = event.value;
  if (action === "greet") {
    await event.thread.post(`${emoji.wave} Hello, ${event.user.fullName}!`);
  } else if (action === "info") {
    await event.thread.post(
      `${emoji.memo} You're on **${event.adapter.name}** in thread \`${event.threadId}\``
    );
  } else if (action === "help") {
    await event.thread.post(
      `${emoji.question} Try mentioning me with "AI" to enable AI assistant mode!`
    );
  }
});

bot.onAction("choose_plan", (event) => {
  if (!event.thread) {
    return;
  }
  event.thread.post(
    <Card title="Choose Plan">
      <Actions>
        <RadioSelect id="plan_selected" label="Choose Plan">
          <SelectOption
            description="Headers, body text, labels, and placeholders"
            label="*All text elements*"
            value="all_text"
          />
          <SelectOption
            description="Keep body text in the current system font"
            label="*Headers and titles only*"
            value="headers_titles"
          />
          <SelectOption
            description="Only the composer textarea and its placeholder"
            label="*Input fields and placeholders*"
            value="input_fields"
          />
          <SelectOption
            description="All text, but leave button labels unchanged"
            label="*Everything except buttons*"
            value="except_buttons"
          />
        </RadioSelect>
      </Actions>
    </Card>
  );
});
bot.onAction("plan_selected", (event) => {
  if (!event.thread) {
    return;
  }
  event.thread.post(
    <Card title={`${emoji.check} Plan Chosen!`}>
      <Text>You chose plan *{event.value}*</Text>
    </Card>
  );
});

// Handle card button actions
bot.onAction("hello", async (event) => {
  if (!event.thread) {
    return;
  }
  await event.thread.post(`${emoji.wave} Hello, ${event.user.fullName}!`);
});

bot.onAction("info", async (event) => {
  if (!event.thread) {
    return;
  }
  const threadState = await event.thread.state;
  await event.thread.post(
    <Card title="Bot Information">
      <Fields>
        <Field label="User" value={event.user.fullName} />
        <Field label="User ID" value={event.user.userId} />
        <Field label="Platform" value={event.adapter.name} />
        <Field label="Thread ID" value={event.threadId} />
        <Field
          label="AI Mode"
          // @ts-expect-error ThreadState generic not propagated through event
          value={threadState?.aiMode ? "Enabled" : "Disabled"}
        />
      </Fields>
    </Card>
  );
});

bot.onAction("goodbye", async (event) => {
  if (!event.thread) {
    return;
  }
  await event.thread.post(
    `${emoji.wave} Goodbye, ${event.user.fullName}! See you later.`
  );
});

bot.onAction("show-table", async (event) => {
  if (!event.thread) {
    return;
  }
  await event.thread.post(
    <Card title={`${emoji.memo} Team Directory`}>
      <Text>Here's the current team roster:</Text>
      <Table
        headers={["Name", "Role", "Location", "Status"]}
        rows={[
          ["Alice Chen", "Engineering Lead", "San Francisco", "Active"],
          ["Bob Smith", "Designer", "New York", "Active"],
          ["Carol Wu", "Product Manager", "London", "On Leave"],
          ["Dan Lee", "Backend Engineer", "Tokyo", "Active"],
          ["Eve Park", "Frontend Engineer", "Seoul", "Active"],
        ]}
      />
    </Card>
  );
});

// Feedback modal component
const FeedbackModal = (
  <Modal
    callbackId="feedback_form"
    closeLabel="Cancel"
    notifyOnClose
    submitLabel="Send"
    title="Send Feedback"
  >
    <TextInput
      id="message"
      label="Your Feedback"
      multiline
      placeholder="Tell us what you think..."
    />
    <Select id="category" label="Category" placeholder="Select a category">
      <SelectOption label="Bug Report" value="bug" />
      <SelectOption label="Feature Request" value="feature" />
      <SelectOption label="General Feedback" value="general" />
      <SelectOption label="Other" value="other" />
    </Select>
    <TextInput
      id="email"
      label="Email (optional)"
      optional
      placeholder="your@email.com"
    />
  </Modal>
);

// Open feedback modal
bot.onAction("feedback", async (event) => {
  await event.openModal(FeedbackModal);
});

bot.onSlashCommand("/ping", async (event) => {
  await event.channel.post(
    `Pong! Command invoked by ${event.user.fullName}${event.text ? `: ${event.text}` : ""}`
  );
});

// Opens feedback modal via /feedback
bot.onSlashCommand("/test-feedback", async (event) => {
  const result = await event.openModal(FeedbackModal);
  if (!result) {
    await event.channel.post(
      `${emoji.warning} Couldn't open the feedback modal. Please try again.`
    );
  }
});

// Open bug report modal with privateMetadata carrying context from button value
bot.onAction("report", async (event) => {
  await event.openModal(
    <Modal
      callbackId="report_form"
      privateMetadata={JSON.stringify({
        reportType: event.value,
        threadId: event.threadId,
        reporter: event.user.userId,
      })}
      submitLabel="Submit"
      title="Report Bug"
    >
      <TextInput
        id="title"
        label="Bug Title"
        placeholder="Brief description of the issue"
      />
      <TextInput
        id="steps"
        label="Steps to Reproduce"
        multiline
        placeholder="1. Go to...\n2. Click on..."
      />
      <Select id="severity" label="Severity">
        <SelectOption label="Low" value="low" />
        <SelectOption label="Medium" value="medium" />
        <SelectOption label="High" value="high" />
        <SelectOption label="Critical" value="critical" />
      </Select>
    </Modal>
  );
});

// Handle bug report modal — reads context from privateMetadata
bot.onModalSubmit("report_form", async (event) => {
  console.log("report_form privateMetadata:", event.privateMetadata);
  const metadata = event.privateMetadata
    ? JSON.parse(event.privateMetadata)
    : {};
  const { title, steps, severity } = event.values;

  if (!title || title.length < 3) {
    return {
      action: "errors" as const,
      errors: { title: "Title must be at least 3 characters" },
    };
  }

  await event.relatedThread?.post(
    <Card title={`${emoji.memo} Bug Report Filed`}>
      <Fields>
        <Field label="Title" value={title} />
        <Field label="Severity" value={severity} />
        <Field label="Reporter" value={event.user.fullName} />
        <Field label="Report Type" value={metadata.reportType || "unknown"} />
        <Field label="Thread" value={metadata.threadId || "unknown"} />
      </Fields>
      <Divider />
      <Text>{`**Steps to Reproduce:**\n${steps}`}</Text>
    </Card>
  );
});

// Handle modal submission
bot.onModalSubmit("feedback_form", async (event) => {
  const { message, category, email } = event.values;

  // Validate message
  if (!message || message.length < 5) {
    return {
      action: "errors" as const,
      errors: { message: "Feedback must be at least 5 characters" },
    };
  }

  // Log the feedback
  console.log("Received feedback:", {
    message,
    category,
    email,
    user: event.user.userName,
  });
  await event.relatedMessage?.edit(`${emoji.check} **Feedback received!**`);
  const target = event.relatedChannel || event.relatedThread;
  await target?.postEphemeral(
    event.user,
    <Card title={`${emoji.check} Feedback received!`}>
      <Text>Thank you for your feedback!</Text>
      <Fields>
        <Field label="User" value={event.user.fullName} />
        <Field label="Category" value={category} />
        <Field label="Message" value={message} />
        <Field label="Email" value={email} />
      </Fields>
    </Card>,
    { fallbackToDM: false }
  );
});

// Handle modal close (cancel)
bot.onModalClose("feedback_form", (event) => {
  console.log(`${event.user.userName} cancelled the feedback form`);
});

// Demonstrate fetchMessages and allMessages
bot.onAction("messages", async (event) => {
  if (!event.thread) {
    return;
  }
  const { thread } = event;

  // Helper to get display text for a message (handles empty text from cards)
  const getDisplayText = (text: string, hasAttachments?: boolean) => {
    if (text?.trim()) {
      const truncated = text.slice(0, 30);
      return text.length > 30 ? `${truncated}...` : truncated;
    }
    // Empty text - likely a card or attachment-only message
    return hasAttachments ? "[Attachment]" : "[Card]";
  };

  try {
    // 1. fetchMessages with backward direction (default) - gets most recent messages
    const recentResult = await thread.adapter.fetchMessages(thread.id, {
      limit: 5,
      direction: "backward",
    });

    // 2. fetchMessages with forward direction - gets oldest messages first
    const oldestResult = await thread.adapter.fetchMessages(thread.id, {
      limit: 5,
      direction: "forward",
    });

    // 3. allMessages iterator - iterate through all messages (uses forward direction)
    const allMessages: string[] = [];
    let count = 0;
    for await (const msg of thread.allMessages) {
      const displayText = getDisplayText(
        msg.text,
        msg.attachments && msg.attachments.length > 0
      );
      allMessages.push(
        `Msg ${count + 1}: ${msg.author.userName} - ${displayText}`
      );
      count++;
    }

    // Format results
    const formatMessages = (msgs: typeof recentResult.messages) =>
      msgs.length > 0
        ? msgs
            .map((m, i) => {
              const displayText = getDisplayText(
                m.text,
                m.attachments && m.attachments.length > 0
              );
              return `Msg ${i + 1}: ${m.author.userName} - ${displayText}`;
            })
            .join("\n\n")
        : "(no messages)";

    await thread.post(
      <Card title={`${emoji.memo} Message Fetch Results`}>
        <Section>
          <Text>**fetchMessages (backward, limit: 5)**</Text>
          <Text>Gets most recent messages, cursor points to older</Text>
          <Text>{formatMessages(recentResult.messages)}</Text>
          <Text>{`Next cursor: ${
            recentResult.nextCursor ? "yes" : "none"
          }`}</Text>
        </Section>
        <Divider />
        <Section>
          <Text>**fetchMessages (forward, limit: 5)**</Text>
          <Text>Gets oldest messages first, cursor points to newer</Text>
          <Text>{formatMessages(oldestResult.messages)}</Text>
          <Text>{`Next cursor: ${
            oldestResult.nextCursor ? "yes" : "none"
          }`}</Text>
        </Section>
        <Divider />
        <Section>
          <Text>**allMessages iterator**</Text>
          <Text>Iterates from oldest to newest using forward direction</Text>
          <Text>
            {allMessages.length > 0
              ? allMessages.join("\n\n")
              : "(no messages)"}
          </Text>
        </Section>
      </Card>
    );
  } catch (err) {
    await thread.post(
      `${emoji.warning} Error fetching messages: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
});

// Demonstrate channel abstraction: read channel messages and post summary
bot.onAction("channel-post", async (event) => {
  if (!event.thread) {
    return;
  }
  const { thread } = event;
  const channel = thread.channel;

  try {
    // Fetch channel info for the name
    const info = await channel.fetchMetadata();
    const channelName = info.name || channel.id;

    // Get the last 3 top-level channel messages using the backward iterator
    const recent: string[] = [];
    for await (const msg of channel.messages) {
      const preview = msg.text?.trim()
        ? msg.text.slice(0, 50)
        : "[Card/Attachment]";
      recent.push(`- ${msg.author.userName}: ${preview}`);
      if (recent.length >= 3) {
        break;
      }
    }

    const summary =
      recent.length > 0 ? recent.join("\n\n") : "(no top-level messages found)";

    await channel.post(
      <Card title={`${emoji.memo} Channel Summary`}>
        <Section>
          <Text>{`Channel: ${channelName}`}</Text>
          <Text>**Last 3 top-level messages:**</Text>
          <Text>{summary}</Text>
        </Section>
      </Card>
    );
  } catch (err) {
    await thread.post(
      `${emoji.warning} Error reading channel: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
  }
});

// Helper to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Handle messages matching a pattern
bot.onNewMessage(/help/i, async (thread, message) => {
  const platforms = Object.keys(adapters).join(", ") || "none configured";
  await thread.post(
    <Card title={`${emoji.question} Help`}>
      <Text>{`Hi ${message.author.userName}! Here's how I can help:`}</Text>
      <Divider />
      <Section>
        <Text>{`${emoji.star} **Mention me** to start a conversation`}</Text>
        <Text>{`${emoji.sparkles} **Mention me with "AI"** to enable AI assistant mode`}</Text>
        <Text>{`${emoji.eyes} I'll respond to messages in threads where I'm mentioned`}</Text>
        <Text>{`${emoji.fire} React to my messages and I'll react back!`}</Text>
        <Text>{`${emoji.rocket} Active platforms: ${platforms}`}</Text>
      </Section>
    </Card>
  );
});

// Handle messages in subscribed threads — continue the conversation
bot.onSubscribedMessage(async (thread, message) => {
  if (!(thread.adapter.name === "telegram" || message.isMention)) {
    return;
  }

  const pr =
    thread.adapter.name === "github"
      ? parseGitHubThreadId(thread.id)
      : undefined;
  const contextHint = pr
    ? `\n[Context: GitHub PR #${pr.prNumber} on ${pr.owner}/${pr.repo}]`
    : "";

  const history = await getHistory(thread);
  // Append current message if not already in history
  if (
    history.length === 0 ||
    history[history.length - 1].content !== message.text
  ) {
    history.push({
      role: "user" as const,
      content: message.text + contextHint,
    });
  }

  await thread.startTyping("👻 Thinking...");
  try {
    const agent = createAgent(thread);
    const result = await agent.stream({ prompt: history });
    await thread.post(result.fullStream);
    // Persist history for platforms without fetchMessages
    const responseText = await result.text;
    history.push({ role: "assistant", content: responseText });
    await thread.setState({ history });
  } catch (err) {
    console.error("GhostShip error:", err);
    await thread.post(
      `${emoji.warning} ${err instanceof Error ? err.message : "Something went wrong"}`
    );
  }
});

/* ── Legacy demo handlers below (kept for button actions, modals, reactions) ── */

// Handle emoji reactions - respond with a matching emoji or message
bot.onReaction(["thumbs_up", "heart", "fire", "rocket"], async (event) => {
  // Only respond to added reactions, not removed ones
  if (!event.added) {
    return;
  }

  // GChat and Teams bots cannot add reactions via their APIs
  // Respond with a message instead
  if (event.adapter.name === "gchat" || event.adapter.name === "teams") {
    await event.adapter.postMessage(
      event.threadId,
      `Thanks for the ${event.rawEmoji}!`
    );
    return;
  }

  // React to the same message with the same emoji
  // Adapters auto-convert normalized emoji to platform-specific format
  await event.adapter.addReaction(
    event.threadId,
    event.messageId,
    emoji.raised_hands
  );
});
