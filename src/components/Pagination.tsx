import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div>
            <button onClick={() => onPageChange(currentPage - 1)}>
                Previous
            </button>
            {pages.map(page => (
                <button key={page} onClick={() => onPageChange(page)} >
                    {page}
                </button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)}>
                Next
            </button>
        </div>
    );
};

export default Pagination;
