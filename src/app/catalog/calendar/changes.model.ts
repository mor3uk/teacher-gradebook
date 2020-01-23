import { Lesson } from '../../shared/models/lesson.model';

export interface Changes {
  add: Lesson[];
  delete: string[];
}
