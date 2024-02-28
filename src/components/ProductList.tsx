import React, { useEffect, useState } from 'react';
import Product from './Product';
import { fetchFilteredProductIds, fetchProductDetails, fetchProductIds } from './utils/api';
import useDebounce from "./utils/hooks/useDebounce";
import Loading from "./utils/Loading";
import Pagination from "./utils/Pagination";
import { TextField, Grid, Typography } from '@mui/material';
import { ProductInterface } from "./types/productInterface";

const ProductList: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [filterProduct, setFilterProduct] = useState<string>('');
    const [filterPrice, setFilterPrice] = useState<number | undefined>();
    const [filterBrand, setFilterBrand] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 50;

    const debouncedFilterProduct = useDebounce(filterProduct, 3000);
    const debouncedFilterPrice = useDebounce(filterPrice, 3000);
    const debouncedFilterBrand = useDebounce(filterBrand, 3000);

    const handleProductChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterProduct(event.target.value);
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const price = event.target.value.trim() !== '' && !isNaN(parseFloat(event.target.value)) ? parseFloat(event.target.value) : undefined;
        setFilterPrice(price);
    };

    const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterBrand(event.target.value);
    };

    const handlePageChange = async (page: number) => {
        setCurrentPage(page);
        const totalPages = Math.ceil(products.length / itemsPerPage);
        if (
            !filterProduct &&
            !filterPrice &&
            !filterBrand &&
            page === totalPages &&
            totalPages > 1 &&
            products.length < page * itemsPerPage
        ) {
            await loadAdditionalItems((page - 1) * itemsPerPage);
        }
    };

    const loadAdditionalItems = async (offset: number) => {
        try {
            setLoading(true);

            const additionalProductIds = await fetchProductIds(offset);
            const additionalProductDetails = await fetchProductDetails(additionalProductIds, []);

            const updatedProducts = [...products, ...additionalProductDetails];

            const uniqueProducts = removeDuplicatesById(updatedProducts);

            setProducts(uniqueProducts);
        } catch (error) {
            console.error('Error loading additional items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                setProducts([]);

                let productIds: string[] = [];

                if (debouncedFilterProduct.length > 3 || debouncedFilterPrice !== undefined || debouncedFilterBrand.length > 3) {
                    productIds = await fetchFilteredProductIds(debouncedFilterProduct, debouncedFilterPrice, debouncedFilterBrand);
                } else {
                    productIds = await fetchProductIds(0);
                }

                const fetchedProducts = await fetchProductDetails(productIds, []);

                const uniqueProducts = removeDuplicatesById(fetchedProducts);

                setProducts(uniqueProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [debouncedFilterProduct, debouncedFilterPrice, debouncedFilterBrand]);

    const removeDuplicatesById = (products: ProductInterface[]): ProductInterface[] => {
        return products.reduce<ProductInterface[]>((acc, product) => {
            if (!acc.find(p => p.id === product.id)) {
                acc.push(product);
            }
            return acc;
        }, []);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Список товаров</Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    id="filterQuery"
                    label="Поиск по наименованию"
                    variant="outlined"
                    value={filterProduct}
                    onChange={handleProductChange}
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
                    onChange={handlePriceChange}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    id="filterBrand"
                    label="Поиск по бренду"
                    variant="outlined"
                    value={filterBrand}
                    onChange={handleBrandChange}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                {loading ? <Loading /> : (
                    <>
                        {paginatedProducts.map(product => (
                            <Product key={product.id} product={product} />
                        ))}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(products.length / itemsPerPage)}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </Grid>
        </Grid>
    );
}

export default ProductList;
