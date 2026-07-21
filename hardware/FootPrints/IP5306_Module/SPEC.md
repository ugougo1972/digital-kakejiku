# IP5306_Module フットプリント設計仕様書
**Document ID**: PM-FP-004
**Document Name**: SPEC.md
**Module**: IP5306_Module
**Version**: Release v2.0
**Status**: RELEASED
**Library**: PowerModules.pretty
**Last Updated**: 2026-07-17

---

# 1. 目的

本書は PowerModules.pretty に登録する
IP5306 UPS Power Module フットプリントの設計仕様を定義する。

本書は本モジュールの唯一の設計基準文書とする。

詳細な座標は

```
COORDINATES.md
```

を参照する。

---

# 2. モジュール概要

IP5306 を搭載した
6Pin UPS電源モジュールである。

主な用途

- Li-ion充電
- 5V昇圧
- UPS電源
- Battery管理

本プロジェクトでは

Digital Kakejiku

電源基板の中核モジュールとして使用する。

---

# 3. 基本設計方針

本フットプリントは
PowerModules.pretty 共通設計規約に従う。

採用方針

- 現物実測優先
- 基板中心原点
- Pad番号のみ管理
- 信号名は回路図管理
- F.Fabによる機械外形管理
- F.SilkSによる視認性向上
- F.Courtyardによる実装領域管理

---

# 4. モジュール仕様

端子数

```
6
```

実装方式

```
Through Hole
```

用途

```
UPS Power Module
```

---

# 5. ピン仕様

|Pad|信号|
|---:|---|
|1|VIN|
|2|GND|
|3|GND|
|4|BAT|
|5|GND|
|6|OUT-5V|

Pad番号のみをフットプリントで管理する。

信号名はシンボル側で管理する。

---

# 6. Pad仕様

Pad Type

```
Through Hole
```

Pad Shape

- Pad1：RoundRect
- Pad2〜Pad6：Oval

Pad径およびドリル径は
現物実測に基づく。

詳細座標は

```
COORDINATES.md
```

を参照する。

---

# 7. 基板外形

管理レイヤ

```
F.Fab
```

管理対象

- 基板外形
- 突出部
- 切欠き

寸法は実測値を採用する。

---

# 8. シルク仕様

管理レイヤ

```
F.SilkS
```

表示内容

- OUT-5V
- BAT
- GND
- VIN

Pin番号は表示しない。

文字はPad・固定穴・Courtyardと干渉しないこと。

---

# 9. Reference

Field

```
Reference
```

Layer

```
F.SilkS
```

初期値

```
J**
```

---

# 10. Value

Field

```
Value
```

Layer

```
F.Fab
```

表示

```
IP5306_Module
```

---

# 11. Description

Description

```
IP5306 UPS Power Module
```

---

# 12. Keywords

```
IP5306
UPS
Battery
Boost
Charger
Power
```

---

# 13. Courtyard

管理レイヤ

```
F.Courtyard
```

最大機械外形に対して

```
+0.50mm
```

以上確保する。

---

# 14. Design Rationale

## 原点

採択

```
基板中心
```

理由

左右対称性を維持し、
PCB配置およびレビューを容易にする。

---

## 実測優先

採択

```
現物実測
```

理由

メーカー図面との差異を吸収するため。

---

## Pad管理

採択

```
Pad番号のみ
```

理由

信号管理をシンボルへ集約するため。

---

## シルク

採択

```
端子名称表示
```

理由

ユニバーサル基板配線および
PCBレビュー時の視認性を向上させるため。

---

## Reference

採択

```
J**
```

理由

モジュールとして管理するため。

---

# 15. 品質基準

登録前に以下を確認する。

- 基板中心原点
- Pad番号
- Pad形状
- F.Fab
- F.SilkS
- F.Courtyard
- Description
- Keywords
- ライブラリ再読込

---

# 16. 最終判定

Design Review

```
PASS
```

Library Review

```
PASS
```

PCB Placement

```
PASS
```

Registration

```
PASS
```

---

# 17. 関連文書

- COORDINATES.md
- ../common/FOOTPRINT_LIBRARY_RULES.md
- ../common/FOOTPRINT_COORDINATE_RULES.md
- ../common/MEASUREMENT_GUIDE.md
- ../common/DESIGN_RATIONALE_GUIDE.md

---

# 18. 変更履歴

|Version|内容|
|---|---|
|v2.0|Release初版。PowerModules.pretty用IP5306_Moduleフットプリント仕様書を制定。|