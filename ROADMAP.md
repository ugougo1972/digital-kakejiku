# digital-kakejiku Roadmap

最終更新: 2026-06-29  
文書版: vNext 1.3 hardware-power reflected

---

# 1. 目的

本書はフェーズ計画の基準源である。

現在状態は `CURRENT_STATUS.md`、詳細仕様は各基準源文書を参照する。

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

並行作業。

```text
Phase 2前提作業
電源基板PoC / 本体基板配線設計準備
```

現在、GAS Phase 1と並行して、Phase 2前提となる電源基板PoCを先行実施する。

次工程。

```text
1. 電源基板配線図の最終修正
2. テストポイント追加
3. 導通・短絡確認
4. 無負荷通電
5. 5V BUS確認
6. TPS63802 3.3V出力確認
7. XIAO + 電源基板のみの起動試験
8. USB D+/D-通信確認
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

# 6. Phase 2前提作業: 電源基板PoC

Phase 2のESP32統合前に、電源基板の実装・検証を先行する。

## 対象

- USB-C入力
- PTC
- IP5306
- 18650 JST
- DMG2305UX-13
- TPS63802
- 5V BUS
- 3.3V OUTPUT
- Battery_SENSE
- 5V_SENSE
- USB D+/D-独立配線
- テストポイント

## 完了条件

- 通電前導通・短絡確認が完了していること
- USB入力からIP5306 VINまで5Vが届くこと
- IP5306 OUT-5Vが確認できること
- DMG2305UX-13後段の5V BUSが確認できること
- TPS63802 VOUTで3.3Vが確認できること
- Battery_SENSEが電池電圧の約1/2として測定できること
- 5V_SENSEが想定分圧値として測定できること
- XIAO + 電源基板のみで起動確認できること
- USB D+/D-経由でPC通信確認できること

---

# 7. Phase 2: ESP32統合

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
| D11〜D19側面ランド取り出しPoC | CONFIRMED |
| D11〜D19 JST-XH 2ピン接続確認 | CONFIRMED |
| 信号線＋GND撚り線の導通確認 | PROPOSED |
| 本体基板GNDバス直結確認 | PROPOSED |
| DMG2305UX-13接続・発熱確認 | PROPOSED |
| SPS30 3.5V〜5.0V電源確認 | CONFIRMED |
| I2S再割当検討 | PROPOSED |

---

# 8. Phase 3: 表示統合

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

# 9. Phase 4: 長期運用試験

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

# 10. Phase 5: 筐体完成

対象。

- 筐体
- 配線整理
- 通気
- 放熱
- 背面UI操作性
- メンテナンス性

---

# 11. 優先順位

## Highest

- Spreadsheet
- GAS
- Calendar
- Poem
- Retry
- Troubleshooting

## High

- 電源基板PoC
- ESP32統合
- E-Paper表示
- 背面保守UI

## Medium

- センサー実装位置
- 音処理仕様
- 本体基板配線整理

## Low

- 筐体意匠
- 長期拡張

---

# 12. STATUS

| Phase | 状態 |
|---|---|
| Phase 0 設計 | COMPLETE |
| Phase 1 GAS本実装 | IN_PROGRESS |
| Phase 2前提作業 電源基板PoC | IN_PROGRESS |
| Phase 2 ESP32統合 | PENDING |
| Phase 3 表示統合 | PENDING |
| Phase 4 長期運用試験 | PENDING |
| Phase 5 筐体完成 | PENDING |

---

# 13. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.2として査読残課題をPhase計画へ反映 |
| 2026-06-20 | Phase 2前確認事項を明確化 |
| 2026-06-20 | Phase 1月次運用準備を追加 |
| 2026-06-25 | 裏面ランド原則禁止、側面ランド取り出しに変更 |
| 2026-06-29 | 電源基板PoC先行、DMG2305UX-13、D11〜D19、USB D+/D-例外、テストポイント工程を反映 |
