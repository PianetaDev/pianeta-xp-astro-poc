// Pick the "continua a leggere" item from the same collection.
// Strategy: sort by date desc, find current index, return next (wrap if last).
export function pickNextItem(items: any[], currentId: string) {
  const live = items.filter((i: any) => i.data.draft !== true && i.id !== currentId);
  if (live.length === 0) return null;
  const sorted = live.sort((a: any, b: any) => {
    const da = a.data.date ? new Date(a.data.date).getTime() : 0;
    const db = b.data.date ? new Date(b.data.date).getTime() : 0;
    return db - da;
  });
  return sorted[0];
}

export function toNextProp(item: any, type: string) {
  if (!item) return undefined;
  const d = item.data;
  const cover = d.cover || d.photo || d.ogImage || '/og/placeholder.svg';
  const title = d.name || d.title || item.id;
  let kicker = '';
  if (type === 'work') kicker = [d.client, d.year].filter(Boolean).join(' · ');
  else if (type === 'bulletin' && d.date) kicker = new Date(d.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
  else if (type === 'team') kicker = d.role || '';
  else if (type === 'lab') kicker = d.kind || '';
  else if (type === 'careers') kicker = [d.employmentType, d.location].filter(Boolean).join(' · ');
  else if (type === 'services') kicker = 'Servizio';
  return { type, slug: item.id, title, deck: d.description, cover, kicker };
}
