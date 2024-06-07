<script setup>
import { ref, onMounted } from 'vue';


const layout = ref('grid');

const AllProductslist = ref([]);
const list = ref([]);

function getAllProds() {
    fetch('https://firestore.googleapis.com/v1/projects/mselegance-13f07/databases/(default)/documents/Produits')
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            AllProductslist.value = data.documents.map((doc) => {
                return {
                    id: doc.fields.id.integerValue,
                    name: doc.fields.name.stringValue,
                    category: doc.fields.category.stringValue,
                    price: doc.fields.price.integerValue,
                    link: doc.fields.link.stringValue,
                    isAvailable: doc.fields.isAvailable.booleanValue
                };
            });
            list.value = AllProductslist.value;
        })
        .then(() => {
            getCategories();
            applyFilters();

        });
}
onMounted(() => {
    getAllProds();
});
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
        sum += parseInt(cart.value[i].price);
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
            categories.value.push(AllProductslist.value[i].category);
        }
    }
}
const switchValue = ref(false);

 function applyFilters() {
    let filteredList = AllProductslist.value;
    if (switchValue.value) {
        filteredList = filteredList.filter((product) => product.isAvailable === true);
    }

    if (selectedCategory.value !== 'Tout') {
        filteredList = filteredList.filter((product) => product.category === selectedCategory.value);
    }

    list.value = filteredList;
}

/*********************** FILTER BY PRICE ******************************* */

const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const sortOptions = ref([
    { label: 'du prix le plus élevé au prix le plus bas', value: '!price' },
    { label: 'du prix le plus bas au prix le plus élevé', value: 'price' }
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
const isMobile = ref(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

const open = () => {
    display.value = true;
    copied.value = false;
    confirmed.value = false;
    name.value = '';
    number.value = '';
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

const name = ref('');
const number = ref('');
const confirmed = ref(false);
function AjouterCommande() {
    fetch('https://firestore.googleapis.com/v1/projects/mselegance-13f07/databases/(default)/documents/Commandes', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name.value,
            number: number.value,
            products: cart.value
        })
    })
        .then((response) => response.json())
        .then((confirmed.value = true));
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
                                <Dropdown class="drop" v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Filtrer par le prix" @change="onSortChange($event)" />
                                <Dropdown class="drop" v-model="selectedCategory" :options="categories" @change="applyFilters()" />
                                <br>
                                <br>
                                <label>Masquer les produits indisponible</label>
                                <InputSwitch v-model="switchValue" @change="applyFilters()" />

                            </div>
                        </div>
                    </template>

                    <template #grid="slotProps">
                        <div class="flex">
                            <div class="grid grid-nogutter gridSize mygrid">
                                <div v-for="(item, index) in slotProps.items" :key="index" class="p-5">
                                    <div class="p-4 border-1 surface-border surface-card border-round flex flex-column">
                                        <div class="surface-50 flex justify-content-center border-round p-3">
                                            <div>
                                                <img class="border-round imgS" :src="item.link" :alt="item.name" />
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
                                                     <Tag v-if="item.isAvailable" value="Disponible" severity="success" />
                                                     <Tag v-else value="Non Disponible" severity="danger" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex flex-column gap-4 mt-4">
                                                <span class="text-2xl font-semibold text-900">{{ item.price }} TND</span>
                                                <div class="flex gap-2">
                                                    <Button  icon="pi pi-shopping-cart" label="Ajouter au panier" :disabled="item.isAvailable == false" class="flex-auto white-space-nowrap mycolor" @click="addToCart(item)"></Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!------------------------------------------------SECODND GRID-->
                            <div class="cart" v-if="fullPrice > 0">
                                <p class="text-4xl">
                                    Total: <span class="mainColor">{{ fullPrice }} </span> DT <Button class="btn mycolor" @click="open">Valider</Button>
                                </p>

                                <div v-for="(item, index) in cart" :key="index">
                                    <div class="flex flex-column sm:flex-row sm:align-items-center p-2 gap-1" :class="{ 'border-top-1 surface-border': index !== 0 }">
                                        <div class="md:w-8rem relative">
                                            <img class="block xl:block mx-auto border-round w-full" :src="item.link" :alt="item.name" />
                                            <Tag :value="item.inventoryStatus" class="absolute" style="left: 4px; top: 4px"></Tag>
                                        </div>
                                        <div class="flex flex-column md:flex-row justify-content-between md:align-items-center flex-1 gap-2">
                                            <div class="flex flex-row md:flex-column justify-content-between align-items-start gap-1"></div>
                                            <div>
                                                <div class="text-xl font-semibold text-900">{{ item.price }} TND</div>
                                                <div class="text-lg font-medium text-900 mt-1">{{ item.name }}</div>
                                                <icon class="pi pi-trash text-red-500 cursor-pointer" @click="RemoveFromCart(item)"></icon>
                                            </div>
                                        </div>
                                    </div>
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
                    <p>id<{{ item.id }}> - {{ item.name }}</p>
                </div>
                <div class="fixed bg-black text-white font-normal rounded p-3 myclass" v-if="hover" :style="{ top: `${position.y}px`, left: `${position.x}px` }">Copier</div>
            </div>
            <br />
            <div v-if="copied">
                La commande a été copiée. Veuillez l'envoyer
                <a v-if="isMobile" class="text-purple-500 font-bold underline" href="instagram://user?username=ms__elegance__">ici</a>
                <a v-else class="text-purple-500 font-bold underline" href="https://www.instagram.com/direct/t/17845195875045937/">ici</a>
            </div>
        </div>
        <br />
        <div class="separator"></div>
        <br />
        <div>
            <h3>Par un formulaire</h3>
            <br />
            <div class="flex flex-wrap">
                <FloatLabel>
                    <InputText id="Identity" type="text" v-model="name" />
                    <label for="Identity">Nom et prenom </label>
                </FloatLabel>

                <FloatLabel>
                    <InputText id="phone" type="text" v-model="number" />
                    <label for="phone">numero de telephonne </label>
                </FloatLabel>
            </div>
            <br />
            <Button v-if="!confirmed" label="Confimer" icon="pi pi-check" class="p-button-outlined mycolor" @click="AjouterCommande()"></Button>
            <div v-if="confirmed" class="text-green-500 font-bold">Merci ! Votre commande a été ajoutée avec succès</div>
        </div>
    </Dialog>
</template>

<style scoped>
.myclass {
    background-color: black;
    border-radius: 5px;
}
.separator {
    background-color: rgb(180, 180, 180);
    border: 1px solid rgb(180, 180, 180);
    width: 100%;
}

.imgS {
    width: 100%;
    max-width: 300px;
    height: 100%;
    max-height: 300px;
}
.mygrid {
    justify-content: center;
}
.cart {
    width: 100%;
    max-width: 250px;
    min-width: 100px;
    border-radius: 20px;
    outline: rgb(211, 211, 211) 1px solid;
    justify-content: center;
    align-items: center;
    display: block;
    text-align: center;
}
.btn {
    height: 100%;
    width: 80%;
    text-align: center;
}

.mycolor {
    background-color: #c09495;
    color: rgb(255, 255, 255);
    outline: #c09495 1px solid;
    border: #c09495;
}
.mainColor {
    color: #c09495;
}
.drop {
}
.drop:hover {
    outline: #c09495 1px solid;
}
</style>
