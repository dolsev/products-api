import React, { useEffect, useState } from 'react';
import Product from './Product';
import { fetchFilteredProductIds, fetchProductDetails, fetchProductIds } from './utils/api';
import useDebounce from "./utils/hooks/useDebounce";

interface ProductType {
    id: string;
    product: string;
    price: number;
    brand?: string;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [filterQuery, setFilterQuery] = useState<string>('');
    const [filterPrice, setFilterPrice] = useState<number | undefined>();
    const [filterBrand, setFilterBrand] = useState<string>('');

    const debouncedFilterQuery = useDebounce(filterQuery, 3000);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterQuery(event.target.value);
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const price = parseFloat(event.target.value);
        setFilterPrice(price);
    };

    const handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterBrand(event.target.value);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let filteredProductIds: string[] = [];
                if (debouncedFilterQuery.length > 3) {
                    filteredProductIds = await fetchFilteredProductIds(debouncedFilterQuery);
                } else {
                    filteredProductIds = await fetchProductIds();
                }
                const productDetails = await fetchProductDetails(filteredProductIds);

                const filteredProducts = productDetails.filter((product:ProductType) => {
                    return filterPrice ? product.price === filterPrice : true;
                });

                setProducts(filteredProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [debouncedFilterQuery, filterPrice]);

    return (
        <div>
            <h1>Список товаров</h1>
            <div>
                <label htmlFor="filterQuery">Поиск по наименованию:</label>
                <input
                    type="text"
                    id="filterQuery"
                    value={filterQuery}
                    onChange={handleFilterChange}
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
            {products.map(product => (
                <Product key={product.id} product={product} />
            ))}
        </div>
    );
}

export default ProductList;
