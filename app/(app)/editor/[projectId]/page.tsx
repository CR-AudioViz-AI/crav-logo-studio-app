'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import {
  Save,
  Download,
  Wand2,
  Type,
  Square,
  Circle,
  Palette,
  Layers,
  Undo,
  Redo,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAppStore } from '@/lib/store';
import { Project, Revision } from '@/lib/types';
import { toast } from 'sonner';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAppStore();
  const [project, setProject] = useState<Project | null>(null);
  const [currentRevision, setCurrentRevision] = useState<Revision | null>(null);
  const [title, setTitle] = useState('');
  const [svgContent, setSvgContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && params.projectId) {
      loadProject();
    }
  }, [user, params.projectId]);

  const loadProject = async () => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.projectId)
        .single();

      if (projectError) throw projectError;

      if (projectData.owner_id !== user!.id) {
        toast.error('Access denied');
        router.push('/projects');
        return;
      }

      setProject(projectData);
      setTitle(projectData.title);

      const { data: revisions, error: revisionsError } = await supabase
        .from('revisions')
        .select('*')
        .eq('project_id', params.projectId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (revisionsError) throw revisionsError;

      if (revisions && revisions.length > 0) {
        setCurrentRevision(revisions[0]);
        setSvgContent(revisions[0].svg);
      }
    } catch (error: any) {
      toast.error('Failed to load project');
      router.push('/projects');
    } finally {
      setLoading(false);
    }
  };

  const saveProject = async () => {
    try {
      await supabase
        .from('projects')
        .update({
          title,
          updated_at: new Date().toISOString(),
        })
        .eq('id', params.projectId);

      await supabase.from('revisions').insert({
        project_id: params.projectId,
        svg: svgContent,
        editor_state: {},
        notes: 'Manual save',
      });

      toast.success('Project saved');
    } catch (error: any) {
      toast.error('Failed to save project');
    }
  };

  const downloadSVG = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('SVG downloaded');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="border-b bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="max-w-xs"
            placeholder="Project name"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Redo className="h-4 w-4" />
          </Button>
          <Button onClick={saveProject} size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button onClick={downloadSVG} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-64 border-r bg-white p-4 overflow-y-auto">
          <Tabs defaultValue="tools" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">AI Tools</h3>
                <Button className="w-full gap-2 mb-2">
                  <Wand2 className="h-4 w-4" />
                  Generate Logo
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Shapes</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Square className="h-4 w-4" />
                    Rectangle
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Circle className="h-4 w-4" />
                    Circle
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Text</h3>
                <Button variant="outline" className="w-full gap-2">
                  <Type className="h-4 w-4" />
                  Add Text
                </Button>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Color</h3>
                <Button variant="outline" className="w-full gap-2">
                  <Palette className="h-4 w-4" />
                  Color Picker
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="layers" className="space-y-2 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Layers</h3>
                <Layers className="h-4 w-4 text-slate-500" />
              </div>
              <Card className="p-3 text-sm text-slate-600">
                No layers yet
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1 bg-slate-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full aspect-square flex items-center justify-center">
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>
        </div>

        <div className="w-64 border-l bg-white p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold mb-3">Properties</h3>
          <p className="text-sm text-slate-600">
            Select an element to edit its properties
          </p>
        </div>
      </div>
    </div>
  );
}
