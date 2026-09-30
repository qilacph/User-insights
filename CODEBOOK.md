# Codebook — qila urban cycling study

Generated from `site/assets/questions.js`. Each field is a column in the **Responses** sheet; multi-select cells hold comma-separated codes. `<field>_other` holds the free text typed under "Other".

## `helmet_use`
**Do you wear a helmet when you cycle?**  
_Bruger du hjelm, når du cykler?_

_single choice_ · screen `q01`

| Code | English | Dansk |
|---|---|---|
| `yes` | YES | JA |
| `sometimes` | SOMETIMES | NOGLE GANGE |
| `no` | NO | NEJ |

## `helmet_annoyances`
**What bugs you about your helmet?**  
_Hvad irriterer dig ved din hjelm?_

_multi-select · + Other text · Yes branch only_ · screen `q02y`

| Code | English | Dansk |
|---|---|---|
| `nothing` | Nothing, it’s fine *(exclusive)* | Intet, den er fin |
| `carrying` | Carrying it around | At slæbe den rundt |
| `storing` | Where to put it when I arrive | Hvor den skal være, når jeg er fremme |
| `hot` | Hot or sweaty | Varm eller svedig |
| `fit` | Uncomfortable fit | Sidder ubehageligt |
| `hair` | Messes up my hair | Ødelægger mit hår |
| `style` | Doesn’t match my style | Passer ikke til min stil |
| `bulky` | Bulky in my bag | Fylder i tasken |
| `theft` | Worried it gets stolen | Bange for, at den bliver stjålet |

## `wear_reasons`
**What makes you wear it?**  
_Hvorfor bruger du den?_

_multi-select · + Other text · Yes branch only_ · screen `q03y`

| Code | English | Dansk |
|---|---|---|
| `safety` | Safety | Sikkerhed |
| `habit` | Habit since I was a kid | Vane siden jeg var barn |
| `traffic` | Traffic feels risky | Trafikken føles farlig |
| `speed` | I ride fast / e-bike | Jeg kører stærkt / elcykel |
| `close_call` | A crash or close call | Et styrt eller en nærved-ulykke |
| `asked` | Someone asked me to | Nogen har bedt mig om det |
| `role_model` | Role model for kids | Rollemodel for børn |
| `norm` | Everyone around me does | Alle omkring mig gør det |

## `helmet_on_arrival`
**Where does your helmet go when you arrive?**  
_Hvor ender din hjelm, når du er fremme?_

_single choice · + Other text · Yes branch only_ · screen `q04y`

| Code | English | Dansk |
|---|---|---|
| `bike` | Stays on the bike | Bliver på cyklen |
| `bag` | In my bag | I tasken |
| `hand` | I carry it in my hand | Jeg bærer den i hånden |
| `locker` | Locker, desk or hook | Skab, skrivebord eller knage |

## `skip_situations`
**When do you skip it?**  
_Hvornår dropper du den?_

_multi-select · + Other text · Sometimes branch only_ · screen `q02s`

| Code | English | Dansk |
|---|---|---|
| `short` | Short trips | Korte ture |
| `evening` | Evenings & nights out | Aftener og byture |
| `hurry` | When I’m in a hurry | Når jeg har travlt |
| `dressed` | When I’ve dressed up | Når jeg er klædt pænt på |
| `weather` | Good weather | Godt vejr |
| `not_home` | Not going straight home | Når jeg ikke skal direkte hjem |
| `shared` | Shared or rental bike | Delecykel eller lejecykel |
| `forget` | I simply forget | Jeg glemmer den bare |

## `skip_reasons`
**What gets in the way?**  
_Hvad står i vejen?_

_multi-select · + Other text · Sometimes branch only_ · screen `q03s`

| Code | English | Dansk |
|---|---|---|
| `carrying` | Carrying it around | At slæbe den rundt |
| `storing` | Nowhere to put it | Intet sted at gøre af den |
| `hot` | Uncomfortable or hot | Ubehagelig eller varm |
| `hair` | Messes up my hair | Ødelægger mit hår |
| `style` | Doesn’t match my outfit | Passer ikke til mit tøj |
| `friends` | Friends don’t wear one | Mine venner bruger ikke hjelm |
| `low_risk` | I don’t feel at risk | Jeg føler mig ikke i fare |

*`helmet_on_arrival` is also asked in the **Sometimes** branch (q04s).*

## `helmet_ownership`
**Do you own a helmet?**  
_Har du en hjelm?_

