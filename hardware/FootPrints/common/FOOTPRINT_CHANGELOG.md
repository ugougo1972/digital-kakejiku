# PowerModules Library Change Log
**Document ID**: PM-FP-007
**Document Name**: FOOTPRINT_CHANGELOG.md
**Version**: Release v2.0
**Status**: RELEASED
**Last Updated**: 2026-07-17

---

# 1. 目的

本書は PowerModules.pretty ライブラリの変更履歴を管理する。

単なる更新履歴ではなく、

- 設計方針
- 設計変更理由
- 採択理由
- 廃止理由

を含む設計履歴として管理する。

---

# 2. 管理方針

変更履歴は

「何を変更したか」

だけではなく

「なぜ変更したか」

を必ず記録する。

設計判断が追跡できることを目的とする。

---

# 3. Version管理

|Version|意味|
|---|---|
|Major|設計思想変更|
|Minor|仕様追加|
|Patch|誤記修正|

例

```
v2.0.0
```

Release版

```
v2.1.0
```

仕様追加

```
v2.1.1
```

誤記修正

---

# 4. Release履歴

## v2.0.0

初回正式Release

PowerModules.pretty運用開始

---

# 5. USB_C_Breakout_6Pin

### 新規追加

PowerModulesライブラリ第1号として登録。

---

### 採択事項

#### 原点

変更前

```
Pad1中心
```

変更後

```
基板中心
```

理由

左右対称モジュールでは
Pad基準より
基板中心基準の方が

- 機械設計
- PCB設計
- レビュー

すべて容易になるため。

---

#### USBシェル寸法

実測

```
7.42
7.39
```

採択

```
7.40
```

---

#### Pad

Pad径

```
1.80mm
```

穴径

```
1.00mm
```

---

#### 固定穴

```
NPTH Mechanical
```

採択。

---

#### Pin1

Pad1

```
RoundRect
```

採択。

---

#### F.SilkS

追加

```
USB-C 6P
```

```
VBUS
```

```
GND
```

```
CC1
```

```
D-
```

```
D+
```

```
CC2
```

理由

配線確認性向上。

---

#### F.Courtyard

追加。

USB突出部を含め

```
+0.50mm
```

採択。

---

### 保存手順

今回発生した

ライブラリ認識問題を受け

以下を正式採択。

```
保存
```

↓

```
エディタ終了
```

↓

```
ライブラリ再読込
```

↓

```
レビュー
```

---

# 6. ライブラリ共通ルール制定

今回新たに制定。

・基板中心原点

・実測優先

・推測禁止

・Pad番号のみ管理

・信号名は回路図側

・端子名称はF.SilkS

・Description必須

・Keywords必須

・レビュー必須

・GitHub管理

---

# 7. 今後の予定

以下を順次追加予定。

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

```
XIAO_ESP32S3_Plus
```

---

# 8. 更新ルール

変更時は

以下を必ず記録する。

・Version

・日付

・変更内容

・変更理由

・担当者

---

# 9. Change Log

|Version|Date|内容|
|---|---|---|
|2.0.0|2026-07-17|PowerModules Library Release第1版公開|

---

# 10. Design History

## 採用した設計

- 基板中心原点
- 実測優先
- F.SilkS端子名称
- F.Courtyard追加
- 保存→再読込確認
- GitHub文書管理

---

## 採用しなかった設計

### Pad1原点

理由

左右対称部品では

機械設計との整合が悪いため。

---

### Padへ信号名付与

理由

信号管理は

回路図シンボル側へ集約するため。

---

# 11. 変更履歴

|Version|内容|
|---|---|
|v2.0|Release第1版制定|