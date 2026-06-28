# Lake Erie Arms Digital Day Pass

Static GitHub Pages site for restaurant day passes.

## How it works

1. Guest scans a QR code.
2. Guest completes the form.
3. The site creates a same-day mobile pass.
4. Submission data is sent to a configured form endpoint.

The site works without a backend while testing. If `submissionEndpoint` is empty
in `script.js`, submissions are saved only in the browser's `localStorage`.

## Recommended backend

Use one of these for the first version:

- Google Apps Script connected to Google Sheets
- Microsoft Forms connected to Excel Online
- Formspree, Basin, Tally, Airtable, Zapier, or Make

Do not put private API keys in this GitHub Pages site. Anything in this folder is
public once hosted.

## Configure data submission

Edit `script.js`:

```js
const CONFIG = {
  submissionEndpoint: "https://your-form-endpoint.example.com",
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
