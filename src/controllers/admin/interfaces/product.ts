export interface ProductIdsReq {
  titleKeyword: string;
}
export interface ProductInfosReq {
  productIds: number[];
}
export interface ProductInfoByKeywordReq {
  keyword: string[];
  isActive: boolean;
}
