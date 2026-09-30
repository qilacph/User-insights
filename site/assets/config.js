/*
  qila survey — configuration
  ---------------------------
  1. SHEETS_ENDPOINT: paste the Web app URL from Google Apps Script (see backend/README.md).
     Leave empty to run in demo mode (answers are only logged in the browser console).
  2. WAITLIST: your waitlist (a Google Apps Script web app, same one the qila app uses).
     - endpoint:  the /exec URL of the waitlist script.
     - buildBody: the fields sent. Return URLSearchParams for form fields (what the
       waitlist script expects), or a plain object to send JSON instead.
     - The script answers { ok: true } when the sign-up worked.
     - If endpoint is empty, the button opens `url` instead (link-out mode).
     The survey's response id is NEVER sent to the waitlist, so answers stay anonymous.
*/
window.QILA_CONFIG = {
  SHEETS_ENDPOINT: '',

  WAITLIST: {
    endpoint: 'https://script.google.com/macros/s/AKfycbxAcq-Ycbhbd4L5HrCWFEM-uBC1YUgQwyA_xtZJR6C-0r-KcniA-NCNfxcmknIBtavGfg/exec',
    method: 'POST',
    buildBody: ({ name, email, consent, lang }) => new URLSearchParams({
      name,                                 // first name (optional in the form, may be '')
      email,
      source: 'survey',                     // the qila app sends 'qila-app'; this tells survey sign-ups apart
      language: lang,                       // 'da' or 'en' (extra field, ignored if the script doesn't use it)
      consent: consent ? 'yes' : 'no',      // they ticked the marketing consent box
    }),
    url: 'https://qila.dk/waitlist?src=survey', // only used if endpoint is emptied
  },

  VERSION: 'v1-2026-10',
  MIN_AGE_FOR_WAITLIST: 16,               // under-16s finish without the email form
};
