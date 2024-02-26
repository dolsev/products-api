import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import Product from './Product';
import Pagination from './Pagination';
import { fetchProductIds, fetchProductDetails } from './utils/api';

interface ProductType {
    id: string;
    product: string;
    price: number;
    brand?: string;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState({ name: '', price: '', brand: '' });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let productIds = await fetchProductIds(currentPage);
                if (Object.values(filter).some(value => value !== '')) {
                    productIds = await applyFilter(productIds);
                }
                const productDetails = await fetchProductDetails(productIds);
                const uniqueProducts = removeDuplicates(productDetails, 'id');
                setProducts(uniqueProducts.slice(0, 50));

                const totalProductIds = await fetchProductIds(1);
                const totalProducts = totalProductIds.length;
                const totalPages = Math.ceil(totalProducts / 50);
                setTotalPages(totalPages);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const debouncedFetchProducts = _.debounce(fetchProducts, 300);

        debouncedFetchProducts();

        return () => {
            debouncedFetchProducts.cancel();
        };
    }, [currentPage, filter]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFilter({ ...filter, [name]: value });
    };

    const applyFilter = async (productIds: string[]) => {
        try {
            const filteredProductIds = await fetchProductIds(1);
            const filteredProducts = await fetchProductDetails(filteredProductIds);
            return filteredProducts
                .filter((product: ProductType) => {
                    if (filter.name && !product.product.toLowerCase().includes(filter.name.toLowerCase())) {
                        return false;
                    }
                    if (filter.price && product.price !== parseFloat(filter.price)) {
                        return false;
                    }
                    return !(filter.brand && product.brand !== filter.brand);

                })
                .map((product: ProductType) => product.id);
        } catch (error) {
            console.error('Error applying filter:', error);
            return productIds;
        }
    };

    const removeDuplicates = (arr: any[], prop: string) => {
        return arr.filter((obj, index, self) =>
            index === self.findIndex((o) => o[prop] === obj[prop])
        );
    };


    return (
        <div>
            <h1>Список товаров</h1>
            <div className='filter__box'>
            <div>
                <label htmlFor="name">Название:</label>
                <input type="text" id="name" name="name" value={filter.name} onChange={handleFilterChange} />
            </div>
            <div>
                <label htmlFor="price">Цена:</label>
                <input type="text" id="price" name="price" value={filter.price} onChange={handleFilterChange} />
            </div>
            <div>
                <label htmlFor="brand">Бренд:</label>
                <input type="text" id="brand" name="brand" value={filter.brand} onChange={handleFilterChange} />
            </div>
            </div>
            {products.map((product, index) => (
                <Product key={product.id} product={product} index={(currentPage - 1) * 50 + index + 1} />
            ))}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
}

export default ProductList;
