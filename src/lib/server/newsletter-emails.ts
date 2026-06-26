/**
 * Transactional newsletter emails — confirmation, welcome, prefs updated, unsubscribed.
 * All inline CSS. Brand-aligned with broadcast template.
 */
const SITE = 'https://xp.pianeta.studio'

function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function shell(opts: { title: string; body: string; manageUrl?: string; unsubscribeUrl?: string }): string {
  return `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>${escapeHtml(opts.title)}</title></head>
<body style="margin:0;padding:0;background:#fafaf7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0e1116;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fafaf7;padding:32px 16px;"><tr><td align="center">
<table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;">
  <tr><td style="padding:24px 32px;border-bottom:1px solid #0e111612;">
    <a href="${SITE}" style="text-decoration:none;color:#0e1116;">
      <span style="font-weight:900;font-size:14px;letter-spacing:0.04em;">PIANETA.STUDIO</span>
      <span style="display:block;font-size:11px;color:#0e111680;font-style:italic;margin-top:2px;">Bulletin</span>
    </a>
  </td></tr>
  <tr><td style="padding:32px;font-size:15px;line-height:1.6;color:#0e1116;">
    ${opts.body}
  </td></tr>
  <tr><td style="padding:20px 32px;background:#fafaf7;border-top:1px solid #0e111612;font-size:11px;color:#0e11168c;text-align:center;">
    ${opts.manageUrl ? `<a href="${opts.manageUrl}" style="color:#0e1116;text-decoration:underline;">Gestisci preferenze</a>` : ''}
    ${opts.manageUrl && opts.unsubscribeUrl ? '&nbsp;·&nbsp;' : ''}
    ${opts.unsubscribeUrl ? `<a href="${opts.unsubscribeUrl}" style="color:#0e1116;text-decoration:underline;">Disiscriviti</a>` : ''}
    ${(opts.manageUrl || opts.unsubscribeUrl) ? '<br><br>' : ''}
    <a href="${SITE}" style="color:#0e1116;text-decoration:none;">xp.pianeta.studio</a>
    &nbsp;·&nbsp;<a href="${SITE}/privacy" style="color:#0e1116;text-decoration:underline;">Privacy</a>
  </td></tr>
</table></td></tr></table></body></html>`
}

export function renderConfirmEmail(email: string, confirmUrl: string) {
  return {
    subject: 'Conferma iscrizione · Bulletin Pianeta.Studio',
    html: shell({
      title: 'Conferma iscrizione',
      body: `
        <p style="margin:0 0 16px;font-size:18px;font-weight:600;">Conferma la tua iscrizione 🌱</p>
        <p style="margin:0 0 24px;">Ti sei appena iscritto al Bulletin di Pianeta.Studio con <strong>${escapeHtml(email)}</strong>.</p>
        <p style="margin:0 0 24px;">Per attivare l'iscrizione e iniziare a ricevere gli aggiornamenti, conferma qui sotto:</p>
        <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#0e1116;border-radius:999px;">
          <a href="${confirmUrl}" style="display:inline-block;padding:13px 26px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">Conferma iscrizione →</a>
        </td></tr></table>
        <p style="margin:24px 0 0;font-size:13px;color:#0e111680;">Se non sei stato tu, ignora questa email — non riceverai altri messaggi.</p>
      `,
    }),
    text: `Conferma la tua iscrizione al Bulletin Pianeta.Studio.\n\nClicca qui: ${confirmUrl}\n\nSe non sei stato tu, ignora questa email.`,
  }
}

export function renderWelcomeEmail(email: string, manageUrl: string, unsubscribeUrl: string) {
  return {
    subject: '🌱 Benvenuto nel Bulletin Pianeta.Studio',
    html: shell({
      title: 'Benvenuto',
      manageUrl,
      unsubscribeUrl,
      body: `
        <p style="margin:0 0 16px;font-size:18px;font-weight:600;">Iscrizione confermata. Benvenuto 🌱</p>
        <p style="margin:0 0 20px;">Da oggi riceverai il Bulletin di Pianeta.Studio su <strong>${escapeHtml(email)}</strong> — niente content marketing, solo lavoro vero documentato.</p>
        <p style="margin:0 0 20px;"><strong>Cosa aspettarti:</strong></p>
        <ul style="margin:0 0 24px;padding-left:20px;">
          <li style="margin:6px 0;">Articoli di metodo e ricerca, 1-2 al mese</li>
          <li style="margin:6px 0;">Nuovi case study quando pubblichiamo</li>
          <li style="margin:6px 0;">Annunci di servizi e cambi rilevanti dello studio</li>
        </ul>
        <p style="margin:0 0 24px;">Puoi cambiare cosa ricevere in ogni momento dal centro preferenze.</p>
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="background:#0e1116;border-radius:999px;padding-right:12px;">
            <a href="${SITE}/bulletin" style="display:inline-block;padding:11px 22px;color:#ffffff;text-decoration:none;font-weight:600;font-size:13px;">Leggi gli articoli →</a>
          </td>
          <td style="padding-left:12px;">
            <a href="${manageUrl}" style="color:#0e1116;text-decoration:underline;font-size:13px;">Gestisci preferenze</a>
          </td>
        </tr></table>
      `,
    }),
    text: `Iscrizione confermata. Benvenuto nel Bulletin Pianeta.Studio.\n\nLeggi: ${SITE}/bulletin\nGestisci preferenze: ${manageUrl}\nDisiscriviti: ${unsubscribeUrl}`,
  }
}

export function renderPrefsUpdatedEmail(email: string, manageUrl: string, unsubscribeUrl: string) {
  return {
    subject: 'Preferenze aggiornate · Bulletin Pianeta',
    html: shell({
      title: 'Preferenze aggiornate',
      manageUrl,
      unsubscribeUrl,
      body: `
        <p style="margin:0 0 16px;font-size:18px;font-weight:600;">Preferenze aggiornate ✓</p>
        <p style="margin:0 0 20px;">Le tue preferenze di iscrizione su <strong>${escapeHtml(email)}</strong> sono state salvate.</p>
        <p style="margin:0 0 24px;">Riceverai solo i contenuti che hai scelto. Puoi modificare di nuovo in qualsiasi momento.</p>
        <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#0e1116;border-radius:999px;">
          <a href="${manageUrl}" style="display:inline-block;padding:13px 26px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">Apri il centro preferenze →</a>
        </td></tr></table>
      `,
    }),
    text: `Preferenze aggiornate per ${email}.\n\nGestisci preferenze: ${manageUrl}`,
  }
}

export function renderUnsubscribeEmail(email: string) {
  return {
    subject: 'Disiscritto dal Bulletin Pianeta',
    html: shell({
      title: 'Disiscritto',
      body: `
        <p style="margin:0 0 16px;font-size:18px;font-weight:600;">Confermato 🌱</p>
        <p style="margin:0 0 20px;">${escapeHtml(email)} è stato rimosso dalla lista Bulletin di Pianeta.Studio. Non riceverai più nostre email.</p>
        <p style="margin:0 0 20px;">Grazie per averci letto fin qui. Se ti capita di tornare, sai dove trovarci.</p>
        <p style="margin:0;"><a href="${SITE}" style="color:#0e1116;text-decoration:underline;">xp.pianeta.studio</a></p>
      `,
    }),
    text: `${email} disiscritto dal Bulletin Pianeta.Studio.\n\nGrazie per averci letto.`,
  }
}