_single choice · No branch only_ · screen `q02n`

| Code | English | Dansk |
|---|---|---|
| `at_home` | Yes, but it stays at home | Ja, men den bliver derhjemme |
| `used_to` | I used to | Det har jeg haft |
| `never` | No, never have | Nej, aldrig |

## `no_helmet_reasons`
**What keeps you from wearing one?**  
_Hvad holder dig fra at bruge en?_

_multi-select · + Other text · No branch only_ · screen `q03n`

| Code | English | Dansk |
|---|---|---|
| `carrying` | Carrying it around | At slæbe den rundt |
| `storing` | Nowhere to put it | Intet sted at gøre af den |
| `hot` | Uncomfortable or hot | Ubehagelig eller varm |
| `hair` | Messes up my hair | Ødelægger mit hår |
| `style` | Doesn’t match my style | Passer ikke til min stil |
| `not_found` | Never found one I like | Har aldrig fundet en, jeg kan lide |
| `price` | Too expensive | For dyr |
| `friends` | Friends don’t wear one | Mine venner bruger ikke hjelm |
| `low_risk` | I don’t feel at risk | Jeg føler mig ikke i fare |

## `would_consider`
**What could change your mind?**  
_Hvad kunne få dig til at ændre mening?_

_multi-select · + Other text · No branch only_ · screen `q04n`

| Code | English | Dansk |
|---|---|---|
| `easy_carry` | Easy to carry | Nem at have med |
| `comfort` | More comfortable | Mere behagelig |
| `looks` | Looks good on me | Ser godt ud på mig |
| `hair` | Doesn’t ruin my hair | Ødelægger ikke mit hår |
| `cheaper` | Cheaper | Billigere |
| `friends` | Friends wearing one | At mine venner bruger en |
| `close_call` | A close call | En nærved-ulykke |
| `law` | A helmet law | En lov om hjelm |
| `nothing` | Nothing would *(exclusive)* | Intet ville |

## `ride_frequency`
**How do you ride? — How often · pick one**  
_Hvordan cykler du? — Hvor tit · vælg én_

_single choice_ · screen `q05`

| Code | English | Dansk |
|---|---|---|
| `daily` | Every day | Hver dag |
| `weekly_plus` | A few times a week | Et par gange om ugen |
| `weekly` | Weekly | Ugentligt |
| `less` | Less often | Sjældnere |

## `bike_types`
**How do you ride? — On what · pick all**  
_Hvordan cykler du? — På hvad · vælg alle_

_multi-select · + Other text_ · screen `q05`

| Code | English | Dansk |
|---|---|---|
| `city` | City bike | Bycykel |
| `ebike` | E-bike | Elcykel |
| `road` | Road or gravel | Racer eller gravel |
| `cargo` | Cargo bike | Ladcykel |
| `shared` | Shared bike | Delecykel |
| `speed` | Speed pedelec | Speed pedelec |

## `destinations`
**Where does your bike take you? — Most weeks · pick all**  
_Hvor tager cyklen dig hen? — De fleste uger · vælg alle_

_multi-select · + Other text_ · screen `q06`

| Code | English | Dansk |
|---|---|---|
| `work` | Work | Arbejde |
| `study` | School or uni | Skole eller uni |
| `station` | Station / metro | Station / metro |
| `errands` | Errands | Ærinder |
| `social` | Friends & family | Venner og familie |
| `sport` | Gym & sport | Træning og sport |
| `nights` | Nights out | Byture |
| `kids` | Kids’ daycare | Institution |
| `leisure` | Just riding | Bare en tur |

## `trip_length`
**Where does your bike take you? — Usual trip · pick one**  
_Hvor tager cyklen dig hen? — Typisk tur · vælg én_

_single choice_ · screen `q06`

| Code | English | Dansk |
|---|---|---|
| `lt2` | Under 2 km | Under 2 km |
| `2_5` | 2–5 km | 2–5 km |
| `5_10` | 5–10 km | 5–10 km |
| `gt10` | 10 km + | 10 km + |

## `carried_items`
**What’s usually with you?**  
_Hvad har du typisk med?_

_multi-select · + Other text_ · screen `q07`

| Code | English | Dansk |
|---|---|---|
| `backpack` | Backpack | Rygsæk |
| `tote` | Tote bag | Mulepose |
| `sling` | Sling / crossbody | Crossbody-taske |
| `pannier` | Pannier | Cykeltaske |
| `laptop` | Laptop | Computer |
| `gym` | Gym bag | Sportstaske |
| `nothing` | Nothing, hands free *(exclusive)* | Ingenting |

