import React from 'react';
import { Drawer, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FiltersPanel from '@components/filtersPanel/FiltersPanel';
import { Filter, Filters, Range } from 'types/productFilters';

interface FiltersDrawerProps {
    filters: Filter[] | undefined;
    draftFilters: Filters;
    setDraftFilters: (filters: Filters) => void;
    draftPriceRange: Range;
    setDraftPriceRange: (range: Range) => void;
    applyFilters: () => void;
}

const FiltersDrawer: React.FC<FiltersDrawerProps> = ({
    filters,
    draftFilters,
    setDraftFilters,
    draftPriceRange,
    setDraftPriceRange,
    applyFilters,
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

    const toggleDrawer = (open: boolean) => () => {
        setIsDrawerOpen(open);
    };

    return (
        <>
            <Button startIcon={<MenuIcon />} onClick={toggleDrawer(true)}>
                Фильтры
            </Button>

            <Drawer anchor='left' open={isDrawerOpen} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250, p: 2 }}>
                    <FiltersPanel
                        filters={filters}
                        selectedFilters={draftFilters}
                        priceRange={draftPriceRange}
                        onFilterChange={setDraftFilters}
                        onPriceRangeChange={setDraftPriceRange}
                        onApply={applyFilters}
                    />
                </Box>
            </Drawer>
        </>
    );
};

export default FiltersDrawer;
