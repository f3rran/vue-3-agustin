<template>
  <div class="home">
    <BasicLayout>
      <h1>Últimos productos</h1>
      <div class="ui grid">
        <div class="sixten wide mobile eight wide tablet four wide computer column" v-for="product in products" :key="product.id">
          <Product :product="product"/>
        </div>
      </div>
    </BasicLayout>
  </div>
</template>

<script>
// @ is an alias to /src
import BasicLayout from "../layouts/BasicLayout";
import { getProducts } from "../api/product";
import { onMounted,ref } from 'vue';
import Product from "../components/Product"
export default {
  name: 'Home',
  components: {
    BasicLayout,
    Product
  },
  setup(){
    let products = ref(null);
    onMounted(async () => {
      const response = await getProducts(20);
      console.log(response);
      products.value = response;
    });

    return {
      products,
    }
  }
}
</script>
