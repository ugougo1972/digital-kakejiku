# digital-kakejiku Current Status

最終更新: 2026-07-14
文書版: vNext 1.5 Current Status

---

# 1. 本書の目的

本書は digital-kakejiku プロジェクトの最新開発状況を管理する基準文書である。

設計・実装・試験・ドキュメント整備の進捗を一元管理し、各設計文書との整合性を維持する。

本書は各サブシステムの進捗管理文書であり、詳細仕様は以下の基準文書を参照する。

| 文書 | 内容 |
|------|------|
| 01_HARDWARE_OVERVIEW.md | ハードウェア全体設計 |
| 02_SOFTWARE_OVERVIEW.md | ソフトウェア構成 |
| 05_WIRING_DIAGRAM.md | 配線設計 |
| 08_POWER_ARCHITECTURE.md | 電源設計 |
| ROADMAP.md | 開発計画 |

---

# 2. 現在フェーズ

## 2.1 開発フェーズ

現在の開発は以下のフェーズで進行している。

```text
Phase1
GAS実装
    │
    ├───────────────┐
    ▼               ▼
本体基板設計     GitHub文書整備
        │
        ▼
筐体設計
        │
        ▼
実負荷試験
```

電源基板PoCは完了し、現在は本体基板設計を中心に開発を進めている。

---

## 2.2 現在状態

| 項目 | 状態 |
|------|------|
| GAS | IN_PROGRESS |
| 電源基板PoC | COMPLETED |
| 本体基板設計 | IN_PROGRESS |
| 筐体設計 | IN_PROGRESS |
| GitHub文書 | vNext 1.5 更新中 |

---

## 2.3 開発マイルストーン

```text
✓ GAS基盤構築

✓ Spreadsheet構築

✓ 電源基板PoC

▶ 本体基板設計

□ 筐体試作

□ 実負荷試験

□ 長期連続試験

□ 初号機完成
```

---

## 2.4 現在の重点作業

現在の優先順位は以下とする。

1. 本体基板設計
2. 筐体設計
3. GitHub文書更新
4. GAS実装継続
5. 実負荷試験準備

---

# 3. Phase 1 Go / NoGo 判定

## 3.1 Phase1判定

| 項目 | 状態 | 判定 |
|------|------|------|
| Spreadsheet Schema | FINALIZED | GO |
| GAS Implementation Guide | FINALIZED | GO |
| Retry Strategy | FINALIZED | GO |
| Gemini Prompt | FINALIZED | GO |
| Testing Strategy | FINALIZED | GO |
| Troubleshooting | FINALIZED | GO |
| ConfigManager基盤 | DONE | GO |
| HealthCheck | DONE | GO |
| SystemLogger | DONE | GO |
| ErrorLogger | DONE | GO |
| 電源基板PoC | COMPLETED | GO |

---

## 3.2 総合判定

```text
GO
```

Phase1は継続する。

電源基板PoCは完了し、現在は本体基板設計および筐体設計を並行して進める。

GAS実装は継続し、ハードウェア完成後に統合試験へ移行する。

# 4. GAS実装状況

## 4.1 実装方針

ソフトウェアはGoogle Apps Scriptを中心に構成し、ハードウェア開発と並行して実装を進める。

Phase1では基盤機能を完成させ、本体基板完成後にESP32との統合試験へ移行する。

---

## 4.2 完了

以下の実装は完了している。

- [x] Spreadsheetスキーマ設計
- [x] GASアーキテクチャ設計
- [x] エラーコード体系策定
- [x] Calendar状態遷移設計
- [x] Poem状態遷移設計
- [x] Retry Strategy策定
- [x] Gemini Prompt仕様策定
- [x] Troubleshooting策定
- [x] Testing Strategy策定
- [x] GitHub初期反映
- [x] Spreadsheet初期化
- [x] GASプロジェクト作成
- [x] Script Properties設定
- [x] ConfigManager基本確認
- [x] source_config読込確認
- [x] system_config読込確認
- [x] HealthCheck確認
- [x] SystemLogger確認
- [x] ErrorLogger確認

---

## 4.3 実装中

現在実装中のモジュールは以下とする。

| モジュール | 状態 |
|------------|------|
| ConfigManager | IMPLEMENTING |
| SecurityManager | IMPLEMENTING |
| LogSubsystem | IMPLEMENTING |
| ApiGateway | IMPLEMENTING |

