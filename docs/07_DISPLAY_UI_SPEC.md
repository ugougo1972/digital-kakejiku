# digital-kakejiku 表示・UI仕様

最終更新: 2026-06-20  
文書版: vNext 1.2 review reflected

---

# 1. 目的

本書は表示・UIの基準源である。

対象。

- Front Display
- Back UI
- E-Paper更新方針
- 背面保守コンソール

---

# 2. 基本方針

前面と背面の責務を分離する。

| 表示面 | デバイス | 主用途 |
|---|---|---|
| 前面 | 7.5inch E-Paper | 日常表示、環境情報、暦情報、今日の詩 |
| 背面 | I2C OLED | 診断、保守、手動操作 |

前面E-Paperは通常操作を要求しない表示専用とする。
7.5inch E-Paper本体は付属リボンケーブルによりドライバーボードから離隔可能。
ePaperドライバーボード＋XIAOは本体基板近傍へ配置する。
これによりD11〜D19側面ランドから本体基板までの配線を短縮する。

背面OLEDは保守コンソールとし、通常閲覧用の主要表示には使わない。

---

# 3. Front Display

## 採択

- 7.5inch E-Paper
- 800×480
- XIAO ePaper Breakout V2
- SPI接続

## 表示内容

- 日付
- 時刻
- 温度
- 湿度
- CO2
- PM2.5
- 電源状態
- 六曜
- 二十四節気
- 七十二候
- 今日の詩

---

# 4. E-Paper更新スケジュール

Phase 1想定値。

| タイミング | 内容 | 備考 |
|---|---|---|
| 起動時 | 初期画面 | 1回限定 |
| 00:00 | 日付、暦、詩、環境情報 | 日次切替 |
| 01:00〜23:00 | 環境情報 | 1時間ごと |
| エラー発生時 | エラー領域更新 | 必要時のみ |
| 手動更新 | 保守操作後 | 背面UI経由 |

月間更新回数の目安。

```text
日次更新 31回
時間更新 23回 × 30日 = 690回
合計 約720回/月
```

E-Paper寿命への参考計算。

```text
100,000回 ÷ 720回/月 = 約138.8か月
```

この計算は参考値であり、実機の定格・部分更新可否・更新方式により変動する。

---

# 5. BATTERY_MODE時の表示更新

BATTERY_MODEでは保存を優先する。

方針。

- E-Paper更新頻度を抑制する
- 通常の時間更新は2時間ごとを候補とする
- Calendar / Poem の日次表示は継続候補
- 低電圧時は表示更新を停止候補とする

状態。

```text
PROPOSED
```

実測後に確定する。

---

# 6. Back UI

## 採択方針

- I2C OLED
- 128×128 OLED 第一候補
- 128×64 OLED 代替候補
- 秋月電子販売コード114936
- 押下スイッチ付きロータリーエンコーダ
- MCP23017経由

## 役割

- 状態確認
- 診断
- Calendar再生成
- Poem再生成
- 通信確認

---

# 7. 背面UI操作範囲

## 許可

- HOME状態確認
- DETAIL状態確認
- DIAGNOSTIC表示
- Calendar再生成要求
- Poem再生成要求
- 通信確認
- 最終エラー確認

## 禁止

- source_config編集
- system_config編集
- URL編集
- Prompt編集
- Geminiモデル変更
- temperature変更
- API Key編集

---

# 8. Calendar / Poem表示

表示元。

| 表示 | 正本 |
|---|---|
| 六曜 | calendar_master |
| 二十四節気 | calendar_master |
| 七十二候 | calendar_master |
| 今日の詩 | poem_cache |

失敗時。

```text
取得できません
```

表示側で補完・推測・生成してはならない。

---

# 9. エラー表示寿命

| 対象 | 表示 | 継続条件 |
|---|---|---|
| CALENDAR_ERROR | 取得できません | Calendar正常生成まで |
| POEM_ERROR | 取得できません | 当日分poem_cache正常生成まで |
| CONFIG_ERROR | 取得できません | 設定復旧まで |
| NETWORK_ERROR | 通信異常 | 次回成功まで |

---

# 10. フォント

採択。

- UTF-8
- Noto Sans JP

フォントファイル、サイズ、サブセット化方法は実装時に定義する。

---

# 11. 実装時確認項目

- E-Paper実機の更新時間
- 部分更新可否
- E-Paper更新中の消費電流
- TPS63802の発熱
- BATTERY_MODEでの更新抑制動作
- 128×128 OLEDまたは128×64 OLEDの表示行数

---

# 12. STATUS

| 項目 | 状態 |
|---|---|
| Front Display | CONFIRMED |
| Back UI | CONFIRMED |
| 背面保守コンソール | FINALIZED |
| E-Paper更新周期案 | CONFIRMED |
| BATTERY_MODE更新抑制 | PROPOSED |
| 表示時Poem再生成禁止 | FINALIZED |

---

# 13. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.2としてE-Paper更新周期案を追加 |
| 2026-06-20 | 月間更新回数の参考値を追加 |
| 2026-06-20 | BATTERY_MODE時の表示抑制方針を追加 |
