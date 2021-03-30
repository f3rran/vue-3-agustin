import {API_URL, PRODUCTS} from "../utils/constants";
import {uniqBy, countBy} from "lodash";

export function addProductCartApi(idProduct){
    const products = getCartApi();
    
    products.push(idProduct);
    console.log(products);

    localStorage.setItem( PRODUCTS, JSON.stringify(products));
}

export function getCartApi() {
    const products = localStorage.getItem(PRODUCTS);
    if (!products) {
        return [];
    }
    return JSON.parse(products);
}

export async function getProductsCartApi(){
    const idProducts = getCartApi();

    if (idProducts.length === 0) {
        return null;
    }

    try {
        const products = [];

        for await (const idProduct of idProducts){
            const response = await fetch(`${API_URL}/products/${idProduct}`);
            const result = await response.json();
            products.push(result);
        }

        const productsCount = countBy(products, (product) => {
            return product.name;
        });

        const combined = uniqBy(products, (product) => {
            const productTemp = product;
            productTemp.quantity = productsCount[product.name];
            return productTemp.name;
        });

        return combined;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function deleteProductCartApi (id) {
    const products = getCartApi();

    const index = products.indexOf(id);
    if (index > -1) {
        products.splice (index, 1);
        console.log("Producto eliminado");
    }

    localStorage.setItem(PRODUCTS, JSON.stringify(products));
}

export function deleteAllProductCartApi (id) {
    const products = getCartApi();

    const index = products.indexOf(id);
    if (index > -1) {
        products.splice (index, 1);
        localStorage.setItem(PRODUCTS, JSON.stringify(products));
        deleteAllProductCartApi(id);
    }

}

export function deleteCartApi() {
    localStorage.removeItem(PRODUCTS);
}