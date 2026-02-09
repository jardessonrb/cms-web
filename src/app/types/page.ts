export interface Page<T> {
  totalElements: number;
  totalPages: number;
  content: T[];
}
