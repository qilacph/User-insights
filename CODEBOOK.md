# Codebook — qila urban cycling study

Generated from `site/assets/questions.js`. Each field is a column in the **Responses** sheet; multi-select cells hold comma-separated codes. `<field>_other` holds the free text typed under "Other".

Version 2 of the questionnaire (`version` = v2-2026-10). Rows with `version` = v1-2026-10 are test responses from the first version and use older columns.

## `helmet_use`
**Do you wear a bike helmet?**  
_Bruger du cykelhjelm?_

_single choice_ · screen `q01`

| Code | English | Dansk |
|---|---|---|
| `yes` | YES | JA |
| `sometimes` | SOMETIMES | NOGLE GANGE |
| `no` | NO | NEJ |

## `helmet_issues`
**What issues do you experience?**  
_Hvilke problemer oplever du?_

_multi-select · + Other text · Yes branch only_ · screen `q02y`

| Code | English | Dansk |
|---|---|---|
| `carry` | Annoying to carry around | Irriterende at slæbe rundt på |
| `hot` | Hot or sweaty | Varm eller svedig |
| `fit` | Uncomfortable fit | Sidder ubehageligt |
| `hair` | Messes up my hair | Ødelægger mit hår |
| `looks` | Don’t like how it looks | Kan ikke lide, hvordan den ser ud |
| `forget` | I forget it | Jeg glemmer den |
| `nothing` | Nothing, it’s fine *(exclusive)* | Ingen, den er fin |

## `top_issue`
**Which one bothers you most?**  
_Hvad generer dig mest?_

_single choice · Yes branch only_ · screen `q03y`

| Code | English | Dansk |
|---|---|---|
| (same codes as `helmet_issues`) | The one option the person ranks highest among those they picked there. Filled in automatically when they picked only one. | Samme koder som `helmet_issues` |

## `wear_reasons`
**What makes you wear it?**  
_Hvad får dig til at bruge den?_

_multi-select · + Other text · Yes branch only_ · screen `q04y`

| Code | English | Dansk |
|---|---|---|
| `safety` | Safety | Sikkerhed |
| `habit` | Habit since I was a kid | Vane, siden jeg var barn |
| `traffic` | Traffic feels risky | Trafikken føles farlig |
| `close_call` | An accident — mine or someone close to me | En ulykke – min egen eller blandt mine nærmeste |
| `asked` | Someone asked me to | Nogen bad mig om det |
| `example` | To set an example | For at være et godt eksempel |
| `peers` | People around me do | Folk omkring mig gør det |

## `skip_situations`
**When do you skip it?**  
_Hvornår springer du den over?_

_multi-select · + Other text · Sometimes branch only_ · screen `q02s`

| Code | English | Dansk |
|---|---|---|
| `short` | Short trips | Korte ture |
| `nights` | Nights out | Byture |
| `hurry` | When I’m in a hurry | Når jeg har travlt |
| `dressed` | When I’ve dressed up | Når jeg har pyntet mig |
| `warm` | Warm days | Varme dage |
| `carry_after` | When I’d have to carry it around | Når jeg skal slæbe rundt på den bagefter |
| `shared` | On a shared bike | På en delecykel |

## `skip_reasons`
**What gets in the way?**  
_Hvad står i vejen?_

_multi-select · + Other text · Sometimes branch only_ · screen `q03s`

| Code | English | Dansk |
|---|---|---|
| `carry` | Annoying to carry around | Irriterende at slæbe rundt på |
| `hot` | Hot or sweaty | Varm eller svedig |
| `fit` | Uncomfortable fit | Sidder ubehageligt |
| `hair` | Messes up my hair | Ødelægger mit hår |
| `looks` | Don’t like how it looks | Kan ikke lide, hvordan den ser ud |
| `forget` | I forget it | Jeg glemmer den |
| `friends` | My friends don’t wear one | Mine venner bruger ikke hjelm |
| `risk` | I don’t feel at risk | Jeg føler mig ikke i fare |

## `top_reason`
**Which one matters most?**  
_Hvad betyder mest?_

_single choice · Sometimes branch only_ · screen `q04s`

| Code | English | Dansk |
|---|---|---|
| (same codes as `skip_reasons`) | The one option the person ranks highest among those they picked there. Filled in automatically when they picked only one. | Samme koder som `skip_reasons` |

## `helmet_ownership`
**Do you own a helmet?**  
_Ejer du en hjelm?_

_single choice · No branch only_ · screen `q02n`

| Code | English | Dansk |
|---|---|---|
| `at_home` | Yes, but it stays at home | Ja, men den bliver derhjemme |
| `used_to` | I used to | Det har jeg gjort |
| `never` | No, never have | Nej, aldrig |

## `no_helmet_reasons`
**What keeps you from wearing one?**  
_Hvad holder dig fra at bruge en?_

_multi-select · + Other text · No branch only_ · screen `q03n`

| Code | English | Dansk |
|---|---|---|
| `carry` | Annoying to carry around | Irriterende at slæbe rundt på |
| `hot` | Hot or sweaty | Varm eller svedig |
| `fit` | Uncomfortable fit | Sidder ubehageligt |
| `hair` | Messes up my hair | Ødelægger mit hår |
| `looks` | Don’t like how it looks | Kan ikke lide, hvordan den ser ud |
| `forget` | I forget it | Jeg glemmer den |
| `friends` | My friends don’t wear one | Mine venner bruger ikke hjelm |
| `risk` | I don’t feel at risk | Jeg føler mig ikke i fare |
| `price` | Too expensive | For dyr |

