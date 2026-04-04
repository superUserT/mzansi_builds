import { fetchClient } from './fetchClient';

export interface CreateProjectPayload {
  title: string;
  description: string;
  stage: 'Ideation' | 'Prototyping' | 'MVP' | 'Scaling';
  supportRequired?: string[];
  githubLink?: string;
  liveLink?: string;
}

export const projectsApi = {
  // Create a new project
  createProject: async (data: CreateProjectPayload) => {
    return fetchClient('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProjects: async () => {
    return fetchClient('/projects');
  },

  addMilestone: async (projectId: string, description: string) => {
    return fetchClient(`/projects/${projectId}/milestones`, {
      method: 'POST',
      body: JSON.stringify({ description }),
    });
  },

  completeProject: async (projectId: string) => {
    return fetchClient(`/projects/${projectId}/complete`, {
      method: 'PATCH',
    });
  }
};