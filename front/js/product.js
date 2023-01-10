import { getFromLocalStorage } from "./localstorage.js";

const href = window.location.href;
const url = new URL(href);
const id = url.searchParams.get("id");
let productsList = [];

const quantity = document.getElementById('quantity');
const colorsSelect = document.getElementById('color-select');

/** Initiates the document */

(function init() {
    displayOneProduct();

    const buttonSubmit = document.getElementById('addToCart');
    buttonSubmit.addEventListener('click', addToCart);
})();

/**  Displaying one product according to the id in the url */

function displayOneProduct() {
    fetch(`http://localhost:3000/api/products/${id}`).then((res) => {
        if (res.ok) {
            return res.json();
        }
    })
    .then((value) => {
        value.colors.forEach((color) => {
            const newOption = document.createElement('option');
            newOption.setAttribute('value', color);
            newOption.textContent = color;
            colorsSelect.append(newOption);
        });

        const newImg = document.createElement('img');

        newImg.setAttribute('src', value.imageUrl);
        newImg.setAttribute('alt', value.altTxt);

        document.querySelector('.item__img').append(newImg);
        document.getElementById('title').textContent = value.name;
        document.getElementById('price').textContent = value.price;
        document.getElementById('description').textContent = value.description;
    })
    .catch((err) => {
        console.log(err);
    })
}

/**  Function triggered by the button, which adds items in local storage */

function addToCart() {
    productsList = getFromLocalStorage();
    if(!colorsSelect.value) return // disabling if the color is not set
    const obj = {
        color : colorsSelect.value,
        quantity : parseInt(quantity.value),
        id
    };
    let isAlreadyIn = false;
    productsList.forEach(product => {
        if(product.id === obj.id && product.color === obj.color){
            isAlreadyIn = true;
            product.quantity += parseInt(obj.quantity);
        }
    })
    if(isAlreadyIn === false){
        productsList.push(obj);
    }
    localStorage.setItem('cart', JSON.stringify(productsList));
}