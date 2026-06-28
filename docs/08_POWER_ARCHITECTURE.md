# digital-kakejiku 電源アーキテクチャ

最終更新: 2026-06-29  
文書版: vNext 1.3 hardware-power reflected

---

# 1. 目的

本書は電源構成の基準源である。

---

# 2. 採択済み構成

- UPS方式
- USB-C入力
- PTC / ポリスイッチ
- 18650
- IP5306
- DMG2305UX-13
- TPS63802

DMG3415Uは採択しない。

---

# 3. 電源ブロック

```text
USB-C
 ↓
ポリスイッチ
 ↓
IP5306
 ├─ 18650
 └─ OUT-5V
      ↓
    DMG2305UX-13
      ↓
    5V BUS
      ├─ SPS30
      └─ TPS63802 VIN
           ↓
         TPS63802 VOUT
           ↓
         3.3V OUTPUT
```

DMG2305UX-13は、IP5306 OUT-5Vから5V BUSへ供給する低損失スイッチおよび簡易逆流抑制として使用する。単体P-MOSFET構成は完全な逆流防止ではないため、5V BUSへ外部5Vを直接注入しない運用条件を置く。

---

# 4. 動作モード

| Mode | 説明 |
|---|---|
| USB_MODE | 通常USB給電 |
| BATTERY_MODE | 停電時18650給電 |

---

# 5. PowerManager責務

PowerManagerは給電経路を能動切替しない。

責務。

- USB給電有無の監視
- 電池電圧の監視
- USB_MODE / BATTERY_MODE の状態管理
- event_log記録
- system_log記録
- 必要時のerror_log記録

---

# 6. 停電時優先順位

1. RTC維持
2. 観測継続
3. microSD保存
4. 通信抑制
5. 表示更新抑制

---

# 7. 電源基板実装方針

電源基板は本体基板上の亀の子構成を許容する。基板間に高低差を設け、発熱部からセンサー側への空気対流を抑制する。亀の子基板下にはノイズ低減用コンデンサー等を配置できる前提とする。

## 系統

| 系統 | 対象 |
|---|---|
| 5V系 | USB-C / PTC / IP5306 / 18650 JST / DMG2305UX-13 / TPS63802 VIN / 5V BUS |
| 3.3V系 | TPS63802 VOUT / 3.3V OUTPUT |
| SENSE系 | Battery_SENSE / 5V_SENSE |
| USB通信 | USB D+ / USB D- |

電源基板上では3.3V系GNDバスを長く作らない。3.3V系GNDは実質的にTPS63802 VOUT側GNDであり、本体基板上で3.3V系GNDを展開する。

---

# 8. GND方針

GNDは共通ネットである。ただし、物理配線上は以下に分ける。

| GND | 用途 | 方針 |
|---|---|---|
| 5V系GND BUS | USB-C、IP5306、18650、5V BUS、TPS63802 VIN側 | 太く短く。大電流帰路 |
| TPS63802近傍GND島 | TPS63802 VIN/VOUT側GND、入出力コンデンサーGND | 局所合流点 |
| SENSE GND枝 | Battery_SENSE / 5V_SENSE の下側抵抗・平滑コンデンサー | 5V大電流を流さない |

TPS63802近傍GND島を、電源基板内の実質的なGND局所合流点として扱う。SENSE GND枝はTPS63802近傍に直接落とさず、ヘッダー近傍のSENSE GNDから共通GNDへ戻す。

```text
5V系GND BUS
  └─ TPS63802近傍GND島
        ├─ TPS63802 VIN側GND
        ├─ TPS63802 VOUT側GND
        ├─ TPS入力コンデンサーGND
        ├─ TPS出力コンデンサーGND
        └─ 本体基板向けGND

SENSE GND枝
  ├─ Battery_SENSE下側抵抗GND
  ├─ Battery_SENSE 0.1µF GND
  ├─ 5V_SENSE下側抵抗GND
  └─ 5V_SENSE 0.1µF GND
```

---

# 9. PTC推奨値

| 項目 | 推奨 |
|---|---|
| 用途 | USB 5V入力保護 |
| 定格電圧 | 16V以上推奨 |
| 保持電流 Ihold | 1.1A〜1.5A |
| トリップ電流 Itrip | 2.2A〜3.0A程度 |
| 配置 | USB-C VBUS直後、IP5306 VIN前 |
| 接続 | VBUS側に直列 |

```text
USB-C VBUS ── PTC ── IP5306 VIN
```

---

# 10. DMG2305UX-13接続

| 端子 | 接続先 | 備考 |
|---|---|---|
| Drain | IP5306 OUT-5V | 上流側 |
| Source | 5V BUS | 下流側 |
| Gate | 100kΩで5V系GNDへプルダウン | 常時ON寄り |

