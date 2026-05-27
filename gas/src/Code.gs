const SPREADSHEET_ID = "1rwjobWZK4JJ9krvzQ9QpreLFvmFxholi0vFhzj-iAPA";
const SHEET_NAME = "RawLogs";

// 任意の長い文字列に変更する
const API_SECRET = "change-this-secret";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse(400, "missing post body");
    }

    const body = JSON.parse(e.postData.contents);

    if (!body.secret || body.secret !== API_SECRET) {
      return jsonResponse(401, "unauthorized");
    }

    if (!body.device_id || typeof body.device_id !== "string") {
      return jsonResponse(400, "device_id is required");
    }

    const temperature = validateNumber(body.temperature, "temperature");
    const humidity = validateNumber(body.humidity, "humidity");
    const pressure = validateNumber(body.pressure, "pressure");
    const rssi = validateNumber(body.rssi, "rssi");
    const battery = validateNumber(body.battery, "battery");

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return jsonResponse(500, "sheet not found: " + SHEET_NAME);
    }

    sheet.appendRow([
      new Date(),
      body.device_id,
      temperature,
      humidity,
      pressure,
      rssi,
      battery,
      JSON.stringify(body)
    ]);

    return jsonResponse(200, "ok");

  } catch (err) {
    return jsonResponse(400, "invalid request: " + err.message);
  }
}

function doGet() {
  return ContentService
    .createTextOutput("digital-kakejiku GAS alive")
    .setMimeType(ContentService.MimeType.TEXT);
}

function validateNumber(value, name) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  const n = Number(value);

  if (Number.isNaN(n)) {
    throw new Error(name + " must be a number");
  }

  return n;
}

function jsonResponse(code, message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: code >= 200 && code < 300 ? "ok" : "error",
      code: code,
      message: message
    }))
    .setMimeType(ContentService.MimeType.JSON);
}