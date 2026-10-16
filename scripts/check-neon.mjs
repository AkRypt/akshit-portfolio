import fs from 'fs'
import { neon } from '@neondatabase/serverless'

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

const url = env.DATABASE_URL
if (!url) {
  console.error('FAIL: DATABASE_URL missing')
  process.exit(1)
}

console.log('database_host:', new URL(url).host)
console.log('branch:', env.NEON_BRANCH || '(unset)')

const sql = neon(url)
const rows = await sql`SELECT COUNT(*)::int AS n FROM analytics_events`
console.log('events_count:', rows[0]?.n)

const id = `health-${Date.now()}`
await sql`
  INSERT INTO analytics_events (id, name, label, path, meta, ts)
  VALUES (${id}, 'page_view', 'healthcheck', '/health', ${JSON.stringify({ ok: true })}, NOW())
`
const recent = await sql`
  SELECT id, name, label FROM analytics_events WHERE id = ${id}
`
console.log('insert_ok:', recent[0]?.label === 'healthcheck')
console.log('OK')
