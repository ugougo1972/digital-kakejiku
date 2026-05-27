# DECISION_0005_REPOSITORY_STRUCTURE.md

# Decision

Repository を
責務分離型構成で運用する。

---

# Date

2026-05-27

---

# Status

Accepted

---

# Context

単一README肥大化や、
設計・実装・思想混在を避ける必要がある。

---

# Decision Details

以下構成を基本方針とする。

```text
docs/
├── 00_CONCEPT/
├── 10_REQUIREMENTS/
├── 20_ARCHITECTURE/
├── 30_HARDWARE/
├── 40_FIRMWARE/
├── 50_GAS/
├── 60_DATA/
├── 70_UI/
├── 80_OPERATIONS/
└── 90_DECISIONS/
```

また：

- CURRENT_STATUS.md
- ROADMAP.md

を Repository Root に配置する。

---

# Consequences

## Positive

- 情報責務明確化
- AI解析性向上
- 長期保守容易化

## Negative

- 初期構築量増加
- ドキュメント分散化
