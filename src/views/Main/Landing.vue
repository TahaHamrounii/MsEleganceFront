<template>
    <div
        id="hero"
        class="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden"
        style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #e8d6d7 0%, #b0797a 100%); clip-path: ellipse(150% 87% at 93% 13%)"
    >
        <div class="mx-4 md:mx-8 mt-0 md:mt-4">
            <h1 class="text-6xl font-bold text-gray-900 line-height-2"><span class="font-light block">Bienvenue chez</span>MsElegance</h1>
            <p class="font-normal text-2xl line-height-3 md:mt-3 text-gray-700">ou vous trouverez les meilleurs bijoux</p>
            <Button @click="pushProd" label="Voir les Produits" class="p-button-rounded text-xl border-none bg-blue-500 font-normal text-white line-height-3 px-3"></Button>
            <br />
            <br />
        </div>
        <div class="flex justify-content-center md:justify-content-end">
            <img src="/demo/images/landing/f.png" alt="" class="thirty responsive" />
            <img src="/demo/images/landing/f2.png" alt="" class="thirty responsive" />
            <img src="/demo/images/landing/f3.png" alt="" class="thirty responsive" />
        </div>
    </div>

</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
function pushProd() {
    router.push({ name: 'Produits' });
}
</script>

<style scoped>
.image {
    border-radius: 20%;
}
.thirty {
    max-width: 23%;
    max-height: 40rem;
    margin: 0 10px;
    border-radius: 20px;
    box-shadow: 20px 10px 20px 0px rgba(0, 0, 0, 0.5);
    animation: pop-up 1.5s ease-out forwards;
}
#hero {
    min-height: 80vh;
    position: relative;
}

@keyframes pop-up {
    0% {
        transform: translateY(100%);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
