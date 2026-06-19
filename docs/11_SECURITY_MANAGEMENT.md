# 11_SECURITY_MANAGEMENT.md

## 1. 目的

認証情報管理方針を定義する。

---

## 2. 対象

* secret
* device_id

---

## 3. GAS側

保存先

Script Properties

---

## 4. Spreadsheet

禁止

* secret保存
* secretログ出力

---

## 5. ESP32側

保存先

NVS

---

## 6. 通信

HTTPS必須

---

## 7. device_id

形式

dk-xxxx

---

## 8. secretローテーション

初号機

手動

---

## 9. ログ出力禁止

禁止項目

* secret
* access_token

---

## 10. 将来拡張

* Device Registry
* Secret Rotation API
* Device Revoke
