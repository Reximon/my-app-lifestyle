export interface Assignment {
  id: string;
  title: string;
  course: string;        // materia
  type: 'assignment' | 'project';
  status: 'pendiente' | 'entregado' | 'revisado';
  dueDate?: string;
  description?: string;
  createdAt: string;
}
