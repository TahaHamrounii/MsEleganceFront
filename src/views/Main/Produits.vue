<script setup>
import { ref, onMounted } from 'vue';
import { ProductService } from '@/service/ProductService';
import { initializeApp } from 'firebase/app';
import { getStorage, listAll, ref as firebaseRef, getDownloadURL } from 'firebase/storage';

const dataviewValue = ref(null);
const layout = ref('grid');

const productService = new ProductService();
const AllProductslist = ref([]);
const list = ref([]);
const ImagesList = ref([]);

function getAllProds() {
    fetch('http://localhost:3000/Products')
        .then((response) => response.json())
        .then((data) => {
            AllProductslist.value = data;
            list.value = AllProductslist.value;
        })
        .then(() => {
            getCategories();
        });
}
onMounted(() => {
    getAllProds();
    listAllImages();
});

/********************************************************************FIREBASE */
const firebaseConfig = {
    apiKey: 'AIzaSyD1_GuX3Wl6h34zkWXIts9VifH8mQWzRVE',
    authDomain: 'mselegance-13f07.firebaseapp.com',
    projectId: 'mselegance-13f07',
    storageBucket: 'mselegance-13f07.appspot.com',
    messagingSenderId: '741003400802',
    appId: '1:741003400802:web:4cef5ad7b32da81a8f233b'
};
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp, 'gs://mselegance-13f07.appspot.com');
const storageRef = firebaseRef(storage);

async function listAllImages() {
    try {
        const res = await listAll(storageRef);
        const imageFiles = res.items.filter((item) => item.name.includes('.png'));
        const imageUrls = [];

        for (let file of imageFiles) {
            let url = await getDownloadURL(file);
            imageUrls.push(url);
        }

        ImagesList.value = imageUrls;
    } catch (error) {
        console.error('Error listing images:', error);
    }
}
/*******************************************************************CART ***********************/

const cart = ref([]);
function addToCart(product) {
    if (!cart.value.find((item) => item.id === product.id)) {
        cart.value.push(product);
        updateValues();
    }
}

function RemoveFromCart(product) {
    cart.value = cart.value.filter((item) => item.id !== product.id);
    updateValues();
}

const fullPrice = ref(0);
function updateValues() {
    let sum = 0;
    for (let i = 0; i < cart.value.length; i++) {
        sum += cart.value[i].price;
    }
    fullPrice.value = sum;
}
/******************************* FILTER BY CATEGORY********************************* */
const categories = ref([]);
const selectedCategory = ref('Tout');

function getCategories() {
    categories.value.push('Tout');
    for (let i = 0; i < AllProductslist.value.length; i++) {
        if (!categories.value.includes(AllProductslist.value[i].category)) {
            console.log(AllProductslist.value[i].category);
            categories.value.push(AllProductslist.value[i].category);
        }
    }
}
function filterByCategory() {
    if (selectedCategory.value === 'Tout') {
        list.value = AllProductslist.value;
    } else {
        list.value = AllProductslist.value.filter((product) => product.category === selectedCategory.value);
    }
}

/*********************** FILTER BY PRICE ******************************* */

const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const sortOptions = ref([
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' }
]);

const onSortChange = (event) => {
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    } else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
};

/*********************************COMMANDER *********************/
const display = ref(false);
const copied = ref(false);
const open = () => {
    display.value = true;
    copied.value = false;
    confirmed.value = false;
    name.value =('');
    number = ('');
};

async function copyToClipboard() {
    const text = cart.value.map((item) => `${item.id} - ${item.name} `).join('\n');
    await navigator.clipboard.writeText(text);
    copied.value = true;
}

const hover = ref(false);
function onMouseOver() {
    hover.value = true;
}
function onMouseLeave() {
    hover.value = false;
}
const position = ref({ x: 0, y: 0 });
function onMouseMove(event) {
    position.value = { x: event.clientX - 660, y: event.clientY - 300 };
}

const name =ref('');
const number = ref('');
const confirmed = ref(false);
function AjouterCommande(){
    fetch('http://localhost:3000/Commandes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name.value,
            number: number.value,
            products: cart.value
        })
    })
    .then(response => response.json())
    .then(confirmed.value = true)

}
</script>

