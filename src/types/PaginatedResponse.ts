export class PaginatedResponse<T> {
  data: T[];
  moreAvailable: boolean;

  constructor(d: T[], more: boolean) {
    this.data = d;
    this.moreAvailable = more;
  }
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  cursor: number | null;
}
