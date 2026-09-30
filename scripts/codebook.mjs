// Writes CODEBOOK.md: every sheet column and answer code with its English and Danish label.
// Run after editing questions:  npm run codebook
import fs from 'node:fs'; import vm from 'node:vm';
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(new URL('../site/assets/questions.js', import.meta.url), 'utf8'), ctx);
const screens = ctx.window.QILA_SCREENS;
const branch = { q02y: 'Yes', q03y: 'Yes', q04y: 'Yes', q02s: 'Sometimes', q03s: 'Sometimes', q04s: 'Sometimes', q02n: 'No', q03n: 'No', q04n: 'No' };
const seen = new Set();
let md = `# Codebook — qila urban cycling study\n\nGenerated from \`site/assets/questions.js\`. Each field is a column in the **Responses** sheet; multi-select cells hold comma-separated codes. \`<field>_other\` holds the free text typed under "Other".\n`;
for (const s of screens) {
  for (const g of s.groups || []) {
    const qen = [s.q && s.q.en, g.label && g.label.en].filter(Boolean).join(' — ');
    const qda = [s.q && s.q.da, g.label && g.label.da].filter(Boolean).join(' — ');
        if (seen.has(g.field) && branch[s.id]) { md += `\n*\`${g.field}\` is also asked in the **${branch[s.id]}** branch (${s.id}).*\n`; continue; }
    seen.add(g.field);
    const flags = [g.type === 'multi' ? 'multi-select' : 'single choice', g.max && `max ${g.max}`, g.optional && 'optional', g.other && '+ Other text', g.showIf && `only if ${g.showIf.field} ∈ ${g.showIf.in.join('/')}`, branch[s.id] && `${branch[s.id]} branch only`].filter(Boolean).join(' · ');
    md += `\n## \`${g.field}\`\n**${qen.replace(/\n/g, ' ')}**  \n_${qda.replace(/\n/g, ' ')}_\n\n_${flags}_ · screen \`${s.id}\`\n\n| Code | English | Dansk |\n|---|---|---|\n`;
    for (const o of g.options) md += `| \`${o.id}\` | ${o.en}${o.exclusive ? ' *(exclusive)*' : ''} | ${o.da} |\n`;
  }
}
md += `\n## Meta columns\n| Column | Meaning |\n|---|---|\n| received_at | When the sheet received it |\n| response_id | Random ID per respondent (not linked to the waitlist) |\n| source | The \`?src=\` tag from the QR code / link |\n| lang | Language the person answered in (en/da) |\n| version | Questionnaire version from config.js |\n| device | touch or pointer |\n| started_at / duration_sec | When they began, total seconds |\n| last_screen | Last screen reached (useful in Partial) |\n| screen_times | JSON of seconds spent per screen |\n| excluded | "under 16" → left out of the Summary |\n`;
fs.writeFileSync(new URL('../CODEBOOK.md', import.meta.url), md);
console.log('CODEBOOK.md written');
