# 04_STATE_MACHINE.md

# digital-kakejiku 状態遷移仕様

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku の状態遷移を定義する。

査読結果を反映し、UPS運用、Calendar Subsystem、Poem Subsystem、通信障害時挙動、BATTERY_MODEの整理を実施する。

---

# 2. 基本方針

- 据置型
- 常時給電運用
- UPS採択
- 通常運用ではDeepSleepを主軸としない
- ESP32は観測端末
- GASは中央制御層

---

# 3. 全体状態

```text
BOOT
 ↓
INITIALIZING
 ↓
IDLE
 ↓
OBSERVING
 ↓
LOCAL_STORE
 ↓
NETWORK_TRANSFER
 ↓
DISPLAY_UPDATE
 ↓
IDLE
```

エラー時。

```text
ERROR
 ↓
RECOVERY
 ↓
IDLE
```

---

# 4. BOOT

内容。

- MCU起動
- RTC確認
- SD確認
- OLED確認
- 設定読込

遷移。

```text
BOOT
 ↓
INITIALIZING
```

---

# 5. INITIALIZING

内容。

- センサー初期化
- Wi-Fi準備
- ResourceManager初期化

成功。

```text
INITIALIZING
 ↓
IDLE
```

失敗。

```text
INITIALIZING
 ↓
ERROR
```

---

# 6. IDLE

待機状態。

内容。

- 状態監視
- UI受付
- RTC待機

遷移。

```text
IDLE
 ↓
OBSERVING
```

---

# 7. OBSERVING

内容。

- SCD41
- SGP41
- SPS30
- LTR390
- BME680
- LD2410C
- ICS-43434

取得。

成功。

```text
OBSERVING
 ↓
LOCAL_STORE
```

失敗。

```text
OBSERVING
 ↓
ERROR
```

---

# 8. LOCAL_STORE

内容。

- CSV生成
- SD保存

成功。

```text
LOCAL_STORE
 ↓
NETWORK_TRANSFER
```

失敗。

```text
LOCAL_STORE
 ↓
ERROR
```

---

# 9. NETWORK_TRANSFER

内容。

- HTTPS POST
- JSON送信
- GAS保存

成功。

```text
NETWORK_TRANSFER
 ↓
DISPLAY_UPDATE
```

失敗。

```text
NETWORK_TRANSFER
 ↓
ERROR
```

---

# 10. DISPLAY_UPDATE

内容。

- E-Paper更新
- OLED更新

完了。

```text
DISPLAY_UPDATE
 ↓
IDLE
```

---

# 11. ERROR

内容。

- error_log生成
- OLED通知
- 障害分類

分類。

- SENSOR_ERROR
- STORAGE_ERROR
- NETWORK_ERROR
- RTC_ERROR
- CALENDAR_ERROR
- POEM_ERROR
- SECURITY_ERROR

遷移。

```text
ERROR
 ↓
RECOVERY
```

---

# 12. RECOVERY

内容。

- 再初期化
- 再接続
- リトライ

成功。

```text
RECOVERY
 ↓
IDLE
```

失敗。

```text
RECOVERY
 ↓
ERROR
```

---

# 13. BATTERY_MODE

査読指摘を反映し追加。

## 目的

停電時運用。

## 進入条件

- USB喪失
- 18650運用へ移行

注意。

切替そのものはハードウェアで実施する。

PowerManagerは状態監視のみ行う。

## 状態

```text
IDLE
 ↓
BATTERY_MODE
```

## 動作

優先度低下。

- OLED輝度低減
- 通信頻度抑制（PROPOSED）
- E-Paper更新頻度抑制（PROPOSED）

## 閾値

電圧閾値は未確定。

査読指摘を反映し、現時点では決定しない。

状態。

PROPOSED

---

# 14. RTC_ERROR状態

RTC異常時。

```text
RTC_ERROR
 ↓
OBSERVING継続
```

内容。

- 記録継続
- timestamp_validity設定
- server_received_at利用

Calendar判定。

GAS側日時を優先する。

---

# 15. CALENDAR_UPDATE

GAS側状態。

内容。

- 祝日取得
- 二十四節気取得
- 七十二候生成

禁止。

- AI生成
- AI推定
- 欠損補完

失敗時。

```text
CALENDAR_ERROR
```

表示。

- 取得できません

---

# 16. POEM_GENERATE

GAS側状態。

内容。

- Gemini API呼出
- Prompt生成
- poem_cache生成

制約。

- 1日1回
- 表示時再生成禁止

失敗時。

```text
POEM_ERROR
```

表示。

- 取得できません

---

# 17. SPI_RESOURCE_LOCK

査読対応。

対象。

- E-Paper
- microSD

状態。

```text
UNLOCKED
 ↓
LOCKED
 ↓
UNLOCKED
```

管理。

- ResourceManager

詳細。

09_SPI_RESOURCE_CONTROL.md

---

# 18. オフライン状態

```text
NETWORK_ERROR
 ↓
OFFLINE_MODE
```

内容。

- SD保存継続
- 観測継続

再接続成功。

```text
OFFLINE_MODE
 ↓
NETWORK_TRANSFER
```

---

# 19. STATUS

| 項目 | 状態 |
|---|---|
| 常時給電運用 | CONFIRMED |
| UPS運用 | CONFIRMED |
| BATTERY_MODE | CONFIRMED |
| 電圧閾値 | PROPOSED |
| RTC_ERROR運用 | CONFIRMED |
| Calendar状態管理 | CONFIRMED |
| Poem状態管理 | CONFIRMED |
| SPI排他制御 | CONFIRMED |

---

# 20. CHANGE LOG

| 日付 | 内容 | 理由 |
|---|---|---|
| 2026-06-19 | BATTERY_MODE追加 | Claude査読対応 |
| 2026-06-19 | RTC_ERROR状態追加 | Calendar連携対応 |
| 2026-06-19 | Calendar/Poem状態追加 | GAS側責務明確化 |
| 2026-06-19 | STATUS追加 | 確定度管理導入 |
