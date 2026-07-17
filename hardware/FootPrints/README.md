# PowerModules.pretty
**PowerModules Library**  
**Release**: v2.0.0  
**Status**: RELEASED

---

# 概要

PowerModules.pretty は、DigitalKakejiku プロジェクト専用の KiCad フットプリントライブラリです。

本ライブラリは、市販モジュールを対象とした **実測ベースの高精度フットプリント**を提供します。

設計の基本方針は以下のとおりです。

- 現物実測優先
- 基板中心原点
- 機械外形重視
- レビュー必須
- GitHubによる設計履歴管理

---

# 設計思想

PowerModules.pretty は、一般的な部品ライブラリではありません。

目的は

> **実際に購入したモジュールを、そのまま安全かつ確実にPCBへ実装できるフットプリントを提供すること**

です。

そのため、

- データシート
- メーカー図面

よりも、

**現物実測値**

を優先します。

---

# 設計原則

すべてのフットプリントは以下を満たします。

- 基板中心原点
- 実測値採用
- 推測禁止
- Pad番号のみ管理
- 信号名は回路図シンボル側
- F.Fabで機械外形管理
- F.SilkSで視認性確保
- F.Courtyardで実装領域管理
- 保存・再読込確認済み

---

# ディレクトリ構成

```text
footprints/
│
├── PowerModules.pretty
│
└── docs/
    └── hardware/
        └── footprints/
            ├── README.md
            ├── 01_FOOTPRINT_LIBRARY_RULES.md
            ├── 02_FOOTPRINT_NAMING_RULES.md
            ├── 03_FOOTPRINT_REVIEW_CHECKLIST.md
            ├── 04_USB_C_Breakout_6Pin_SPEC.md
            ├── 05_USB_C_Breakout_6Pin_COORDINATES.md
            ├── 06_FOOTPRINT_DESIGN_WORKFLOW.md
            └── 07_FOOTPRINT_CHANGELOG.md
```

---

# リリース済みフットプリント

|名称|状態|
|---|---|
|USB_C_Breakout_6Pin|RELEASED|

---

# 開発予定

以下を順次追加予定です。

|名称|状態|
|---|---|
|TPS63802_Module|PLANNED|
|IP5306_Module|PLANNED|
|DS3231_AT24_Module|PLANNED|
|OLED_0_91_Module|PLANNED|
|SPS30_Module|PLANNED|
|LD2410C_Module|PLANNED|
|BME680_Module|PLANNED|
|LTR390_Module|PLANNED|
|XIAO_ESP32S3_Plus|PLANNED|

---

# 新規フットプリント作成手順

新規フットプリントは、以下の順番で作成します。

1. 現物入手
2. 現物実測
3. 設計値決定
4. 仕様書作成
5. 座標仕様書作成
6. KiCad入力
7. 設計レビュー
8. 修正
9. 保存
10. エディタ終了
11. ライブラリ再読込
12. PCB配置確認
13. GitHub登録

詳細は

- `01_FOOTPRINT_LIBRARY_RULES.md`
- `06_FOOTPRINT_DESIGN_WORKFLOW.md`

を参照してください。

---

# 品質保証

ライブラリへ登録するフットプリントは、以下を満たす必要があります。

- REVIEW：PASS
- PCB配置確認：PASS
- 保存確認：PASS
- ライブラリ再読込：PASS

レビュー項目は

`03_FOOTPRINT_REVIEW_CHECKLIST.md`

に従います。

---

# バージョン管理

本ライブラリは Semantic Versioning を採用します。

|番号|意味|
|---|---|
|Major|設計思想変更|
|Minor|新規フットプリント追加|
|Patch|誤記修正・軽微な修正|

例

- v2.0.0：Release第1版
- v2.1.0：新規モジュール追加
- v2.1.1：文書修正

---

# GitHub運用

ライブラリ更新時は以下を更新します。

- フットプリント
- 仕様書
- 座標仕様書
- ChangeLog

レビューを実施しない更新は禁止します。

---

# ライセンス

本ライブラリは DigitalKakejiku プロジェクト専用ライブラリです。

公開・再配布する場合は、ライセンス条件および実測値の出典を明記してください。

---

# 更新履歴

|Version|内容|
|---|---|
|v2.0.0|PowerModules Library 初版公開。USB_C_Breakout_6Pinを基準フットプリントとして登録。|