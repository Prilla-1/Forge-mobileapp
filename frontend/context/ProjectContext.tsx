import React, { createContext, useContext, useState } from 'react';
import { mockProjects } from '../mockProjects';

// Activity type
export type Activity = {
  id: string;
  type: 'comment' | 'reply' | 'favorite';
  projectId: string;
  text?: string;
  author?: string;
  date: string; // e.g. '2025-07-23'
  time?: string; // e.g. '14:32'
  replyTo?: string; // For reply activities, store the original comment author
};

// Project type
export type Project = typeof mockProjects[0] & {
  comments: Array<{ id: string; text: string; author: string; date: string; time?: string; liked?: boolean }>;
  favorite?: boolean;
};

// Context shape
interface ProjectContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  addComment: (projectId: string, comment: { text: string; author: string }) => void;
  addReply: (projectId: string, reply: { text: string; author: string; replyTo: string }) => void;
  addActivity: (activity: Activity) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(
    mockProjects.map((p: any) => ({
      ...p,
      favorite: false,
      comments: p.comments?.map((c: any) => ({ ...c, liked: false })) || []
    }))
  );
  // Create initial activities from mock comments
  const initialActivities: Activity[] = [];
  mockProjects.forEach((project: any) => {
    (project.comments || []).forEach((comment: any) => {
      initialActivities.push({
        id: `a${comment.id}`,
        type: 'comment',
        projectId: project.id,
        text: comment.text,
        author: comment.author,
        date: comment.date,
        time: (comment as any).time || '',
      });
    });
  });
  const [activities, setActivities] = useState<Activity[]>(initialActivities.reverse());

  const addComment = (projectId: string, comment: { text: string; author: string }) => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);
    setProjects((prev: Project[]) => prev.map((p: Project) =>
      p.id === projectId
        ? {
            ...p,
            comments: [
              ...p.comments,
              {
                id: `c${Date.now()}`,
                text: comment.text,
                author: comment.author,
                date,
                time,
                liked: false,
              },
            ],
          }
        : p
    ));
    setActivities((prev: Activity[]) => [
      {
        id: `a${Date.now()}`,
        type: 'comment',
        projectId,
        text: comment.text,
        author: comment.author,
        date,
        time,
      },
      ...prev,
    ]);
  };

  const addReply = (projectId: string, reply: { text: string; author: string; replyTo: string }) => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);
    setProjects((prev: Project[]) => prev.map((p: Project) =>
      p.id === projectId
        ? {
            ...p,
            comments: p.comments.map((c: any) =>
              c.id === reply.replyTo
                ? {
                    ...c,
                    replies: [
                      ...(c.replies || []),
                      {
                        id: `r${Date.now()}`,
                        text: reply.text,
                        author: reply.author,
                        date,
                        time,
                        liked: false,
                      },
                    ],
                  }
                : c
            ),
          }
        : p
    ));
    setActivities((prev: Activity[]) => [
      {
        id: `a${Date.now()}`,
        type: 'reply',
        projectId,
        text: reply.text,
        author: reply.author,
        date,
        time,
        replyTo: reply.replyTo,
      },
      ...prev,
    ]);
  };

  const addActivity = (activity: Activity) => {
    setActivities((prev: Activity[]) => [activity, ...prev]);
  };

  return (
    <ProjectContext.Provider value={{ projects, setProjects, activities, setActivities, addComment, addReply, addActivity }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjectContext must be used within a ProjectProvider');
  return ctx;
}; 