---

## 4.4 未着手

以下は本体基板完成までに実装する。

- CalendarSubsystem
- PoemSubsystem
- JobScheduler
- MaintenanceHandler
- L1単体試験
- L2結合試験
- L3障害試験

---

## 4.5 現在の優先順位

```text
ConfigManager
      │
      ▼
SecurityManager
      │
      ▼
LogSubsystem
      │
      ▼
ApiGateway
      │
      ▼
CalendarSubsystem
      │
      ▼
PoemSubsystem
```

ハードウェア開発との整合を維持しながら進める。

---

# 5. ハードウェア進捗

## 5.1 全体状況

現在のハードウェア開発状況を以下に示す。

| 項目 | 状態 |
|------|------|
| 電源基板PoC | COMPLETED |
| 本体基板設計 | IN_PROGRESS |
| 筐体設計 | IN_PROGRESS |
| 実負荷試験 | PENDING |
| 長期連続試験 | PENDING |

---

## 5.2 電源基板PoC

電源基板PoCは完了した。

確認済み項目は以下のとおりである。

- USB単独給電
- 18650単独給電
- UPS自動切替
- 5V出力確認
- 3.3V出力確認
- Battery_SENSE確認
- 5V_SENSE確認
- 導通確認
- 短絡確認

実負荷試験は本体基板完成後に実施する。

---

## 5.3 電源構成

正式構成は以下とする。

```text
USB Type-C
      │
      ▼
PTC
      │
      ▼
IP5306
      │
      ▼
DMG2305UX-13
      │
      ▼
5V_BUS
 ├────────5V_OUT
 ├────────5V_SENSE
 └────────TPS63802
               │
               ▼
          3.3V_OUT
```

本構成はPoCにより基本動作を確認済みである。

---

## 5.4 本体基板

現在、本体基板設計を進めている。

設計対象は以下のとおり。

- XIAO ESP32S3 Plus
- RTC
- microSD
- MCP23017
- I2Cセンサー群
- I2Sマイク
- 電源基板インターフェース
- OLED基板インターフェース

レイアウトでは配線長だけでなく、保守性および熱設計を優先する。

---

## 5.5 筐体設計

筐体設計は本体基板設計と並行して進める。

現在の正式方針は以下のとおり。

- 20シリーズアルミフレーム採用
- 白色塩ビ化粧板採用
- 面ファスナー固定
- E-Paper縦置き
- OLED独立基板
- ファンレス自然対流

---

## 5.6 現在位置

```text
✓ 電源基板PoC
        │
        ▼
▶ 本体基板設計
        │
        ▼
筐体試作
        │
        ▼
実負荷試験
        │
        ▼
長期連続試験
```

---

## 5.7 次工程

本体基板完成後は以下の順序で進める。

1. 本体基板製作
2. センサー搭載
3. 実負荷試験
4. UPS長時間試験
5. 温度評価
6. 通信評価
7. 長期連続運転評価

# 6. センサー

## 6.1 採択センサー

現在採択しているセンサーは以下のとおりである。

| センサー | 用途 | 接続 | 状態 |
|----------|------|------|------|
| SCD41 | CO₂ | I2C | FINALIZED |
| SGP41 | VOC・NOx | I2C | FINALIZED |
| BME680 | 温湿度・気圧 | I2C | FINALIZED |
| LTR390 | 紫外線・照度 | I2C | FINALIZED |
| SPS30 | PM2.5 | I2C | FINALIZED |
| HLK-LD2410C | 人感検知 | OUT | FINALIZED |
| ICS-43434 | 音環境 | I2S | FINALIZED |
| DS3231 | RTC | I2C | FINALIZED |
| AT24C32 | EEPROM | I2C | FINALIZED |

---

## 6.2 電源構成

センサー電源は用途別に分離する。

### 3.3V系

- XIAO ESP32S3 Plus
- SCD41
- SGP41
- BME680
- LTR390
- MCP23017
- RTC
- OLED
- ICS-43434

### 5V系

- SPS30

SENSE_GNDはADC測定専用であり、センサーの電源リターンには使用しない。

---

## 6.3 配置方針

熱およびノイズの影響を低減するため、以下を基本配置とする。

