<template>
  <BasicLayout>
      <div class="login">
          <h2>Iniciar sesión</h2>
          <form class="ui form" @submit.prevent="login">
          
              <div class="field">
                  <input type="text" placeholder="Nombre de usuario" v-model="formData.identifier" :class="{error: formError.identifier}">
              </div>
              <div class="field">
                  <input type="password" placeholder="Contraseña" v-model="formData.password" :class="{error: formError.password}">
              </div>
              <button type="submit" class="ui button fluid positive" :class="{loading}">
                  Iniciar sesión
              </button>
              <p v-if="messageError">{{messageError.value}}</p>
          </form>
           <router-link to="/register">Crear cuenta</router-link>
      </div>
  </BasicLayout>
</template>

<script>
import * as Yup from "yup"
import {ref, onMounted} from "vue"
import  {useRouter} from "vue-router"
import BasicLayout from "../layouts/BasicLayout"
import {loginApi} from "../api/user"
import {setTokenApi, getTokenApi} from "../api/token"
export default {
    name: "Login",
    components: {
        BasicLayout,
    },
    setup () {
        let formData = ref({});
        let formError = ref({});
        let loading = ref(false);
        let messageError = ref("");
        const router = useRouter();
        const token = getTokenApi();

        onMounted(() => {
            if (token) router.push("/");
        })

        const schemaForm = Yup.object().shape({
            identifier: Yup.string().required(true),
            password: Yup.string().required(true),
        })

        const login = async () => {
            formError.value = {};
            try {
                await schemaForm.validate(formData.value, {abortEarly: false});

                try {
                    const response = await loginApi(formData.value);
                    if(!response?.jwt) throw "El usuario o contraseña no son válidos"

                    setTokenApi(response.jwt);
                    router.push("/");
                    console.log("Login ok");
                } catch (error) {
                    console.log(error);
                    messageError.value = error;
                }
            } catch (error) {
                error.inner.forEach((er) => {
                    formError.value[er.path] = er.message;
                })
            }
        }

        return{
            formData,
            formError,
            loading,
            login,
            messageError,
        }
    }
}
</script>

<style lang="scss" scoped>
    .login{
        text-align: center;
        > h2 {
            margin: 50px 0 30px 0;
        }

        .ui.form {
            max-width: 300px !important;
            margin: 0 auto;
            margin-bottom: 10px;

            input.error {
                border-color: #faa;
                background-color: #ffeded;
            }
        }
    }
</style>