```text
IP5306 OUT-5V ── Drain
                 DMG2305UX-13
5V BUS        ── Source

Gate ── 100kΩ ── 5V系GND
```

制約。

- 5V BUSへ外部5Vを直接入れない。
- XIAO側USB VBUSを5V BUSへ戻さない。
- USB D+/D-は通信専用として扱う。
- USB-C VBUSはPTC経由でIP5306 VINへ入れる。

注意。

- 単体P-MOSFET構成は完全な逆流防止ではない。
- 5V BUSを外部給電する可能性を残す場合は、ショットキーダイオード、理想ダイオードIC、またはMOSFETバックツーバック構成を再検討する。

---

# 11. TPS63802接続

TPS63802は、電源基板図面上では表面視点のピン配置を基準とする。表面視点ピン配置は図面座標と一致確認済みである。

| ピン群 | 接続先 | 方針 |
|---|---|---|
| VIN | 5V BUS | 2ピンとも接続 |
| VOUT | 3.3V OUTPUT | 2ピンとも接続 |
| GND | TPS63802近傍GND島 | 全GNDを低インピーダンス接続 |

TPS63802入力コンデンサー、出力コンデンサーのGNDは、TPS63802近傍GND島へ最短で戻す。

---

# 12. コンデンサー方針

最初から1000µFを多用せず、470µF中心＋追加余地とする。

| 位置 | 推奨容量 | 耐圧・種類 | 備考 |
|---|---:|---|---|
| USB入力 / PTC後段 | 470µF | 10V以上、低ESR電解等 | IP5306 VIN近傍 |
| USB入力高周波 | 0.1µF | 25V以上、X7R | IP5306 VIN近傍 |
| 5V BUS | 470〜680µF | 10V以上、低ESR | DMG2305UX-13後段 |
| 5V高周波 | 0.1µF | 25V以上、X7R | 5V BUS近傍 |
| TPS63802入力 | 10〜22µF | 10V以上、X7R | TPS VIN直近 |
| TPS63802出力 | 22〜47µF | 6.3V以上、X7R | TPS VOUT直近 |
| 3.3V出力 | 220〜330µF | 6.3V以上、低ESR | 3V3_OUT近傍 |
| 3.3V高周波 | 0.1µF | 16V以上、X7R | 3V3_OUT近傍 |
| Battery_SENSE | 0.1µF | 16V以上、X7R | 分圧点直近 |
| 5V_SENSE | 0.1µF | 16V以上、X7R | 分圧点直近 |

---

# 13. SENSE回路

## Battery_SENSE

```text
BAT+ ── 100kΩ ──┬── Battery_SENSE
                 │
                0.1µF
                 │
SENSE_GND ─100kΩ─┘
```

| 部品 | 推奨 |
|---|---|
| 上側抵抗 | 100kΩ / 1% / 1/10W以上 |
| 下側抵抗 | 100kΩ / 1% / 1/10W以上 |
| 平滑コンデンサー | 0.1µF / 16V以上 / X7R |

## 5V_SENSE

```text
5V検出元 ── 150kΩ ──┬── 5V_SENSE
                     │
                    0.1µF
                     │
SENSE_GND ─100kΩ────┘
```

| 部品 | 推奨 |
|---|---|
| 上側抵抗 | 150kΩ / 1% / 1/10W以上 |
| 下側抵抗 | 100kΩ / 1% / 1/10W以上 |
| 平滑コンデンサー | 0.1µF / 16V以上 / X7R |

5V検出元は、PTC後段を基本とする。

---

# 14. USB通信線

USB D+/D-は電源系から独立させ、本体基板上のXIAO裏面ランドへ接続する。

```text
USB-C D- → XIAO裏面 USB D-
USB-C D+ → XIAO裏面 USB D+
```

方針。

- 細い被覆線を使用する。
- D+ / D-を近接並走させる。
- IP5306、TPS63802、5V BUSから離す。
- 電源線と交差する場合は直角交差を優先する。
- USB D+/D-には1PINヘッダーを立てない。
- 確認用は小ランドまたは未実装穴に留める。

---

# 15. テストポイント方針

通常の電圧測定用テストポイントは、1PIN独立ヘッダーを基本とする。GNDは少なくとも1箇所をワニ口用ループにする。USB D+/D-は小ランドまたは未実装穴に留める。

