/*
  qila urban cycling study — questions
  ------------------------------------
  Edit wording freely (en / da). Keep the `id` of fields and options stable:
  they are the column names and values in the Google Sheet.

  Screen types
    intro | tiles | chips | end
  Group options
    type:      'single' | 'multi'
    shuffle:   true  → option order is randomised per respondent (use for unordered lists only)
    other:     true  → adds a "+ Other" chip with a text field (saved as <field>_other)
    max:       n     → multi-select limit
    optional:  true  → can be left empty
    showIf:    { field, in: [...] } → group only appears when another answer matches
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
const OPT_K  = { en: 'Optional',     da: 'Valgfri' };

const S_HELMET = { en: 'Your helmet', da: 'Din hjelm' };
const S_RIDING = { en: 'Your riding', da: 'Din cykling' };

const ARRIVE = [
  { id: 'bike',   en: 'Stays on the bike',       da: 'Bliver på cyklen' },
  { id: 'bag',    en: 'In my bag',               da: 'I tasken' },
  { id: 'hand',   en: 'I carry it in my hand',   da: 'Jeg bærer den i hånden' },
  { id: 'locker', en: 'Locker, desk or hook',    da: 'Skab, skrivebord eller knage' },
];

window.QILA_SCREENS = [
  { id: 'intro', type: 'intro',
    kicker: { en: 'Urban cycling study · Denmark 2026', da: 'Studie af bycyklister · Danmark 2026' },
    hero:   { en: 'HOW DO\nYOU\nRIDE?', da: 'HVORDAN\nCYKLER\nDU?' },
    body:   { en: 'Help us understand how people really move through Danish cities — and what they wear on their heads doing it.',
              da: 'Hjælp os med at forstå, hvordan folk faktisk bevæger sig rundt i de danske byer – og hvad de har på hovedet imens.' },
    facts:  [ { en: 'Tap only', da: 'Kun tryk' }, { en: '~2 min', da: '~2 min' }, { en: 'Anonymous', da: 'Anonymt' } ],
    cta:    { en: 'Start', da: 'Start' },
    fine:   { en: 'No names, no email. Answers are stored anonymously and used only for qila’s research. You can stop at any time.',
              da: 'Ingen navne, ingen e-mail. Svarene gemmes anonymt og bruges kun til qilas research. Du kan stoppe når som helst.' },
  },

  { id: 'q01', type: 'tiles', step: 1, section: S_HELMET, kicker: { en: 'Q.01', da: 'Q.01' },
    q:    { en: 'Do you wear a helmet when you cycle?', da: 'Bruger du hjelm, når du cykler?' },
    hint: { en: 'Be honest — every answer helps.', da: 'Vær ærlig – alle svar hjælper.' },
    groups: [ { field: 'helmet_use', type: 'single', options: [
      { id: 'yes',       en: 'YES',       da: 'JA',          sub: { en: 'Every ride',          da: 'Hver tur' } },
      { id: 'sometimes', en: 'SOMETIMES', da: 'NOGLE GANGE', sub: { en: 'Depends on the trip', da: 'Afhænger af turen' } },
      { id: 'no',        en: 'NO',        da: 'NEJ',         sub: { en: 'Never',               da: 'Aldrig' } },
    ] } ] },

  /* ---------- YES branch ---------- */
  { id: 'q02y', type: 'chips', step: 2, section: S_HELMET, branch: 'yes', kicker: YES_K,
    q: { en: 'What bugs you about your helmet?', da: 'Hvad irriterer dig ved din hjelm?' }, hint: 'pickAll',
    groups: [ { field: 'helmet_annoyances', type: 'multi', shuffle: true, other: true, options: [
      { id: 'nothing',  en: 'Nothing, it’s fine',             da: 'Intet, den er fin', exclusive: true },
      { id: 'carrying', en: 'Carrying it around',             da: 'At slæbe den rundt' },
      { id: 'storing',  en: 'Where to put it when I arrive',  da: 'Hvor den skal være, når jeg er fremme' },
      { id: 'hot',      en: 'Hot or sweaty',                  da: 'Varm eller svedig' },
      { id: 'fit',      en: 'Uncomfortable fit',              da: 'Sidder ubehageligt' },
      { id: 'hair',     en: 'Messes up my hair',              da: 'Ødelægger mit hår' },
      { id: 'style',    en: 'Doesn’t match my style',         da: 'Passer ikke til min stil' },
      { id: 'bulky',    en: 'Bulky in my bag',                da: 'Fylder i tasken' },
      { id: 'theft',    en: 'Worried it gets stolen',         da: 'Bange for, at den bliver stjålet' },
    ] } ] },
  { id: 'q03y', type: 'chips', step: 3, section: S_HELMET, branch: 'yes', kicker: YES_K,
    q: { en: 'What makes you wear it?', da: 'Hvorfor bruger du den?' }, hint: 'pickAll',
    groups: [ { field: 'wear_reasons', type: 'multi', shuffle: true, other: true, options: [
      { id: 'safety',     en: 'Safety',                   da: 'Sikkerhed' },
      { id: 'habit',      en: 'Habit since I was a kid',  da: 'Vane siden jeg var barn' },
      { id: 'traffic',    en: 'Traffic feels risky',      da: 'Trafikken føles farlig' },
      { id: 'speed',      en: 'I ride fast / e-bike',     da: 'Jeg kører stærkt / elcykel' },
      { id: 'close_call', en: 'A crash or close call',    da: 'Et styrt eller en nærved-ulykke' },
      { id: 'asked',      en: 'Someone asked me to',      da: 'Nogen har bedt mig om det' },
      { id: 'role_model', en: 'Role model for kids',      da: 'Rollemodel for børn' },
      { id: 'norm',       en: 'Everyone around me does',  da: 'Alle omkring mig gør det' },
    ] } ] },
  { id: 'q04y', type: 'chips', step: 4, section: S_HELMET, branch: 'yes', kicker: YES_K,
    q: { en: 'Where does your helmet go when you arrive?', da: 'Hvor ender din hjelm, når du er fremme?' }, hint: 'pickOne',
    groups: [ { field: 'helmet_on_arrival', type: 'single', other: true, options: ARRIVE } ] },

  /* ---------- SOMETIMES branch ---------- */
  { id: 'q02s', type: 'chips', step: 2, section: S_HELMET, branch: 'sometimes', kicker: SOME_K,
    q: { en: 'When do you skip it?', da: 'Hvornår dropper du den?' }, hint: 'pickAll',
    groups: [ { field: 'skip_situations', type: 'multi', shuffle: true, other: true, options: [
      { id: 'short',    en: 'Short trips',                 da: 'Korte ture' },
      { id: 'evening',  en: 'Evenings & nights out',       da: 'Aftener og byture' },
      { id: 'hurry',    en: 'When I’m in a hurry',         da: 'Når jeg har travlt' },
      { id: 'dressed',  en: 'When I’ve dressed up',        da: 'Når jeg er klædt pænt på' },
      { id: 'weather',  en: 'Good weather',                da: 'Godt vejr' },
      { id: 'not_home', en: 'Not going straight home',     da: 'Når jeg ikke skal direkte hjem' },
      { id: 'shared',   en: 'Shared or rental bike',       da: 'Delecykel eller lejecykel' },
      { id: 'forget',   en: 'I simply forget',             da: 'Jeg glemmer den bare' },
    ] } ] },
  { id: 'q03s', type: 'chips', step: 3, section: S_HELMET, branch: 'sometimes', kicker: SOME_K,
    q: { en: 'What gets in the way?', da: 'Hvad står i vejen?' }, hint: 'pickAll',
    groups: [ { field: 'skip_reasons', type: 'multi', shuffle: true, other: true, options: [
      { id: 'carrying', en: 'Carrying it around',       da: 'At slæbe den rundt' },
      { id: 'storing',  en: 'Nowhere to put it',        da: 'Intet sted at gøre af den' },
      { id: 'hot',      en: 'Uncomfortable or hot',     da: 'Ubehagelig eller varm' },
      { id: 'hair',     en: 'Messes up my hair',        da: 'Ødelægger mit hår' },
      { id: 'style',    en: 'Doesn’t match my outfit',  da: 'Passer ikke til mit tøj' },
      { id: 'friends',  en: 'Friends don’t wear one',   da: 'Mine venner bruger ikke hjelm' },
      { id: 'low_risk', en: 'I don’t feel at risk',     da: 'Jeg føler mig ikke i fare' },
    ] } ] },
  { id: 'q04s', type: 'chips', step: 4, section: S_HELMET, branch: 'sometimes', kicker: SOME_K,
    q: { en: 'Where does your helmet go when you arrive?', da: 'Hvor ender din hjelm, når du er fremme?' }, hint: 'pickOne',
    groups: [ { field: 'helmet_on_arrival', type: 'single', other: true, options: ARRIVE } ] },

  /* ---------- NO branch ---------- */
  { id: 'q02n', type: 'chips', step: 2, section: S_HELMET, branch: 'no', kicker: NO_K,
    q: { en: 'Do you own a helmet?', da: 'Har du en hjelm?' }, hint: 'pickOne',
    groups: [ { field: 'helmet_ownership', type: 'single', options: [
      { id: 'at_home', en: 'Yes, but it stays at home', da: 'Ja, men den bliver derhjemme' },
      { id: 'used_to', en: 'I used to',                 da: 'Det har jeg haft' },
      { id: 'never',   en: 'No, never have',            da: 'Nej, aldrig' },
    ] } ] },
  { id: 'q03n', type: 'chips', step: 3, section: S_HELMET, branch: 'no', kicker: NO_K,
    q: { en: 'What keeps you from wearing one?', da: 'Hvad holder dig fra at bruge en?' }, hint: 'pickAll',
    groups: [ { field: 'no_helmet_reasons', type: 'multi', shuffle: true, other: true, options: [
      { id: 'carrying',  en: 'Carrying it around',       da: 'At slæbe den rundt' },
      { id: 'storing',   en: 'Nowhere to put it',        da: 'Intet sted at gøre af den' },
      { id: 'hot',       en: 'Uncomfortable or hot',     da: 'Ubehagelig eller varm' },
      { id: 'hair',      en: 'Messes up my hair',        da: 'Ødelægger mit hår' },
      { id: 'style',     en: 'Doesn’t match my style',   da: 'Passer ikke til min stil' },
      { id: 'not_found', en: 'Never found one I like',   da: 'Har aldrig fundet en, jeg kan lide' },
      { id: 'price',     en: 'Too expensive',            da: 'For dyr' },
      { id: 'friends',   en: 'Friends don’t wear one',   da: 'Mine venner bruger ikke hjelm' },
      { id: 'low_risk',  en: 'I don’t feel at risk',     da: 'Jeg føler mig ikke i fare' },
    ] } ] },
  { id: 'q04n', type: 'chips', step: 4, section: S_HELMET, branch: 'no', kicker: NO_K,
    q: { en: 'What could change your mind?', da: 'Hvad kunne få dig til at ændre mening?' }, hint: 'pickAll',
    groups: [ { field: 'would_consider', type: 'multi', shuffle: true, other: true, options: [
      { id: 'easy_carry', en: 'Easy to carry',         da: 'Nem at have med' },
      { id: 'comfort',    en: 'More comfortable',      da: 'Mere behagelig' },
      { id: 'looks',      en: 'Looks good on me',      da: 'Ser godt ud på mig' },
      { id: 'hair',       en: 'Doesn’t ruin my hair',  da: 'Ødelægger ikke mit hår' },
      { id: 'cheaper',    en: 'Cheaper',               da: 'Billigere' },
      { id: 'friends',    en: 'Friends wearing one',   da: 'At mine venner bruger en' },
      { id: 'close_call', en: 'A close call',          da: 'En nærved-ulykke' },
      { id: 'law',        en: 'A helmet law',          da: 'En lov om hjelm' },
      { id: 'nothing',    en: 'Nothing would',         da: 'Intet ville', exclusive: true },
    ] } ] },

  /* ---------- Everyone ---------- */
  { id: 'q05', type: 'chips', step: 5, section: S_RIDING, kicker: ALL_K,
    q: { en: 'How do you ride?', da: 'Hvordan cykler du?' },
    groups: [
      { field: 'ride_frequency', type: 'single', label: { en: 'How often · pick one', da: 'Hvor tit · vælg én' }, options: [
        { id: 'daily',       en: 'Every day',          da: 'Hver dag' },
        { id: 'weekly_plus', en: 'A few times a week', da: 'Et par gange om ugen' },
        { id: 'weekly',      en: 'Weekly',             da: 'Ugentligt' },
        { id: 'less',        en: 'Less often',         da: 'Sjældnere' },
      ] },
      { field: 'bike_types', type: 'multi', shuffle: true, other: true, label: { en: 'On what · pick all', da: 'På hvad · vælg alle' }, options: [
        { id: 'city',   en: 'City bike',      da: 'Bycykel' },
        { id: 'ebike',  en: 'E-bike',         da: 'Elcykel' },
        { id: 'road',   en: 'Road or gravel', da: 'Racer eller gravel' },
        { id: 'cargo',  en: 'Cargo bike',     da: 'Ladcykel' },
        { id: 'shared', en: 'Shared bike',    da: 'Delecykel' },
        { id: 'speed',  en: 'Speed pedelec',  da: 'Speed pedelec' },
      ] },
    ] },
  { id: 'q06', type: 'chips', step: 6, section: S_RIDING, kicker: ALL_K,
    q: { en: 'Where does your bike take you?', da: 'Hvor tager cyklen dig hen?' },
    groups: [
      { field: 'destinations', type: 'multi', shuffle: true, other: true, label: { en: 'Most weeks · pick all', da: 'De fleste uger · vælg alle' }, options: [
        { id: 'work',     en: 'Work',             da: 'Arbejde' },
        { id: 'study',    en: 'School or uni',    da: 'Skole eller uni' },
        { id: 'station',  en: 'Station / metro',  da: 'Station / metro' },
        { id: 'errands',  en: 'Errands',          da: 'Ærinder' },
        { id: 'social',   en: 'Friends & family', da: 'Venner og familie' },
        { id: 'sport',    en: 'Gym & sport',      da: 'Træning og sport' },
        { id: 'nights',   en: 'Nights out',       da: 'Byture' },
        { id: 'kids',     en: 'Kids’ daycare',    da: 'Institution' },
        { id: 'leisure',  en: 'Just riding',      da: 'Bare en tur' },
      ] },
      { field: 'trip_length', type: 'single', label: { en: 'Usual trip · pick one', da: 'Typisk tur · vælg én' }, options: [
        { id: 'lt2',  en: 'Under 2 km', da: 'Under 2 km' },
        { id: '2_5',  en: '2–5 km',     da: '2–5 km' },
        { id: '5_10', en: '5–10 km',    da: '5–10 km' },
        { id: 'gt10', en: '10 km +',    da: '10 km +' },
      ] },
    ] },
  { id: 'q07', type: 'chips', step: 7, section: { en: 'Your day', da: 'Din dag' }, kicker: ALL_K,
    q: { en: 'What’s usually with you?', da: 'Hvad har du typisk med?' }, hint: 'pickAll',
    groups: [ { field: 'carried_items', type: 'multi', shuffle: true, other: true, options: [
      { id: 'backpack', en: 'Backpack',           da: 'Rygsæk' },
      { id: 'tote',     en: 'Tote bag',           da: 'Mulepose' },
      { id: 'sling',    en: 'Sling / crossbody',  da: 'Crossbody-taske' },
      { id: 'pannier',  en: 'Pannier',            da: 'Cykeltaske' },
      { id: 'laptop',   en: 'Laptop',             da: 'Computer' },
      { id: 'gym',      en: 'Gym bag',            da: 'Sportstaske' },
      { id: 'nothing',  en: 'Nothing, hands free', da: 'Ingenting', exclusive: true },
    ] } ] },
  { id: 'q08', type: 'chips', step: 8, section: { en: 'Your people', da: 'Dine folk' }, kicker: ALL_K,
    q: { en: 'How many of your friends wear a helmet?', da: 'Hvor mange af dine venner bruger hjelm?' }, hint: 'pickOne',
    groups: [ { field: 'friends_helmet_share', type: 'single', options: [
      { id: 'almost_all', en: 'Almost all', da: 'Næsten alle' },
      { id: 'half',       en: 'About half', da: 'Cirka halvdelen' },
      { id: 'few',        en: 'A few',      da: 'Nogle få' },
      { id: 'none',       en: 'None',       da: 'Ingen' },
      { id: 'unknown',    en: 'No idea',    da: 'Ved ikke' },
    ] } ] },
  { id: 'q09', type: 'chips', step: 9, section: { en: 'Your taste', da: 'Din smag' }, kicker: ALL_K,
    q: { en: 'What matters most in things you use every day?', da: 'Hvad betyder mest i ting, du bruger hver dag?' },
    hint: { en: 'Pick up to 3.', da: 'Vælg op til 3.' },
    groups: [ { field: 'values_top3', type: 'multi', max: 3, shuffle: true, other: true, options: [
      { id: 'design',      en: 'Design',      da: 'Design' },
      { id: 'quality',     en: 'Quality',     da: 'Kvalitet' },
      { id: 'comfort',     en: 'Comfort',     da: 'Komfort' },
      { id: 'price',       en: 'Price',       da: 'Pris' },
      { id: 'practical',   en: 'Practical',   da: 'Praktisk' },
      { id: 'sustainable', en: 'Sustainable', da: 'Bæredygtig' },
      { id: 'tech',        en: 'Tech',        da: 'Teknologi' },
      { id: 'brand',       en: 'Brand',       da: 'Brand' },
    ] } ] },
  { id: 'q10', type: 'chips', step: 10, section: { en: 'Your taste', da: 'Din smag' }, kicker: OPT_K, optional: true,
    q: { en: 'Which brands feel like you?', da: 'Hvilke brands føles som dig?' },
    hint: { en: 'Pick any, or skip.', da: 'Vælg gerne flere – eller spring over.' },
    groups: [ { field: 'brand_affinity', type: 'multi', optional: true, shuffle: true, other: true, options: [
      { id: 'apple', en: 'Apple', da: 'Apple' }, { id: 'nothing', en: 'Nothing', da: 'Nothing' },
      { id: 'rains', en: 'Rains', da: 'Rains' }, { id: 'arcteryx', en: 'Arc’teryx', da: 'Arc’teryx' },
      { id: 'salomon', en: 'Salomon', da: 'Salomon' }, { id: 'patagonia', en: 'Patagonia', da: 'Patagonia' },
      { id: 'norse', en: 'Norse Projects', da: 'Norse Projects' }, { id: 'ganni', en: 'Ganni', da: 'Ganni' },
      { id: 'veja', en: 'Veja', da: 'Veja' }, { id: 'muji', en: 'Muji', da: 'Muji' },
    ] } ] },
  { id: 'q11', type: 'chips', step: 11, section: { en: 'About you', da: 'Om dig' }, kicker: ALL_K,
    q: { en: 'A little about you', da: 'Lidt om dig' },
    groups: [
      { field: 'age_band', type: 'single', label: { en: 'Age · pick one', da: 'Alder · vælg én' }, options: [
        { id: 'u16', en: 'Under 16', da: 'Under 16' }, { id: '16_19', en: '16–19', da: '16–19' },
        { id: '20_25', en: '20–25', da: '20–25' }, { id: '26_30', en: '26–30', da: '26–30' },
        { id: '31_35', en: '31–35', da: '31–35' }, { id: '36_45', en: '36–45', da: '36–45' },
        { id: '46_60', en: '46–60', da: '46–60' }, { id: '60p', en: '60 +', da: '60 +' },
        { id: 'na', en: 'Rather not say', da: 'Vil helst ikke sige' },
      ] },
      { field: 'city', type: 'single', label: { en: 'Where you ride most · pick one', da: 'Hvor du cykler mest · vælg én' }, options: [
        { id: 'cph', en: 'Copenhagen', da: 'København' }, { id: 'frb', en: 'Frederiksberg', da: 'Frederiksberg' },
        { id: 'aar', en: 'Aarhus', da: 'Aarhus' }, { id: 'ode', en: 'Odense', da: 'Odense' }, { id: 'aal', en: 'Aalborg', da: 'Aalborg' },
        { id: 'dk_other', en: 'Elsewhere in DK', da: 'Andet sted i DK' }, { id: 'abroad', en: 'Outside DK', da: 'Uden for DK' },
      ] },
    ] },
  { id: 'q12', type: 'chips', step: 12, section: { en: 'About you', da: 'Om dig' }, kicker: OPT_K, optional: true,
    q: { en: 'How do you describe your gender?', da: 'Hvordan beskriver du dit køn?' }, hint: 'pickAll',
    groups: [ { field: 'gender', type: 'multi', optional: true, other: true, otherLabel: { en: 'Self-describe', da: 'Beskriv selv' }, options: [
      { id: 'woman', en: 'Woman', da: 'Kvinde' }, { id: 'man', en: 'Man', da: 'Mand' },
      { id: 'nonbinary', en: 'Non-binary', da: 'Nonbinær' }, { id: 'genderqueer', en: 'Genderqueer', da: 'Genderqueer' },
      { id: 'genderfluid', en: 'Genderfluid', da: 'Kønsflydende' }, { id: 'agender', en: 'Agender', da: 'Agender' },
      { id: 'trans_woman', en: 'Trans woman', da: 'Transkvinde' }, { id: 'trans_man', en: 'Trans man', da: 'Transmand' },
      { id: 'two_spirit', en: 'Two-spirit', da: 'Two-spirit' }, { id: 'questioning', en: 'Questioning', da: 'Er i tvivl' },
      { id: 'rather_not', en: 'Rather not say', da: 'Vil helst ikke sige', exclusive: true },
    ] } ] },
  { id: 'q13', type: 'chips', step: 13, section: { en: 'Last one', da: 'Sidste' }, kicker: ALL_K,
    q: { en: 'If one piece of kit solved what you picked, would you use it?', da: 'Hvis ét produkt løste det, du har valgt, ville du så bruge det?' },
    groups: [
      { field: 'kit_interest', type: 'single', label: { en: 'Pick one', da: 'Vælg én' }, options: [
        { id: 'yes', en: 'Yes', da: 'Ja' }, { id: 'maybe', en: 'Maybe', da: 'Måske' }, { id: 'no', en: 'No', da: 'Nej' },
      ] },
      { field: 'fair_price', type: 'single', showIf: { field: 'kit_interest', in: ['yes', 'maybe'] },
        label: { en: 'A fair price?', da: 'Hvad er en fair pris?' }, options: [
        { id: 'lt500', en: 'Under 500 kr', da: 'Under 500 kr.' }, { id: '500_799', en: '500–799 kr', da: '500–799 kr.' },
        { id: '800_1199', en: '800–1,199 kr', da: '800–1.199 kr.' }, { id: '1200_1599', en: '1,200–1,599 kr', da: '1.200–1.599 kr.' },
        { id: '1600p', en: '1,600 kr +', da: '1.600 kr. +' }, { id: 'unsure', en: 'Not sure', da: 'Ved ikke' },
      ] },
    ] },

  { id: 'end', type: 'end', step: 14, section: { en: 'Done', da: 'Færdig' },
    kicker: { en: 'That’s everything', da: 'Det var det hele' },
    hero:   { en: 'THANK\nYOU.', da: 'TAK.' },
    body:   { en: 'Your answers help us understand how people really ride. We’re building something for the trips you just told us about.',
              da: 'Dine svar hjælper os med at forstå, hvordan folk faktisk cykler. Vi bygger noget til de ture, du lige har fortalt os om.' },
    ask:    { en: 'Want to be first to see it?', da: 'Vil du være blandt de første til at se det?' },
    join:   { en: 'Join the waitlist', da: 'Skriv dig på ventelisten' },
    finish: { en: 'Finish without joining', da: 'Afslut uden at tilmelde dig' },
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
