export interface CategoryGetTreeReq {
  parentId: number;
  id?: number | null;
}

export interface CategoryGetIdsReq {
  id: number;
  name: string;
  parentId: number;
}

export interface CategoryGetInfosReq {
  categoryIds: number[];
}
