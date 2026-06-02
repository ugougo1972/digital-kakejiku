# DECISION_0003_README_POLICY.md

# Decision

README.md を
「入口文書」
として限定運用する。

---

# Date

2026-05-27

---

# Status

Accepted

---

# Context

一人開発長期プロジェクトでは、
README.md が肥大化し、

- 情報重複
- 保守困難化
- AI誤認識

を招きやすい。

---

# Decision Details

README.md には：

- プロジェクト概要
- 思想
- 現状
- ドキュメント導線

のみを記載する。

詳細設計は：

- docs/
- CURRENT_STATUS.md
- ROADMAP.md
- DECISIONS

へ責務分離する。

---

# Consequences

## Positive

- README肥大化防止
- 保守性向上
- AI解析精度向上
- GitHub可読性向上

## Negative

- 初見で情報量不足に見える可能性