<template>
    <div class="grid">
        <div class="col-15">
            <div class="card">
                <h5>Nos Produits</h5>
                <DataView :value="list" :layout="layout" :paginator="true" :rows="9" :sortOrder="sortOrder" :sortField="sortField">
                    <template #header>
                        <div class="grid grid-nogutter">
                            <div class="col-6 text-left">
                                <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Filtrer par le prix" @change="onSortChange($event)" />
                                <Dropdown v-model="selectedCategory" :options="categories" @change="filterByCategory()" />
                            </div>
                        </div>
                    </template>

                    <template #grid="slotProps">
                        <div class="flex">
                            <div class="grid grid-nogutter">
                                <div v-for="(item, index) in slotProps.items" :key="index" class="col-12 sm:col-6 md:col-4 p-2">
                                    <div class="p-4 border-1 surface-border surface-card border-round flex flex-column">
                                        <div class="surface-50 flex justify-content-center border-round p-3">
                                            <div class="relative mx-auto">
                                                <img class="border-round w-full" :src="ImagesList[item.id - 1]" :alt="item.name" style="max-width: 300px" />
                                                <Tag :value="item.inventoryStatus" class="absolute" style="left: 4px; top: 4px"></Tag>
                                            </div>
                                        </div>
                                        <div class="pt-4">
                                            <div class="flex flex-row justify-content-between align-items-start gap-2">
                                                <div>
                                                    <span class="font-medium text-secondary text-sm">{{ item.category }}</span>
                                                    <div class="text-lg font-medium text-900 mt-1">{{ item.name }}</div>
                                                </div>
                                                <div class="surface-100 p-1" style="border-radius: 30px">
                                                    <div
                                                        class="surface-0 flex align-items-center gap-2 justify-content-center py-1 px-2"
                                                        style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)"
                                                    >
                                                        <span class="text-900 font-medium text-sm">{{ item.rating }}</span>
                                                        <i class="pi pi-star-fill text-yellow-500"></i>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex flex-column gap-4 mt-4">
                                                <span class="text-2xl font-semibold text-900">${{ item.price }}</span>
                                                <div class="flex gap-2">
                                                    <Button icon="pi pi-shopping-cart" label="Buy Now" :disabled="item.inventoryStatus === 'OUTOFSTOCK'" class="flex-auto white-space-nowrap" @click="addToCart(item)"></Button>
                                                    <Button icon="pi pi-heart" outlined></Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!------------------------------------------------SECODND GRID-->
                            <div class="col-50 sticky" >
                                <div v-if="fullPrice > 0">
                                    <h2>totale {{ fullPrice }} DT</h2>
                                    <Button label="Commander" icon="pi pi-external-link" style="width: auto" @click="open" />
                                </div>

                                <div v-for="(item, index) in cart" :key="index" class="col-12">
                                    <div class="flex flex-column sm:flex-row sm:align-items-center p-2 gap-1" :class="{ 'border-top-1 surface-border': index !== 0 }">
                                        <div class="md:w-8rem relative">
                                            <img class="block xl:block mx-auto border-round w-full" :src="ImagesList[item.id - 1]" :alt="item.name" />
                                            <Tag :value="item.inventoryStatus" class="absolute" style="left: 4px; top: 4px"></Tag>
                                        </div>
                                        <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-2">
                                            <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-1"></div>
                                            <div>
                                                <div class="text-xl font-semibold text-900">${{ item.price }}</div>
                                                <div class="text-lg font-medium text-900 mt-1">{{ item.name }}</div>
                                                <icon class="pi pi-trash color-red cursor-pointer" @click="RemoveFromCart(item)"></icon>
                                            </div>
                                        </div>
                                    </div>

                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
            </div>
        </div>
    </div>

    <Dialog header="Confirmer" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
        <div>
            <h3>Par instagram</h3>
            <p>Veuillez cliquer pour copier. Le lien la discussion s'affichera ensuite</p>
            <div class="border-1 border-gray-400 p-4 cursor-pointer hover:bg-gray-100" @click="copyToClipboard()" @mouseleave="onMouseLeave" @mouseover="onMouseOver" @mousemove="onMouseMove">
                <div v-for="item in cart" :key="item.id">
                    <p>{{ item.id }} - {{ item.name }}</p>
                </div>
                <div class="fixed bg-black text-white font-normal rounded p-3 myclass" v-if="hover" :style="{ top: `${position.y}px`, left: `${position.x}px` }">Copier</div>
            </div>
            <br />
            <div v-if="copied">La commande a été copiée. Veuillez l'envoyer <a class="text-purple-500 font-bold underline" href="https://www.instagram.com/direct/t/17845195875045937/">ici</a></div>
        </div>
        <br />
        <div class="separator"></div>
        <br />
        <div>
            <h3>Par un formulaire</h3>
            <br />
            <div class="flex">
                <FloatLabel>
                    <InputText id="Identity" type="text" v-model="name"/>
                    <label for="Identity">Nom et prenom </label>
                </FloatLabel>

                <FloatLabel>
                    <InputText id="phone" type="text" v-model="number" />
                    <label for="phone">numero de telephonne </label>
                </FloatLabel>
            </div>
            <br />
            <Button v-if="!confirmed" label="Confimer" icon="pi pi-check" class="p-button-outlined" @click="AjouterCommande()"></Button>
            <div v-if="confirmed" class="text-green-500 font-bold">Merci ! Votre commande a été ajoutée avec succès</div>
        </div>
    </Dialog>
</template>

<style>
.myclass {
    background-color: black;
    border-radius: 5px;
}
.separator {
    background-color: rgb(180, 180, 180);
    border: 1px solid rgb(180, 180, 180);
    width: 100%;
}
</style>