## `friends_helmet_share`
**How many of your friends wear a helmet?**  
_Hvor mange af dine venner bruger hjelm?_

_single choice_ · screen `q08`

| Code | English | Dansk |
|---|---|---|
| `almost_all` | Almost all | Næsten alle |
| `half` | About half | Cirka halvdelen |
| `few` | A few | Nogle få |
| `none` | None | Ingen |
| `unknown` | No idea | Ved ikke |

## `values_top3`
**What matters most in things you use every day?**  
_Hvad betyder mest i ting, du bruger hver dag?_

_multi-select · max 3 · + Other text_ · screen `q09`

| Code | English | Dansk |
|---|---|---|
| `design` | Design | Design |
| `quality` | Quality | Kvalitet |
| `comfort` | Comfort | Komfort |
| `price` | Price | Pris |
| `practical` | Practical | Praktisk |
| `sustainable` | Sustainable | Bæredygtig |
| `tech` | Tech | Teknologi |
| `brand` | Brand | Brand |

## `brand_affinity`
**Which brands feel like you?**  
_Hvilke brands føles som dig?_

_multi-select · optional · + Other text_ · screen `q10`

| Code | English | Dansk |
|---|---|---|
| `apple` | Apple | Apple |
| `nothing` | Nothing | Nothing |
| `rains` | Rains | Rains |
| `arcteryx` | Arc’teryx | Arc’teryx |
| `salomon` | Salomon | Salomon |
| `patagonia` | Patagonia | Patagonia |
| `norse` | Norse Projects | Norse Projects |
| `ganni` | Ganni | Ganni |
| `veja` | Veja | Veja |
| `muji` | Muji | Muji |

## `age_band`
**A little about you — Age · pick one**  
_Lidt om dig — Alder · vælg én_

_single choice_ · screen `q11`

| Code | English | Dansk |
|---|---|---|
| `u16` | Under 16 | Under 16 |
| `16_19` | 16–19 | 16–19 |
| `20_25` | 20–25 | 20–25 |
| `26_30` | 26–30 | 26–30 |
| `31_35` | 31–35 | 31–35 |
| `36_45` | 36–45 | 36–45 |
| `46_60` | 46–60 | 46–60 |
| `60p` | 60 + | 60 + |
| `na` | Rather not say | Vil helst ikke sige |

## `city`
**A little about you — Where you ride most · pick one**  
_Lidt om dig — Hvor du cykler mest · vælg én_

_single choice_ · screen `q11`

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

_multi-select · optional · + Other text_ · screen `q12`

| Code | English | Dansk |
|---|---|---|
| `woman` | Woman | Kvinde |
| `man` | Man | Mand |
| `nonbinary` | Non-binary | Nonbinær |
| `genderqueer` | Genderqueer | Genderqueer |
| `genderfluid` | Genderfluid | Kønsflydende |
| `agender` | Agender | Agender |
| `trans_woman` | Trans woman | Transkvinde |
| `trans_man` | Trans man | Transmand |
| `two_spirit` | Two-spirit | Two-spirit |
| `questioning` | Questioning | Er i tvivl |
| `rather_not` | Rather not say *(exclusive)* | Vil helst ikke sige |

## `kit_interest`
**If one piece of kit solved what you picked, would you use it? — Pick one**  
_Hvis ét produkt løste det, du har valgt, ville du så bruge det? — Vælg én_

_single choice_ · screen `q13`

| Code | English | Dansk |
|---|---|---|
| `yes` | Yes | Ja |
| `maybe` | Maybe | Måske |
| `no` | No | Nej |

## `fair_price`
**If one piece of kit solved what you picked, would you use it? — A fair price?**  
_Hvis ét produkt løste det, du har valgt, ville du så bruge det? — Hvad er en fair pris?_

_single choice · only if kit_interest ∈ yes/maybe_ · screen `q13`

| Code | English | Dansk |
|---|---|---|
| `lt500` | Under 500 kr | Under 500 kr. |
| `500_799` | 500–799 kr | 500–799 kr. |
| `800_1199` | 800–1,199 kr | 800–1.199 kr. |
| `1200_1599` | 1,200–1,599 kr | 1.200–1.599 kr. |
| `1600p` | 1,600 kr + | 1.600 kr. + |
| `unsure` | Not sure | Ved ikke |

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
