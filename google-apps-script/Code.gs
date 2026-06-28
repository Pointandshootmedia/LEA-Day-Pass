const SPREADSHEET_ID = "";
const SHEET_NAME = "Day Pass Leads";

const HEADERS = [
  "Timestamp",
  "First Name",
  "Last Name",
  "Phone",
  "Email",
  "ZIP",
  "Referral",
  "Visit Type",
  "Pass Number",
  "Business Name",
  "Restaurant/Selected Access Acknowledged",
  "Marketing Consent",
  "Created At",
  "Expires At",
];

function doPost(event) {
  try {
    const sheet = getLeadSheet_();
    const payload = parsePayload_(event);

    sheet.appendRow([
      new Date(),
      payload.firstName || "",
      payload.lastName || "",
      payload.phone || "",
      payload.email || "",
      payload.zip || "",
      payload.referral || "",
      payload.visitType || "",
      payload.passNumber || "",
      payload.businessName || "",
      payload.restaurantOnlyAcknowledged === true,
      payload.marketingConsent === true,
      payload.createdAt || "",
      payload.expiresAt || "",
    ]);

    return json_({ ok: true, sheetName: sheet.getName() });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

function doGet() {
  return ContentService
    .createTextOutput(
      "Lake Erie Arms day pass endpoint is running. Sheet target: " +
        getSpreadsheet_().getName()
    )
    .setMimeType(ContentService.MimeType.TEXT);
}

function getLeadSheet_() {
  const spreadsheet = getSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function getSpreadsheet_() {
  if (SPREADSHEET_ID) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error("No active spreadsheet. Set SPREADSHEET_ID in Code.gs.");
  }

  return spreadsheet;
}

function parsePayload_(event) {
  if (!event || !event.postData || !event.postData.contents) {
    return {};
  }

  try {
    return JSON.parse(event.postData.contents);
  } catch (error) {
    return {};
  }
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
