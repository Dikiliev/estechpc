import { ISortOrder } from '@admin/types/category';

export const filterData = <T>(data: T[], filterBy: string, filterFn: (item: T) => boolean): T[] => {
    if (filterBy === 'all') return data;
    return data.filter(filterFn);
};

export const sortData = <T extends { order: number }>(data: T[], sortOrder: ISortOrder, accessor: (item: T) => string): T[] => {
    if (sortOrder === 'order') {
        return data.sort((a, b) => a.order - b.order);
    }

    return data.sort((a, b) => {
        const compare = accessor(a).localeCompare(accessor(b));
        return sortOrder === 'asc' ? compare : -compare;
    });
};
