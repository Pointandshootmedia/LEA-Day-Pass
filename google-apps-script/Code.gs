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
  "Verification Code",
  "Business Name",
  "Restaurant/Selected Access Acknowledged",
  "Marketing Consent",
  "Created At",
  "Expires At",
];

function doPost(event) {
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
    payload.verifyCode || "",
    payload.businessName || "",
    payload.restaurantOnlyAcknowledged === true,
    payload.marketingConsent === true,
    payload.createdAt || "",
    payload.expiresAt || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput("Lake Erie Arms day pass endpoint is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function getLeadSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
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
