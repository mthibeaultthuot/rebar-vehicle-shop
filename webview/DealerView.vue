<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import { useEvents } from '../../../../webview/composables/useEvents';
import { DealerEventNames } from '../shared/event';
import VehicleListView from './VehicleListView.vue';
import { DealerConfig } from '../shared/config';

const events = useEvents();
let vehicles = ref<string[]>([]);
let colors = ref<{primaryColorId : number, secondaryColorId : number, primaryColorHex : string, secondaryColorHex : string, color : string}[]>(DealerConfig.colors)
let targetGarageKey;

const categories = ref<string[]>(['Super', 'Sport']);
const selectedCategory = ref<string | null>(null);
const subCategories = ref<{ [key: string]: object[] }>({
  Super: [
    {model : 'nero2', name : 'Super Car 1', price : 100000, imgUrl : "https://bucket.veemdigital.com/img10.png"}, 
    {model : 'nero', name : 'S', price : 100000, imgUrl : "https://bucket.veemdigital.com/img10.png"}, 
],
  Sport: [
    {model : 'nero2', name : 'Super Car 1', price : 100000, imgUrl : "https://bucket.veemdigital.com/img10.png"}, 
    {model : 'nero', name : 'Super Car 1', price : 100000, imgUrl : "https://bucket.veemdigital.com/img10.png"}, 
  ],
});

function chooseVehicleCategory(category: string) {
  selectedCategory.value = selectedCategory.value === category ? null : category;
  categoryElements.value[category].style.top = categoryElements.value[category].offsetTop - 300 + 'px';
}

const isCategorySelected = (category: string) => {
  return selectedCategory.value === category;
};


async function selectVehicle(model : string) {
    const result = await events.emitServerRpc(DealerEventNames.toServer.selectVehicle, model);
    console.log(result);
}

async function changeVehicleColor(primaryColor : number, secondaryColor : number) {
    const result = await events.emitServerRpc(DealerEventNames.toServer.changeVehicleColor, primaryColor, secondaryColor);
    console.log(result);
}


async function buyVehicle() {
    const result = await events.emitServerRpc(DealerEventNames.toServer.buyVehicle);
    console.log(result);
}

function init() {
  
}

onMounted(init);

const categoryElements = ref<{ [key: string]: HTMLElement | null }>({});


function setCategoryElement(category: string, element: HTMLElement | null) {
  if (element) {
    categoryElements.value[category] = element;
  }
}



</script>

<template>
    <div class="container">
        <div class="menu">
            <div class="top-bar">
                <div class="top-bar-red cercle"></div>
                <div class="top-bar-yellow cercle"></div>
                <div class="top-bar-green cercle"></div>
            </div>
            <div class="header">
                <h1 class="header-title">Garage</h1>
            </div>
            <div class="body">
                <div v-for="category in categories" :key="category">
                    <div 
                        @click="chooseVehicleCategory(category)" 
                        class="item"
                        :ref="categoryElement  => setCategoryElement(category, categoryElement)"
                    >
                        {{ category }}
                    </div>
                    <div 
                        v-if="isCategorySelected(category)" 
                        class="submenu-container submenu"
                        :style="{
                        }"
                    >
                    <div class="menu">

                        <div v-for="sub in subCategories[category]" :key="sub.name" class="submenu-item" @click="selectVehicle(sub.model)">
                            <img class="submenu-item-img" :src="sub.imgUrl">
                            <div style="display: flex; flex-direction: column; margin-left: auto; margin-right: auto; text-align: center;">
                                <div class="submenu-item-name">{{ sub.name }}</div>
                                <div class="submenu-item-price">{{ sub.price }}</div>
                            </div>
                        </div>
                        <button @click="buyVehicle">Buy Now !!!</button>
                    </div>
                    <div class="submenu-color menu" style="width: 2vw; margin-left: 20px;">
                            <div v-for="color in colors" >
                                <div @click="changeVehicleColor(color.primaryColorId, color.secondaryColorId)" class="submenu-color-item" :style="{background : color.primaryColorHex}" style="color: transparent;">f</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>


.container {
    display: flex;
    flex-direction: row;
    position: fixed;
    left: 1%;
    top: 1%;
}

.menu {
    padding: 1px 10px;
    background-color: #333;
    opacity: .8;
    border: #555; 
    border-radius: 7px;
    width: 10vw;
    color: white;
    box-shadow: 0 22px 70px 4px rgba(0, 0, 0, 0.56);
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;font-family: "Gill Sans", sans-serif;
    text-align: center;
}

.top-bar {
    margin-top: 10px;
    display: flex;
    width: 13%;
}

.cercle {
    width: 10px;
    height: 10px;
    border-radius: 100px;
    margin: auto;
    box-shadow: 0 10px 20px 1px rgba(255, 255, 255, 0.1);
}

.top-bar-red {
    background-color: #f54254;
}
.top-bar-green {
    background-color: #65f06e;
}
.top-bar-yellow {
    background-color: #f0ed65;
}

.header {
    margin-bottom: 20px;
    margin-top: 10px;
    text-align: center;
    height: 6vh;
    padding: 0;
    width: 100%;
    background-image: url('https://bucket.veemdigital.com/aesthetic-gta-cityscape-desktop-wallpaper-preview.jpg');
    background-size: cover; 
    background-position: center; 
    background-repeat: no-repeat;
    border-radius: 7px;
    display: flex; 
    justify-content: center; 
    align-items: center; 
}

.header h1 {
    text-align: center;
    margin: 0;
    font-size: 3.5em;
}

.item {
    cursor: pointer;
    padding: 10px 10px;
    transition: 1s;
}

.item:hover {
    background-color: #555;
    transition: 1s;
    border-radius: 10px;
}

.submenu-container {
    display: flex;
    flex-direction: row;
}

.submenu {
    position: fixed;
    left: 450px;
    opacity: 0.9;
    width: 10vw;

    cursor: pointer;
}

.submenu-item {
    padding: 10px 10px;
    display: flex;
    flex-direction: row;
}

.submenu-item-img {
    border-radius: 5px;
    width: 25%;
}

.submenu-item-name {

}

.submenu-color {
    display: flex;
    flex-direction: column;
    padding: 10px 10px;
}

.submenu-color-item {
    width: 85%;
    margin-left: auto;
    margin-right: auto;
    border-radius: 3px;
    margin-bottom: 10px;
    cursor: pointer;
}


button {
    width: 80%;
    background-color: #65f06e;
    border-radius: 10px;
    color: #111;
}



</style>