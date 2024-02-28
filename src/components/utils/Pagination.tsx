// Pagination.tsx
import React from 'react';
import { Button, Typography } from '@mui/material';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Typography variant="body1">Страница {currentPage} из {totalPages}</Typography>
            <div>
                {pages.map(page => (
                    <Button
                        key={page}
                        variant={page === currentPage ? "contained" : "outlined"}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default Pagination;
