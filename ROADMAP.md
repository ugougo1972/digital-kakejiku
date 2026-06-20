# digital-kakejiku Roadmap

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書はフェーズ計画のみを管理する。現在状態は CURRENT_STATUS.md、詳細仕様は各基準源文書を参照する。

---

# 2. 全体フェーズ

```text
Phase0 設計
 ↓
Phase1 GAS本実装
 ↓
Phase2 ESP32統合
 ↓
Phase3 表示統合
 ↓
Phase4 長期運用試験
 ↓
Phase5 筐体完成
```

---

# 3. Phase0 設計

状態。

```text
COMPLETE
```

完了事項。

- ハードウェア主要構成
- 電源UPS構成
- センサー選定
- Spreadsheet Schema
- Calendar / Poem設計
- GAS構成
- セキュリティ方針
- 設定管理方針
- vNext 1.1文書セット

---

# 4. Phase1 GAS本実装

状態。

```text
IN_PROGRESS
```

実装順序。

1. Spreadsheet初期化
2. ConfigManager
3. SecurityManager
4. LogSubsystem
5. ApiGateway
6. CalendarSubsystem
7. PoemSubsystem
8. JobScheduler
9. 結合試験

完了条件。

- doGet / doPost が正常動作する
- observation_log へ保存できる
- calendar_master を生成できる
- poem_cache を生成できる
- CALENDAR_PENDING / Retry / Error が仕様通り動く
- L1/L2試験が完了する

---

# 5. Phase2 ESP32統合

状態。

```text
PENDING
```

対象。

- Wi-Fi
- HTTPS POST
- Payload送信
- NVS管理
- microSD保存
- ResourceManager
- 背面保守UI

完了条件。

- 24時間連続送信成功
- SD保存と送信の整合確認
- 背面UIで状態確認可能

---

# 6. Phase3 表示統合

状態。

```text
PENDING
```

対象。

- E-Paper表示
- Calendar表示
- Poem表示
- エラー表示
- E-Paper更新周期評価

完了条件。

- 自動更新成功
- 表示時再生成禁止が守られる
- 取得失敗時に「取得できません」を表示する

---

# 7. Phase4 長期運用試験

状態。

```text
PENDING
```

対象。

- 30日以上の安定稼働
- Calendar / Poem成功率
- GAS実行時間
- Spreadsheet容量
- UPS動作
- エラー復旧

---

# 8. Phase5 筐体完成

状態。

```text
PENDING
```

対象。

- 筐体
- 配線整理
- 通気
- 放熱
- 背面UI操作性

---

# 9. 優先タスク

## Priority A

- Gemini Prompt実装
- Error Retry詳細実装
- Calendar / Poem Job詳細フロー実装
- L1/L2試験

## Priority B

- 月次運用チェック運用化
- Troubleshooting運用化
- Spreadsheet検証

## Priority C

- IP5306モジュール確定
- OLED最終型番確定
- E-Paper部分更新実測
- ICS-43434音処理方式確定

---

# 10. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.1としてフェーズ計画を再整理 |
