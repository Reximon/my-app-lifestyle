export interface ClassNote {
  id: string;
  course: string;     // 'AWS' | 'Clases de conducir' | etc.
  title: string;
  content: string;    // texto largo o markdown
  createdAt: string;
  updatedAt?: string;
}
