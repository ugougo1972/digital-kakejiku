# PowerModules Library Naming Rules
**Document ID**: PM-FP-002  
**Document Name**: FOOTPRINT_NAMING_RULES.md  
**Version**: Release v2.0  
**Status**: RELEASED  
**Last Updated**: 2026-07-17

---

# 1. 目的

本書は、PowerModules.pretty ライブラリに登録するフットプリントの命名規則を定義する。

目的は以下のとおりである。

- ライブラリ検索性向上
- 命名の一貫性維持
- GitHub管理の容易化
- 他ライブラリとの差別化
- レビュー品質向上

---

# 2. 適用範囲

本規約はPowerModules.prettyへ登録する全フットプリントに適用する。

対象例

- USBモジュール
- 電源モジュール
- MCUモジュール
- RTC
- センサーモジュール
- Displayモジュール
- その他モジュール

---

# 3. 基本方針

名称は

**部品の用途が分かること**

を最優先とする。

型番のみの命名は禁止する。

例

NG

```
Module001
```

OK

```
USB_C_Breakout_6Pin
```

---

# 4. フットプリント名

基本形式

```
機能_特徴
```

例

```
USB_C_Breakout_6Pin
```

```
TPS63802_Module
```

```
IP5306_Module
```

```
DS3231_AT24_Module
```

```
SPS30_Module
```

---

# 5. 使用可能文字

使用する文字

```
A～Z
a～z
0～9
_
```

使用しない文字

```
空白
-
/
\
()
[]
{}
.
,
```

---

# 6. 略称規則

USB Type-C

↓

```
USB_C
```

Breakout

↓

```
Breakout
```

Module

↓

```
Module
```

OLED

↓

```
OLED
```

RTC

↓

```
RTC
```

MCU

↓

```
MCU
```

---

# 7. バージョン番号

フットプリント名へ

```
_v1
_v2
```

などは付加しない。

バージョン管理はGitで行う。

---

# 8. Reference

Referenceは

KiCadフィールドを使用する。

通常テキストは禁止。

代表例

|部品|Reference|
|---|---|
|Connector|J**|
|IC|U**|
|Resistor|R**|
|Capacitor|C**|
|Inductor|L**|
|Switch|SW**|
|Fuse|F**|

PowerModulesでは

USBモジュール等も

```
J**
```

を使用する。

---

# 9. Value

Valueは

フットプリント名と一致させる。

例

```
USB_C_Breakout_6Pin
```

---

# 10. Description

Descriptionには

最低限以下を含める。

- 部品名称
- 基板寸法
- Pin数
- Pitch
- 実測採用

例

```
USB Type-C 6-pin breakout module,
PCB 21.6 × 14.2 mm,
2.54 mm pitch,
measured from actual module
```

---

# 11. Keywords

検索性向上のため

一般名称を複数登録する。

例

```
USB-C
Type-C
Breakout
6Pin
Power
Module
```

例

```
TPS63802
Buck-Boost
Power
Converter
Module
```

---

# 12. 部品名称（F.SilkS）

部品名称は

短く

判読しやすくする。

例

```
USB-C 6P
```

```
TPS63802
```

```
RTC
```

---

# 13. 端子名称

配置可能な場合は

F.SilkSへ

端子名称を追加する。

例

```
VBUS
GND
CC1
D-
D+
CC2
```

Pad番号とは独立して管理する。

---

# 14. GitHub文書名

仕様書

```
USB_C_Breakout_6Pin.md
```

座標仕様書

```
USB_C_Breakout_6Pin_COORDINATES.md
```

レビュー記録

```
USB_C_Breakout_6Pin_REVIEW.md
```

---

# 15. PowerModules推奨命名例

```
USB_C_Breakout_6Pin
```

```
IP5306_Module
```

```
TPS63802_Module
```

```
DS3231_AT24_Module
```

```
OLED_0_91_Module
```

```
SPS30_Module
```

```
LD2410C_Module
```

```
BME680_Module
```

```
LTR390_Module
```

---

# 16. 変更履歴

|Version|内容|
|---|---|
|v2.0|Release第1版。PowerModules.pretty命名規則を制定。|