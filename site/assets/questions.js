/*
  qila urban cycling study — questions (v2)
  -----------------------------------------
  Edit wording freely (en / da). Keep the `field` and option `id`s stable:
  they are the column names and values in the Google Sheet.

  Screen types
    intro | tiles | chips | end
  Screen flags
    branch:   'yes' | 'sometimes' | 'no'  → only shown on that path
    optional: true                         → shows Skip, nothing is required
    needs:    { field, min }               → screen is skipped unless that many answers were picked in `field`
  Group kinds (default is pills)
    type:      'single' | 'multi'
    shuffle:   true  → option order is randomised per respondent (unordered lists only)
    other:     true  → adds a "+ Other" pill with a text field (saved as <field>_other)
    max:       n     → multi-select limit
    optional:  true  → can be left empty
    from:      'field' → pills are whatever the person picked in that earlier question ("which one matters most")
    kind: 'slider'   → 0–100 % slider (step 5) with an "unsure" pill; saved as a number or 'not_sure'
    kind: 'text'     → up to `count` typed answers, saved as <field>_1_other, <field>_2_other …
  Option flags
    exclusive: true  → selecting it clears the others (e.g. "Nothing", "Rather not say")
*/

window.QILA_UI = {
  next:        { en: 'Next', da: 'Næste' },
  back:        { en: 'Back', da: 'Tilbage' },
  skip:        { en: 'Skip', da: 'Spring over' },
  tap:         { en: 'Tap an answer', da: 'Tryk på et svar' },
  other:       { en: 'Other', da: 'Andet' },
  otherPh:     { en: 'Type your own', da: 'Skriv selv' },
  addAnother:  { en: 'Add another', da: 'Tilføj en mere' },
  microLeft:   { en: 'qila / urban cycling study', da: 'qila / bycykel-studie' },
  microRight:  { en: '2026 · anonymous', da: '2026 · anonymt' },
  pickAll:     { en: 'Pick all that fit.', da: 'Vælg alle, der passer.' },
  pickOne:     { en: 'Pick one.', da: 'Vælg én.' },
  maxReached:  { en: 'You can pick up to {n}.', da: 'Du kan vælge op til {n}.' },
  langLabel:   { en: 'Sprog / Language', da: 'Sprog / Language' },
};

const YES_K  = { en: 'You wear one', da: 'Du bruger hjelm' };
const SOME_K = { en: 'Sometimes',    da: 'Nogle gange' };
const NO_K   = { en: 'No helmet',    da: 'Ingen hjelm' };
const ALL_K  = { en: 'Everyone',     da: 'Alle' };

const S_HELMET = { en: 'Your helmet', da: 'Din hjelm' };

/* The same six barriers, worded the same, in all three branches — so answers can be compared. */
const CORE = [
  { id: 'carry',  en: 'Annoying to carry around', da: 'Irriterende at slæbe rundt på' },
  { id: 'hot',    en: 'Hot or sweaty',            da: 'Varm eller svedig' },
  { id: 'fit',    en: 'Uncomfortable fit',        da: 'Sidder ubehageligt' },
  { id: 'hair',   en: 'Messes up my hair',        da: 'Ødelægger mit hår' },
  { id: 'looks',  en: 'Don’t like how it looks',  da: 'Kan ikke lide, hvordan den ser ud' },
  { id: 'forget', en: 'I forget it',              da: 'Jeg glemmer den' },
];
const FRIENDS = { id: 'friends', en: 'My friends don’t wear one', da: 'Mine venner bruger ikke hjelm' };
const RISK    = { id: 'risk',    en: 'I don’t feel at risk',      da: 'Jeg føler mig ikke i fare' };

