/** Browser-facing URLs only. Export/data filesystem paths never use this. */
export function resolveSiteUrl(value: string, prefix = '', workbench = ''): string {
  if (!value.startsWith('/') || value.startsWith('//')) return value
  if (workbench && /^\/w(?:[/?#]|$)/.test(value)) {
    return workbench.replace(/\/+$/, '') + value.slice(2)
  }
  if (!prefix || value === prefix || value.startsWith(prefix + '/')) return value
  return prefix + value
}

export function siteUrl(value: string): string
export function siteUrl(value: undefined): undefined
export function siteUrl(value: string | undefined): string | undefined
export function siteUrl(value: string | undefined): string | undefined {
  return value === undefined ? undefined : resolveSiteUrl(value,
    process.env.NEXT_PUBLIC_QT_BASE_PATH || '', process.env.NEXT_PUBLIC_QT_WORKBENCH_URL || '')
}

export const externalWorkbench = Boolean(process.env.NEXT_PUBLIC_QT_WORKBENCH_URL)
