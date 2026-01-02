import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/features/shared/components/Header';
import Footer from '@/features/shared/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';

// Form Schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  type_id: z.string().min(1, "Please select an entity type."),
  description: z.string().min(10, "Description must be at least 10 characters.").optional().or(z.literal('')),
  website: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  linkedin: z.string().url("Please enter a valid LinkedIn URL.").optional().or(z.literal('')),
  wilaya_id: z.string().optional(),
  founded_year: z.string().regex(/^\d{4}$/, "Must be a 4-digit year").optional().or(z.literal('')),
});

type EntityType = { id: string; name: string; };
type Wilaya = { id: string; name: string; code: string; };

const SubmitEntityPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: entityTypes } = useQuery({
    queryKey: ['entity_types'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('api?task=get-lookups&table=entity_types', {
        method: 'GET'
      });
      if (error) throw error;
      return data as EntityType[];
    }
  });

  const { data: wilayas } = useQuery({
    queryKey: ['wilayas'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('api?task=get-lookups&table=wilayas', {
        method: 'GET'
      });
      if (error) throw error;
      return data as Wilaya[];
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type_id: "",
      description: "",
      website: "",
      linkedin: "",
      wilaya_id: "null",
      founded_year: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const slug = values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substr(2, 4);

      const payload = {
        name: values.name,
        slug: slug,
        type_id: values.type_id,
        description: values.description || null,
        website: values.website || null,
        linkedin: values.linkedin || null,
        wilaya_id: values.wilaya_id === 'null' ? null : values.wilaya_id,
        founded_year: values.founded_year ? parseInt(values.founded_year) : null,
        status: 'pending'
      };

      const { error } = await supabase.functions.invoke('api', {
        body: { task: 'submit-entity', ...payload }
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    },
    onError: (error) => {
      toast.error(`Submission failed: ${error.message}`);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitMutation.mutate(values);
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Submission Received!</h1>
          <p className="text-muted-foreground max-w-md mb-8">
            Thank you for contributing to the Algeria Ecosystem. Your submission has been sent for review and will be listed once approved.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>Submit Another</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container max-w-2xl py-8 px-4 flex-1">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Submit a New Entry</h1>
          <p className="text-muted-foreground">
            Help us grow the ecosystem by adding missing startups, incubators, or communities.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Entity Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {entityTypes?.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wilaya_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="null">National / Online</SelectItem>
                          {wilayas?.map(w => (
                            <SelectItem key={w.id} value={w.id}>{w.code} - {w.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Briefly describe the entity..." className="resize-none" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="founded_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Founded Year</FormLabel>
                    <FormControl>
                      <Input placeholder="YYYY" maxLength={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
                {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Approval
              </Button>
            </form>
          </Form>
        </div>
      </main>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default SubmitEntityPage;
