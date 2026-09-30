/*
  qila survey — configuration
  ---------------------------
  1. SHEETS_ENDPOINT: paste the Web app URL from Google Apps Script (see backend/README.md).
     Leave empty to run in demo mode (answers are only logged in the browser console).
  2. WAITLIST: point it at your own waitlist API.
     - endpoint:  the URL your website already uses for waitlist sign-ups.
     - buildBody: shape the JSON exactly as your API expects it.
     - If endpoint is empty, the button opens `url` instead (link-out mode).
     The survey's response id is NEVER sent to the waitlist, so answers stay anonymous.
*/
window.QILA_CONFIG = {
  SHEETS_ENDPOINT: '',

  WAITLIST: {
    endpoint: '',                          // e.g. 'https://qila.dk/api/waitlist'
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    buildBody: ({ email, consent, lang }) => ({
      email,
      consent,                            // true — they ticked the marketing consent box
      source: 'survey',
      language: lang,                     // 'da' or 'en'
    }),
    url: 'https://qila.dk/waitlist?src=survey', // used when endpoint is empty
  },

  VERSION: 'v1-2026-10',
  MIN_AGE_FOR_WAITLIST: 16,               // under-16s finish without the email form
};
