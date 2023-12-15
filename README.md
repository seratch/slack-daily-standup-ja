## デイリースクラム（Slack スタンダードワークフロー）

このリポジトリは、毎朝のデイリースクラムのためのスタンダードワークフローを CLI で開発・管理する例を示すサンプルです。

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/19163/026a779a-4d58-892b-059d-1534b5605ce6.png" width=600/>

このアプリは、二つのスタンダードワークフローの組み合わせで構成されています。

* **リマインダー**: 平日の朝、リマインダーのチャンネルメッセージを送信するワークフロー (`workflows/morning_reminder.ts`)
* **フォーム送信**: アップデートを投稿するためのフォームを提供するワークフロー (`workflows/share_updates.ts`)

これらを有効にするためには、いくつかの手順があるので、順を追って説明します。

## アプリをデプロイ

`slack deploy` コマンドで初回デプロイを実行します。「実行中にトリガーをつくるか？」と聞かれるので、その場合は `triggers/share_updates.ts` を指定して作成します。それをスキップした場合や、作り直す場合は `slack trigger create --trigger-def triggers/share_updates.ts` というコマンドでいつでも作成できます。

```
$ slack deploy
? Choose a deployed environment Install to a new team
? Install to a new team seratch T03E94MJU

🔔 If you leave this team, you can no longer manage the installed apps
   Installed apps will belong to the team if you leave the workspace

📚 App Manifest
   Created app manifest for "Daily Standup" in "Acme Corp"

🏠 App Install
   Installing "Daily Standup" app to "Acme Corp"
   Updated app icon: assets/icon.png
   Finished in 5.4s

⚡ Listing triggers installed to the app...
   There are no triggers installed for the app

⚡ Create a trigger
   Searching for trigger definition files under 'triggers/*'...
   Found 3 trigger definition files

? Choose a trigger definition file: triggers/share_updates.ts

⚡ Trigger successfully created!

   デイリースタンドアップでアップデートを共有 Ft06A42JJJ14 (shortcut)
   Created: 2023-12-15 16:51:18 +09:00 (1 second ago)
   Collaborators:
     Kaz Sera @seratch U03E94MK0
   Can be found and used by:
     everyone in the workspace
   https://slack.com/shortcuts/Ft06A42JJJ14/....

🎁 App packaged and ready to deploy
   0.002MB was packaged in 0.3s

🚀 Daily Standup deployed in 9.1s
   App Owner:  seratch (U03E94MK0)
   Workspace:  Acme Corp (T03E94MJU)
   Dashboard:  https://slack.com/apps/A06AAJ.....

🌩  Visit Slack to try out your live app!
   When you make any changes, update your app by re-running slack deploy

💌 We would love to know how things are going
   Survey your development experience with slack feedback --name platform-improvements
```

## 設定の変更

次にリマインダーの方のワークフローに 3 つほど設定をします。

`triggers/morning_reminder.ts` を開いて `trigger.schedule.start_time` を初回実行の日時に設定します。`start_time` の値は未来の日時でなければならないことに注意してください。

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/19163/82a08c35-17f7-9af3-8e73-24e489588e54.png" width=600/>

UTC での日時として設定する場合、以下のようにして翌日 9 時の値を取得することができます（9 時間マイナスすればよいだけではありますが）。日本の標準時で設定してもよいと思います。
```bash
# macOS: 
date -v09H -v00M -v00S -v+1d +%s | xargs date -u -Iseconds -r
# Linux:
date -u -d 'TZ="Asia/Tokyo" 09:00 tomorrow'
```

次に `workflows/morning_reminder.ts` を開いて、二点変更します。

`TODO: 以下のコマンドで生成されたものに差し替え` と書かれている URL を先ほど生成した URL に差し替えます。もう一つは `TODO: インストール先の実際のチャンネル ID に差し替え` と書かれているチャンネルの ID を差し替えます。

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/19163/c2c0081d-d793-82a9-d9f3-a4f0b7bd8a04.png" width=600/>

