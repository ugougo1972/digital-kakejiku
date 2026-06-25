# digital-kakejiku Roadmap

最終更新: 2026-06-20  
文書版: vNext 1.2 review reflected

---

# 1. 目的

本書はフェーズ計画の基準源である。

現在状態は CURRENT_STATUS.md、詳細仕様は各基準源文書を参照する。

---

# 2. 現在位置

```text
Phase 1
GAS本実装
```

状態。

```text
IN_PROGRESS
```

---

# 3. Phase 1: GAS本実装

Goal。

- Spreadsheet構築
- ConfigManager実装
- SecurityManager実装
- LogSubsystem実装
- ApiGateway実装
- CalendarSubsystem実装
- PoemSubsystem実装
- JobScheduler実装
- MaintenanceHandler実装
- 結合試験

完了条件。

- observation_log保存成功
- Calendar生成成功
- Poem生成成功
- CALENDAR_PENDING制御成功
- Retry制御成功
- Troubleshooting手順で主要障害を追跡可能

---

# 4. Phase 1中の追加反映項目

査読反映済み。

- Gemini Prompt Template
- Error Retry詳細仕様
- GAS Trigger設定方針
- system_config詳細スキーマ
- Secretローテーション手順
- Prompt Version変更時の再生成手順

---

# 5. Phase 1 月次運用準備

Phase 1実装中に以下を確認する。

- GAS Triggerが意図通り作成されること
- Script PropertiesにAPI_SECRET / GEMINI_API_KEYが存在すること
- system_config初期値が作成されること
- source_config初期値が作成されること
- error_logに機密情報が出力されないこと
- Troubleshooting手順で障害確認できること

---

# 6. Phase 2: ESP32統合

Goal。

```text
ESP32
↓
GAS
↓
Spreadsheet
```

対象。

- Wi-Fi
- HTTPS
- Payload送信
- 再送制御
- 表示取得
- 背面保守UI

Phase 2前の確認事項。

| 項目 | 状態 |
|---|---|
| IP5306実装モジュール確定 | PROPOSED |
| USB Presence検出方法 | PROPOSED |
| LD2410C電源電圧確認 | PROPOSED |
| ICS-43434音処理方式 | PROPOSED |
| E-Paper更新時間実測 | PROPOSED |
| D11〜D19側面ランド取り出しPoC | PROPOSED |
| D11〜D19 JST 2ピン接続確認 | PROPOSED |
| 信号線＋GND撚り線の導通確認 | PROPOSED |
| 本体基板GNDバス直結確認 | PROPOSED |
| DMG3415U発熱確認 | PROPOSED |
| SPS30 3.5V〜5.0V電源確認 | PROPOSED |
| I2S再割当検討 | PROPOSED |

---

# 7. Phase 3: 表示統合

対象。

- E-Paper HOME
- DETAIL
- DIAGNOSTIC
- Calendar表示
- Poem表示
- 背面保守UI

完了条件。

- 表示時Poem再生成が発生しないこと
- Calendar/Poem失敗時に「取得できません」を表示すること
- BATTERY_MODE時の表示抑制が機能すること

---

# 8. Phase 4: 長期運用試験

評価項目。

- Calendar成功率
- Poem成功率
- error_log傾向
- GAS実行時間
- E-Paper更新回数
- UPS挙動
- RTC挙動

完了条件。

- 30日以上安定稼働

---

# 9. Phase 5: 筐体完成

対象。

- 筐体
- 配線整理
- 通気
- 放熱
- 背面UI操作性
- メンテナンス性

---

# 10. 優先順位

## Highest

- Spreadsheet
- GAS
- Calendar
- Poem
- Retry
- Troubleshooting

## High

- ESP32統合
- E-Paper表示
- 背面保守UI

## Medium

- 電源PoC
- センサー実装位置
- 音処理仕様

## Low

- 筐体意匠
- 長期拡張

---

# 11. STATUS

| Phase | 状態 |
|---|---|
| Phase 0 設計 | COMPLETE |
| Phase 1 GAS本実装 | IN_PROGRESS |
| Phase 2 ESP32統合 | PENDING |
| Phase 3 表示統合 | PENDING |
| Phase 4 長期運用試験 | PENDING |
| Phase 5 筐体完成 | PENDING |

---

# 12. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.2として査読残課題をPhase計画へ反映 |
| 2026-06-20 | Phase 2前確認事項を明確化 |
| 2026-06-20 | Phase 1月次運用準備を追加 |
| 2026-06-25 | 裏面ランド使用禁止 側面ランド使用解禁 |