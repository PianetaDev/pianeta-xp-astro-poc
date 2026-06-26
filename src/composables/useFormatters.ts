// Formatters condivisi (date, autori, plurali)
export function useFormatters() {
  const formatDate = (d?: string, opts?: Intl.DateTimeFormatOptions) => {
    if (!d) return ''
    const date = new Date(d)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('it-IT', opts || { day: '2-digit', month: 'long', year: 'numeric' })
  }
  const formatAuthors = (item: { authors?: string[]; author?: string }) => {
    if (Array.isArray(item?.authors) && item.authors.length) return item.authors.join(' · ')
    return item?.author || ''
  }
  const pluralize = (n: number, sing: string, plur?: string) =>
    `${n} ${n === 1 ? sing : (plur || sing + 's')}`
  return { formatDate, formatAuthors, pluralize }
}
