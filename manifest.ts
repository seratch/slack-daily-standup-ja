import { Manifest } from "deno-slack-sdk/mod.ts";
import MorningReminder from "./workflows/morning_reminder.ts";
import ShareUpdates from "./workflows/share_updates.ts";

export default Manifest({
  name: "Daily Standup",
  description: "チャンネル上でデイリースタンドアップを運用する",
  icon: "assets/icon.png",
  workflows: [MorningReminder, ShareUpdates],
  botScopes: ["chat:write", "chat:write.public"],
});
