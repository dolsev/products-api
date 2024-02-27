import React from 'react';
import { Grid, Typography, Divider } from '@mui/material';
import { ProductInterface } from '../types/productInterface';
import Product from "../Product";

interface ProductListViewProps {
    products: ProductInterface[];
}

const ProductListView: React.FC<ProductListViewProps> = ({ products }) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Список товаров</Typography>
            </Grid>
            {products.map(product => (
                <Grid item xs={12} key={product.id}>
                    <Product product={product} />
                    <Divider />
                </Grid>
            ))}
        </Grid>
    );
}

export default ProductListView;
