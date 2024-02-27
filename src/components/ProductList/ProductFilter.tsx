import React from 'react';
import { TextField, Grid, Typography } from '@mui/material';

interface ProductFilterProps {
    filterProduct: string;
    filterPrice: number | undefined;
    filterBrand: string;
    onProductChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBrandChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
                                                         filterProduct,
                                                         filterPrice,
                                                         filterBrand,
                                                         onProductChange,
                                                         onPriceChange,
                                                         onBrandChange,
                                                     }) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Фильтры</Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="filterQuery"
                    label="Поиск по наименованию"
                    variant="outlined"
                    value={filterProduct}
                    onChange={onProductChange}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    id="filterPrice"
                    label="Поиск по цене"
                    type="number"
                    variant="outlined"
                    value={filterPrice ?? ''}
                    onChange={onPriceChange}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    id="filterBrand"
                    label="Поиск по бренду"
                    variant="outlined"
                    value={filterBrand}
                    onChange={onBrandChange}
                    fullWidth
                />
            </Grid>
        </Grid>
    );
}

export default ProductFilter;
