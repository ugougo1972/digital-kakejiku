# DECISION_0002_GAS_CENTRALIZATION.md

# Decision

Google Apps Script (GAS) を
中央制御層として採用する。

---

# Date

2026-05-27

---

# Status

Accepted

---

# Context

ESP32側で：

- データ処理
- AI Prompt生成
- 状態推定
- ログ集約

まで行う構成も検討された。

しかし、
長期運用性と責務分離を考慮し、
GAS側へ集約する方針とした。

---

# Decision Details

ESP32側は：

- センサ取得
- HTTPS通信
- 表示制御

に責務を限定する。

GAS側は：

- API Gateway
- Spreadsheet制御
- Prompt生成
- 状態推定
- Config返却

を担う。

---

# Consequences

## Positive

- Firmware簡素化
- Prompt変更容易化
- Spreadsheet統合管理
- AI制御集中化

## Negative

- GAS依存増加
- Googleサービス依存
- 通信断時制約増加
