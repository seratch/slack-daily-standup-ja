import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const workflow = DefineWorkflow({
  callback_id: "morning-reminder-workflow",
  title: "平日朝にデイリースタンドアップのリマインダーを送信",
  input_parameters: { properties: {}, required: [] },
});

// TODO: 以下のコマンドで生成されたものに差し替え
// slack trigger create --trigger-def triggers/share_updates.ts
const interactiveWorkflowTrigger =
  "https://slack.com/shortcuts/Ft06A42JJJ14/cdad026675c85ea88053fc0dacb364ac";

workflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: "CHE2DUW5V", // TODO: インストール先の実際のチャンネル ID に差し替え
  message: `*:handshake: Daily Standup (online) :handshake:*

<!here> :sunrise: おはようございます！デイリースタンドアップの時間です。

<${interactiveWorkflowTrigger}|ここ>をクリックしてチームにアップデートをシェアしましょう！ :writing_hand:`,
});

export default workflow;
