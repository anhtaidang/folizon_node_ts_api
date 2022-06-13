export interface CategoryDTO {
    id:number,
    parentId:number,
    name:string,
    urlRewrite:string,
    description: string,
    imageThumb: string,
    imageBanner: string,
    hashTags: string,
    isActive:boolean,
    createdBy: number,
    createdTime: number
    updatedBy: number
    updatedTime: number
}


export type CreateCategoryDTO = Omit<CategoryDTO, 'id' | 'updatedBy' | 'updatedTime'>;
export type UpdateCategoryDTO = Omit<CategoryDTO, 'createdBy' | 'createdTime'>;