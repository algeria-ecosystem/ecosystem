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

interface EntityType {
  id: string;
  slug: string;
  name: string;
}

const EntityTypesManager = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EntityType | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  // Fetch
  const { data: entityTypes, isLoading } = useQuery({
    queryKey: ['admin_entity_types'],
    queryFn: async () => {
      const { data, error } = await supabase.from('entity_types').select('*').order('name');
      if (error) throw error;
      return data as EntityType[];
    }
  });

  // Mutations
  const upsertMutation = useMutation({
    mutationFn: async (data: { id?: string, name: string, slug: string }) => {
      const { error } = await supabase.from('entity_types').upsert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_entity_types'] });
      toast.success("Entity type saved successfully");
      handleCloseDialog();
    },
    onError: (error) => toast.error(`Error: ${error.message}`)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('entity_types').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_entity_types'] });
      toast.success("Entity type deleted");
    },
    onError: (error) => toast.error(`Error: ${error.message}`)
  });

  // Handlers
  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', slug: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: EntityType) => {
    setEditingItem(item);
    setFormData({ name: item.name, slug: item.slug });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: EntityType) => {
    deleteMutation.mutate(item.id);
  };

  const handleSave = () => {
    if (!formData.name || !formData.slug) {
      toast.error("Please fill in all fields");
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
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  return (
    <div>
      <DataTable
        title="Entity Types"
        data={entityTypes || []}
        isLoading={isLoading}
        searchKey="name"
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'slug', header: 'Slug', render: (item) => <code className="bg-muted px-2 py-1 rounded text-xs">{item.slug}</code> },
          { key: 'actions', header: 'Actions' }
        ]}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Entity Type' : 'Add Entity Type'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData(prev => ({ ...prev, name: val, slug: !editingItem ? generateSlug(val) : prev.slug }));
                }}
                placeholder="e.g. Startup"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="e.g. startup"
              />
            </div>
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

export default EntityTypesManager;
