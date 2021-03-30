<template>
  <BasicLayout>
      <h1>Carrito</h1>
      <table class="ui celled table" v-if="products">
          <thead>
              <tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th></th></tr>
          </thead>
          <tbody>
              <tr v-for="product in products" :key="product.id">
                  <td>{{product.name}}</td>
                  <td>{{product.quantity}}</td>
                  <td>{{product.price}} €</td>
                  <td style="text-align: center;">
                      <i class="close icon" @click="deleteAllProductCart(product.id)"></i>
                  </td>
              </tr>
              <tr>
                  <td></td><td>TOTAL: </td><td colspan="2">{{getTotal()}} €</td>
              </tr>
          </tbody>
      </table>

      <button class="ui button primary fluid" v-if="products" @click="createOrder">Generar pedido</button>
      <h3 v-else>No tienes productos en el carrito</h3>
  </BasicLayout>
</template>

<script>
import {ref, watchEffect} from "vue"
import {useRouter} from "vue-router"
import jwtDecode from "jwt-decode";
import BasicLayout from "../layouts/BasicLayout";
import {getProductsCartApi, deleteAllProductCartApi, deleteCartApi} from "../api/cart";
import {createOrderApi} from "../api/order";
import {getTokenApi} from "../api/token";
export default {
    name: "Cart",
    components:{
        BasicLayout
    },
    setup(){
        let products = ref(null);
        let reloadCart = ref(false);
        const router = useRouter();

        watchEffect(async () => {
            reloadCart.value;
            const response = await getProductsCartApi();
            products.value = response;
            
        })

        const getTotal = () => {
            let totalTemp = 0;
            products.value.forEach(element => {
                totalTemp+= element.price * element.quantity;
            });

            return totalTemp.toFixed(2);
        }

        const deleteAllProductCart = (id) => {
            deleteAllProductCartApi(id);
            reloadCart.value = !reloadCart.value;
        }

        const createOrder = async () => {
            const token = getTokenApi(); 
            const {id} = jwtDecode(token);

            console.log(id);

            const data = {
                user: id,
                totalPayment: getTotal(),
                data: products.value,
            }

            try {
                const response = await createOrderApi(data);
                console.log("Pedido creado");
                deleteCartApi();
                router.push("/orders");
            } catch (error) {
                console.log(error);
            }
        }

        return {
            products, getTotal,deleteAllProductCart,createOrder,
        }
    }
}
</script>

<style>

</style>