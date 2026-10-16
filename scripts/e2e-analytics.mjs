import fs from 'fs'

const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]
    })
)

const base = process.env.BASE_URL || 'http://localhost:3005'
const password = env.ADMIN_PASSWORD
if (!password) {
  console.error('FAIL: ADMIN_PASSWORD missing')
  process.exit(1)
}

const track = await fetch(`${base}/api/track`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'resume_download',
    label: 'e2e-resume',
    path: '/',
    href: '/assets/resume/AkshitU_2026_AI_SE.pdf',
  }),
})
const trackJson = await track.json()
console.log('track_status', track.status, 'ok', trackJson.ok)

const analytics = await fetch(`${base}/api/analytics`, {
  headers: { 'x-admin-password': password },
})
const data = await analytics.json()
console.log('analytics_status', analytics.status)
console.log('configured', data.configured)
console.log('resume_downloads', data.totals?.resume_download ?? 0)
console.log('recent_has_e2e', (data.recent || []).some((e) => e.label === 'e2e-resume'))
console.log('message', data.message)

if (!trackJson.ok || !data.configured || !(data.totals?.resume_download > 0)) {
  process.exit(1)
}
console.log('E2E_OK')
