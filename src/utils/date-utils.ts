export function formatDateToYYYYMMDD(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(date);
  return formattedDate.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$2-$3');
}