## `would_consider`
**What could change your mind?**  
_Hvad kunne få dig til at ændre mening?_

_multi-select · + Other text · No branch only_ · screen `q04n`

| Code | English | Dansk |
|---|---|---|
| `carry` | Easier to carry | Nemmere at have med |
| `comfort` | More comfortable | Mere behagelig |
| `hair` | Doesn’t mess up my hair | Ødelægger ikke mit hår |
| `looks` | Looks good on me | Ser godt ud på mig |
| `cheaper` | Cheaper | Billigere |
| `stigma` | If the stigma disappeared | Hvis stigmaet forsvandt |
| `asked` | If someone close to me asked me to | Hvis en af mine nærmeste bad mig om det |
| `close_call` | An accident — mine or someone close to me | En ulykke – min egen eller blandt mine nærmeste |
| `nothing` | Nothing would *(exclusive)* | Intet |

## `ride_frequency`
**How often do you ride? — Pick one**  
_Hvor tit cykler du? — Vælg én_

_single choice_ · screen `q05`

| Code | English | Dansk |
|---|---|---|
| `daily` | Every day | Hver dag |
| `weekly_plus` | A few times a week | Et par gange om ugen |
| `weekly` | About once a week | Cirka en gang om ugen |
| `less` | Less often | Sjældnere |

## `bike_types`
**How often do you ride? — What do you ride? · pick all**  
_Hvor tit cykler du? — Hvad cykler du på? · vælg alle_

_multi-select · + Other text_ · screen `q05`

| Code | English | Dansk |
|---|---|---|
| `city` | City bike | Bycykel |
| `ebike` | E-bike | Elcykel |
| `cargo` | Cargo bike (Christiania) | Ladcykel (Christiania) |
| `shared` | Shared bike | Delecykel |

## `friends_helmet_pct`
**How many of your friends wear a helmet?**  
_Hvor mange af dine venner bruger hjelm?_

_slider_ · screen `q06`

| Code | English | Dansk |
|---|---|---|
| `0`–`100` | Percentage, in steps of 5 | Procent, i trin på 5 |
| `not_sure` | Not sure | Ved ikke |

## `values_top3`
**What is important to you when buying apparel?**  
_Hvad er vigtigt for dig, når du køber tøj?_

_multi-select · max 3 · + Other text_ · screen `q07`

| Code | English | Dansk |
|---|---|---|
| `design` | Design | Design |
| `quality` | Quality | Kvalitet |
| `comfort` | Comfort | Komfort |
| `price` | Price | Pris |
| `function` | Function | Funktion |
| `sustainable` | Sustainability | Bæredygtighed |
| `materials` | Technical materials | Tekniske materialer |
| `brand` | Brand | Brand |

## `brand`
**Which brands do you identify with?**  
_Hvilke brands identificerer du dig med?_

_typed · optional_ · screen `q08`

| Code | English | Dansk |
|---|---|---|
| free text | Up to 3 typed answers, saved in the columns `brand_1_other`, `brand_2_other`, `brand_3_other` | Op til 3 skrevne svar |

## `age_band`
**A little about you — Age · pick one**  
_Lidt om dig — Alder · vælg én_

_single choice_ · screen `q09`

| Code | English | Dansk |
|---|---|---|
| `u16` | Under 16 | Under 16 |
| `16_19` | 16–19 | 16–19 |
| `20_25` | 20–25 | 20–25 |
| `26_30` | 26–30 | 26–30 |
| `31_35` | 31–35 | 31–35 |
| `36_45` | 36–45 | 36–45 |
| `46_60` | 46–60 | 46–60 |
| `60p` | Over 60 | Over 60 |
| `na` | Rather not say | Vil helst ikke sige |

## `city`
**A little about you — Where do you live? · pick one**  
_Lidt om dig — Hvor bor du? · vælg én_

_single choice_ · screen `q09`

| Code | English | Dansk |
|---|---|---|
| `cph` | Copenhagen | København |
| `frb` | Frederiksberg | Frederiksberg |
| `aar` | Aarhus | Aarhus |
| `ode` | Odense | Odense |
| `aal` | Aalborg | Aalborg |
| `dk_other` | Elsewhere in DK | Andet sted i DK |
| `abroad` | Outside DK | Uden for DK |

## `gender`
**How do you describe your gender?**  
_Hvordan beskriver du dit køn?_

_multi-select · optional · + Other text_ · screen `q10`

| Code | English | Dansk |
|---|---|---|
| `woman` | Woman | Kvinde |
| `man` | Man | Mand |
| `nonbinary` | Non-binary | Nonbinær |
| `rather_not` | Rather not say *(exclusive)* | Vil helst ikke sige |

## `kit_interest`
**If there was a solution that solved all your problems, would you want to try it?**  
_Hvis der fandtes en løsning, der løste alle dine problemer, ville du så prøve den?_

_single choice_ · screen `q11`

| Code | English | Dansk |
|---|---|---|
| `yes` | Yes | Ja |
| `maybe` | Maybe | Måske |
| `no` | No | Nej |

## Meta columns
| Column | Meaning |
|---|---|
| received_at | When the sheet received it |
| response_id | Random ID per respondent (not linked to the waitlist) |
| source | The `?src=` tag from the QR code / link |
| lang | Language the person answered in (en/da) |
| version | Questionnaire version from config.js |
| device | touch or pointer |
| started_at / duration_sec | When they began, total seconds |
| last_screen | Last screen reached (useful in Partial) |
| screen_times | JSON of seconds spent per screen |
| excluded | "under 16" → left out of the Summary |
