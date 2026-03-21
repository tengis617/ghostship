import { Composition, Folder } from "remotion";
import { SlackDemo } from "./SlackDemo";
import { GitHubDemo } from "./GitHubDemo";

export const RemotionRoot = () => {
  return (
    <Folder name="Demos">
      <Composition
        id="SlackDemo"
        component={SlackDemo}
        durationInFrames={300}
        fps={30}
        width={1200}
        height={675}
      />
      <Composition
        id="GitHubDemo"
        component={GitHubDemo}
        durationInFrames={300}
        fps={30}
        width={1200}
        height={675}
      />
    </Folder>
  );
};
