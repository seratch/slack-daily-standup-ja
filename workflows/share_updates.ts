import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const workflow = DefineWorkflow({
  callback_id: "share-updates-workflow",
  title: "デイリースタンドアップでアップデートを共有",
  input_parameters: {
    properties: {
      interactivity: { type: Schema.slack.types.interactivity },
      user_id: { type: Schema.slack.types.user_id },
      channel_id: { type: Schema.slack.types.channel_id },
      message_ts: { type: Schema.types.string },
    },
    required: [
      "interactivity",
      "user_id",
      "channel_id",
      "message_ts",
    ],
  },
});

const emoji = ":question:";
const q1 = "前日に対応した重要な事柄をシェアしてください";
const q2 = "今日やる予定のタスクをシェアしてください";
const q3 = "チームと相談したいことや課題があれば書いてください";

const form = workflow.addStep(Schema.slack.functions.OpenForm, {
  title: "デイリースタンドアップ",
  interactivity: workflow.inputs.interactivity,
  submit_label: "スレッドに投稿",
  fields: {
    elements: [
      {
        name: "q1",
        title: q1,
        type: Schema.types.string,
        long: true,
        description: "やったことを詳細まで全て網羅する必要はありません",
      },
      {
        name: "q2",
        title: q2,
        type: Schema.types.string,
        long: true,
        description: "やる予定のことを詳細まで全て網羅する必要はありません",
      },
      {
        name: "q3",
        title: q3,
        type: Schema.types.string,
        long: true,
        description:
          "もし何もなければスキップしても構いません。何か面白かったことを書いても OK です！",
      },
    ],
    required: ["q1", "q2"],
  },
});

workflow.addStep(Schema.slack.functions.ReplyInThread, {
  message_context: {
    channel_id: workflow.inputs.channel_id,
    message_ts: workflow.inputs.message_ts,
  },
  message: `:wave: <@${workflow.inputs.user_id}> さんのアップデート：

${emoji} *${q1}*
${form.outputs.fields.q1}

${emoji} *${q2}*
${form.outputs.fields.q2}

${emoji} *${q3}*
${form.outputs.fields.q3}
`,
});

export default workflow;