| センサー | 配置 |
|----------|------|
| BME680 | 底面吸気付近 |
| SGP41 | 底面吸気付近 |
| SCD41 | 本体中央 |
| LTR390 | 側面採光窓 |
| HLK-LD2410C | 前面 |
| ICS-43434 | 上部 |
| SPS30 | 本体基板設計後に最終決定 |

---

## 6.4 保留事項

以下は本体基板完成後に最終確定する。

- SPS30搭載位置
- HLK-LD2410C電源電圧
- OLED最終型番
- D11〜D19最終割り当て

---

# 7. GAS / Spreadsheet

## 7.1 現在状況

Phase1ではGAS基盤の整備を継続している。

| 項目 | 状態 |
|------|------|
| Spreadsheet Schema | DONE |
| Spreadsheet初期化 | DONE |
| Script Properties | DONE |
| ConfigManager確認 | DONE |
| HealthCheck | DONE |
| SystemLogger | DONE |
| ErrorLogger | DONE |

---

## 7.2 実装中

現在実装中の主要モジュール。

| モジュール | 状態 |
|------------|------|
| ConfigManager | IMPLEMENTING |
| SecurityManager | IMPLEMENTING |
| LogSubsystem | IMPLEMENTING |
| ApiGateway | IMPLEMENTING |

---

## 7.3 実装予定

ハードウェア完成までに以下を実装する。

- CalendarSubsystem
- PoemSubsystem
- JobScheduler
- MaintenanceHandler
- L1単体試験
- L2結合試験
- L3障害試験

---

## 7.4 ドキュメント整備

現在、GitHub文書はvNext 1.5への全面刷新を進めている。

対象文書は以下とする。

- 01_HARDWARE_OVERVIEW.md
- CURRENT_STATUS.md
- README.md
- ROADMAP.md
- 05_WIRING_DIAGRAM.md
- 08_POWER_ARCHITECTURE.md

各文書は相互参照を維持し、一貫した用語・状態管理を行う。

---

# 8. 開発優先順位

## 8.1 現在の優先順位

現在の開発優先順位は以下とする。

1. 本体基板設計
2. 筐体設計
3. GitHub文書更新
4. GAS実装
5. 実負荷試験
6. 長期連続試験

---

## 8.2 ハードウェア

```text
本体基板設計
      │
      ▼
基板製作
      │
      ▼
センサー実装
      │
      ▼
実負荷試験
      │
      ▼
温度評価
      │
      ▼
長期運転試験
```

---

## 8.3 ソフトウェア

```text
ConfigManager
      │
      ▼
SecurityManager
      │
      ▼
LogSubsystem
      │
      ▼
ApiGateway
      │
      ▼
CalendarSubsystem
      │
      ▼
PoemSubsystem
      │
      ▼
統合試験
```

---

## 8.4 ドキュメント

GitHub文書は以下の順序で全面刷新を行う。

1. 01_HARDWARE_OVERVIEW.md
2. CURRENT_STATUS.md
3. README.md
4. ROADMAP.md
5. 05_WIRING_DIAGRAM.md
6. 08_POWER_ARCHITECTURE.md
7. DISCUSSION（筐体構造刷新）

---

## 8.5 開発方針

現在の開発方針を以下とする。

- 本体基板設計を最優先とする。
- 筐体設計は本体基板設計と並行して進める。
- GAS実装は継続し、ハードウェア完成後に統合試験を実施する。
- GitHub文書を常に最新状態へ維持し、設計変更は速やかに反映する。

# 9. 基準文書

## 9.1 設計基準

本プロジェクトでは以下の文書を設計・実装・試験の基準文書とする。

| 文書 | 役割 |
|------|------|
| 01_HARDWARE_OVERVIEW.md | ハードウェア全体設計 |
| 02_SOFTWARE_OVERVIEW.md | ソフトウェア構成 |
| 03_LOG_FORMAT.md | ログ仕様 |
| 04_STATE_MACHINE.md | 状態遷移 |
| 05_WIRING_DIAGRAM.md | 配線仕様 |
| 06_GAS_API_SPEC.md | GAS API |
| 07_DISPLAY_UI_SPEC.md | UI仕様 |
| 08_POWER_ARCHITECTURE.md | 電源設計 |
| 14_SPREADSHEET_SCHEMA.md | Spreadsheet設計 |
| 15_GAS_IMPLEMENTATION_GUIDE.md | GAS実装 |
| 16_TESTING_STRATEGY.md | 試験計画 |
| 17_TROUBLESHOOTING.md | 障害対応 |
| 18_GAS_RETRY_STRATEGY.md | Retry設計 |
| 19_GEMINI_PROMPT_SPECIFICATION.md | Gemini仕様 |

