# DECISION_0004_DISPLAY_DIRECTION.md

# Decision 001

表示装置候補として
E-Paper を思想的優先候補とする。

---

# Date

2026-05-27

---

# Status

Proposed

---

# Context

LCD と E-Paper の双方を検討。

LCD は：

- 高速描画
- 高表現力
- LVGL適性

を持つ。

一方 E-Paper は：

- 非発光
- 静的表示
- 長時間表示
- 電子的掛軸性

に優れる。

---

# Decision Details

現時点では、

「静けさ」

との思想整合性から、
E-Paper を優先候補とする。

ただし：

- 更新速度
- ゴースト
- UI制約

の検証は未完了。

最終採択は PoC 後に行う。

---

# Consequences

## Positive

- 思想整合性が高い
- 長時間表示向き
- 省電力化期待

## Negative

- 更新速度制約
- UI自由度低下
- Ghosting問題


# Discussion 002
# E-Paper方針

採択:

- 7.5inch 800x480 E-Paper
- XIAO ePaper Breakout Board V2

理由:

- 非発光
- 静的表示
- 電子的掛軸
- 低頻度更新
