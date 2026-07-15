export interface Objective {
  id: string;
  scope: 'daily' | 'weekly' | 'semester';
  title: string;
  description?: string;
  status: 'pendiente' | 'completado';
  createdAt: string;
  dueDate?: string;
}