これらの文書は相互参照を維持し、仕様変更時は整合性を保った状態で更新する。

---

## 9.2 ドキュメント管理方針

GitHubを唯一の設計情報管理基盤とする。

設計変更は、実装前に関連文書へ反映することを原則とする。

CURRENT_STATUS.md は進捗管理文書であり、仕様書ではない。

---

# 10. 未確定事項

## 10.1 ハードウェア

| 項目 | 状態 | 確定条件 |
|------|------|----------|
| OLED最終型番 | PROPOSED | 実機評価 |
| RotaryEncoder最終型番 | PROPOSED | 操作性評価 |
| SPS30最終配置 | PROPOSED | 本体基板完成 |
| LTR390窓構造 | PROPOSED | 筐体試作 |
| LD2410C電源仕様 | PROPOSED | 実機評価 |

---

## 10.2 電源

| 項目 | 状態 | 確定条件 |
|------|------|----------|
| Battery_SENSE補正式 | PROPOSED | 実負荷試験 |
| 5V_SENSE補正式 | PROPOSED | 実負荷試験 |
| UPS長時間試験 | PENDING | 本体完成後 |
| TPS63802温度評価 | PENDING | 長時間運転 |

---

## 10.3 筐体

| 項目 | 状態 | 確定条件 |
|------|------|----------|
| SPS30吸排気構造 | PROPOSED | 本体組立 |
| 上面メッシュ寸法 | PROPOSED | 試作評価 |
| 配線固定方法 | PROPOSED | 実装評価 |

---

## 10.4 ソフトウェア

| 項目 | 状態 | 確定条件 |
|------|------|----------|
| 保守UI最終仕様 | PROPOSED | 実装完了 |
| センサー診断画面 | PROPOSED | 統合試験 |
| PowerManager表示 | PROPOSED | UI評価 |

---

# 11. STATUS

## 11.1 プロジェクト

| 項目 | 状態 |
|------|------|
| 開発フェーズ | Phase1 |
| Phase1判定 | GO |
| GitHub文書更新 | IN_PROGRESS |

---

## 11.2 ハードウェア

| 項目 | 状態 |
|------|------|
| ハードウェア設計 | IN_PROGRESS |
| 電源基板PoC | COMPLETED |
| 本体基板設計 | IN_PROGRESS |
| 筐体設計 | IN_PROGRESS |
| 実負荷試験 | PENDING |
| 長期運転試験 | PENDING |

---

## 11.3 ソフトウェア

| 項目 | 状態 |
|------|------|
| GAS基盤 | IN_PROGRESS |
| ConfigManager | IMPLEMENTING |
| SecurityManager | IMPLEMENTING |
| LogSubsystem | IMPLEMENTING |
| ApiGateway | IMPLEMENTING |

---

## 11.4 現在の開発位置

```text
✓ GAS基盤

✓ 電源基板PoC

▶ 本体基板設計

▶ 筐体設計

□ 実負荷試験

□ 長期連続試験

□ 初号機完成
```

---

## 11.5 次工程

次工程は以下の順序とする。

1. 本体基板レイアウト完成
2. 基板製作
3. センサー実装
4. 筐体試作
5. 実負荷試験
6. 長期連続運転試験
7. ソフトウェア統合試験

---

# 12. CHANGE LOG

| 日付 | 内容 |
|------|------|
| 2026-06-20 | Phase1開始判定をGOへ更新 |
| 2026-06-25 | GPIO・D11〜D19・USB設計を更新 |
| 2026-06-29 | 電源PoC計画を反映 |
| 2026-07-10 | 電源アーキテクチャを全面更新 |
| 2026-07-10 | GND設計・TPS63802・DMG2305UX-13仕様を反映 |
| 2026-07-14 | 電源基板PoC完了を反映 |
| 2026-07-14 | 本体基板設計開始を反映 |
| 2026-07-14 | 筐体設計を20シリーズアルミフレーム構造へ更新 |
| 2026-07-14 | 開発マイルストーンを追加 |
| 2026-07-14 | CURRENT_STATUS.md を vNext 1.5 として全面刷新 |