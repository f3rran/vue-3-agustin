<template>
  <BasicLayout>
      <h1>Categoria: {{params.category}}</h1>
      <div class="ui grid">
        <div class="sixten wide mobile eight wide tablet four wide computer column" v-for="product in products" :key="product.id">
          <Product :product="product"/>
        </div>
      </div>
  </BasicLayout>
</template>

<script>
import BasicLayout from "../layouts/BasicLayout"
import {getProductsCategory} from "../api/product"
import Product from "../components/Product"
import { onMounted,ref } from 'vue';
import {useRoute } from "vue-router"
export default {
    name: "Category",
    components: {
        BasicLayout,
        Product,
    },
    watch:{
        $route(to, from){
            this.getProducts(to.params.category);
        }
    },
    setup(){
        const {params} = useRoute();
        let products = ref(null);
        onMounted( () => {
            getProducts(params.category);
        })

        const getProducts = async (category) => {
            const response = await getProductsCategory(category);
            products.value = response;
        }

        return {
            params, products, getProducts
        }
    }
}
</script>

<style>

</style>