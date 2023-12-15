import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerTypes } from "deno-slack-api/mod.ts";
import workflow from "../workflows/morning_reminder.ts";

// 毎朝のリマインダーを送信するスケジュールトリガー
// slack trigger create --trigger-def triggers/morning_reminder.ts
const trigger: Trigger<typeof workflow.definition> = {
  type: TriggerTypes.Scheduled,
  name: "平日朝にデイリースタンドアップのリマインダーを送信",
  workflow: `#/workflows/${workflow.definition.callback_id}`,
  // 参考: https://api.slack.com/automation/triggers/scheduled
  schedule: {
    // TODO: 以下の start_time を差し替えてください
    // start_time は未来の日時でなければならないことに注意してください
    // UTC での日付は以下のようにして取得することができます：
    // macOS: date -v09H -v00M -v00S -v+1d +%s | xargs date -u -Iseconds -r
    // Linux: date -u -d 'TZ="Asia/Tokyo" 09:00 tomorrow'
    start_time: "2023-12-16T00:00:00+00:00",
    frequency: {
      type: "weekly",
      on_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
};

// export defualt でなければならないので変更しないでください
export default trigger;
