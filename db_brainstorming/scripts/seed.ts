
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');

// Try to get env vars
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. check .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function readJson(filename: string) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    console.log(`Loaded ${data.length} items from ${filename}`);
    return data;
  } catch (err) {
    console.error(`Failed to read ${filename} at ${filePath}:`, err);
    return [];
  }
}

async function seed() {
  console.log("Seeding database...");

  // 1. Entity Types
  console.log("Seeding Entity Types...");
  const entityTypes = [
    { slug: 'startup', name: 'Startup' },
    { slug: 'incubator', name: 'Incubator' },
    { slug: 'accelerator', name: 'Accelerator' },
    { slug: 'coworking-space', name: 'Coworking Space' },
    { slug: 'media', name: 'Media' },
    { slug: 'community', name: 'Community' },
    { slug: 'event', name: 'Event' },
    { slug: 'resource', name: 'Resource' },
    { slug: 'job_portal', name: 'Job Portal' }
  ];

  for (const type of entityTypes) {
    const { error } = await supabase.from('entity_types').upsert(type, { onConflict: 'slug' });
    if (error) console.error(`Error inserting entity type ${type.slug}:`, error);
  }

  // Load Entity Types Map (slug -> id)
  const { data: dbEntityTypes } = await supabase.from('entity_types').select('id, slug');
  const entityTypeMap = new Map(dbEntityTypes?.map(t => [t.slug, t.id]));

  // 2. Categories
  console.log("Seeding Categories...");
  const categoriesData = await readJson('startup_categories.json');
  for (const cat of categoriesData) {
    const { error } = await supabase.from('categories').upsert({
      slug: cat.id,
      name: cat.name
    }, { onConflict: 'slug' });
    if (error) console.error(`Error inserting category ${cat.id}:`, error);
  }

  // Load Categories Map (slug -> id)
  const { data: dbCategories } = await supabase.from('categories').select('id, slug');
  const categoryMap = new Map(dbCategories?.map(c => [c.slug, c.id]));

  // 3. Wilayas
  console.log("Seeding Wilayas...");
  const wilayasData = await readJson('wilayas.json');
  for (const w of wilayasData) {
    const { error } = await supabase.from('wilayas').upsert({
      code: w.code,
      name: w.name,
      slug: w.slug
    }, { onConflict: 'slug' });
    if (error) console.error(`Error inserting wilaya ${w.slug}:`, error);
  }

  // Load Wilayas Map (slug -> id)
  const { data: dbWilayas } = await supabase.from('wilayas').select('id, slug');
  const wilayaMap = new Map(dbWilayas?.map(w => [w.slug, w.id]));

  // 4. Media Types
  console.log("Seeding Media Types...");
  const mediaCategoriesData = await readJson('media_category.json');
  const mediaTypeSlugMap: Record<number, string> = { 1: 'podcast', 2: 'video', 3: 'newsletter' };

  for (const mc of mediaCategoriesData) {
    const slug = mediaTypeSlugMap[mc.id] || `type-${mc.id}`;
    const { error } = await supabase.from('media_types').upsert({
      slug: slug,
      name: mc.name,
      icon_emoji: mc.icon
    }, { onConflict: 'slug' });
    if (error) console.error(`Error inserting media type ${slug}:`, error);
  }

  // Load Media Types Map (slug -> id)
  const { data: dbMediaTypes } = await supabase.from('media_types').select('id, slug');
  const mediaTypeMap = new Map(dbMediaTypes?.map(m => [m.slug, m.id]));

  // HELPER: Upsert Entity
  async function upsertEntity(entityData: any, typeSlug: string, extraData: any = {}) {
    const typeId = entityTypeMap.get(typeSlug);
    if (!typeId) {
      console.error(`Unknown entity type: ${typeSlug}`);
      return null;
    }

    // Generate slug from name if not present (simple slugify)
    const slug = entityData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Resolve Wilaya
    let wilayaId = null;
    if (entityData.wilaya) {
      // entityData.wilaya is the slug from our rewrite script
      wilayaId = wilayaMap.get(entityData.wilaya);
    }

    const payload = {
      slug: slug,
      type_id: typeId,
      wilaya_id: wilayaId,
      name: entityData.name,
      description: entityData.description,
      website: entityData.website,
      linkedin: entityData.linkedin,
      founded_year: entityData.founded_year ? parseInt(entityData.founded_year) : null,
      map_location: entityData.map_location,
      image_url: entityData.image_url,
      ...extraData
    };

    // Remove undefined/nulls if needed? SQL handles nulls.

    const { data, error } = await supabase.from('entities').upsert(payload, { onConflict: 'slug' }).select('id').single();
    if (error) {
      console.error(`Error upserting entity ${entityData.name} (${slug}):`, error.message);
      return null;
    }
    return data.id;
  }

  // 5. Seed Entities by Type

  // Startups
  console.log("Seeding Startups...");
  const startups = await readJson('startups.json');
  for (const s of startups) {
    const entityId = await upsertEntity(s, 'startup');
    if (entityId && s.categories && Array.isArray(s.categories)) {
      // Link Categories
      for (const catSlug of s.categories) {
        const catId = categoryMap.get(catSlug);
        if (catId) {
          await supabase.from('entity_categories').upsert({
            entity_id: entityId,
            category_id: catId
          }, { onConflict: 'entity_id,category_id' as any }); // composite key
        }
      }
    }
  }

  // Media
  console.log("Seeding Media...");
  const media = await readJson('media.json');
  for (const m of media) {
    const entityId = await upsertEntity(m, 'media');
    if (entityId && m.media_type) {
      const mediaTypeId = mediaTypeMap.get(m.media_type);
      if (mediaTypeId) {
        await supabase.from('entity_media_types').upsert({
          entity_id: entityId,
          media_type_id: mediaTypeId
        }, { onConflict: 'entity_id,media_type_id' as any });
      }
    }
  }

  // Incubators
  console.log("Seeding Incubators...");
  const incubators = await readJson('incubators.json');
  for (const i of incubators) await upsertEntity(i, 'incubator');

  // Accelerators
  console.log("Seeding Accelerators...");
  const accelerators = await readJson('accelerators.json');
  for (const a of accelerators) await upsertEntity(a, 'accelerator');

  // Coworking
  console.log("Seeding Coworking...");
  const coworking = await readJson('coworking-spaces.json');
  for (const c of coworking) await upsertEntity(c, 'coworking-space');

  // Communities
  console.log("Seeding Communities...");
  const communities = await readJson('communities.json');
  for (const c of communities) await upsertEntity(c, 'community');

  // Events
  console.log("Seeding Events...");
  const events = await readJson('events.json');
  for (const e of events) await upsertEntity(e, 'event');

  // Resources
  console.log("Seeding Resources...");
  const resources = await readJson('resources.json');
  for (const r of resources) await upsertEntity(r, 'resource');

  // Job Portals
  console.log("Seeding Job Portals...");
  const jobs = await readJson('jobs.json');
  for (const j of jobs) await upsertEntity(j, 'job_portal');

  console.log("Seeding complete!");
}

seed().catch(e => console.error(e));
