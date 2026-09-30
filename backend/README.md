# Google Sheets backend — setup (about 5 minutes)

The survey sends each response to a small Google Apps Script attached to a Google Sheet.
No servers, no cost. Answers are written as one row per person.

## 1. Create the sheet
1. Go to <https://sheets.new> (use the qila Google account that should own the data).
2. Name it **qila survey responses**.

## 2. Add the script
1. In the sheet: **Extensions → Apps Script**.
2. Delete the placeholder code and paste everything from [`Code.gs`](Code.gs).
3. Click **Save** (disk icon). Name the project *qila survey*.
4. In the function dropdown pick **setup** and click **Run**. Approve the permissions
   (Google shows "unverified app" because it's your own script — choose *Advanced → Go to qila survey*).
   This creates the **Responses**, **Partial** and **Summary** tabs.

## 3. Publish it as a web app
1. **Deploy → New deployment** → type **Web app**.
2. *Execute as*: **Me**. *Who has access*: **Anyone**.
3. Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
4. Paste it into `site/assets/config.js`:
   ```js
   SHEETS_ENDPOINT: 'https://script.google.com/macros/s/XXXX/exec',
   ```
5. Commit and push. Done.

> If you change `Code.gs` later: **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**.
> The URL stays the same.

## What lands in the sheet
| Tab | What |
|---|---|
| **Responses** | One row per completed survey. Multi-select answers are comma-separated codes (`carrying, hair`). Free text from "Other" is in `<question>_other`. |
| **Partial** | People who started but closed the page — shows `last_screen` so you can see where they drop off. A row is removed when that person finishes. |
| **Summary** | Counts and % per answer, overall and split by helmet use (Yes / Sometimes / No). Refresh from the **qila** menu. |

Useful columns: `source` (which QR code or link), `duration_sec`, `screen_times` (seconds per screen), `lang`, `excluded` (under-16s, left out of the Summary).

## Security & privacy notes
- The endpoint only accepts short answer codes and 80-character free text. Anything else is dropped.
- Free text is escaped so it can't run as a spreadsheet formula.
- A hidden honeypot field filters simple bots. Duplicate submissions (same `response_id`) are ignored.
- No names, emails or IP addresses are stored. The waitlist email never touches this sheet.
- Keep the sheet private to the qila team; share read-only links for analysis.
