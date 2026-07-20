export interface Task {
  id: string;
  type: 'tarea' | 'clase' | 'topic' | 'nota' | 'assignment';
  title: string;
  description?: string;
  status: 'pendiente' | 'en progreso' | 'completado';
  color?: string;
  dueDate?: string;
  createdAt: string;
  googleEventId?: string;
}
