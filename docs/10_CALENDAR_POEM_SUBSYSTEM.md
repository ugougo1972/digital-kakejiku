# 10_CALENDAR_POEM_SUBSYSTEM.md

## 1. 目的

暦情報および今日の詩を管理する。

---

## 2. Calendar Subsystem

管理シート

* source_config
* solar_term_master
* season_dictionary
* calendar_master

---

## 3. 情報源

| 項目     | 取得元                |
| ------ | ------------------ |
| 祝日     | 内閣府                |
| 二十四節気  | 国立天文台              |
| 七十二候名称 | 固定マスタ              |
| 七十二候解説 | source_config管理URL |

---

## 4. 更新タイミング

### Calendar

毎日00:05

または

手動再生成

---

## 5. エラー方針

禁止

* AI推定
* 前回値流用

表示

取得できません

---

## 6. Poem Subsystem

生成元

Gemini API Free Tier

---

## 7. 入力

* calendar_master
* observation_log

---

## 8. 出力

* poem_cache

---

## 9. 生成タイミング

毎日00:10

1日1回

---

## 10. エラー時

poem_cache更新禁止

表示

取得できません

---

## 11. リトライ

1回目失敗

↓

10分後

↓

再試行

最大3回

---

## 12. AI禁止事項

* 暦生成
* 暦推定
* 欠損補完
