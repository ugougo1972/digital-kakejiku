# digital-kakejiku 電源アーキテクチャ

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書は電源構成の基準源である。

---

# 2. 基本方針

- 据置型
- 常時稼働
- USB給電優先
- 停電時は18650へ自動移行
- データ保存を最優先

---

# 3. 採択構成

| 部材 | 用途 | 状態 |
|---|---|---|
| 18650 | 停電時電源 | CONFIRMED |
| IP5306 | 充電・昇圧管理 | CONFIRMED |
| DMG2305UX-13 | 逆流防止 | CONFIRMED |
| TPS63802 | 3.3V生成 | CONFIRMED |
| ポリスイッチ | 過電流保護 | CONFIRMED |

---

# 4. 電源フロー

```text
USB-C
 ↓
ポリスイッチ
 ↓
IP5306
 ├─ 18650
 └─ 5V
     ├─ SPS30
     └─ TPS63802
          ↓
        3.3V系
```

---

# 5. 電源モード

| Mode | 説明 |
|---|---|
| USB_MODE | 通常USB給電 |
| BATTERY_MODE | 停電時18650運用 |

遷移。

```text
USB_MODE
 ↓ USB喪失
BATTERY_MODE
 ↓ USB復帰
USB_MODE
```

---

# 6. 停電時優先順位

1. RTC維持
2. 観測継続
3. microSD保存
4. 通信抑制
5. E-Paper更新抑制

---

# 7. PowerManager責務

PowerManagerは給電経路を能動的に切り替えない。電源切替は回路側のUPS的動作に任せる。

PowerManagerの責務。

- USB給電有無の検出
- 電池電圧監視
- power_mode記録
- event_log記録
- 低電圧時の通信・表示抑制判断

---

# 8. 未確定事項

| 項目 | 状態 |
|---|---|
| IP5306実装モジュール | PROPOSED |
| USB Presence検出方式 | PROPOSED |
| 低電圧閾値 | PROPOSED |
| 復電検出閾値 | PROPOSED |
| 発熱評価 | PROPOSED |

---

# 9. STATUS

| 項目 | 状態 |
|---|---|
| UPS方式 | CONFIRMED |
| PowerManager責務 | FINALIZED |
| 停電時優先順位 | FINALIZED |
| 閾値類 | PROPOSED |

---

# 10. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.1として電源責務を整理 |
