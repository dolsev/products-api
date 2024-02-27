import React, { useEffect, useState } from 'react';
import Product from './Product';
import { fetchFilteredProductIds, fetchProductDetails, fetchProductIds } from './utils/api';
import useDebounce from "./utils/hooks/useDebounce";
import Loading from "./utils/Loading";
import Pagination from "./utils/Pagination";
import { ProductInterface } from "./types/productInterface";

const ProductList: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [filterProduct, setFilterProduct] = useState<string>('');
    const [filterPrice, setFilterPrice] = useState<number | undefined>();
    const [filterBrand, setFilterBrand] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 50;

    const debouncedFilterQuery = useDebounce(filterProduct, 3000);
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
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                let productIds: string[] = [];

                if (debouncedFilterQuery.length > 3 || debouncedFilterPrice !== undefined || debouncedFilterBrand.length > 3) {
                    productIds = await fetchFilteredProductIds(debouncedFilterQuery, debouncedFilterPrice, debouncedFilterBrand);
                } else {
                    productIds = await fetchProductIds(0);
                }

                const fetchedProducts = await fetchProductDetails(productIds, []);

                // Remove duplicates by ID
                const uniqueProducts = fetchedProducts.reduce<ProductInterface[]>((acc, product) => {
                    if (!acc.find(p => p.id === product.id)) {
                        acc.push(product);
                    }
                    return acc;
                }, []);

                setProducts(uniqueProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        // Refetch data whenever any of the filters change
        fetchProducts();
    }, [debouncedFilterQuery, debouncedFilterPrice, debouncedFilterBrand]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return (
        <div>
            <h1>Список товаров</h1>
            <div>
                <label htmlFor="filterQuery">Поиск по наименованию:</label>
                <input
                    type="text"
                    id="filterQuery"
                    value={filterProduct}
                    onChange={handleProductChange}
                />
            </div>
            <div>
                <label htmlFor="filterPrice">Фильтр по цене:</label>
                <input
                    type="number"
                    id="filterPrice"
                    value={filterPrice ?? ''}
                    onChange={handlePriceChange}
                />
            </div>
            <div>
                <label htmlFor="filterBrand">Фильтр по бренду:</label>
                <input
                    type="text"
                    id="filterBrand"
                    value={filterBrand}
                    onChange={handleBrandChange}
                />
            </div>
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
        </div>
    );
}

export default ProductList;
