# 09_SPI_RESOURCE_CONTROL.md

## 1. 目的

SPI共有デバイスの排他制御を定義する。

対象

* E-Paper
* microSD

---

## 2. 設計方針

同時アクセス禁止。

SPI BUSは単一リソースとして管理する。

---

## 3. ResourceManager

SPI_RESOURCE

状態

* FREE
* LOCKED

---

## 4. 使用ルール

### DISPLAY_UPDATE

開始時

LOCK(SPI_RESOURCE)

終了時

UNLOCK(SPI_RESOURCE)

---

### STORAGE_WRITE

開始時

LOCK(SPI_RESOURCE)

終了時

UNLOCK(SPI_RESOURCE)

---

## 5. 優先順位

1. STORAGE_WRITE
2. DISPLAY_UPDATE

---

## 6. エラー処理

LOCK_TIMEOUT

↓

error_log記録

---

## 7. 将来拡張

* SPIデバイス追加対応
* mutex化
* FreeRTOS Semaphore対応
