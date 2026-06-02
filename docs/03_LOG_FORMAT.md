# 03_LOG_FORMAT.md

# 1. 概要

本書は digital-kakejiku におけるログ保存形式を定義する。

ログは以下の目的で利用する。

- 環境観測データ保存
- 障害解析
- 通信監視
- システム状態記録
- AI生成履歴保存

---

# 2. ログ種別

| 種別 | 用途 |
|--------|--------|
| OBSERVATION_LOG | 環境観測データ |
| SYSTEM_LOG | システム状態 |
| EVENT_LOG | 操作イベント |
| ERROR_LOG | エラー情報 |
| AI_LOG | AI生成履歴 |

---

# 3. OBSERVATION_LOG

## 保存形式

CSV

## 項目

| 項目名 | 内容 |
|---------|---------|
| timestamp | RTC時刻 |
| co2_ppm | SCD41 |
| temperature_c | BME680 |
| humidity_pct | BME680 |
| pressure_hpa | BME680 |
| voc_index | SGP41 |
| nox_index | SGP41 |
| lux | LTR390 |
| uv | LTR390 |
| pm1_0 | SPS30 |
| pm2_5 | SPS30 |
| pm4_0 | SPS30 |
| pm10 | SPS30 |
| presence | LD2410C |
| sound_level | ICS-43434 |
| battery_v | 電池電圧 |
| usb_power | USB給電状態 |
| rssi | Wi-Fi受信強度 |

---

# 4. SYSTEM_LOG

## 保存形式

CSV

## 項目

timestamp,event,detail

## 主なイベント

- boot
- init_complete
- rtc_sync
- network_connect
- network_disconnect
- storage_mount
- storage_unmount
- display_refresh

---

# 5. EVENT_LOG

## 保存形式

CSV

## 項目

timestamp,event,value

## 主なイベント

- encoder_cw
- encoder_ccw
- encoder_push
- page_change
- menu_enter
- menu_exit

---

# 6. ERROR_LOG

## 保存形式

CSV

## 項目

timestamp,module,error_code,error_detail

## 対象

- sensor
- rtc
- network
- storage
- display
- power

---

# 7. AI_LOG

## 保存形式

JSON

## 項目

- timestamp
- prompt_id
- generated_text
- generation_time_ms
- status

---

# 8. 保存方針

- SDカードへ保存する
- 通信成功有無に関係なく保存する
- GAS送信失敗時は再送対象とする
- ログ欠損を許容しない

---

# 9. 将来拡張

- 複数端末統合ログ
- 圧縮保存
- SQLite化検討
