import type Stripe from 'stripe'

export function renderLeadEmail(lead: any): string {
  const tx = Array.isArray(lead.transcript) ? lead.transcript.slice(-20).map((m: any) => {
    const text = Array.isArray(m.content)
      ? m.content.filter((b: any) => b.type === 'text').map((b: any) => b.text).join(' ')
      : String(m.content)
    return `<p><strong>${m.role === 'user' ? 'Visitatore' : 'Alba'}:</strong> ${escapeHtml(text)}</p>`
  }).join('') : ''

  return `
<h2>✍ Nuovo lead Hire Us</h2>
<p>Una persona ha completato la conversazione con Alba.</p>

<h3>Identità</h3>
<ul>
  <li><strong>Nome:</strong> ${escapeHtml(lead.name || '—')}</li>
  <li><strong>Email:</strong> ${escapeHtml(lead.email)}</li>
  <li><strong>Azienda:</strong> ${escapeHtml(lead.company || '—')}</li>
</ul>

<h3>Brief</h3>
<ul>
  <li><strong>Budget:</strong> ${escapeHtml(lead.budget_range || 'non specificato')}</li>
  <li><strong>Timeline:</strong> ${escapeHtml(lead.timeline || 'non specificato')}</li>
</ul>

<p><strong>Descrizione:</strong></p>
<blockquote style="border-left: 3px solid #ccc; padding-left: 12px; color: #555;">${escapeHtml(lead.description)}</blockquote>

<h3>Transcript chat (ultimi 20 messaggi)</h3>
${tx}

<hr>
<p style="font-size: 12px; color: #999;">Da fare: risposta cliente entro 24-48h. — Sistema Pianeta.Studio</p>
`
}

export function renderSubscriptionEmail({ session, sub, customer, portalUrl }: { session: Stripe.Checkout.Session; sub: Stripe.Subscription; customer: Stripe.Customer; portalUrl: string }): string {
  const taxIds = (customer.tax_ids?.data || []).map(t => t.value).join(', ') || '—'
  const addr = customer.address
  const addrStr = addr ? `${addr.line1 || ''} ${addr.line2 || ''}, ${addr.postal_code || ''} ${addr.city || ''}, ${addr.country || ''}` : '—'
  const albaName = (session.metadata as any)?.alba_session_id ? `Sessione Alba: ${session.metadata?.alba_session_id}` : ''

  return `
<h2>🎉 Nuova subscription Hire Us</h2>
<p>Una persona ha appena sottoscritto <strong>Team-as-a-Service</strong>.</p>

<h3>Dati Stripe (per fattura)</h3>
<ul>
  <li><strong>Email:</strong> ${escapeHtml(customer.email || '')}</li>
  <li><strong>Nome:</strong> ${escapeHtml(customer.name || '')}</li>
  <li><strong>P.IVA:</strong> ${escapeHtml(taxIds)}</li>
  <li><strong>Indirizzo:</strong> ${escapeHtml(addrStr)}</li>
</ul>

<h3>Subscription</h3>
<ul>
  <li><strong>Stripe Subscription ID:</strong> ${sub.id}</li>
  <li><strong>Inizio:</strong> ${new Date(sub.created * 1000).toISOString().slice(0, 10)}</li>
  <li><strong>Prossimo rinnovo:</strong> ${new Date(sub.current_period_end * 1000).toISOString().slice(0, 10)}</li>
  <li><strong>Importo:</strong> €4.000/mese IVA inclusa</li>
</ul>

${albaName ? `<p>${escapeHtml(albaName)}</p>` : ''}

<h3>Da fare ora</h3>
<ol>
  <li>Emetti la fattura su Fatture in Cloud entro il 15 del mese.</li>
  <li>Manda calendar invite cliente per kickoff entro 24h.</li>
</ol>

<p><strong>Customer Portal (mandare al cliente):</strong><br><a href="${portalUrl}">${portalUrl}</a></p>

<hr>
<p style="font-size: 12px; color: #999;">— Sistema Pianeta.Studio</p>
`
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}
