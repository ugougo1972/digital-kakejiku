# Project Conventions

**Document:** `00_PROJECT_CONVENTIONS.md`

**Project:** digital-kakejiku

**Version:** vNext 1.5

**Last Updated:** 2026-07-14

---

# 1. 本書の目的

本書は digital-kakejiku プロジェクト全体で共通となる設計・記述・運用ルールを定義する。

各設計書へ重複記載せず、本書を唯一の共通規約とする。

---

# 2. 基本方針

本プロジェクトでは以下を設計原則とする。

- 保守性優先
- 拡張性優先
- モジュール化
- ドキュメント駆動開発
- GitHubを唯一の設計情報管理基盤とする
- 実装前にドキュメントを更新する

---

# 3. ドキュメント体系

## 基準文書

| 文書 | 役割 |
|------|------|
| README.md | プロジェクト概要 |
| CURRENT_STATUS.md | 開発状況 |
| ROADMAP.md | 開発計画 |
| 00_PROJECT_CONVENTIONS.md | 共通規約 |

---

## 設計文書

- Hardware
- Software
- Wiring
- Power
- UI
- GAS
- Testing

---

# 4. STATUS定義

本プロジェクトでは以下のみ使用する。

| STATUS | 意味 |
|----------|------|
| PROPOSED | 提案中 |
| PENDING | 未着手 |
| IMPLEMENTING | 実装中 |
| IN_PROGRESS | 作業進行中 |
| COMPLETED | 完了 |
| FINALIZED | 仕様確定 |

---

## STATUS使用基準

### PROPOSED

設計候補。

まだ採択していない。

---

### PENDING

開始していない。

---

### IMPLEMENTING

プログラム実装中。

主にソフトウェアで使用する。

---

### IN_PROGRESS

設計・評価・製作など進行中。

ハードウェアで使用する。

---

### COMPLETED

PoC・試験・製作など作業が完了。

---

### FINALIZED

仕様として固定。

今後変更予定なし。

---

# 4.1 RESULT(RESULT)

RESULTはレビュー・試験・工程判定を表す。

GO
    次工程への進行を許可

NG
    課題があり修正が必要

PASS
    試験・検証に合格

FAIL
    試験・検証に不合格

# 5. Phase定義

| Phase | 内容 |
|---------|------|
| Phase0 | システム設計 |
| Phase1 | ソフトウェア基盤 |
| Phase2 | ハードウェア完成 |
| Phase3 | システム統合 |
| Phase4 | 長期評価 |
| Phase5 | Release |

---

# 6. 命名規則

## 電源

| 名称 | 用途 |
|------|------|
| 5V_BUS | 電源基板内部5V |
| 5V_OUT | 本体基板供給5V |
| 3.3V_OUT | 本体基板供給3.3V |

---

## GND

| 名称 | 用途 |
|------|------|
| 5V_GND | 5V系 |
| 3.3V_GND | 3.3V系 |
| SENSE_GND | ADC専用 |

---

## ADC

| 名称 | 用途 |
|------|------|
| Battery_SENSE | Battery監視 |
| 5V_SENSE | 5V監視 |

---

# 7. 配線設計ルール

基本原則。

- 配線交差を避ける
- 電源と通信を分離する
- GNDを途中接続しない
- SENSE_GNDへ負荷電流を流さない
- USB D+/D-は近接並走
- TPS63802周辺は最短配線

---

# 8. ドキュメント更新ルール

設計変更時は以下を同時更新する。

## ハードウェア変更

- README
- CURRENT_STATUS
- ROADMAP
- 01_HARDWARE_OVERVIEW
- 05_WIRING_DIAGRAM
- 08_POWER_ARCHITECTURE

---

## ソフトウェア変更

- README
- CURRENT_STATUS
- ROADMAP
- Software関連文書

---

# 9. CHANGE LOGルール

CHANGE LOGは

以下の形式で記載する。

| 日付 | 内容 |

例

| 2026-07-14 | 電源基板PoC完了を反映 |

---

# 10. Markdownルール

以下を統一する。

## 見出し

```
#
##
###
```

のみ使用。

---

## 表

ヘッダーを必ず付与する。

---

## 配線図

ASCIIアートで統一する。

---

## STATUS

必ず大文字。

---

## ファイル名

```
NN_NAME.md
```

形式とする。

---

# 11. GitHub運用

GitHubを唯一の設計情報管理基盤とする。

設計変更は必ずGitHubへ反映する。

実装だけ先行することは禁止する。

---

# 12. 今後追加予定

以下は将来追加予定。

- Coding Style
- Git運用規約
- Branch運用
- Release運用
- Version管理

---

# CHANGE LOG

| 日付 | 内容 |
|------|------|
| 2026-07-14 | 初版作成 |