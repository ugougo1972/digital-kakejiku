# 09_SPI_RESOURCE_CONTROL.md

# digital-kakejiku SPI共有リソース制御仕様

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは、SPI共有環境におけるリソース制御方式を定義する。

査読結果を反映し、E-PaperとmicroSDの共有SPI制御、ResourceManager責務、優先順位、状態遷移との整合を定義する。

---

# 2. 背景

digital-kakejikuでは以下をSPI共有する。

| デバイス | 用途 |
|---|---|
| E-Paper | 表示 |
| microSD | ローカル保存 |

GPIO節約のため、SPI BUS共有を採択する。

---

# 3. 対象リソース

共有対象。

```text
SPI BUS
 ├─ E-Paper
 └─ microSD
```

共有対象外。

- I2C
- UART
- I2S

---

# 4. 基本方針

### 排他制御必須

同時アクセス禁止。

### ResourceManager採択

SPI管理は ResourceManager が担当する。

### 保存優先

microSD保存を優先する。

理由。

観測データ消失防止。

---

# 5. ResourceManager責務

担当。

- SPI Lock取得
- SPI Lock解放
- 使用状態管理
- 競合回避
- タイムアウト管理

担当外。

- センサ取得
- GAS通信
- Calendar生成
- Poem生成

---

# 6. リソース状態

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

同時保持は禁止。

---

# 7. 優先順位

優先順位。

| 優先度 | 処理 |
|---|---|
| 1 | microSD保存 |
| 2 | E-Paper更新 |
| 3 | OLED表示 |

OLEDはSPI共有対象ではない。

---

# 8. 排他制御シーケンス

## microSD

```text
LOCK取得
 ↓
CSV生成
 ↓
SD保存
 ↓
flush
 ↓
LOCK解放
```

## E-Paper

```text
LOCK取得
 ↓
描画生成
 ↓
転送
 ↓
完了待ち
 ↓
LOCK解放
```

---

# 9. 競合発生時

### ケース1

保存中にE-Paper更新要求。

```text
保存完了待ち
 ↓
E-Paper更新
```

### ケース2

E-Paper更新中に保存要求。

```text
保存要求保留
 ↓
E-Paper完了
 ↓
保存実行
```

---

# 10. タイムアウト

初期値。

```text
5秒
```

状態。

PROPOSED

実機評価後確定。

---

# 11. エラー処理

### LOCK取得失敗

記録。

```text
RESOURCE_LOCK_ERROR
```

保存先。

- error_log

---

### タイムアウト

記録。

```text
RESOURCE_TIMEOUT
```

保存先。

- error_log

---

# 12. 状態遷移との関係

04_STATE_MACHINE.md と整合する。

```text
LOCAL_STORE
 ↓
SPI_LOCK_SD
 ↓
SD保存
```

```text
DISPLAY_UPDATE
 ↓
SPI_LOCK_DISPLAY
 ↓
E-Paper更新
```

---

# 13. PowerManagerとの関係

BATTERY_MODE時。

候補。

- E-Paper更新頻度低減
- 通信頻度低減

状態。

PROPOSED

SPI制御方式自体は変更しない。

---

# 14. DisplayManagerとの関係

DisplayManagerは直接SPIを制御しない。

必ず ResourceManager 経由とする。

---

# 15. StorageManagerとの関係

StorageManagerは直接SPIを制御しない。

必ず ResourceManager 経由とする。

---

# 16. GASとの関係

なし。

SPI制御はESP32内部実装。

---

# 17. Calendar/Poemとの関係

Calendar Subsystem。

- GAS側

Poem Subsystem。

- GAS側

SPI制御対象外。

---

# 18. 将来拡張

候補。

- SPIデバッグ統計
- 使用時間計測
- ロック待ち時間計測

状態。

PROPOSED

---

# 19. STATUS

| 項目 | 状態 |
|---|---|
| SPI共有方式 | CONFIRMED |
| ResourceManager採択 | CONFIRMED |
| microSD優先 | CONFIRMED |
| DisplayManager経由禁止 | FINALIZED |
| StorageManager経由禁止 | FINALIZED |
| LOCKタイムアウト値 | PROPOSED |
| SPI統計取得 | PROPOSED |

---

# 20. CHANGE LOG

| 日付 | 内容 | 理由 |
|---|---|---|
| 2026-06-19 | ResourceManager責務整理 | Claude査読対応 |
| 2026-06-19 | 状態遷移連携追加 | 04_STATE_MACHINE整合 |
| 2026-06-19 | Calendar/Poem整理 | GAS側責務明確化 |
| 2026-06-19 | STATUS追加 | 確定度管理導入 |
