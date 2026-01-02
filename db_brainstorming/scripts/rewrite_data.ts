
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');

const WILAYAS = [
  { code: 1, name: "Adrar", slug: "adrar" },
  { code: 2, name: "Chlef", slug: "chlef" },
  { code: 3, name: "Laghouat", slug: "laghouat" },
  { code: 4, name: "Oum El Bouaghi", slug: "oum-el-bouaghi" },
  { code: 5, name: "Batna", slug: "batna" },
  { code: 6, name: "Béjaïa", slug: "bejaia" },
  { code: 7, name: "Biskra", slug: "biskra" },
  { code: 8, name: "Béchar", slug: "bechar" },
  { code: 9, name: "Blida", slug: "blida" },
  { code: 10, name: "Bouira", slug: "bouira" },
  { code: 11, name: "Tamanrasset", slug: "tamanrasset" },
  { code: 12, name: "Tébessa", slug: "tebessa" },
  { code: 13, name: "Tlemcen", slug: "tlemcen" },
  { code: 14, name: "Tiaret", slug: "tiaret" },
  { code: 15, name: "Tizi Ouzou", slug: "tizi-ouzou" },
  { code: 16, name: "Algiers", slug: "algiers" },
  { code: 17, name: "Djelfa", slug: "djelfa" },
  { code: 18, name: "Jijel", slug: "jijel" },
  { code: 19, name: "Sétif", slug: "setif" },
  { code: 20, name: "Saïda", slug: "saida" },
  { code: 21, name: "Skikda", slug: "skikda" },
  { code: 22, name: "Sidi Bel Abbès", slug: "sidi-bel-abbes" },
  { code: 23, name: "Annaba", slug: "annaba" },
  { code: 24, name: "Guelma", slug: "guelma" },
  { code: 25, name: "Constantine", slug: "constantine" },
  { code: 26, name: "Médéa", slug: "medea" },
  { code: 27, name: "Mostaganem", slug: "mostaganem" },
  { code: 28, name: "M'Sila", slug: "msila" },
  { code: 29, name: "Mascara", slug: "mascara" },
  { code: 30, name: "Ouargla", slug: "ouargla" },
  { code: 31, name: "Oran", slug: "oran" },
  { code: 32, name: "El Bayadh", slug: "el-bayadh" },
  { code: 33, name: "Illizi", slug: "illizi" },
  { code: 34, name: "Bordj Bou Arréridj", slug: "bordj-bou-arreridj" },
  { code: 35, name: "Boumerdès", slug: "boumerdes" },
  { code: 36, name: "El Tarf", slug: "el-tarf" },
  { code: 37, name: "Tindouf", slug: "tindouf" },
  { code: 38, name: "Tissemsilt", slug: "tissemsilt" },
  { code: 39, name: "El Oued", slug: "el-oued" },
  { code: 40, name: "Khenchela", slug: "khenchela" },
  { code: 41, name: "Souk Ahras", slug: "souk-ahras" },
  { code: 42, name: "Tipaza", slug: "tipaza" },
  { code: 43, name: "Mila", slug: "mila" },
  { code: 44, name: "Aïn Defla", slug: "ain-defla" },
  { code: 45, name: "Naâma", slug: "naama" },
  { code: 46, name: "Aïn Témouchent", slug: "ain-temouchent" },
  { code: 47, name: "Ghardaïa", slug: "ghardaia" },
  { code: 48, name: "Relizane", slug: "relizane" },
  { code: 49, name: "Timimoun", slug: "timimoun" },
  { code: 50, name: "Bordj Badji Mokhtar", slug: "bordj-badji-mokhtar" },
  { code: 51, name: "Ouled Djellal", slug: "ouled-djellal" },
  { code: 52, name: "Béni Abbès", slug: "beni-abbes" },
  { code: 53, name: "In Salah", slug: "in-salah" },
  { code: 54, name: "In Guezzam", slug: "in-guezzam" },
  { code: 55, name: "Touggourt", slug: "touggourt" },
  { code: 56, name: "Djanet", slug: "djanet" },
  { code: 57, name: "El M'Ghair", slug: "el-mghair" },
  { code: 58, name: "El Meniaa", slug: "el-meniaa" }
];

const MEDIA_CATEGORIES = {
  1: 'podcast',
  2: 'video',
  3: 'newsletter'
};

async function readJson(filename: string) {
  const raw = await fs.readFile(path.join(DATA_DIR, filename), 'utf-8');
  return JSON.parse(raw);
}

