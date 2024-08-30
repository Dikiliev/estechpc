export interface ICategory {
    id: number;
    name: string;
    parent: ICategory | null;
    image: string | null;
    order: number;
}

export type ISortOrder = 'order' | 'asc' | 'desc';
