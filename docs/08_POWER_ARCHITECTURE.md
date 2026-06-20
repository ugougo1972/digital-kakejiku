# 08_POWER_ARCHITECTURE.md

# digital-kakejiku 電源アーキテクチャ

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 概要

据置型・常時稼働を前提とし、通常時はUSB給電で動作する。停電またはUSB給電喪失時は、18650リチウムイオン電池へ自動的に切り替え、観測データ保存を継続するUPS方式を採用する。

# 2. 採択済み電源構成

| 項目 | 採択部材 | 状態 | 備考 |
| --- | --- | --- | --- |
| バッテリー | 18650 Li-ion | CONFIRMED | 容量は実装時に選定 |
| 充電・昇圧管理 | IP5306 | CONFIRMED | 実装モジュール仕様は未確定 |
| 逆流防止 | DMG2305UX-13 | CONFIRMED | P-MOSFET |
| 3.3V生成 | TPS63802 | CONFIRMED | 昇降圧DC/DC |
| 過電流保護 | ポリスイッチ | CONFIRMED | USB入力または電源ライン保護 |


# 3. 電源ブロック構成

```text
USB-C入力
↓
ポリスイッチ
↓
IP5306
├─ 18650充電
└─ 5V系出力
    ├─ SPS30
    ↓
DMG2305UX-13
↓
TPS63802
↓
3.3V系
├─ XIAO ESP32S3 Plus
├─ SCD41 / SGP41 / BME680 / LTR390
├─ DS3231 + AT24C32
├─ MCP23017
├─ I2C OLED
├─ HLK-LD2410C（電源電圧は実機確認）
└─ ICS-43434
```

# 4. 電圧系統

5V系。

- SPS30
- TPS63802入力

3.3V系。

- XIAO ESP32S3 Plus
- SCD41
- SGP41
- BME680
- LTR390
- DS3231 + AT24C32
- MCP23017
- I2C OLED
- ICS-43434

HLK-LD2410Cは実機確認。

# 5. 電源フロー

通常時。

```text
USB-C入力
↓
IP5306
↓
5V系
↓
TPS63802
↓
3.3V系
↓
MCU・センサー動作
```

停電時。

```text
USB-C入力喪失
↓
18650
↓
IP5306
↓
5V系
↓
TPS63802
↓
3.3V系
↓
観測・保存を継続
```

# 6. 電源切替の責務

ハードウェア側。

- IP5306
- 18650
- DMG2305UX-13
- TPS63802
- ポリスイッチ

ソフトウェア側。

- USB給電有無を検知
- 電池電圧を監視
- USB_MODE / BATTERY_MODE を管理
- event_log / system_log / error_logへ記録

禁止。

- PowerManagerがFETや電源ICを能動制御して給電経路を切り替えること

# 7. 停電時優先順位

| 優先 | 処理 | 方針 |
| --- | --- | --- |
| 1 | 未保存ログ保存 | microSD保存を最優先 |
| 2 | RTC維持 | DS3231を維持 |
| 3 | センサー観測 | 必要に応じて継続 |
| 4 | 通信 | 抑制または停止 |
| 5 | E-Paper更新 | 最小限 |
| 6 | 背面OLED表示 | 必要最小限 |


# 8. 未確定事項

| 項目 | 状態 | 備考 |
| --- | --- | --- |
| IP5306実装モジュール | PROPOSED | 型番・基板仕様は未確定 |
| USB Presence検出方法 | PROPOSED | 実装モジュール仕様確認後に決定 |
| USB喪失検知閾値 | PROPOSED | 実測後に確定 |
| 低電圧警告閾値 | PROPOSED | 実測後に確定 |
| 復電検知閾値 | PROPOSED | 実測後に確定 |


# 9. STATUS

| 項目 | 状態 |
| --- | --- |
| UPS方式 | CONFIRMED |
| IP5306採択 | CONFIRMED |
| TPS63802採択 | CONFIRMED |
| DMG2305UX-13採択 | CONFIRMED |
| PowerManager監視方式 | CONFIRMED |
| BATTERY_MODE | CONFIRMED |
| 閾値類 | PROPOSED |


# 10. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | 背面I2C OLEDを3.3V系に反映 |
| 2026-06-20 | PowerManager責務とハードウェア切替責務を明確化 |
