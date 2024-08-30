export const filterData = <T>(data: T[], filterBy: string, filterFn: (item: T) => boolean): T[] => {
    if (filterBy === 'all') return data;
    return data.filter(filterFn);
};

export const sortData = <T>(data: T[], sortOrder: 'asc' | 'desc', accessor: (item: T) => string): T[] => {
    return data.sort((a, b) => {
        const compare = accessor(a).localeCompare(accessor(b));
        return sortOrder === 'asc' ? compare : -compare;
    });
};
