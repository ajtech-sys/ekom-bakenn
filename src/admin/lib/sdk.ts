const BASE_URL = (import.meta as any).env?.VITE_BACKEND_URL || '/'

function buildUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (BASE_URL.endsWith('/') && path.startsWith('/')) return `${BASE_URL.slice(0, -1)}${path}`
  if (!BASE_URL.endsWith('/') && !path.startsWith('/')) return `${BASE_URL}/${path}`
  return `${BASE_URL}${path}`
}

async function jsonFetch(
  path: string,
  init: { method?: string; headers?: Record<string, string>; body?: any } = {}
): Promise<{ status: number; data: any }> {
  const url = buildUrl(path)
  const headers = init.headers || { 'Content-Type': 'application/json' }
  const body = init.body ? JSON.stringify(init.body) : undefined
  const res = await fetch(url, { method: init.method || 'GET', headers, body, credentials: 'include' })
  const data = await res.json().catch(() => null)
  return { status: res.status, data }
}

async function uploadFiles({ files }: { files: File[] }) {
  try {
    const fd = new FormData()
    files.forEach((f) => fd.append('files', f))
    const url = buildUrl('/admin/uploads')
    const res = await fetch(url, { method: 'POST', body: fd, credentials: 'include' })
    const data = await res.json()
    return data
  } catch {
    return { files: files.map((f, i) => ({ id: `${Date.now()}-${i}`, url: URL.createObjectURL(f) })) }
  }
}

export const sdk = {
  client: { fetch: jsonFetch },
  admin: { upload: { create: uploadFiles } },
}
