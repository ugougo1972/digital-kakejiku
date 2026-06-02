# 08_POWER_ARCHITECTURE.md

# 1. 概要

UPS方式電源構成を定義する。

---

# 2. 採択構成

- 18650
- IP5306
- DMG2305UX-13
- TPS63802
- ポリスイッチ

---

# 3. 電源フロー

USB-C
↓
IP5306
↓
18650

18650
↓
DMG2305UX-13
↓
TPS63802
↓
3.3V

---

# 4. 電圧系統

## 5V系

- SPS30

## 3.3V系

- XIAO ESP32S3 Plus
- SCD41
- SGP41
- BME680
- LTR390
- DS3231
- MCP23017
- HLK-LD2410C
- ICS-43434

---

# 5. 停電時動作

- USB断検知
- 電池運転継続
- 復電検知

---

# 6. 保護機能

- ポリスイッチ
- 逆流防止MOSFET

---

# 7. 監視

- Battery Voltage
- USB Presence

---

# 8. 採択方針

- 常時稼働
- UPS運用
- データ消失防止
