// Stima sunset/sunrise sui server Pianeta — timezone Europe/Rome.
// Tabella mensile per Catania (sede legale), approssimazione media mensile
// (errore ±20 min nei mesi di transizione, OK per scopo del theme switch).
const SUNRISE_BY_MONTH = [7.25, 7.05, 6.5, 6.0, 5.5, 5.5, 5.75, 6.25, 6.75, 7.25, 6.75, 7.25];
const SUNSET_BY_MONTH  = [17.0, 17.5, 18.5, 20.0, 20.5, 21.0, 21.0, 20.5, 19.5, 18.5, 17.25, 17.0];

export function isNightInItaly(now: Date = new Date()): boolean {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Rome',
    month: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false,
  });
  const parts: Record<string, number> = {};
  for (const p of fmt.formatToParts(now)) {
    if (p.type !== 'literal') parts[p.type] = parseInt(p.value);
  }
  const month = (parts.month || 1) - 1;
  const hourFloat = (parts.hour || 0) + (parts.minute || 0) / 60;
  return hourFloat < SUNRISE_BY_MONTH[month] || hourFloat >= SUNSET_BY_MONTH[month];
}
