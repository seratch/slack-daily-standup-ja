import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import workflow from "../workflows/morning_reminder.ts";

// 手動でテストをするためのリンクトリガー
// slack trigger create --trigger-def triggers/morning_reminder_test.ts
const trigger: Trigger<typeof workflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "手動テスト：平日朝にデイリースタンドアップのリマインダーを送信",
  workflow: `#/workflows/${workflow.definition.callback_id}`,
  inputs: {},
};

// export defualt でなければならないので変更しないでください
export default trigger;
