# qila — urban cycling study

A phone-first, tap-only survey (Danish + English) for Danish city cyclists, with:

- **Hosting:** GitHub Pages. Every push to `main` deploys the site automatically.
- **Data:** each response lands as a row in a **Google Sheet** (free, no server).
- **QR codes:** branded qila QR codes are generated for the live URL on every deploy.
- **Waitlist:** the end screen signs people up to the existing qila waitlist script.

```
site/                 the website (plain HTML/CSS/JS, no build step)
  index.html          the survey
  qr.html             QR maker: any source tag, download PNG/SVG
  assets/config.js    ← the only file you normally edit (endpoints)
  assets/questions.js ← question wording (EN + DA) and answer codes
backend/Code.gs       Google Apps Script that writes to the Sheet
backend/README.md     5-minute Sheet setup
scripts/              QR + codebook generators
qr-sources.json       the source tags that get a pre-made QR code
CODEBOOK.md           every sheet column and answer code with its label
```

---

## Go live in 4 steps

### 1 · Put it on GitHub
1. Create a new repository on GitHub (private is fine; Pages works on paid plans for private repos, otherwise make it public). Suggested name: `survey`.
2. Push this folder to it:
   ```bash
   git remote add origin https://github.com/<owner>/<repo>.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `gh-pages` / (root)**.
4. Every push to `main` runs the "Publish survey" action, which rebuilds the `gh-pages` branch. About a minute later the survey is live at
   `https://<owner>.github.io/<repo>/`.

> **Own domain** (e.g. `survey.qila.dk`): add it under Settings → Pages → Custom domain, then add a repository
> variable **Settings → Secrets and variables → Actions → Variables → `SURVEY_URL`** = `https://survey.qila.dk/`
> so the QR codes point to the domain instead of github.io. Re-run the workflow.

### 2 · Connect the Google Sheet
Follow [`backend/README.md`](backend/README.md) (5 minutes), then paste the Web app URL into
`site/assets/config.js`:
```js
SHEETS_ENDPOINT: 'https://script.google.com/macros/s/XXXX/exec',
```
Until this is set the survey runs in **demo mode**: nothing is sent, answers are kept in the browser only.

### 3 · Waitlist (already connected)
The end screen posts to the same waitlist Google Apps Script the qila app uses (`WAITLIST.endpoint` in
`site/assets/config.js`). It sends form fields, so no CORS setup is needed:

| Field | Value |
|---|---|
| `name` | First name (optional in the form, may be empty) |
| `email` | Email (validated in the browser) |
| `source` | `survey` (the app sends `qila-app`, so you can tell sign-ups apart) |
| `language` | `da` or `en` |
| `consent` | `yes` (the marketing-consent box must be ticked to join) |

The script's reply `{ ok: true }` shows "You're on the list"; anything else shows "Something went wrong, try again".
If the waitlist script ignores `language` and `consent`, nothing breaks; add columns for them there if you want to keep them.

**Privacy:** the waitlist only ever receives name and email. The survey's `response_id` is never sent, so sign-ups can't be matched to answers. Under-16s don't see the form.

### 4 · Print the QR codes
After each deploy:
- **`/qr/`**: ready-made codes for every tag in `qr-sources.json` (posters per city, campus, sticker, Instagram). Branded SVG for design work, plain PNG (2048 px) for fast printing.
- **`/qr.html`**: make a code for any new tag on the spot.

Each code carries `?src=<tag>`, which is saved with every answer, so you can see which poster or place responses came from. To add pre-made tags permanently, edit `qr-sources.json` and push.

Print at least 3 × 3 cm and test-scan every printed code. All codes were decoded in testing at 160 px, logo included (error correction level H).

---

## Editing questions
Edit `site/assets/questions.js`. Wording in `en` / `da` can change freely.
**Keep `field` and option `id`s stable once responses are coming in**: they are the sheet's column names and values.
New fields get a new column automatically. Bump `VERSION` in `config.js` when you change the questionnaire, so answers can be told apart.
Then run `npm run codebook` to refresh `CODEBOOK.md`.

Useful links while testing:
- `?lang=da` / `?lang=en` forces a language (otherwise it follows the phone).
- `?src=test` tags your own test runs so you can filter them out of the sheet.

## Link preview image
The picture shown when the link is shared (Messages, WhatsApp, LinkedIn, Slack…) is `site/assets/share.jpg`, 1200 × 630 px. Replace that file to change it. If you move to your own domain, update the three `qilacph.github.io` addresses in the `<head>` of `site/index.html`.

## Run locally
```bash
npm install
npm run serve          # http://localhost:8080
npm run qr -- https://<owner>.github.io/<repo>/   # generate site/qr/ locally
```

## What's been tested
- Version 2 of the questionnaire (11 steps): the Yes, Sometimes and No branches end to end on a phone (390×844), a small phone (360×640), a tablet (834×1112) and a laptop (1440×900), in Danish and English. No console errors.
- The slider, the typed brands, and the "which one bothers you most" screen (skipped when only one issue was picked; the answer is then filled in automatically).
- Payloads reach the Sheet endpoint. Waitlist posts carry no survey ID, and the form shows an error when the waitlist script says `ok: false`. The waitlist was tested against a mock, so no test sign-ups went onto the real list.
- `Code.gs` against a mock of Google Sheets:
  - Duplicates are ignored, and a partial row is replaced by the complete one.
  - Bots and bad IDs are rejected.
  - A formula typed as free text is stored as plain text.
  - Under-16s are excluded from the Summary.
- Every generated QR code decodes to the right URL.

## Privacy (GDPR) notes
- No cookies, no analytics, no third-party requests: fonts are self-hosted.
- Survey answers are anonymous: no name, email or IP is stored in the Sheet.
- Emails go only to your waitlist system, with explicit consent (checkbox).
- Consider adding a link to your privacy policy in `questions.js` (intro `fine` text).
