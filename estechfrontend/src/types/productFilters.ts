export interface Filter {
    id: number;
    name: string;
    values: string[];
}

export interface Filters {
    [key: string]: string[];
}

export interface Range {
    min: number;
    max: number;
}
