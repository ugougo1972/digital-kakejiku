# digital-kakejiku 電源アーキテクチャ

最終更新: 2026-06-20  
文書版: vNext 1.2 review reflected

---

# 1. 目的

本書は電源構成の基準源である。

---

# 2. 採択済み構成

- UPS方式
- 18650
- IP5306
- DMG2305UX-13
- TPS63802
- ポリスイッチ

---

# 3. 電源ブロック

```text
USB-C
 ↓
ポリスイッチ
 ↓
IP5306
 ├─ 18650
 └─ 5V BUS
      ├─ SPS30
      └─ TPS63802
           ↓
         3.3V BUS
```

DMG2305UX-13は逆流防止に使用する。

---

# 4. 動作モード

| Mode | 説明 |
|---|---|
| USB_MODE | 通常USB給電 |
| BATTERY_MODE | 停電時18650給電 |

---

# 5. PowerManager責務

PowerManagerは給電経路を能動切替しない。

責務。

- USB給電有無の監視
- 電池電圧の監視
- USB_MODE / BATTERY_MODE の状態管理
- event_log記録
- system_log記録
- 必要時のerror_log記録

---

# 6. 停電時優先順位

1. RTC維持
2. 観測継続
3. microSD保存
4. 通信抑制
5. 表示更新抑制

---

# 7. Phase 2前の確定必須項目

| 項目 | 状態 | 対応時期 |
|---|---|---|
| IP5306実装モジュール | PROPOSED | Phase 2 PoC前 |
| USB Presence検出方法 | PROPOSED | Phase 2 PoC前 |
| Battery Voltage測定方法 | PROPOSED | Phase 2 PoC前 |
| 低電圧警告閾値 | PROPOSED | 実測後 |
| 復電検知方式 | PROPOSED | 実測後 |

---

# 8. IP5306モジュール確定プロセス

Phase 2前に以下を確認する。

1. 使用するIP5306モジュールの型番または基板仕様を記録する
2. USB入力時の5V出力を測定する
3. 18650動作時の5V出力を測定する
4. TPS63802入力時の電圧降下を測定する
5. SPS30動作時の負荷応答を確認する
6. E-Paper更新時の電圧降下を確認する
7. 発熱を確認する

---

# 9. USB Presence検出方法

候補。

| 方式 | 状態 | 備考 |
|---|---|---|
| IP5306モジュールの信号利用 | PROPOSED | モジュール依存 |
| USB 5V分圧検出 | PROPOSED | GPIO/ADC使用 |
| 電源モード推定 | PROPOSED | 精度は低い |

確定までは方式を固定しない。

---

# 10. ログ連携

event_log。

- USB_POWER_LOST
- USB_POWER_RESTORE

system_log。

- power_mode
- battery_voltage

error_log。

- POWER_ERROR
- BATTERY_ERROR

---

# 11. STATUS

| 項目 | 状態 |
|---|---|
| UPS方式 | CONFIRMED |
| IP5306採択 | CONFIRMED |
| IP5306実装モジュール | PROPOSED |
| TPS63802採択 | CONFIRMED |
| DMG2305UX-13採択 | CONFIRMED |
| USB Presence検出 | PROPOSED |
| BATTERY_MODE | CONFIRMED |

---

# 12. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.2としてPhase 2前確認プロセスを追加 |
| 2026-06-20 | IP5306モジュール確定プロセスを追加 |
