# digital-kakejiku 表示・UI仕様

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書は表示・UIの基準源である。

---

# 2. 基本方針

前面と背面の責務を分離する。

| 面 | デバイス | 用途 |
|---|---|---|
| 前面 | 7.5inch E-Paper | 日常表示 |
| 背面 | I2C OLED | 保守コンソール |

---

# 3. 前面E-Paper

- 7.5inch
- 800×480
- SPI接続
- microSDとSPI共有

表示項目。

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

# 4. E-Paper更新周期案

Phase1想定値。

| タイミング | 内容 | 状態 |
|---|---|---|
| 起動時 | 初期画面 | CONFIRMED |
| 00:00 | 日付・暦・詩反映 | PROPOSED |
| 毎正時 | 環境情報更新 | PROPOSED |
| エラー発生時 | 必要範囲のみ更新 | PROPOSED |
| BATTERY_MODE中 | 2時間ごとへ低減 | PROPOSED |

月間更新回数概算。

```text
通常時: 約720回/月
```

100,000回更新を仮定した場合の単純計算。

```text
約11年
```

実機の仕様・部分更新可否により変動するため、寿命は未確定とする。

---

# 5. 背面OLED

採択方針。

- I2C OLED
- 128×128 OLED 第一候補
- 128×64 OLED 代替候補
- 表示は軽量メニュー中心

入力。

- 秋月電子販売コード114936
- 押下スイッチ付きロータリーエンコーダ
- MCP23017経由

---

# 6. 背面UIメニュー

許可。

- 状態確認
- 診断
- Calendar再生成
- Poem再生成
- 通信確認

禁止。

- source_config編集
- system_config編集
- URL編集
- Prompt編集
- Geminiモデル変更
- temperature変更
- API Key編集

---

# 7. エラー表示

| 対象 | 表示 | 継続条件 |
|---|---|---|
| Calendar取得失敗 | 取得できません | 正常生成まで |
| Poem生成失敗 | 取得できません | 正常生成まで |
| Config失敗 | 取得できません | 復旧まで |

表示側で補完・推定・代替生成をしない。

---

# 8. フォント

- UTF-8
- Noto Sans JP

実ファイル・サイズ・サブセット化は実装時に確定する。

---

# 9. STATUS

| 項目 | 状態 |
|---|---|
| 前面E-Paper | CONFIRMED |
| 背面保守コンソール | FINALIZED |
| OLED I2C化 | FINALIZED |
| E-Paper更新周期案 | PROPOSED |
| 部分更新可否 | PROPOSED |
| Noto Sans JP | CONFIRMED |

---

# 10. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | E-Paper更新周期案を追加 |
| 2026-06-20 | 背面UI禁止操作を整理 |
