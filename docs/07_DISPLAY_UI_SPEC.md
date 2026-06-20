# 07_DISPLAY_UI_SPEC.md

# digital-kakejiku 表示・UI仕様

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 概要

表示系およびUI仕様を定義する。

対象。

- 前面 7.5inch 800×480 E-Paper
- 背面 I2C OLED
- 押下スイッチ付きロータリーエンコーダ
- 保守コンソール

# 2. 表示デバイス

前面。

| 項目 | 内容 |
| --- | --- |
| 種別 | E-Paper |
| サイズ | 7.5inch |
| 解像度 | 800×480 |
| 接続 | SPI |
| 備考 | microSDとSPI共有 |


背面。

| 項目 | 内容 |
| --- | --- |
| 種別 | OLED |
| 接続 | I2C |
| 第一候補 | 128×128 |
| 代替候補 | 128×64 |
| 用途 | 保守コンソール |


# 3. UI基本方針

- 前面E-Paperは表示専用。
- 背面OLEDは保守コンソール。
- 長文編集は背面UIで行わない。
- URL、Prompt、API Key、Gemini設定は背面UIから編集しない。
- E-Paper更新回数を抑える。
- 停電時は表示より保存を優先する。

# 4. 入力装置

採択。

- 秋月電子販売コード114936
- 押下スイッチ付きロータリーエンコーダ
- RGB LEDなし
- MCP23017経由

| 入力 | 内容 |
| --- | --- |
| 回転 | 画面切替、項目選択 |
| 押下 | 決定、詳細表示、メニュー遷移 |
| 長押し | 未確定 |


# 5. 前面画面構成

Phase1。

| 画面 | 内容 |
| --- | --- |
| HOME | 日めくり風の標準表示 |
| DETAIL | 全センサー値の詳細表示 |
| DIAGNOSTIC | システム診断表示 |


# 6. HOME画面

表示項目。

- 日付
- 時刻
- 気温
- 湿度
- CO₂
- PM2.5
- 人感状態
- 電源状態
- 六曜
- 二十四節気
- 七十二候
- 今日の詩

# 7. DETAIL画面

表示項目。

- CO₂
- VOC Index
- NOx Index
- 温度
- 湿度
- 気圧
- 照度
- UV
- PM1.0
- PM2.5
- PM4.0
- PM10
- presence
- sound_level
- Wi-Fi状態
- RSSI
- 電源状態

# 8. DIAGNOSTIC画面

表示項目。

- SD状態
- RTC状態
- Wi-Fi状態
- GAS送信状態
- センサー状態
- 電源状態
- Calendar状態
- Poem状態
- エラー件数

# 9. Calendar / Poem表示

Calendar表示元。

```text
calendar_master
```

Poem表示元。

```text
poem_cache
```

失敗時表示。

```text
取得できません
```

禁止。

- ESP32側暦生成
- AI補完
- 前回値流用
- 表示時Poem再生成
- Gemini API再呼出
- 代替詩生成

# 10. 背面保守コンソール

```text
許可
- 状態確認
- 診断
- Calendar再生成
- Poem再生成
- 通信確認

禁止
- source_config編集
- system_config編集
- URL編集
- Prompt編集
- Geminiモデル変更
- temperature変更
- API Key編集
```

# 11. 背面メニュー構成

HOME。

- システム状態
- 電源状態
- Wi-Fi状態
- 最終送信状態

DETAIL。

- センサー状態
- RTC状態
- SD状態
- RSSI
- バッテリー電圧

DIAGNOSTIC。

- Calendar状態
- Poem状態
- Error件数
- 最終エラー
- 最終Job結果

SERVICE。

- RTC確認
- SD確認
- Sensor確認
- 通信確認
- Calendar再生成
- Poem再生成

# 12. 背面UI階層

原則。

- 2階層まで
- 最大3階層まで

避ける操作。

- 長文入力
- API Key入力
- URL入力
- Prompt本文編集
- 複雑な日付範囲入力

# 13. SPI共有制約

- E-Paper と microSD は SPI共有。
- ResourceManager が排他制御する。
- 背面OLEDはI2CのためSPI対象外。
- 停電時は表示よりmicroSD保存を優先。

# 14. フォント

- UTF-8
- Noto Sans JP

# 15. STATUS

| 項目 | 状態 |
| --- | --- |
| 前面E-Paper表示 | CONFIRMED |
| 背面保守コンソール | FINALIZED |
| I2C OLED | FINALIZED |
| OLED最終サイズ | PROPOSED |
| ロータリーエンコーダ | FINALIZED |
| Calendar表示 | FINALIZED |
| Poem表示 | FINALIZED |
| 表示時Poem再生成禁止 | FINALIZED |
| AIによる暦補完禁止 | FINALIZED |
| E-Paper更新周期 | PROPOSED |
| 部分更新可否 | PROPOSED |
| Noto Sans JP | CONFIRMED |


# 16. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | 背面UIを保守コンソールへ統一 |
| 2026-06-20 | I2C OLED、128×128第一候補、128×64代替候補を反映 |
| 2026-06-20 | source_config/system_config編集禁止を反映 |
