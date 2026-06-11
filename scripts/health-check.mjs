#!/usr/bin/env node

const args = process.argv.slice(2);

function readArg(name, fallback) {
  const prefix = `--${name}=`;
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = args.indexOf(`--${name}`);
  if (index !== -1 && args[index + 1]) return args[index + 1];

  return fallback;
}

const baseUrl = readArg('url', process.env.ROUTE_LONGEVITY_HEALTH_URL || process.env.APP_URL || 'https://routelongevity.com')
  .replace(/\/+$/, '');
const timeoutMs = Number(readArg('timeout', process.env.HEALTH_TIMEOUT_MS || '10000'));

const checks = [
  {
    name: 'frontend',
    url: baseUrl,
    validate: async (response) => response.ok && (await response.text()).includes('Route Longevity'),
  },
  {
    name: 'api-health',
    url: `${baseUrl}/api/health`,
    validate: async (response) => {
      if (!response.ok) return false;
      const payload = await response.json();
      return payload?.ok === true && payload?.service === 'route-longevity-api';
    },
  },
  {
    name: 'listings-api',
    url: `${baseUrl}/api/listings`,
    validate: async (response) => {
      if (!response.ok) return false;
      const payload = await response.json();
      return Array.isArray(payload?.listings);
    },
  },
];

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json,text/html' } });
  } finally {
    clearTimeout(timer);
  }
}

const startedAt = Date.now();
const results = [];

for (const check of checks) {
  const checkStartedAt = Date.now();

  try {
    const response = await fetchWithTimeout(check.url);
    const ok = await check.validate(response);
    results.push({
      name: check.name,
      ok,
      status: response.status,
      ms: Date.now() - checkStartedAt,
      url: check.url,
    });
  } catch (error) {
    results.push({
      name: check.name,
      ok: false,
      status: 'error',
      ms: Date.now() - checkStartedAt,
      url: check.url,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

const failed = results.filter((result) => !result.ok);
const summary = {
  ok: failed.length === 0,
  baseUrl,
  checkedAt: new Date().toISOString(),
  totalMs: Date.now() - startedAt,
  results,
};

console.log(JSON.stringify(summary, null, 2));

if (failed.length > 0) {
  process.exit(1);
}
