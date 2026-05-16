export type Priority = 'low' | 'medium' | 'high';

export type FilterType = 'all' | 'active' | 'completed';

export interface ITodo {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
}
