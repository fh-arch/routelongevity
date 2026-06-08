import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query, pool } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

function extractArray(source, constName) {
  const marker = `const ${constName}`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Could not find ${constName}`);
  }

  const assignmentIndex = source.indexOf('=', markerIndex);
  if (assignmentIndex === -1) {
    throw new Error(`Could not find assignment for ${constName}`);
  }

  const start = source.indexOf('[', assignmentIndex);
  if (start === -1) {
    throw new Error(`Could not find array start for ${constName}`);
  }

  let depth = 0;
  let quote = '';
  let escaped = false;
  let templateDepth = 0;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    const prev = source[index - 1];

    if (quote) {
      if (quote === '`' && char === '$' && source[index + 1] === '{') {
        templateDepth += 1;
        index += 1;
        continue;
      }

      if (templateDepth > 0) {
        if (char === '{') templateDepth += 1;
        if (char === '}') templateDepth -= 1;
        continue;
      }

      if (char === quote && !escaped) {
        quote = '';
      }

      escaped = char === '\\' && !escaped;
      if (char !== '\\') escaped = false;
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      escaped = false;
      continue;
    }

    if (char === '[') depth += 1;
    if (char === ']') depth -= 1;

    if (depth === 0) {
      return source.slice(start, index + 1);
    }

    if (prev === undefined) {
      throw new Error(`Unexpected parser state for ${constName}`);
    }
  }

  throw new Error(`Could not find array end for ${constName}`);
}

function loadFrontendContent() {
  const modalPath = path.join(rootDir, 'src/components/BlogEventsModal.tsx');
  const source = fs.readFileSync(modalPath, 'utf8');
  return {
    postsEn: Function(`return ${extractArray(source, 'MOCK_POSTS_EN')}`)(),
    postsTr: Function(`return ${extractArray(source, 'MOCK_POSTS_TR')}`)(),
    eventsEn: Function(`return ${extractArray(source, 'MOCK_EVENTS_EN')}`)(),
    eventsTr: Function(`return ${extractArray(source, 'MOCK_EVENTS_TR')}`)(),
  };
}

async function seedBlogPosts(postsEn, postsTr) {
  for (const [index, postEn] of postsEn.entries()) {
    const postTr = postsTr.find((post) => post.id === postEn.id) || postEn;

    await query(
      `INSERT INTO blog_posts (
         id, title, subtitle, category, read_time, date_label, author,
         image_url, content, tags, sort_order
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         subtitle = EXCLUDED.subtitle,
         category = EXCLUDED.category,
         read_time = EXCLUDED.read_time,
         date_label = EXCLUDED.date_label,
         author = EXCLUDED.author,
         image_url = EXCLUDED.image_url,
         content = EXCLUDED.content,
         tags = EXCLUDED.tags,
         sort_order = EXCLUDED.sort_order,
         updated_at = now()`,
      [
        postEn.id,
        JSON.stringify({ en: postEn.title, tr: postTr.title }),
        JSON.stringify({ en: postEn.subtitle, tr: postTr.subtitle }),
        JSON.stringify({ en: postEn.category, tr: postTr.category }),
        JSON.stringify({ en: postEn.readTime, tr: postTr.readTime }),
        JSON.stringify({ en: postEn.date, tr: postTr.date }),
        JSON.stringify({ en: postEn.author, tr: postTr.author }),
        postEn.imageUrl,
        JSON.stringify({ en: postEn.content, tr: postTr.content }),
        JSON.stringify({ en: postEn.tags, tr: postTr.tags }),
        (index + 1) * 10,
      ],
    );
  }
}

