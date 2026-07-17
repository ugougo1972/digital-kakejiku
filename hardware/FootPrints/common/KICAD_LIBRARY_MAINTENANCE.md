# KiCad Library Maintenance Guide
**Document ID**: PM-FP-009
**Version**: Release v2.1

---

# 1. 目的

PowerModules.pretty の長期運用手順を定義する。

---

# 2. ディレクトリ構成

PowerBoard/

PowerModules.pretty/

docs/

backup/

---

# 3. バックアップ

変更前に

PowerModules.pretty

を丸ごとコピーする。

推奨

```
PowerModules_20260717.pretty
```

---

# 4. KiCad更新時

確認項目

- ライブラリ読込

- Description

- Keywords

- Reference

- Courtyard

- DRC

---

# 5. ライブラリ追加

追加前

レビュー実施

↓

追加

↓

保存

↓

再読込

↓

PCB確認

↓

GitHub更新

---

# 6. ライブラリ名称変更

変更禁止

PowerModules.pretty

固定

---

# 7. フォルダ移動

移動後

必ず

```
フットプリントライブラリ管理
```

で確認する。

---

# 8. GitHub運用

更新対象

- pretty

- md

- ChangeLog

同一コミットを推奨。

---

# 9. リリース

Major

設計思想変更

Minor

部品追加

Patch

誤記修正

---

# 10. 障害対応

ライブラリが見えない

↓

ライブラリ管理確認

↓

pretty存在確認

↓

再読込

↓

PCB確認

---

# 11. 推奨バックアップ

毎週

GitHub Push

主要更新時

ZIP保存

リリース時

Tag作成

---

# 12. 保守チェックリスト

□ ライブラリ読込

□ Description

□ Keywords

□ Reference

□ Value

□ DRC

□ GitHub

□ Tag
