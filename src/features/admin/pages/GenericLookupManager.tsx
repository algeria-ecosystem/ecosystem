import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DataTable } from '../components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface GenericItem {
  id: string;
  slug: string;
  name: string;
  [key: string]: any;
}

interface GenericLookupManagerProps {
  tableName: string; // 'categories', 'media_types', 'wilayas'
  title: string;
  fields?: { key: string, label: string, type?: 'text' | 'number' }[];
}

const GenericLookupManager = ({ tableName, title, fields = [] }: GenericLookupManagerProps) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GenericItem | null>(null);
  const [formData, setFormData] = useState<any>({ name: '', slug: '' });

  // Fetch
  const { data: items, isLoading } = useQuery({
    queryKey: [`admin_${tableName}`],
    queryFn: async () => {
      // For tables with different ID types or structures, we might need adjustments
      // Assuming categories, media_types, wilayas all have UUID id, name, slug.
      const query = supabase.from(tableName).select('*').order('name');
      const { data, error } = await query;
      if (error) throw error;
      return data as GenericItem[];
    }
  });

  // Mutations
  const upsertMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from(tableName as any).upsert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`admin_${tableName}`] });
      toast.success("Item saved successfully");
      handleCloseDialog();
    },
    onError: (error) => toast.error(`Error: ${error.message}`)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(tableName as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`admin_${tableName}`] });
      toast.success("Item deleted");
    },
    onError: (error) => toast.error(`Error: ${error.message}`)
  });

  // Handlers
  const handleAdd = () => {
    setEditingItem(null);
    const initialData: any = { name: '', slug: '' };
    fields.forEach(f => initialData[f.key] = '');
    setFormData(initialData);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: GenericItem) => {
    setEditingItem(item);
    const data: any = { name: item.name, slug: item.slug };
    fields.forEach(f => data[f.key] = item[f.key]);
    setFormData(data);
    setIsDialogOpen(true);
  };

  const handleDelete = (item: GenericItem) => {
    deleteMutation.mutate(item.id);
  };

  const handleSave = () => {
    if (!formData.name || !formData.slug) {
      toast.error("Name and Slug are required");
      return;
    }
    upsertMutation.mutate({
      id: editingItem?.id, // undefined for new, set for edit
      ...formData
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({ name: '', slug: '' });
  };

  const generateSlug = (name: string) => {
    if (!name) return '';
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  // Default columns
  const columns = [
    { key: 'name' as const, header: 'Name' },
    { key: 'slug' as const, header: 'Slug', render: (item: any) => <code className="bg-muted px-2 py-1 rounded text-xs">{item.slug}</code> },
    ...fields.map(f => ({ key: f.key, header: f.label })),
    { key: 'actions' as const, header: 'Actions' }
  ];

  return (
    <div>
      <DataTable
        title={title}
        data={items || []}
        isLoading={isLoading}
        searchKey="name"
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev: any) => ({ ...prev, name: val, slug: !editingItem ? generateSlug(val) : prev.slug }));
                }}
                placeholder="Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, slug: e.target.value }))}
                placeholder="slug-value"
              />
            </div>
            {fields.map(field => (
              <div className="space-y-2" key={field.key}>
                <Label htmlFor={field.key}>{field.label}</Label>
                <Input
                  id={field.key}
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.label}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} disabled={upsertMutation.isPending}>
              {upsertMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default GenericLookupManager;
