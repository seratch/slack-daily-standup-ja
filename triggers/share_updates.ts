import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import workflow from "../workflows/share_updates.ts";

// アップデートの内容を送信するためのモーダルを開きます
// slack trigger create --trigger-def triggers/share_updates.ts
const trigger: Trigger<typeof workflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "デイリースタンドアップでアップデートを共有",
  description:
    "クリックして開いたフォームでデータ送信するとその内容が元のメッセージのスレッドに投稿されます",
  workflow: `#/workflows/${workflow.definition.callback_id}`,
  inputs: {
    interactivity: { value: TriggerContextData.Shortcut.interactivity },
    user_id: { value: TriggerContextData.Shortcut.user_id },
    channel_id: { value: TriggerContextData.Shortcut.channel_id },
    message_ts: { value: TriggerContextData.Shortcut.message_ts },
  },
};

// export defualt でなければならないので変更しないでください
export default trigger;
