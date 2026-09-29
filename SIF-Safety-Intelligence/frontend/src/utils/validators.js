export function isValidJSON(text) {
  try {
    JSON.parse(text)
    return true
  } catch {
    return false
  }
}

export function validateCSVFile(file) {
  const errors = []
  if (!file) { errors.push('No file selected'); return errors }
  if (!file.name.toLowerCase().endsWith('.csv')) errors.push('File must be a .csv file')
  if (file.size > 5 * 1024 * 1024) errors.push('File exceeds 5MB limit')
  return errors
}

export function validateJSONFile(file) {
  const errors = []
  if (!file) { errors.push('No file selected'); return errors }
  if (!file.name.toLowerCase().endsWith('.json')) errors.push('File must be a .json file')
  if (file.size > 5 * 1024 * 1024) errors.push('File exceeds 5MB limit')
  return errors
}
