/**
 * HTML email template for content broadcasts (work, bulletin, services).
 * Inline CSS only — works on Gmail / Outlook / Apple Mail / Resend audiences.
 */

const SITE = 'https://xp.pianeta.studio'

const TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  work:     { label: 'Nuovo case study', emoji: '🎯' },
  bulletin: { label: 'Nuovo articolo',   emoji: '📰' },
  services: { label: 'Nuovo servizio',   emoji: '✨' },
}

function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function abs(url: string | undefined): string {
  if (!url) return ''
  return url.startsWith('http') ? url : `${SITE}${url}`
}

/** Extract first non-heading non-blockquote paragraph (or TLDR) from markdown body */
function extractExcerpt(body: string | undefined): string {
  if (!body) return ''
  const lines = body.split('\n')
  for (const line of lines) {
    const t = line.trim()
    if (!t) continue
    if (t.startsWith('#')) continue
    if (t.startsWith('>')) continue
    if (t.startsWith('---')) continue
    if (t.startsWith('```')) continue
    // Strip MD inline syntax
    return t
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/\[(.+?)\]\([^)]+\)/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .slice(0, 380)
  }
  return ''
}

export function renderBroadcastEmail(opts: {
  type: 'work' | 'bulletin' | 'services'
  item: any
  audienceId?: string
  /** Recipient email (for tokenized manage/unsubscribe links) */
  recipientEmail?: string
  manageUrl?: string
  unsubscribeUrl?: string
}): { subject: string; html: string; text: string } {
  const { type, item } = opts
  const meta = TYPE_LABELS[type]
  const url = `${SITE}${item.path}`
  const cover = abs(item.cover || item.ogImage)
  const title = item.title || item.name || ''
  const desc = item.description || ''
  const excerpt = extractExcerpt(item.body)

  const ctaLabel = type === 'work'     ? 'Leggi il case study →'
                  : type === 'bulletin' ? 'Leggi l\'articolo →'
                  : 'Scopri il servizio →'

  const subject = `${meta.emoji} ${meta.label}: ${title}`

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#fafaf7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0e1116;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fafaf7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">

        <!-- HEADER brand -->
        <tr><td style="padding:24px 32px;border-bottom:1px solid #0e111612;">
          <a href="${SITE}" style="text-decoration:none;color:#0e1116;">
            <span style="font-weight:900;font-size:14px;letter-spacing:0.04em;">PIANETA.STUDIO</span>
            <span style="display:block;font-size:11px;color:#0e111680;font-style:italic;margin-top:2px;">Sustainable Creativity™</span>
          </a>
        </td></tr>

        ${cover ? `
        <!-- HERO image -->
        <tr><td>
          <a href="${url}" style="display:block;line-height:0;">
            <img src="${cover}" alt="${escapeHtml(title)}" width="600" style="display:block;width:100%;height:auto;max-width:600px;">
          </a>
        </td></tr>
        ` : ''}

        <!-- BODY -->
        <tr><td style="padding:32px;">
          <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#0e111699;font-weight:600;">${meta.emoji} ${meta.label}</p>
          <h1 style="margin:0 0 16px;font-size:28px;line-height:1.15;font-weight:900;letter-spacing:-0.01em;color:#0e1116;">
            <a href="${url}" style="text-decoration:none;color:#0e1116;">${escapeHtml(title)}</a>
          </h1>
          ${desc ? `<p style="margin:0 0 20px;font-size:17px;line-height:1.5;color:#0e1116b3;">${escapeHtml(desc)}</p>` : ''}
          ${excerpt ? `<p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#0e1116cc;">${escapeHtml(excerpt)}…</p>` : ''}

          <!-- CTA button -->
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr><td style="background:#0e1116;border-radius:999px;">
              <a href="${url}" style="display:inline-block;padding:13px 26px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:0.01em;">${ctaLabel}</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- META row -->
        ${(item.client || item.year || item.authors || item.date) ? `
        <tr><td style="padding:0 32px 24px;font-size:12px;color:#0e111680;">
          ${item.client ? `<span style="margin-right:12px;"><strong>${escapeHtml(item.client)}</strong></span>` : ''}
          ${item.authors?.length ? `<span style="margin-right:12px;">${escapeHtml(item.authors.join(' · '))}</span>` : ''}
          ${item.year ? `<span style="margin-right:12px;">${item.year}</span>` : ''}
          ${item.date && !item.year ? `<span>${new Date(item.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}</span>` : ''}
        </td></tr>
        ` : ''}

        <!-- FOOTER -->
        <tr><td style="padding:24px 32px;background:#fafaf7;border-top:1px solid #0e111612;font-size:12px;color:#0e11168c;text-align:center;">
          <p style="margin:0 0 8px;">Ricevi questa email perché sei iscritto al <strong>Bulletin Pianeta.Studio</strong>.</p>
          <p style="margin:0;">
            ${opts.manageUrl ? `<a href="${opts.manageUrl}" style="color:#0e1116;text-decoration:underline;">Gestisci preferenze</a>&nbsp;·&nbsp;` : ''}
            ${opts.unsubscribeUrl ? `<a href="${opts.unsubscribeUrl}" style="color:#0e1116;text-decoration:underline;">Disiscriviti</a>&nbsp;·&nbsp;` : ''}
            <a href="${SITE}" style="color:#0e1116;text-decoration:underline;">xp.pianeta.studio</a>
            &nbsp;·&nbsp;
            <a href="${SITE}/privacy" style="color:#0e1116;text-decoration:underline;">Privacy</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  const text = `${meta.label.toUpperCase()}

${title}
${desc ? '\n' + desc + '\n' : ''}
${excerpt ? '\n' + excerpt + '…\n' : ''}
→ ${url}

—
Pianeta.Studio · Sustainable Creativity
${SITE}`

  return { subject, html, text }
}
