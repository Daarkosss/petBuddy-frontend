export type SortDTO = {
  direction: string;
  nullHandling: string;
  ascending: boolean;
  property: string;
  ignoreCase: boolean;
}

export type PageableDTO = {
  offset: number;
  sort: SortDTO[];
  paged: boolean;
  pageSize: number;
  pageNumber: number;
  unpaged: boolean;
}
  