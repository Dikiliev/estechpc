export interface PaginatedResponse<T> {
    count: number;
    page_size: number;
    total_pages: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
