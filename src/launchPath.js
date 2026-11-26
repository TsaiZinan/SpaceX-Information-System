export function launchPath(id, archived = false) {
  const prefix = archived ? '/launch/archive' : '/launch'
  return `${prefix}/${encodeURIComponent(id)}`
}
