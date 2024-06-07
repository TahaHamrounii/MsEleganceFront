<script setup>
import { computed } from 'vue';
const logoUrl = computed(() => {
    return `/demo/images/landing/logo.png`;
});
</script>

<template>
    <div class="layout-topbar h-16">
        <router-link to="/Acceuil">
            <img :src="logoUrl" alt="logo" class="imagew" />
        </router-link>

        <div class="link-container">
            <router-link to="/QuiSommeNous" class="link">Qui Somme Nous</router-link>
            <router-link to="/Produits" class="link">Produits</router-link>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@font-face {
    font-family: 'Tangerine';
    src: url('../../public/fonts/Tangerine-Bold.ttf') format('truetype');
}

.text-tangerine {
    font-family: 'Tangerine', sans-serif;
}
.textformat {
    font-size: 4rem;
}
.imagew {
    width: 110px;
    height: 110px;
    margin-right: 10px;
    margin-top: 10px;
}
.link-container {
    display: flex;
    justify-content: space-between;
}

.link {
    margin-right: 20px;
}
</style>
