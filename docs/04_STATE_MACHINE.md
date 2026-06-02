# 04_STATE_MACHINE.md

# 1. 概要

本書は digital-kakejiku の状態遷移を定義する。

---

# 2. 基本状態遷移

```text
BOOT
 ↓
INIT
 ↓
RTC_SYNC
 ↓
NORMAL
```

---

# 3. BOOT

## 内容

- 電源投入
- ESP32起動

---

# 4. INIT

## 内容

- GPIO初期化
- I2C初期化
- SPI初期化
- センサー初期化
- SD初期化
- E-Paper初期化

---

# 5. RTC_SYNC

## 内容

- RTC読込
- 時刻確認
- 必要に応じNTP補正

---

# 6. NORMAL

```text
NORMAL
 ├─ SENSOR_UPDATE
 ├─ STORAGE_WRITE
 ├─ NETWORK_UPLOAD
 ├─ DISPLAY_UPDATE
 └─ DIAGNOSTIC_CHECK
```

---

# 7. SENSOR_UPDATE

## 内容

- センサーデータ取得
- 異常値判定

---

# 8. STORAGE_WRITE

## 内容

- CSV保存
- JSON保存

---

# 9. NETWORK_UPLOAD

## 内容

- GAS送信
- 再送処理

---

# 10. DISPLAY_UPDATE

## 内容

- 部分更新
- 全面更新

---

# 11. DIAGNOSTIC_CHECK

## 内容

- 自己診断
- 異常検知

---

# 12. エラー状態

```text
NORMAL
 ├─ SENSOR_ERROR
 ├─ NETWORK_ERROR
 ├─ STORAGE_ERROR
 ├─ RTC_ERROR
 └─ DISPLAY_ERROR
```

---

# 13. 停電状態

```text
USB_POWER_LOST
 ↓
BATTERY_MODE
 ↓
USB_POWER_RESTORE
 ↓
NORMAL
```

## 内容

- 停電検知
- バッテリー動作継続
- 復電検知

---

# 14. 将来拡張

```text
AI_GENERATE
 ↓
AI_DISPLAY
```

## 内容

- Gemini生成
- E-Paper表示

---

# 15. 採択方針

- 常時稼働
- ローカル保存優先
- フェイルセーフ
- UPS前提運用
- DeepSleep必須としない
