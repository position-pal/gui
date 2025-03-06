function formatToISO(timeString) {
  if (isValidISOString(timeString)) {
    return timeString
  }
  try {
    const date = new Date(timeString)
    if (!isNaN(date.getTime())) {
      return date.toISOString()
    }
  } catch (e) {
    console.error('Invalid date format:', e)
  }
  return timeString
}

function isValidISOString(str) {
  if (typeof str !== 'string') return false
  try {
    return new Date(str).toISOString() === str
  } catch (e) {
    console.debug('Invalid ISO string:', e)
    return false
  }
}

export { formatToISO, isValidISOString }
