import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '../components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from 'sonner';
import { Loader2, Plus, X } from 'lucide-react';
import type { Entity, Wilaya, EntityType, Category, MediaType } from '@/shared/types/entity';

// Define a type for editing that extends the Entity type but allows for form state
interface EntityFormData {
  name: string;
  slug: string;
  type_id: string;
  wilaya_id: string; // can be "null" or uuid
  description: string;
  website: string;
  linkedin: string;
  founded_year: string;
  map_location: string;
  image_url: string;
  status: 'pending' | 'approved' | 'rejected';
}

const EntitiesManager = () => {
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Entity | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'pending'>('all'); // Filter state
  const [formData, setFormData] = useState<EntityFormData>({
    name: '',
    slug: '',
    type_id: '',
    wilaya_id: 'null',
    description: '',
    website: '',
    linkedin: '',
    founded_year: '',
    map_location: '',
    image_url: '',
    status: 'approved'
  });

  // --- Data Fetching ---

  // Entities
  const { data: entities, isLoading } = useQuery({
    queryKey: ['admin_entities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entities')
        .select(`
                    *,
                    wilaya:wilayas(name),
                    type:entity_types(name)
                `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Entity[];
    }
  });

  // Filter entities based on viewMode
  const displayedEntities = entities?.filter(e =>
    viewMode === 'pending' ? e.status === 'pending' : true
  ) || [];

  // Metadata for dropdowns
  const { data: wilayas } = useQuery({
    queryKey: ['wilayas_lookup'],
    queryFn: async () => {
      const { data } = await supabase.from('wilayas').select('id, name, code').order('code');
      return data as Wilaya[];
    }
  });

  const { data: entityTypes } = useQuery({
    queryKey: ['entity_types_lookup'],
    queryFn: async () => {
      const { data } = await supabase.from('entity_types').select('id, name');
      return data as EntityType[];
    }
  });

  // --- Mutations ---

  const upsertMutation = useMutation({
    mutationFn: async (data: any) => {
      // Clean up empty strings to null or numbers
      const payload = {
        ...data,
        founded_year: data.founded_year ? parseInt(data.founded_year) : null,
        wilaya_id: data.wilaya_id === 'null' || !data.wilaya_id ? null : data.wilaya_id,
        // Use provided status or default to 'approved' if creating new admin entry
        status: data.status || 'approved'
      };

      const { error } = await supabase.from('entities').upsert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_entities'] });
      toast.success("Entity saved successfully");
      handleCloseSheet();
    },
    onError: (error) => toast.error(`Error: ${error.message}`)
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('entities').update({ status: 'approved' }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_entities'] });
      toast.success("Entity approved");
    },
    onError: (error) => toast.error(`Error: ${error.message}`)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('entities').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_entities'] });
      toast.success("Entity deleted");
    },
    onError: (error) => toast.error(`Error: ${error.message}`)
  });

  // --- Handlers ---

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '', slug: '', type_id: entityTypes?.[0]?.id || '', wilaya_id: 'null',
      description: '', website: '', linkedin: '', founded_year: '', map_location: '', image_url: '',
      status: 'approved'
    });
    setIsSheetOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      type_id: item.type_id || '',
      wilaya_id: item.wilaya_id || 'null',
      description: item.description || '',
      website: item.website || '',
      linkedin: item.linkedin || '',
      founded_year: item.founded_year ? String(item.founded_year) : '',
      map_location: item.map_location || '',
      image_url: item.image_url || '',
      status: item.status || 'approved'
    });
    setIsSheetOpen(true);
  };

  const handleDelete = (item: Entity) => {
    deleteMutation.mutate(item.id);
  };

  const handleApprove = (item: Entity) => {
    approveMutation.mutate(item.id);
  };

  const handleSave = () => {
    if (!formData.name || !formData.slug || !formData.type_id) {
      toast.error("Name, Slug, and Category Type are required");
      return;
    }
    upsertMutation.mutate({
      id: editingItem?.id,
      ...formData
    });
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingItem(null);
  };

  const generateSlug = (name: string) => {
    if (!name) return '';
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // --- UI ---

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button
          variant={viewMode === 'all' ? 'default' : 'outline'}
          onClick={() => setViewMode('all')}
        >
          All Entities
        </Button>
        <Button
          variant={viewMode === 'pending' ? 'default' : 'outline'}
          onClick={() => setViewMode('pending')}
          className="relative"
        >
          Pending Approvals
          {entities && entities.filter(e => e.status === 'pending').length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {entities.filter(e => e.status === 'pending').length}
            </span>
          )}
        </Button>
      </div>

      <DataTable
        title={viewMode === 'pending' ? 'Pending Approvals' : 'Entities'}
        data={displayedEntities}
        isLoading={isLoading}
        searchKey="name"
        columns={[
          { key: 'name', header: 'Name' },
          {
            key: 'status', header: 'Status', render: (item: any) => (
              <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-800'
                }`}>
                {item.status || 'approved'}
              </span>
            )
          },
          { key: 'type', header: 'Type', render: (item: any) => <span className="text-sm font-medium">{item.type?.name}</span> },
          { key: 'wilaya', header: 'Wilaya', render: (item: any) => <span className="text-sm">{item.wilaya?.name || '-'}</span> },
          {
            key: 'moderation', header: 'Review', render: (item: Entity) => item.status === 'pending' ? (
              <Button size="sm" variant="outline" className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 dark:border-green-800" onClick={() => handleApprove(item)}>
                Approve
              </Button>
            ) : null
          },
          { key: 'actions', header: 'Actions' }
        ]}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete as any}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingItem ? 'Edit Entity' : 'Add Entity'}</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Status for Admin Control */}
            <div className="bg-muted/50 p-4 rounded-lg border">
              <Label className="mb-2 block">Moderation Status</Label>
              <Select value={formData.status} onValueChange={(val: any) => setFormData(prev => ({ ...prev, status: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData(prev => ({ ...prev, name: val, slug: !editingItem ? generateSlug(val) : prev.slug }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" value={formData.slug} onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} />
              </div>
            </div>

            {/* Classification */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type_id">Entity Type *</Label>
                <Select value={formData.type_id} onValueChange={(val) => setFormData(prev => ({ ...prev, type_id: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypes?.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wilaya_id">Wilaya</Label>
                <Select value={formData.wilaya_id} onValueChange={(val) => setFormData(prev => ({ ...prev, wilaya_id: val }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select wilaya" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">None (National/Digital)</SelectItem>
                    {wilayas?.map(w => (
                      <SelectItem key={w.id} value={w.id}>{w.code} - {w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="founded_year">Founded Year</Label>
                <Input
                  id="founded_year"
                  type="number"
                  value={formData.founded_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, founded_year: e.target.value }))}
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                />
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground border-b pb-1">External Links</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="map_location">Map Location URL</Label>
                  <Input
                    id="map_location"
                    value={formData.map_location}
                    onChange={(e) => setFormData(prev => ({ ...prev, map_location: e.target.value }))}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={handleCloseSheet}>Cancel</Button>
            <Button onClick={handleSave} disabled={upsertMutation.isPending}>
              {upsertMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Entity
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default EntitiesManager;