チャンネルの ID はメッセージの URL で `https://xxx.slack.com/archives/CHE2DUW5V/p1702627198119329` となっているところの `CHE2DUW5V` です。あとはチャンネル名をクリックすると開くポップアップモーダルを一番下までスクロールすると、そこにも表示されています。

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/19163/ba581978-a931-b45a-ad35-1e6d40d1db15.png" width=400/>

これでソースコードの変更は完了です。変更内容を反映するためにもう一度 `slack deploy` を実行してください。

## 動作確認用

それが終わったら次は動作確認のためのトリガーを作成します。 `slack trigger create --trigger-def triggers/morning_reminder_test.ts` を実行し、生成された URL をワークフローを動かしたいチャンネルで共有します。

それをクリックすると以下のように朝のリマインダーが送信されるはずなので、そのままテスト投稿してみましょう。

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/19163/9dc346a5-1bfe-a97b-9a3b-3232dce5e9da.png" width=400>

モーダルダイアログで質問への回答を入力し、

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/19163/f0c3167a-b455-de5f-8c2e-982fe4b7493b.png" width=400/>

送信すると、このようにスレッドに内容が反映されます。

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/19163/026a779a-4d58-892b-059d-1534b5605ce6.png" width=400/>

問題なさそうです。最後に本番のスケジュールトリガーを `slack trigger create --trigger-def triggers/morning_reminder.ts` で作成したら準備完了です。

## さらにカスタマイズする方法

もし文言などカスタマイズしたいところがあれば、コードを変更して手動テストをした上で `slack deploy` するだけで OK です。

トリガーの作り直しは基本的には必要ないですが、リマインダーを送りたいチャンネルを変更するときは埋め込んであるチャンネル ID を書き換えてから `slack trigger create --trigger-def triggers/morning_reminder.ts` で新しいものを生成し、古いものは `slack trigger delete --trigger-id [ここにトリガーの ID を指定]` で削除します。あとはトリガーの name, description などを変更したい場合にも再作成が必要となります。

## デプロイの自動化

GitHub でコードを管理する前提として、GitHub Actions を使って自動デプロイできるようにしておきましょう。 `.github/workflows/deploy.yml` というファイルを作って、以下の内容で保存します。

```yaml
name: Deploy to my Slack workspace
on:
  push:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
    - uses: actions/checkout@v4
    - name: Install Deno runtime
      uses: denoland/setup-deno@v1
      with:
        deno-version: v1.x
    - name: Install Slack CLI
      run: |
        curl -fsSL https://downloads.slack-edge.com/slack-cli/install.sh | bash
    - name: Deploy the app
      env:
        SLACK_SERVICE_TOKEN: ${{ secrets.SLACK_SERVICE_TOKEN }}
      run: |
        slack deploy -s --token $SLACK_SERVICE_TOKEN
```

上の定義に出てくる `secrets.SLACK_SERVICE_TOKEN` を設定します。

ターミナルに戻って `slack auth token` を実行して `slack login` と同様に Slack ワークスペース内で `/slackauthticket` を実行して完了すると `xoxp-3485157640-...` のようなトークンが発行されます。これを `SLACK_SERVICE_TOKEN` として設定するだけです。

Github リポジトリを作成したら、Settings > Security > Secrets and variables > Actions から "Add repository secret" で設定します。

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/19163/99eb8ff2-583a-3805-c038-771db3fc6052.png" width=400/>

以上で、全ての準備が完了です。GitHub リポジトリに全てのファイルを push してみてください。以下の通り、自動デプロイされれば OK です。

<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/19163/d0860846-c61d-5648-5fce-dcb7a3da6177.png" width=400/>

以上です。このリポジトリで紹介したワークフローの管理方法自体は、プレミアムワークフローでも同様です。もし将来このワークフローをより進化させるためにカスタムステップを実装することになった場合にも、このリポジトリのまま移行できるでしょう。