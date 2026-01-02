export interface EntityType {
  id: string;
  slug: string;
  name: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export interface MediaType {
  id: string;
  slug: string;
  name: string;
  icon_url?: string;
  icon_emoji?: string;
}

export interface Wilaya {
  id: string;
  code: number;
  name: string;
  slug: string;
}

export interface Entity {
  id: string;
  slug: string;
  type_id: string;
  wilaya_id?: string;
  name: string;
  description?: string;
  website?: string;
  linkedin?: string;
  founded_year?: number;
  map_location?: string;
  image_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  // Joins
  wilaya?: Wilaya;
  entity_categories?: { category: Category }[];
  entity_media_types?: { media_type: MediaType }[];
}