window.QILA_SCREENS = [
  { id: 'intro', type: 'intro',
    kicker: { en: 'Urban cycling study · Denmark 2026', da: 'Studie af bycyklister · Danmark 2026' },
    hero:   { en: 'HOW DO\nYOU\nRIDE?', da: 'HVORDAN\nCYKLER\nDU?' },
    body:   { en: 'Help us save lives.', da: 'Hjælp os med at redde liv.' },
    facts:  [],
    cta:    { en: 'Start', da: 'Start' },
    fine:   { en: 'No names, no email. Answers are stored anonymously and used only for qila’s research. You can stop at any time.',
              da: 'Ingen navne, ingen e-mail. Svarene gemmes anonymt og bruges kun til qilas research. Du kan stoppe når som helst.' },
  },

  { id: 'q01', type: 'tiles', step: 1, section: S_HELMET, kicker: { en: 'Q.01', da: 'Q.01' },
    q:    { en: 'Do you wear a bike helmet?', da: 'Bruger du cykelhjelm?' },
    hint: { en: 'Be honest — every answer helps.', da: 'Vær ærlig – alle svar hjælper.' },
    groups: [ { field: 'helmet_use', type: 'single', options: [
      { id: 'yes',       en: 'YES',       da: 'JA',          sub: { en: 'Every ride',          da: 'Hver tur' } },
      { id: 'sometimes', en: 'SOMETIMES', da: 'NOGLE GANGE', sub: { en: 'Depends on the trip', da: 'Afhænger af turen' } },
      { id: 'no',        en: 'NO',        da: 'NEJ',         sub: { en: 'Never',               da: 'Aldrig' } },
    ] } ] },

  /* ---------- YES branch ---------- */
  { id: 'q02y', type: 'chips', step: 2, section: S_HELMET, branch: 'yes', kicker: YES_K,
    q: { en: 'What issues do you experience?', da: 'Hvilke problemer oplever du?' }, hint: 'pickAll',
    groups: [ { field: 'helmet_issues', type: 'multi', shuffle: true, other: true, options: [
      ...CORE,
      { id: 'nothing', en: 'Nothing, it’s fine', da: 'Ingen, den er fin', exclusive: true },
    ] } ] },
  { id: 'q03y', type: 'chips', step: 3, section: S_HELMET, branch: 'yes', kicker: YES_K, needs: { field: 'helmet_issues', min: 2 },
    q: { en: 'Which one bothers you most?', da: 'Hvad generer dig mest?' }, hint: 'pickOne',
    groups: [ { field: 'top_issue', type: 'single', from: 'helmet_issues' } ] },
  { id: 'q04y', type: 'chips', step: 4, section: S_HELMET, branch: 'yes', kicker: YES_K,
    q: { en: 'What makes you wear it?', da: 'Hvad får dig til at bruge den?' }, hint: 'pickAll',
    groups: [ { field: 'wear_reasons', type: 'multi', shuffle: true, other: true, options: [
      { id: 'safety',     en: 'Safety',                  da: 'Sikkerhed' },
      { id: 'habit',      en: 'Habit since I was a kid', da: 'Vane, siden jeg var barn' },
      { id: 'traffic',    en: 'Traffic feels risky',     da: 'Trafikken føles farlig' },
      { id: 'close_call', en: 'An accident — mine or someone close to me', da: 'En ulykke – min egen eller blandt mine nærmeste' },
      { id: 'asked',      en: 'Someone asked me to',     da: 'Nogen bad mig om det' },
      { id: 'example',    en: 'To set an example',       da: 'For at være et godt eksempel' },
      { id: 'peers',      en: 'People around me do',     da: 'Folk omkring mig gør det' },
    ] } ] },

  /* ---------- SOMETIMES branch ---------- */
  { id: 'q02s', type: 'chips', step: 2, section: S_HELMET, branch: 'sometimes', kicker: SOME_K,
    q: { en: 'When do you skip it?', da: 'Hvornår springer du den over?' }, hint: 'pickAll',
    groups: [ { field: 'skip_situations', type: 'multi', shuffle: true, other: true, options: [
      { id: 'short',       en: 'Short trips',                      da: 'Korte ture' },
      { id: 'nights',      en: 'Nights out',                       da: 'Byture' },
      { id: 'hurry',       en: 'When I’m in a hurry',              da: 'Når jeg har travlt' },
      { id: 'dressed',     en: 'When I’ve dressed up',             da: 'Når jeg har sat håret' },
      { id: 'warm',        en: 'Warm days',                        da: 'Varme dage' },
      { id: 'carry_after', en: 'When I’d have to carry it around', da: 'Når jeg skal slæbe rundt på den bagefter' },
      { id: 'shared',      en: 'On a shared bike',                 da: 'På en delecykel' },
    ] } ] },
  { id: 'q03s', type: 'chips', step: 3, section: S_HELMET, branch: 'sometimes', kicker: SOME_K,
    q: { en: 'What gets in the way?', da: 'Hvad står i vejen?' }, hint: 'pickAll',
    groups: [ { field: 'skip_reasons', type: 'multi', shuffle: true, other: true, options: [ ...CORE, FRIENDS, RISK ] } ] },
  { id: 'q04s', type: 'chips', step: 4, section: S_HELMET, branch: 'sometimes', kicker: SOME_K, needs: { field: 'skip_reasons', min: 2 },
    q: { en: 'Which one matters most?', da: 'Hvad betyder mest?' }, hint: 'pickOne',
    groups: [ { field: 'top_reason', type: 'single', from: 'skip_reasons' } ] },

  /* ---------- NO branch ---------- */
  { id: 'q02n', type: 'chips', step: 2, section: S_HELMET, branch: 'no', kicker: NO_K,
    q: { en: 'Do you own a helmet?', da: 'Ejer du en hjelm?' }, hint: 'pickOne',
    groups: [ { field: 'helmet_ownership', type: 'single', options: [
      { id: 'at_home', en: 'Yes, but it stays at home', da: 'Ja, men den bliver derhjemme' },
      { id: 'used_to', en: 'I used to',                 da: 'Det har jeg gjort' },
      { id: 'never',   en: 'No, never have',            da: 'Nej, aldrig' },
    ] } ] },
  { id: 'q03n', type: 'chips', step: 3, section: S_HELMET, branch: 'no', kicker: NO_K,
    q: { en: 'What keeps you from wearing one?', da: 'Hvad holder dig fra at bruge en?' }, hint: 'pickAll',
    groups: [ { field: 'no_helmet_reasons', type: 'multi', shuffle: true, other: true, options: [
      ...CORE, FRIENDS, RISK,
      { id: 'price', en: 'Too expensive', da: 'For dyr' },
    ] } ] },
  { id: 'q04n', type: 'chips', step: 4, section: S_HELMET, branch: 'no', kicker: NO_K,
    q: { en: 'What could change your mind?', da: 'Hvad kunne få dig til at ændre mening?' }, hint: 'pickAll',
    groups: [ { field: 'would_consider', type: 'multi', shuffle: true, other: true, options: [
      { id: 'carry',      en: 'Easier to carry',         da: 'Nemmere at have med' },
      { id: 'comfort',    en: 'More comfortable',        da: 'Mere behagelig' },
      { id: 'hair',       en: 'Doesn’t mess up my hair', da: 'Ødelægger ikke mit hår' },
      { id: 'looks',      en: 'Looks good on me',        da: 'Ser godt ud på mig' },
      { id: 'cheaper',    en: 'Cheaper',                 da: 'Billigere' },
      { id: 'stigma',     en: 'If the stigma disappeared',          da: 'Hvis stigmaet forsvandt' },
      { id: 'asked',      en: 'If someone close to me asked me to', da: 'Hvis en af mine nærmeste bad mig om det' },
      { id: 'close_call', en: 'An accident — mine or someone close to me', da: 'En ulykke – min egen eller blandt mine nærmeste' },
      { id: 'nothing',    en: 'Nothing would',           da: 'Intet', exclusive: true },
    ] } ] },

  /* ---------- everyone ---------- */
  { id: 'q05', type: 'chips', step: 5, section: { en: 'Your riding', da: 'Din cykling' }, kicker: ALL_K,
    q: { en: 'How often do you ride?', da: 'Hvor tit cykler du?' },
    groups: [
      { field: 'ride_frequency', type: 'single', label: { en: 'Pick one', da: 'Vælg én' }, options: [
        { id: 'daily',       en: 'Every day',          da: 'Hver dag' },
        { id: 'weekly_plus', en: 'A few times a week', da: 'Et par gange om ugen' },
        { id: 'weekly',      en: 'About once a week',  da: 'Cirka en gang om ugen' },
        { id: 'less',        en: 'Less often',         da: 'Sjældnere' },
      ] },
      { field: 'bike_types', type: 'multi', other: true, label: { en: 'What do you ride? · pick all', da: 'Hvad cykler du på? · vælg alle' }, options: [
        { id: 'city',   en: 'City bike',                da: 'Bycykel' },
        { id: 'ebike',  en: 'E-bike',                   da: 'Elcykel' },
        { id: 'cargo',  en: 'Cargo bike (Christiania)', da: 'Ladcykel (Christiania)' },
        { id: 'shared', en: 'Shared bike',              da: 'Delecykel' },
      ] },
    ] },
  { id: 'q06', type: 'chips', step: 6, section: { en: 'Your people', da: 'Dine venner' }, kicker: ALL_K,
    q: { en: 'How many of your friends wear a helmet?', da: 'Hvor mange af dine venner bruger hjelm?' },
    hint: { en: 'Drag to your best guess.', da: 'Træk til dit bedste gæt.' },
    groups: [ { field: 'friends_helmet_pct', kind: 'slider', start: 50,
      scale:  [ { en: 'None', da: 'Ingen' }, { en: 'Half', da: 'Halvdelen' }, { en: 'All', da: 'Alle' } ],
      unsure: { en: 'Not sure', da: 'Ved ikke' } } ] },
  { id: 'q07', type: 'chips', step: 7, section: { en: 'Your taste', da: 'Din smag' }, kicker: ALL_K,
    q: { en: 'What is important to you when buying apparel?', da: 'Hvad er vigtigt for dig, når du køber tøj?' },
    hint: { en: 'Pick up to 3.', da: 'Vælg op til 3.' },
    groups: [ { field: 'values_top3', type: 'multi', max: 3, shuffle: true, other: true, options: [
      { id: 'design',      en: 'Design',              da: 'Design' },
      { id: 'quality',     en: 'Quality',             da: 'Kvalitet' },
      { id: 'comfort',     en: 'Comfort',             da: 'Komfort' },
      { id: 'price',       en: 'Price',               da: 'Pris' },
      { id: 'function',    en: 'Function',            da: 'Funktion' },
      { id: 'sustainable', en: 'Sustainability',      da: 'Bæredygtighed' },
      { id: 'brand',       en: 'Brand',               da: 'Brand' },
    ] } ] },
  { id: 'q08', type: 'chips', step: 8, section: { en: 'Your taste', da: 'Din smag' }, kicker: ALL_K, optional: true,
    q: { en: 'Which brands do you identify with?', da: 'Hvilke brands identificerer du dig med?' },
    hint: { en: 'Any brands, not helmets. Ones you think are doing really well and that fit your style: clothes, shoes, gear, tech.',
            da: 'Alle slags brands, ikke hjelme. Nogle, du synes gør det rigtig godt, og som passer til din stil: tøj, sko, udstyr, tech.' },
    groups: [ { field: 'brand', kind: 'text', count: 3, optional: true, placeholder: { en: 'e.g. Patagonia, Apple', da: 'f.eks. Patagonia, Apple' }, placeholderMore: { en: 'Another brand', da: 'Et brand mere' } } ] },
  { id: 'q09', type: 'chips', step: 9, section: { en: 'About you', da: 'Om dig' }, kicker: ALL_K,
    q: { en: 'A little about you', da: 'Lidt om dig' },
    groups: [
      { field: 'age_band', type: 'single', label: { en: 'Age · pick one', da: 'Alder · vælg én' }, options: [
        { id: 'u16', en: 'Under 16', da: 'Under 16' }, { id: '16_19', en: '16–19', da: '16–19' },
        { id: '20_25', en: '20–25', da: '20–25' }, { id: '26_30', en: '26–30', da: '26–30' },
        { id: '31_35', en: '31–35', da: '31–35' }, { id: '36_45', en: '36–45', da: '36–45' },
        { id: '46_60', en: '46–60', da: '46–60' }, { id: '60p', en: 'Over 60', da: 'Over 60' },
        { id: 'na', en: 'Rather not say', da: 'Vil helst ikke sige' },
      ] },
      { field: 'city', type: 'single', label: { en: 'Where do you live? · pick one', da: 'Hvor bor du? · vælg én' }, options: [
        { id: 'cph', en: 'Copenhagen', da: 'København' }, { id: 'frb', en: 'Frederiksberg', da: 'Frederiksberg' },
        { id: 'aar', en: 'Aarhus', da: 'Aarhus' }, { id: 'ode', en: 'Odense', da: 'Odense' }, { id: 'aal', en: 'Aalborg', da: 'Aalborg' },
        { id: 'dk_other', en: 'Elsewhere in DK', da: 'Andet sted i DK' }, { id: 'abroad', en: 'Outside DK', da: 'Uden for DK' },
      ] },
    ] },
  { id: 'q10', type: 'chips', step: 10, section: { en: 'About you', da: 'Om dig' }, kicker: ALL_K, optional: true,
    q: { en: 'How do you describe your gender?', da: 'Hvordan beskriver du dit køn?' }, hint: 'pickAll',
    groups: [ { field: 'gender', type: 'multi', optional: true, other: true, otherLabel: { en: 'Self-describe', da: 'Beskriv selv' }, options: [
      { id: 'woman', en: 'Woman', da: 'Kvinde' }, { id: 'man', en: 'Man', da: 'Mand' },
      { id: 'nonbinary', en: 'Non-binary', da: 'Nonbinær' },
      { id: 'rather_not', en: 'Rather not say', da: 'Vil helst ikke sige', exclusive: true },
    ] } ] },
  { id: 'q11', type: 'chips', step: 11, section: { en: 'Last one', da: 'Sidste spørgsmål' }, kicker: ALL_K,
    q: { en: 'If there was a solution that solved all your problems, would you want to try it?',
         da: 'Hvis der fandtes en løsning, der løste alle dine problemer, ville du så prøve den?' }, hint: 'pickOne',
    groups: [ { field: 'kit_interest', type: 'single', options: [
      { id: 'yes', en: 'Yes', da: 'Ja' }, { id: 'maybe', en: 'Maybe', da: 'Måske' }, { id: 'no', en: 'No', da: 'Nej' },
    ] } ] },

  { id: 'end', type: 'end', step: 11, section: { en: 'Done', da: 'Færdig' },
    kicker: { en: 'That’s everything', da: 'Det var det hele' },
    hero:   { en: 'THANK\nYOU.', da: 'TAK.' },
    body:   { en: 'Your answers help us understand your needs. We’re building something to change the format of head protection. And it’s coming soon...',
              da: 'Dine svar hjælper os med at forstå dine behov. Vi bygger noget, der ændrer formatet for hovedbeskyttelse. Og det kommer snart...' },
    join:   { en: 'Join the waitlist', da: 'Skriv dig på ventelisten' },
    finish: { en: 'Finish without joining', da: 'Afslut uden at tilmelde dig' },
    name:   { en: 'First name', da: 'Fornavn' },
    email:  { en: 'Your email', da: 'Din e-mail' },
    consent:{ en: 'Yes, qila may email me about the launch. I can unsubscribe any time.', da: 'Ja, qila må sende mig e-mails om lanceringen. Jeg kan afmelde mig når som helst.' },
    submit: { en: 'Join', da: 'Tilmeld' },
    ok:     { en: 'You’re on the list. We’ll be in touch.', da: 'Du er på listen. Vi skriver til dig.' },
    err:    { en: 'Something went wrong. Please try again.', da: 'Noget gik galt. Prøv igen.' },
    bad:    { en: 'Please check your email address.', da: 'Tjek venligst din e-mailadresse.' },
    needConsent: { en: 'Tick the box so we’re allowed to email you.', da: 'Sæt flueben, så vi må skrive til dig.' },
    note:   { en: 'Your email goes to our waitlist only — it is never stored with your survey answers.',
              da: 'Din e-mail gemmes kun på ventelisten – aldrig sammen med dine svar.' },
    done:   { en: 'All done. You can close this page.', da: 'Færdig. Du kan lukke siden.' },
    under16:{ en: 'All done. You can close this page. Thanks for helping!', da: 'Færdig. Du kan lukke siden. Tak for hjælpen!' },
  },
];
