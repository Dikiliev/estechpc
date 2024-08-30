import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface DataTableProps<T> {
    data: T[];
    columns: {
        label: string;
        accessor: keyof T | ((item: T) => React.ReactNode);
    }[];
    renderActions?: (item: T) => React.ReactNode;
}

const DataTable = <T,>({ data, columns, renderActions }: DataTableProps<T>) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column, index) => (
                            <TableCell key={index}>{column.label}</TableCell>
                        ))}
                        {renderActions && <TableCell align='right'>Действия</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <TableCell key={colIndex}>
                                    {typeof column.accessor === 'function' ? column.accessor(item) : String(item[column.accessor])}
                                </TableCell>
                            ))}
                            {renderActions && <TableCell align='right'>{renderActions(item)}</TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DataTable;
