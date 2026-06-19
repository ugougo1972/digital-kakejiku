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


---

# 2026-06-19 ログ仕様更新

## Spreadsheet構成拡張

従来の観測ログに加え、Calendar SubsystemおよびPoem Subsystem用シートを追加する。

---

## 新規シート

### source_config

用途

- 外部情報源管理
- URL管理
- 優先順位管理

管理対象

- 七十二候解説取得元
- 将来の外部データ取得元

---

### solar_term_master

用途

- 二十四節気管理

情報源

- 国立天文台

保存項目例

- 年
- 節気名
- 日時
- 取得日時

---

### season_dictionary

用途

- 七十二候辞書

管理項目

- 名称
- 読み
- 解説
- キーワード
- 取得元URL

方針

- 推測禁止
- 前回値流用禁止

---

### calendar_master

用途

- 表示用統合カレンダー

管理項目

- 日付
- 六曜
- 祝日
- 二十四節気
- 七十二候
- 状態

---

### poem_cache

用途

- 今日の詩キャッシュ

管理項目

- 日付
- 詩本文
- モデル名
- 生成日時
- ステータス

---

## エラー管理拡張

error_logへ追加

- CALENDAR_ERROR
- SOURCE_ERROR
- POEM_ERROR

---

## Calendar Subsystem方針

情報源

| 情報 | 取得元 |
|------|--------|
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台 |
| 七十二候名称 | 固定マスタ |
| 七十二候説明 | source_config管理URL |

取得失敗時

- error_log記録
- 「取得できません」表示

---

## Poem Subsystem方針

採択

- Gemini API Free Tier

用途

- 今日の詩

禁止事項

- 暦情報生成
- 暦情報推定
- 欠損補完

---

## 共通仕様追加

文字コード

- UTF-8

タイムゾーン

- Asia/Tokyo

---

## 現在の優先実装対象

1. observation_log
2. event_log
3. error_log
4. system_log
5. source_config
6. solar_term_master
7. season_dictionary
8. calendar_master
9. poem_cache
