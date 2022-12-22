import { getFromLocalStorage } from "./localstorage.js";

const cartItems = document.getElementById('cart__items');

let productsFromCart = getFromLocalStorage();
let productsFromApi = [];



(async function init() {
    await getProductsFromApi();
    displayCart(productsFromCart);
    
})();

async function getProductsFromApi() {
    const ids = productsFromCart.map(product => product.id);
    ids.forEach(async (id) => {
        await fetch(`http://localhost:3000/api/products/${id}`).then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((value) => {
            productsFromApi.push(value);
            
        })
        .catch((err) => {
            console.log(err);
        })
        
    })
}

function displayPrice(id){
    const priceProduct = productsFromApi.find((product) => product._id === id);
    const price = priceProduct.price;
    return price;
}

function displayQuantity(){
    let qt = 0;
    productsFromCart.forEach( product => {
        qt += parseInt(product.quantity);
    })
    document.getElementById('totalQuantity').textContent = qt;
}

function changeQuantity(e,color,id) {
    console.log(productsFromCart)
    const qt = e.target.value;
    console.log(qt);
    productsFromCart.find(product => product.color === color && product.id === id).quantity = qt;
    localStorage.setItem('cart', JSON.stringify(productsFromCart))
    displayTotal();
    displayQuantity()
}



function displayTotal(){
    let total = 0;
    productsFromCart.forEach(product => {
        const qt = product.quantity;
        const brut = productsFromApi.find((el) => el._id === product.id);
        const pr = brut.price;
        total += qt * pr;
    })
    let str = total.toString();
    if(str.length>3){
        const arr = str.split('');
        let pre = '';
        let post = '';
        while(arr.length - pre.length > 3 ){
            const i = pre.length;
            pre += '' + (arr[i]);
        }
        post = '' + arr[pre.length] + arr[pre.length+1] + arr[pre.length+2];
        str = pre + ' ' + post;
    }
    const totalPrice = document.getElementById('totalPrice');
    totalPrice.textContent = str;
}

// Display cart

const displayCart = (list) => {
    displayQuantity()
    list.forEach((item) => {
        fetch('http://localhost:3000/api/products/' + item.id)
        .then((res) => {
            if (res.ok) {
                return res.json();
                }
        })
        .then((value) => {
           const newArticle = document.createElement('article');
           const newCartItemImg = document.createElement('div');
           const newImg = document.createElement('img');
           const newCartItemContent = document.createElement('div');
           const newCartItemContentDescription = document.createElement('div');
           const newName = document.createElement('h2');
           const newColor = document.createElement('p');
           const newPrice = document.createElement('p');
           const newCartItemContentSettings = document.createElement('div');
           const newCartItemContentSettingsQuantity = document.createElement('div');
           const newQuantity = document.createElement('p');
           const newInput = document.createElement('input');
           const newCartItemContentSettingsDelete = document.createElement('div');
           const newDeleteItem = document.createElement('p');
           

           newArticle.classList.add('cart__item');
           newCartItemImg.classList.add('cart__item__img');
           newCartItemContent.classList.add('cart__item__content');
           newCartItemContentDescription.classList.add('cart__item__content__description');
           newCartItemContentSettings.classList.add('cart__item__content__settings');
           newInput.classList.add('itemQuantity');
           newCartItemContentSettingsDelete.classList.add('cart__item__content__settings__delete');
           newDeleteItem.classList.add('deleteItem');

            newArticle.setAttribute('data-id', value._id);
            newArticle.setAttribute('data-color', item.color);
            newImg.setAttribute('src', value.imageUrl);
            newImg.setAttribute('alt', value.altTxt);
            newInput.setAttribute('type', 'number');
            newInput.setAttribute('name', 'itemQuantity');
            newInput.setAttribute('min', '1');
            newInput.setAttribute('max', '100');
            newInput.setAttribute('value', item.quantity);

            newName.textContent = item.name;
            newColor.textContent = item.color;
            newPrice.textContent = displayPrice(value._id) + ',00 €';
            newQuantity.textContent = 'Qté : ';
            newDeleteItem.textContent = 'Supprimer';

            newCartItemContentSettingsDelete.append(newDeleteItem);
            newCartItemContentSettingsQuantity.append(newQuantity);
            newCartItemContentSettingsQuantity.append(newInput);
            newCartItemContentSettings.append(newCartItemContentSettingsQuantity);
            newCartItemContentSettings.append(newCartItemContentSettingsDelete);
            newCartItemContentDescription.append(newName);
            newCartItemContentDescription.append(newColor);
            newCartItemContentDescription.append(newPrice);
            newCartItemContent.append(newCartItemContentDescription);
            newCartItemContent.append(newCartItemContentSettings);
            newCartItemImg.append(newImg);
            newArticle.append(newCartItemImg);
            newArticle.append(newCartItemContent);
            cartItems.append(newArticle);
            displayTotal();

            newInput.addEventListener('change', (e) => changeQuantity(e,item.color,value._id))
        })
        .catch((err) => {
            console.log(err);
        })
    })
}


