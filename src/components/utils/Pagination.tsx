import React from 'react';
import { Button, Typography } from '@mui/material';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    const handlePageChange = (page: number) => {
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    };

    return (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <div>
                {pages.map(page => (
                    <Button
                        key={page}
                        variant={page === currentPage ? "contained" : "outlined"}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default Pagination;