async function seedEvents(eventsEn, eventsTr) {
  for (const [index, eventEn] of eventsEn.entries()) {
    const eventTr = eventsTr.find((event) => event.id === eventEn.id) || eventEn;

    await query(
      `INSERT INTO events (
         id, title, date_label, time_label, location, city, description,
         spots_left, tags, image_url, sort_order
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         date_label = EXCLUDED.date_label,
         time_label = EXCLUDED.time_label,
         location = EXCLUDED.location,
         city = EXCLUDED.city,
         description = EXCLUDED.description,
         spots_left = EXCLUDED.spots_left,
         tags = EXCLUDED.tags,
         image_url = EXCLUDED.image_url,
         sort_order = EXCLUDED.sort_order,
         updated_at = now()`,
      [
        eventEn.id,
        JSON.stringify({ en: eventEn.title, tr: eventTr.title }),
        JSON.stringify({ en: eventEn.date, tr: eventTr.date }),
        JSON.stringify({ en: eventEn.time, tr: eventTr.time }),
        JSON.stringify({ en: eventEn.location, tr: eventTr.location }),
        JSON.stringify({ en: eventEn.city, tr: eventTr.city }),
        JSON.stringify({ en: eventEn.description, tr: eventTr.description }),
        eventEn.spotsLeft,
        JSON.stringify({ en: eventEn.tags, tr: eventTr.tags }),
        eventEn.imageUrl,
        (index + 1) * 10,
      ],
    );
  }
}

async function seedListings() {
  const dataModule = await import(path.join(rootDir, 'src/data.ts'));
  const { PARTNERS_DATA } = dataModule;

  for (const partner of PARTNERS_DATA) {
    await query(
      `INSERT INTO listings (
         external_id, category_id, category_label, name, description, city, region,
         country, address, latitude, longitude, image_url, website, phone, email,
         is_premium, status, source, rating, review_count, license_type, annual_fee,
         specialty, featured, analytics
       )
       VALUES (
         $1, $2, $3, $4, $5, $6, $7,
         'Türkiye', $8, $9, $10, $11, $12, $13, $14,
         $15, 'approved', 'seed', $16, $17, $18, $19,
         $20, $21, $22
       )
       ON CONFLICT (external_id) DO UPDATE SET
         category_id = EXCLUDED.category_id,
         category_label = EXCLUDED.category_label,
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         city = EXCLUDED.city,
         region = EXCLUDED.region,
         address = EXCLUDED.address,
         latitude = EXCLUDED.latitude,
         longitude = EXCLUDED.longitude,
         image_url = EXCLUDED.image_url,
         website = EXCLUDED.website,
         phone = EXCLUDED.phone,
         email = EXCLUDED.email,
         is_premium = EXCLUDED.is_premium,
         status = EXCLUDED.status,
         rating = EXCLUDED.rating,
         review_count = EXCLUDED.review_count,
         license_type = EXCLUDED.license_type,
         annual_fee = EXCLUDED.annual_fee,
         specialty = EXCLUDED.specialty,
         featured = EXCLUDED.featured,
         analytics = EXCLUDED.analytics,
         updated_at = now()`,
      [
        partner.id,
        partner.category,
        partner.categoryLabel,
        partner.name,
        partner.description,
        partner.city,
        partner.location,
        partner.address,
        partner.latitude,
        partner.longitude,
        partner.imageUrl,
        partner.website,
        partner.phone,
        partner.email,
        partner.licenseType === 'Premium',
        partner.rating,
        partner.reviewCount,
        partner.licenseType,
        partner.annualFee,
        partner.specialty,
        partner.featured,
        JSON.stringify(partner.analytics || {}),
      ],
    );
  }

  return PARTNERS_DATA.length;
}

async function main() {
  const { postsEn, postsTr, eventsEn, eventsTr } = loadFrontendContent();

  if (process.argv.includes('--dry-run')) {
    const dataModule = await import(path.join(rootDir, 'src/data.ts'));
    console.log(`Ready to seed ${postsEn.length} blog posts, ${eventsEn.length} events, and ${dataModule.PARTNERS_DATA.length} listings.`);
    return;
  }

  await seedBlogPosts(postsEn, postsTr);
  await seedEvents(eventsEn, eventsTr);
  const listingCount = await seedListings();

  console.log(`Seeded ${postsEn.length} blog posts, ${eventsEn.length} events, and ${listingCount} listings.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
