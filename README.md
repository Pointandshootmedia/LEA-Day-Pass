# Lake Erie Arms Digital Day Pass

Static GitHub Pages site for restaurant day passes.

## How it works

1. Guest scans a QR code.
2. Guest completes the form.
3. The site creates a same-day mobile pass.
4. Submission data is sent to a configured form endpoint.

The site works without a backend while testing. If `submissionEndpoint` is empty
in `script.js`, submissions are saved only in the browser's `localStorage`.

## Google Sheets backend

The recommended backend is Google Apps Script connected to Google Sheets.

1. Create a Google Sheet named `Lake Erie Arms Day Pass Leads`.
2. In the sheet, go to Extensions -> Apps Script.
3. Replace the starter code with `google-apps-script/Code.gs` from this repo.
4. Copy the Google Sheet ID from the sheet URL and paste it into `SPREADSHEET_ID`.
   The ID is the long value between `/d/` and `/edit`.
5. Save the Apps Script project.
6. Click Deploy -> New deployment.
7. Choose type: Web app.
8. Execute as: Me.
9. Who has access: Anyone.
10. Deploy and authorize the script.
11. Copy the Web app URL.

Do not put private API keys in this GitHub Pages site. Anything in this folder is
public once hosted.

## Configure data submission

Edit `script.js`:

```js
const CONFIG = {
  submissionEndpoint: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  businessName: "Lake Erie Arms",
};
```

The app sends JSON text with guest fields, pass number, verification code,
restaurant-only acknowledgement, marketing consent, creation time, and
expiration time.

## Publish on GitHub Pages

1. Create a GitHub repository.
2. Upload `index.html`, `styles.css`, `script.js`, `README.md`, and the
   `images` folder.
3. Go to repository Settings.
4. Open Pages.
5. Choose the main branch and root folder.
6. Save, then use the GitHub Pages URL for your QR code.

## Staff verification

The pass displays:

- Current date
- Unique pass number
- Six-digit verification code
- Daily color badge
- Restaurant-only access

For a stronger second version, add a staff-only lookup page backed by the same
spreadsheet or CRM.
