import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const KEYWORDS = ['support', 'customer success', 'technical support', 'help desk', 'junior developer', 'junior frontend', 'qa'];
const TODAY = new Date().toISOString().slice(0, 10);

function matchKeywords(title) {
  const lower = title.toLowerCase();
  return KEYWORDS.filter(kw => lower.includes(kw));
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function cleanText(html) {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

// --- RemoteOK ---
async function fetchRemoteOK() {
  const res = await fetch('https://remoteok.com/api', {
    headers: { 'User-Agent': 'job-tracker-scanner/1.0' },
  });
  const json = await res.json();
  // First element is a metadata object, not a job listing
  return json.slice(1).map(job => ({
    company: cleanText(job.company ?? ''),
    role: cleanText(job.position ?? ''),
    link: job.url ?? '',
    description: job.description ?? '',
    source: 'remoteok',
  }));
}

// --- WeWorkRemotely RSS ---
function parseRssItems(xml) {
  const items = [];
  const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];

  for (const block of itemBlocks) {
    const title = (block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ??
                   block.match(/<title>([\s\S]*?)<\/title>/))?.[1]?.trim() ?? '';

    const description = (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ??
                         block.match(/<description>([\s\S]*?)<\/description>/))?.[1]?.trim() ?? '';

    // WWR puts the job URL in a <link> tag after <guid>, not inside standard XML tags
    const link = (block.match(/<link>([\s\S]*?)<\/link>/) ??
                  block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/))?.[1]?.trim() ?? '';

    // Title format: "Company: Role Title"
    const cleanTitle = decodeHtmlEntities(title);
    const colonIdx = cleanTitle.indexOf(':');
    const company = colonIdx !== -1 ? cleanTitle.slice(0, colonIdx).trim() : '';
    const role = colonIdx !== -1 ? cleanTitle.slice(colonIdx + 1).trim() : cleanTitle;

    items.push({ company, role, link, description: cleanText(description), source: 'weworkremotely' });
  }

  return items;
}

async function fetchWeWorkRemotely() {
  const res = await fetch('https://weworkremotely.com/categories/remote-programming-jobs.rss', {
    headers: { 'User-Agent': 'job-tracker-scanner/1.0' },
  });
  // Force UTF-8 decoding — ignores any wrong charset in Content-Type header
  const buffer = await res.arrayBuffer();
  const xml = new TextDecoder('utf-8').decode(buffer);
  return parseRssItems(xml);
}

// --- Insert with duplicate check ---
async function insertJob(job, matched) {
  const { data: existing } = await supabase
    .from('discovered_jobs')
    .select('id')
    .eq('link', job.link)
    .maybeSingle();

  if (existing) return false;

  const { error } = await supabase.from('discovered_jobs').insert({
    company: job.company,
    role: job.role,
    link: job.link,
    source: job.source,
    date_found: TODAY,
    matched_keywords: matched.join(', '),
  });

  if (error) {
    console.error(`Insert failed for ${job.link}: ${error.message}`);
    return false;
  }

  return true;
}

// --- Main ---
async function main() {
  const [remoteOKJobs, wwrJobs] = await Promise.all([fetchRemoteOK(), fetchWeWorkRemotely()]);
  const allJobs = [...remoteOKJobs, ...wwrJobs];

  let inserted = 0;

  for (const job of allJobs) {
    if (!job.link) continue;
    const matched = matchKeywords(job.role);
    if (matched.length === 0) continue;
    const wasInserted = await insertJob(job, matched);
    if (wasInserted) inserted++;
  }

  console.log(`Scan complete: ${inserted} new job(s) inserted.`);
}

main().catch(err => {
  console.error('Scan failed:', err.message);
  process.exit(1);
});
