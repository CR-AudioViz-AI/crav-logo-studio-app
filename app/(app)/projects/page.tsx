'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical, Trash2, Copy, Share2, FolderOpen } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/lib/store';
import { Project } from '@/lib/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ProjectsPage() {
  const { user } = useAppStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user!.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          owner_id: user!.id,
          title: `New Project ${projects.length + 1}`,
          visibility: 'PRIVATE',
          status: 'DRAFT',
        })
        .select()
        .single();

      if (error) throw error;

      const defaultSvg = '<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="#f0f0f0"/></svg>';

      await supabase.from('revisions').insert({
        project_id: data.id,
        svg: defaultSvg,
        editor_state: {},
        notes: 'Initial revision',
      });

      toast.success('Project created!');
      loadProjects();
    } catch (error: any) {
      toast.error('Failed to create project');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Project deleted');
      loadProjects();
    } catch (error: any) {
      toast.error('Failed to delete project');
    }
  };

  const duplicateProject = async (project: Project) => {
    try {
      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert({
          owner_id: user!.id,
          title: `${project.title} (Copy)`,
          visibility: project.visibility,
          status: 'DRAFT',
        })
        .select()
        .single();

      if (projectError) throw projectError;

      const { data: revisions } = await supabase
        .from('revisions')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (revisions && revisions.length > 0) {
        await supabase.from('revisions').insert({
          project_id: newProject.id,
          svg: revisions[0].svg,
          editor_state: revisions[0].editor_state,
          notes: 'Duplicated from original project',
        });
      }

      toast.success('Project duplicated');
      loadProjects();
    } catch (error: any) {
      toast.error('Failed to duplicate project');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-slate-600 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={createProject} className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
            <p className="text-slate-600 mb-6">
              Create your first logo project to get started
            </p>
            <Button onClick={createProject} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg truncate">{project.title}</h3>
                  <p className="text-sm text-slate-500">
                    Updated {format(new Date(project.updated_at), 'MMM d, yyyy')}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => duplicateProject(project)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteProject(project.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-slate-400 text-sm">Preview</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{project.status}</Badge>
                  <Badge variant="outline">{project.visibility}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/editor/${project.id}`} className="w-full">
                  <Button className="w-full">Open Editor</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