| TP名 | 接続先 | 造作 | 用途 |
|---|---|---|---|
| TP_USB_VBUS | USB-C VBUS / PTC前 | 1PIN | USB入力確認 |
| TP_PTC_OUT | PTC後段 | 1PIN | PTC通過後確認 |
| TP_IP5306_VIN | IP5306 VIN | 1PIN | IP5306入力確認 |
| TP_BAT | IP5306 BAT / BAT+ | 1PIN | 電池電圧確認 |
| TP_IP5306_OUT | IP5306 OUT-5V | 1PIN | IP5306出力確認 |
| TP_5V_BUS | DMG2305UX-13 Source後 / 5V BUS | 1PIN | 主5V確認 |
| TP_TPS_VIN | TPS63802 VIN | 1PIN | TPS入力確認 |
| TP_3V3 | TPS63802 VOUT / 3.3V OUTPUT | 1PIN | 3.3V確認 |
| TP_BAT_SENSE | Battery_SENSE中点 | 1PIN | ADC入力前確認 |
| TP_5V_SENSE | 5V_SENSE中点 | 1PIN | ADC/GPIO入力前確認 |
| TP_GND_5V | 5V系GND BUS | GNDループ推奨 | 大電流側GND基準 |
| TP_GND_ISLAND | TPS63802近傍GND島 | GNDループまたは1PIN | TPS近傍GND基準 |
| TP_GND_SENSE | SENSE GND枝 | 1PIN | ADC基準GND |
| TP_USB_D_MINUS | USB D- | 小ランド | 短絡確認用 |
| TP_USB_D_PLUS | USB D+ | 小ランド | 短絡確認用 |

---

# 16. 配線材・絶縁方針

| 用途 | 推奨部材 |
|---|---|
| 5V系GND BUS | 0.8mm程度スズメッキ線。必要に応じて並列 |
| 5V BUS | 0.8mm程度スズメッキ線。必要に応じて並列 |
| TPS63802近傍GND島 | 太めスズメッキ線＋短配線 |
| 3V3_OUT | 0.6〜0.8mmスズメッキ線 |
| SENSE GND枝 | 0.4〜0.6mmスズメッキ線または短い被覆線 |
| Battery_SENSE / 5V_SENSE | 被覆線寄り。短ければ裸線可 |
| USB D+ / D- | 細い被覆線、近接並走 |
| 18650 JST | 太め被覆線 |
| 亀の子下・交差部 | カプトン絶縁 |

裸線＋カプトンを基本とし、微細配線・交差配線・可動部・USB通信線は被覆線を使用する。

---

# 17. Phase 2前の確定必須項目

| 項目 | 状態 | 対応時期 |
|---|---|---|
| IP5306実装モジュール | PROPOSED | 電源基板PoC時 |
| USB Presence検出方法 | PROPOSED | 電源基板PoC時 |
| Battery Voltage測定方法 | CONFIRMED | Battery_SENSE分圧 |
| 低電圧警告閾値 | PROPOSED | 実測後 |
| 復電検知方式 | PROPOSED | 実測後 |

---

# 18. IP5306モジュール確定プロセス

Phase 2前に以下を確認する。

1. 使用するIP5306モジュールの型番または基板仕様を記録する
2. USB入力時の5V出力を測定する
3. 18650動作時の5V出力を測定する
4. TPS63802入力時の電圧降下を測定する
5. SPS30動作時の負荷応答を確認する
6. E-Paper更新時の電圧降下を確認する
7. 発熱を確認する

---

# 19. USB Presence検出方法

候補。

| 方式 | 状態 | 備考 |
|---|---|---|
| IP5306モジュールの信号利用 | PROPOSED | モジュール依存 |
| USB 5V分圧検出 | PROPOSED | 5V_SENSEとして実装候補 |
| 電源モード推定 | PROPOSED | 精度は低い |

確定までは方式を固定しない。

---

# 20. ログ連携

event_log。

- USB_POWER_LOST
- USB_POWER_RESTORE

system_log。

- power_mode
- battery_voltage

error_log。

- POWER_ERROR
- BATTERY_ERROR

---

# 21. STATUS

| 項目 | 状態 |
|---|---|
| UPS方式 | CONFIRMED |
| IP5306採択 | CONFIRMED |
| IP5306実装モジュール | PROPOSED |
| TPS63802採択 | CONFIRMED |
| TPS63802表面視点ピン配置 | CONFIRMED |
| DMG2305UX-13採択 | CONFIRMED |
| USB Presence検出 | PROPOSED |
| Battery_SENSE | CONFIRMED |
| 5V_SENSE | PROPOSED |
| BATTERY_MODE | CONFIRMED |
| 電源基板PoC | IN_PROGRESS |

---

# 22. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.2としてPhase 2前確認プロセスを追加 |
| 2026-06-20 | IP5306モジュール確定プロセスを追加 |
| 2026-06-29 | 電源基板実装方針、GND方針、PTC推奨値、DMG2305UX-13、TPS63802、SENSE、テストポイントを反映 |
