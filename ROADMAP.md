# ROADMAP.md

# digital-kakejiku Roadmap

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

digital-kakejiku の開発ロードマップを定義する。

# 2. 現在位置

```text
Phase1
GAS本実装
IN_PROGRESS
```

# 3. 全体ロードマップ

```text
Phase0 設計
  ↓
Phase1 GAS本実装
  ↓
Phase2 ESP32統合
  ↓
Phase3 表示統合
  ↓
Phase4 長期運用試験
  ↓
Phase5 筐体完成
```

# 4. Phase0 設計

状態。

```text
COMPLETE
```

完了事項。

- MCU選定
- 前面表示選定
- 背面保守UI方針整理
- RTC選定
- UPS方式採択
- センサー選定
- Spreadsheet設計
- Calendar設計
- Poem設計
- GAS設計
- vNext文書セット再生成

# 5. Phase1 GAS本実装

状態。

```text
IN_PROGRESS
```

Goal。

```text
Spreadsheet完成
GAS API完成
Calendar生成完成
Poem生成完成
Retry制御完成
```

Steps。

| Step | 対象 | 状態 |
| --- | --- | --- |
| 1 | Spreadsheet構築 | NEXT |
| 2 | ConfigManager実装 | PLANNED |
| 3 | SecurityManager実装 | PLANNED |
| 4 | LogSubsystem実装 | PLANNED |
| 5 | ApiGateway実装 | PLANNED |
| 6 | CalendarSubsystem実装 | PLANNED |
| 7 | PoemSubsystem実装 | PLANNED |
| 8 | JobScheduler実装 | PLANNED |
| 9 | Maintenance Handler実装 | PLANNED |
| 10 | 結合試験 | PLANNED |


Phase1完了条件。

- 全シート作成完了
- doGet正常
- doPost正常
- observation_log保存成功
- calendar_master生成成功
- poem_cache生成成功
- CALENDAR_PENDING動作確認
- Retry制御確認
- Security検証確認

# 6. Phase2 ESP32統合

状態。

```text
PENDING
```

対象。

- Wi-Fi
- HTTPS
- Payload送信
- 再送制御
- microSD保存
- NVS設定

完了条件。

```text
24時間連続送信成功
```

# 7. Phase3 表示統合

状態。

```text
PENDING
```

対象。

- E-Paper表示
- calendar_master表示
- poem_cache表示
- 背面OLED表示
- ロータリーエンコーダ操作
- Calendar再生成要求
- Poem再生成要求

# 8. Phase4 長期運用試験

状態。

```text
PENDING
```

完了条件。

```text
30日以上安定稼働
```

# 9. Phase5 筐体完成

状態。

```text
PENDING
```

対象。

- 筐体
- 配線整理
- 放熱
- 通気
- センサー配置
- 背面保守UI配置

# 10. 優先順位

| 優先度 | 対象 |
| --- | --- |
| Highest | Spreadsheet、ConfigManager、SecurityManager、LogSubsystem、ApiGateway、CalendarSubsystem、PoemSubsystem、JobScheduler |
| High | ESP32統合、microSD保存、再送制御 |
| Medium | E-Paper表示統合、背面保守UI統合 |
| Low | 筐体、長期運用試験 |


# 11. STATUS SUMMARY

| 項目 | 状態 |
| --- | --- |
| Phase0 設計 | COMPLETE |
| Phase1 GAS実装 | IN_PROGRESS |
| Phase2 ESP32統合 | PENDING |
| Phase3 表示統合 | PENDING |
| Phase4 長期試験 | PENDING |
| Phase5 筐体完成 | PENDING |


# 12. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | Phase1実装順序を最新方針へ統一 |
| 2026-06-20 | 背面保守UI統合をPhase3対象として反映 |
