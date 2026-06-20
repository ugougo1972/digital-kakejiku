# 09_SPI_RESOURCE_CONTROL.md

# digital-kakejiku SPI共有リソース制御仕様

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

SPI共有環境におけるリソース制御方式を定義する。

対象。

- E-Paper
- microSD
- ResourceManager
- DisplayManager
- StorageManager

# 2. 背景

GPIO節約のため、E-PaperとmicroSDはSPI BUSを共有する。

| デバイス | 用途 |
| --- | --- |
| E-Paper | 前面表示 |
| microSD | ローカル保存 |


背面OLEDはI2C接続であり、SPI共有対象外。

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
- I2C OLED
- MCP23017

# 4. 基本方針

- SPI同時アクセス禁止
- ResourceManager採択
- microSD保存優先
- E-Paper更新は再試行可能処理
- 停電時は表示より保存を優先

# 5. ResourceManager責務

担当。

- SPI Lock取得
- SPI Lock解放
- 使用状態管理
- 競合回避
- タイムアウト管理

担当外。

- センサー取得
- GAS通信
- Calendar生成
- Poem生成
- OLED表示
- UI入力処理

# 6. リソース状態

```text
UNLOCKED
↓
LOCKED_SD
↓
UNLOCKED

UNLOCKED
↓
LOCKED_DISPLAY
↓
UNLOCKED
```

同時保持は禁止。

# 7. 優先順位

| 優先度 | 処理 | 理由 |
| --- | --- | --- |
| 1 | microSD保存 | 観測データ消失防止 |
| 2 | E-Paper更新 | 再試行可能 |
| 3 | OLED表示 | SPI対象外 |


# 8. 排他制御シーケンス

microSD。

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

E-Paper。

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

# 9. 競合発生時

保存中にE-Paper更新要求。

```text
保存完了待ち
↓
E-Paper更新
```

E-Paper更新中に保存要求。

```text
保存要求保留
↓
E-Paper完了
↓
保存実行
```

# 10. エラー処理

LOCK取得失敗。

```text
RESOURCE_LOCK_ERROR
```

タイムアウト。

```text
RESOURCE_TIMEOUT
```

保存先。

- error_log

# 11. STATUS

| 項目 | 状態 |
| --- | --- |
| SPI共有方式 | CONFIRMED |
| ResourceManager採択 | CONFIRMED |
| microSD優先 | CONFIRMED |
| DisplayManager直接SPI禁止 | FINALIZED |
| StorageManager直接SPI禁止 | FINALIZED |
| OLED SPI対象外 | FINALIZED |
| LOCKタイムアウト値 | PROPOSED |
| SPI統計取得 | PROPOSED |


# 12. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | I2C OLEDをSPI共有対象外として明記 |
| 2026-06-20 | microSD保存優先方針を維持 |
