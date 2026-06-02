# 06_GAS_API_SPEC.md

# 1. 概要

digital-kakejiku と GAS WebApp 間の通信仕様を定義する。

---

# 2. 通信構成

ESP32 → HTTPS POST → GAS WebApp → Spreadsheet

---

# 3. 通信方式

- HTTPS
- JSON
- UTF-8
- POST

---

# 4. 認証

## Phase1

- device_id
- secret

## Phase2

- HMAC検討

---

# 5. Observation Payload

```json
{
  "device_id":"dk-001",
  "timestamp":"2026-06-01T12:00:00+09:00",
  "co2_ppm":500,
  "temperature_c":25.3,
  "humidity_pct":45.2
}
```

---

# 6. GAS応答

```json
{
  "status":"ok"
}
```

---

# 7. エラー応答

- 400 Bad Request
- 401 Unauthorized
- 500 Internal Error

---

# 8. 再送仕様

- SDへ保存
- 次回送信時再送

---

# 9. Spreadsheet保存

1レコード1行保存

---

# 10. 将来拡張

- Gemini連携
- 統計分析
