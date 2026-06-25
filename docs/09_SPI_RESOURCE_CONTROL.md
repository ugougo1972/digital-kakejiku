# digital-kakejiku SPI共有リソース制御仕様

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書はSPI共有制御の基準源である。

---

# 2. 対象リソース

共有対象。

- E-Paper
- microSD

共有対象外。

- I2C OLED
- I2Cセンサー
- UART
- I2S

---

# 3. 基本方針

- 同時アクセス禁止
- ResourceManager経由
- microSD保存優先
- E-Paper更新は再試行可能処理
- ePaperドライバーボード＋XIAOは本体基板近傍に配置する。
- ePaper本体とは付属リボンケーブルで接続する。
- この物理配置変更はSPI排他制御方針には影響しない。

---

# 4. 優先順位

| 優先 | 処理 |
|---:|---|
| 1 | microSD保存 |
| 2 | E-Paper更新 |
| 3 | OLED表示 |

OLEDはI2CのためSPIロック対象外である。

---

# 5. 状態

```text
UNLOCKED
 ↓
LOCKED_SD
 ↓
UNLOCKED
```

```text
UNLOCKED
 ↓
LOCKED_DISPLAY
 ↓
UNLOCKED
```

---

# 6. エラー

| エラー | 記録先 |
|---|---|
| RESOURCE_LOCK_ERROR | error_log |
| RESOURCE_TIMEOUT | error_log |

タイムアウト初期案。

```text
5秒
```

状態。

```text
PROPOSED
```

---

# 7. STATUS

| 項目 | 状態 |
|---|---|
| SPI共有方式 | CONFIRMED |
| ResourceManager | CONFIRMED |
| microSD優先 | FINALIZED |
| OLED対象外 | FINALIZED |
| タイムアウト値 | PROPOSED |

---

# 8. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | I2C OLEDをSPI対象外として明記 |
