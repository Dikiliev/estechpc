import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box } from '@mui/material';

interface DataFormDialogProps<T> {
    open: boolean;
    title: string;
    data: T;
    onClose: () => void;
    onSave: () => void;
    onChange: (key: keyof T, value: string) => void;
    fields: { key: keyof T; label: string; type?: string }[];
    additionalContent?: React.ReactNode;
}

const DataFormDialog = <T,>({ open, title, data, onClose, onSave, onChange, fields, additionalContent }: DataFormDialogProps<T>) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {fields.map((field) => (
                    <TextField
                        key={field.key as string}
                        autoFocus={field.key === fields[0].key}
                        margin='dense'
                        label={field.label}
                        type={field.type || 'text'}
                        fullWidth
                        value={String(data[field.key] || '')}
                        onChange={(e) => onChange(field.key, e.target.value)}
                    />
                ))}
                {additionalContent && <Box mt={2}>{additionalContent}</Box>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color='secondary'>
                    Отмена
                </Button>
                <Button onClick={onSave} color='primary'>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DataFormDialog;