async function writeJson(filename: string, data: any) {
  await fs.writeFile(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8');
}

function resolveWilaya(cityName: string) {
  if (!cityName) return null;
  const normalizedCity = cityName.trim().toLowerCase();
  const match = WILAYAS.find(w => w.name.toLowerCase() === normalizedCity);
  return match ? match.slug : null; // return slug or null
}

async function main() {
  console.log("Rewriting JSON files...");

  // 1. Wilayas (Create new file)
  await fs.writeFile(path.join(DATA_DIR, 'wilayas.json'), JSON.stringify(WILAYAS, null, 2));

  // 2. Startups
  try {
    const startups = await readJson('startups.json');
    const newStartups = startups.map((s: any) => ({
      name: s.name,
      founded_year: s.foundedYear || s.founded_year,
      categories: s.categoryIds || s.categories, // keep as array of slugs
      website: s.website,
      linkedin: s.linkedin,
      // type: 'startup' // implicit
    }));
    await fs.writeFile(path.join(DATA_DIR, 'startups.json'), JSON.stringify(newStartups, null, 2));
    console.log("Updated startups.json");
  } catch (e) {
    console.error("Error processing startups.json", e);
  }

  // 3. Media
  try {
    const media = await readJson('media.json');
    const newMedia = media.map((m: any) => ({
      name: m.title || m.name,
      media_type: MEDIA_CATEGORIES[m.categoryId as keyof typeof MEDIA_CATEGORIES] || m.media_type || 'other',
      description: m.description,
      website: m.url,
      image_url: m.image
    }));
    await fs.writeFile(path.join(DATA_DIR, 'media.json'), JSON.stringify(newMedia, null, 2));
    console.log("Updated media.json");
  } catch (e) {
    console.error("Error processing media.json", e);
  }

  // 4. Incubators
  try {
    const incubators = await readJson('incubators.json');
    const newIncubators = incubators.map((i: any) => ({
      name: i.name,
      founded_year: i.foundedYear,
      website: i.website,
      linkedin: i.linkedin,
      wilaya: resolveWilaya(i.city) || i.city, // slug or original name
      map_location: i.mapLocation
    }));
    await fs.writeFile(path.join(DATA_DIR, 'incubators.json'), JSON.stringify(newIncubators, null, 2));
    console.log("Updated incubators.json");
  } catch (e) {
    console.error("Error processing incubators.json", e);
  }

  // 5. Accelerators
  try {
    const accelerators = await readJson('accelerators.json');
    const newAccelerators = accelerators.map((i: any) => ({
      name: i.name,
      founded_year: i.foundedYear,
      description: i.description,
      website: i.website,
      linkedin: i.linkedin,
      wilaya: resolveWilaya(i.city) || i.city,
      map_location: i.mapLocation
    }));
    await fs.writeFile(path.join(DATA_DIR, 'accelerators.json'), JSON.stringify(newAccelerators, null, 2));
    console.log("Updated accelerators.json");
  } catch (e) {
    console.error("Error processing accelerators.json", e);
  }

  // 6. Coworking Spaces
  try {
    const coworking = await readJson('coworking-spaces.json');
    const newCoworking = coworking.map((i: any) => ({
      name: i.name,
      founded_year: i.foundedYear,
      website: i.website,
      linkedin: i.linkedin,
      wilaya: resolveWilaya(i.city) || i.city,
      map_location: i.mapLocation
    }));
    await fs.writeFile(path.join(DATA_DIR, 'coworking-spaces.json'), JSON.stringify(newCoworking, null, 2));
    console.log("Updated coworking-spaces.json");
  } catch (e) {
    console.error("Error processing coworking-spaces.json", e);
  }

  // 7. Communities
  try {
    const communities = await readJson('communities.json');
    const newCommunities = communities.map((c: any) => ({
      name: c.name,
      description: c.description,
      website: c.url
    }));
    await fs.writeFile(path.join(DATA_DIR, 'communities.json'), JSON.stringify(newCommunities, null, 2));
    console.log("Updated communities.json");
  } catch (e) {
    console.error("Error processing communities.json", e);
  }

  // 8. Events
  try {
    const events = await readJson('events.json');
    const newEvents = events.map((e: any) => ({
      name: e.name,
      description: e.description,
      website: e.url
    }));
    await fs.writeFile(path.join(DATA_DIR, 'events.json'), JSON.stringify(newEvents, null, 2));
    console.log("Updated events.json");
  } catch (e) {
    console.error("Error processing events.json", e);
  }

  // 9. Resources
  try {
    const resources = await readJson('resources.json');
    const newResources = resources.map((r: any) => ({
      name: r.name,
      description: r.description,
      website: r.url
    }));
    await fs.writeFile(path.join(DATA_DIR, 'resources.json'), JSON.stringify(newResources, null, 2));
    console.log("Updated resources.json");
  } catch (e) {
    console.error("Error processing resources.json", e);
  }

  // 10. Jobs
  try {
    const jobs = await readJson('jobs.json');
    const newJobs = jobs.map((j: any) => ({
      name: j.name,
      description: j.description,
      website: j.url
    }));
    await fs.writeFile(path.join(DATA_DIR, 'jobs.json'), JSON.stringify(newJobs, null, 2));
    console.log("Updated jobs.json");
  } catch (e) {
    console.error("Error processing jobs.json", e);
  }
}

main();
