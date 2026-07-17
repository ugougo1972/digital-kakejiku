# USB_C_Breakout_6Pin フットプリント設計仕様書
**Document ID**: PM-FP-004  
**Document Name**: USB_C_Breakout_6Pin_SPEC.md  
**Version**: Release v2.0  
**Status**: RELEASED  
**Last Updated**: 2026-07-17

---

# 1. 目的

本書は、DigitalKakejikuプロジェクトで使用する USB Type-C 6Pin Breakout Module の KiCad フットプリント仕様を定義する。

本仕様は PowerModules.pretty ライブラリの正式仕様とする。

---

# 2. 適用範囲

対象

- USB Type-C Breakout Module
- 6Pin
- 2.54mm Pitch
- 電源入力用

対象外

- USB Type-Cコネクタ単体
- 回路図シンボル

---

# 3. 設計方針

本フットプリントは

- 現物実測
- 基板中心原点
- PowerModules設計規約

に従い設計した。

---

# 4. 基本仕様

|項目|値|
|---|---|
|フットプリント名|USB_C_Breakout_6Pin|
|ライブラリ|PowerModules.pretty|
|原点|基板中心|
|設計基準|現物実測|
|単位|mm|

---

# 5. 基板仕様

|項目|値|
|---|---:|
|基板幅|21.60|
|基板高さ|14.20|
|板厚|1.60|

---

# 6. Pad仕様

## 共通仕様

|項目|値|
|---|---|
|Pad数|6|
|Pad種別|Through Hole|
|Pad径|1.80mm|
|穴径|1.00mm|
|Pitch|2.54mm|

Pad1のみ角丸長方形とする。

Pad2〜Pad6は円形とする。

---

## Pad信号順（現物表示）

|Pad|端子表示|
|---:|---|
|1|VBUS|
|2|GND|
|3|CC1|
|4|D-|
|5|D+|
|6|CC2|

Pad番号は物理位置のみを管理する。

信号名は回路図側で管理する。

---

# 7. 固定穴仕様

|項目|値|
|---|---:|
|数量|2|
|穴径|3.30|
|穴間距離|16.50|

Pad種別

```
NPTH Mechanical
```

---

# 8. USBシェル仕様

|項目|値|
|---|---:|
|幅|9.00|
|奥行|7.40|
|突出量|1.40|

実測値

|測定|値|
|---|---:|
|Module①|7.42|
|Module②|7.39|

設計採択値

```
7.40mm
```

---

# 9. レイヤー構成

## F.Fab

記載内容

- 基板外形
- USBシェル
- 固定穴

線幅

```
0.10mm
```

---

## F.SilkS

記載内容

- Pin1マーク
- USB-C 6P
- VBUS
- GND
- CC1
- D-
- D+
- CC2
- Reference

線幅

```
0.15mm
```

---

## F.Courtyard

最大機械外形

+

```
0.50mm
```

USB突出部を含める。

---

# 10. Description

```
USB Type-C 6-pin breakout module,
PCB 21.6 × 14.2 mm,
2.54 mm pitch,
measured from actual module
```

---

# 11. Keywords

```
USB-C
Type-C
Breakout
6Pin
Power
Module
```

---

# 12. KiCad設定

Reference

```
J**
```

Value

```
USB_C_Breakout_6Pin
```

Pad1

```
RectRounded
```

Pad2〜Pad6

```
Circle
```

---

# 13. 完成確認

以下を確認済み。

- 基板外形
- USBシェル
- Pad
- 固定穴
- F.Fab
- F.SilkS
- F.Courtyard
- Description
- Keywords

---

# 14. 保存確認

実施済み

- 保存
- エディタ終了
- ライブラリ再読込

結果

```
PASS
```

---

# 15. PCB配置確認

確認項目

- Pad位置
- 固定穴
- USB突出方向
- Courtyard
- DRC

結果

```
PASS
```

---

# 16. 最終レビュー

|項目|結果|
|---|---|
|設計レビュー|PASS|
|ライブラリレビュー|PASS|
|GitHub登録|PASS|

---

# 17. 運用上の注意

本フットプリントは

PowerModules.pretty

の基準フットプリントとする。

今後作成するモジュールは、本仕様書の構成・記載方法・レイヤー構成・レビュー手順に準拠すること。

---

# 18. 変更履歴

|Version|内容|
|---|---|
|v2.0|Release第1版。PowerModulesライブラリ基準フットプリントとして制定。|