const monthNamesShort = {
  de: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/**
 * Convert an ISO month string (e.g. "2024-03") into a tuple [year, monthShort].
 * Returns ["", ""] for invalid input so callers can render safely.
 */
export function parseMonth(monthString, language = 'de') {
  if (!monthString || typeof monthString !== 'string') return ['', ''];
  const [yearPart, monthPart] = monthString.split('-');
  const monthIndex = Number(monthPart) - 1;
  if (Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return [yearPart ?? '', ''];
  }
  return [yearPart, (monthNamesShort[language] ?? monthNamesShort.de)[monthIndex]];
}
