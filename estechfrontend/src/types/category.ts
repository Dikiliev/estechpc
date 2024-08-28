export interface Category {
    id: number;
    parent: Category | null;
    name: string;
    image: string | null;
}

export interface ParentCategory {
    id: number;
    name: string;
}

export interface ChildCategory {
    id: number;
    name: string;
}
