import { Copy } from "../types";

export const ja: Copy = {
  languageLabel: "言語",
  languageOptions: {
    en: "English",
    zh: "中文",
    es: "Español",
    ja: "日本語"
  },
  heroBadge: "Baby Weekly Companion",
  heroTitle: "はじめての子育てを、もう少し落ち着いて進めるためのアプリ。",
  heroCopy:
    "月齢に応じた優先順位、週次計画、外出準備、家族連携をひとつのモバイル体験にまとめます。",
  tabLabels: {
    today: "今日",
    planner: "計画",
    outings: "外出",
    family: "家族"
  },
  screenEyebrows: {
    today: "今日の焦点",
    planner: "今週の流れ",
    outings: "外出準備",
    family: "家族連携"
  },
  updateButton: "アップデート確認",
  updateStatus: {
    idle: "本番向けビルドで新しいアプリ内容を確認します。",
    checking: "更新を確認中...",
    downloading: "更新を検出しました。ダウンロード中...",
    applying: "更新を適用中...",
    unavailableDev: "開発ビルドではアプリ内更新は使えません。",
    unavailableConfig: "このビルドはまだ OTA 更新向けに設定されていません。",
    upToDate: "すでに最新です。",
    failed: "更新確認に失敗しました。後でもう一度試してください。"
  },
  appMode: {
    mockTitle: "デモモードです",
    mockBody: "このアプリは将来のバックエンドと同じ形のローカル mock リポジトリを使っています。この端末上で主要データを保存できます。",
    remoteTitle: "バックエンドモードです",
    remoteBody: "このアプリは設定済みバックエンドに接続されています。"
  },
  auth: {
    title: "アカウント連携",
    sendMagicLink: "magic link を送信"
  },
  agent: {
    title: "Agent の提案",
    refresh: "再実行",
    accept: "採用",
    ignore: "無視",
    notRelevant: "不要",
    showReason: "理由を見る",
    hideReason: "理由を閉じる",
    reasonTitle: "理由",
    sourceTitle: "シグナル",
    noRecommendations: "十分な提案を出すには、もう少し文脈が必要です。",
    memoryHint: "Agent は、採用・無視・その後の行動から学習します。",
    plannerHint: "この計画ノートは、最近の生活パターンから学んだ内容に影響されます。",
    outingHint: "この外出提案は、現在のシナリオと最近うまくいったパターンを使っています。",
    familyHint: "誰がどの仕事を引き受けることが多いかを学ぶほど、家族向け提案は良くなります。"
  },
  profile: {
    title: "赤ちゃんプロフィール",
    emptyTitle: "まずプロフィールを作成しましょう",
    emptyBody: "プロフィールを一度作れば、月齢に応じた案内や計画、外出時の初期提案を導き出せます。",
    languageTitle: "最初に言語を選んでください",
    languageHint: "国を選ぶ前に言語を確定し、以降の体験を正しい言語で表示します。",
    locationTitle: "次に地域を確認してください",
    locationHint: "このアプリでは、国・地域・街区を先に確認してから、残りのプロフィールに進みます。",
    locationContinue: "プロフィール入力へ進む",
    country: "国",
    region: "地域 / 区",
    street: "通り / エリア",
    name: "赤ちゃんの呼び名",
    birthDate: "生年月日 (YYYY-MM-DD)",
    feedingMode: "授乳方法",
    notes: "メモ",
    save: "プロフィールを保存",
    edit: "プロフィールを編集",
    feedingModes: {
      breast: "母乳",
      formula: "ミルク",
      mixed: "混合",
      solids: "離乳食開始"
    }
  },
  today: {
    title: "いま大切なこと",
    empty: "予定や家族タスクを追加すると、今日の表示がより役立つものになります。"
  },
  planner: {
    title: "今週の計画",
    appointmentsTitle: "予定",
    remindersTitle: "リマインダー",
    nextActionTitle: "次のおすすめ行動",
    appointmentFormTitle: "予定を追加",
    reminderFormTitle: "リマインダーを追加",
    appointmentFields: {
      title: "予定のタイトル",
      startsAt: "開始日時 (YYYY-MM-DDTHH:MM)",
      location: "場所",
      notes: "メモ"
    },
    reminderFields: {
      title: "リマインダー名",
      dueAt: "期限 (YYYY-MM-DDTHH:MM)"
    },
    saveAppointment: "予定を保存",
    saveReminder: "リマインダーを保存"
  },
  outings: {
    title: "状況に応じた外出チェックリスト",
    helper: "シナリオを選ぶとチェックリストが作られます。準備済みをチェックしたり、自由項目を追加できます。",
    scenarioLabel: "シナリオ",
    scenarios: {
      clinic: "通院",
      park: "公園散歩",
      grocery: "短時間の買い物",
      familyVisit: "親族訪問"
    },
    addItem: "項目を追加",
    checklistPlaceholder: "カスタム項目"
  },
  family: {
    title: "家族での分担",
    empty: "共有タスクはまだありません。追加して引き継ぎを分かりやすくしましょう。",
    formTitle: "家族タスクを追加",
    assignee: "担当者",
    task: "タスク内容",
    dueAt: "期限 (YYYY-MM-DDTHH:MM)",
    save: "タスクを保存"
  },
  vaccinations: {
    title: "近くのワクチン接種会場",
    eyebrow: "あなたの街の近く",
    helper: "徒歩または短時間の移動で行ける接種会場を、距離順に提案します。",
    emptyAddress: "プロフィールの通り欄を入力すると、近くのワクチン接種会場が表示されます。",
    distanceLabel: "距離",
    hoursLabel: "受付時間",
    sampleBadge: "サンプルデータ"
  },
  generic: {
    loading: "読み込み中...",
    errorPrefix: "エラーが発生しました",
    retry: "再試行",
    saveSucceeded: "保存しました。",
    saveFailed: "保存に失敗しました。",
    emailPlaceholder: "magic link 用メール",
    magicLinkUnavailable: "magic link はバックエンド設定時のみ利用できます。"
  }
};
