import { getFromLocalStorage, saveToLocalStorage } from "./localstorage.js";

const cartItems = document.getElementById('cart__items');

let productsFromCart = getFromLocalStorage();
let productsFromApi = [];


// Initialize the page
(async function init() {
    await getProductsFromApi();

    displayCart();
})();


// Getting all products from the API with cart basis
async function getProductsFromApi() {
    const ids = productsFromCart.map(product => product.id);

    productsFromApi = await Promise.all(
        ids.map(id => fetch(`http://localhost:3000/api/products/${id}`).then((res) => {
            return res.json();
        }))
    );
}


// Display price of one product
function displayPrice(id){
    const priceProduct = productsFromApi.find((product) => product._id === id);
    return priceProduct.price;
}


// Display total quantity of all products
function displayQuantity(){
    let qt = 0;

    productsFromCart.forEach( product => {
        qt += parseInt(product.quantity);
    });

    document.getElementById('totalQuantity').textContent = qt;
}


// Update total price and total quantity
function changeQuantity(e,color,id) {
    const qt = e.target.value;
    productsFromCart.find(product => product.color === color && product.id === id).quantity = qt;
    localStorage.setItem('cart', JSON.stringify(productsFromCart));
    displayTotal();
    displayQuantity();
}


/**  
 * Delete one product from cart according to the id
 * @param {string} id - The id of the product to delete
 * @param {string} color - The color of the product to delete 
 */

function deleteFromCart(id, color) {
    const articles = document.getElementsByClassName('cart__item');
    for(const art of articles) {
        if(art.dataset.id === id && art.dataset.color === color){
            const arr = [];
            productsFromCart.forEach(product => {
                if(product.id !== id || product.color !== color){
                    arr.push(product);
                }
            })
            saveToLocalStorage(arr);
            productsFromCart = arr;
        }
    }
    displayCart()
}


/**  Display total price */

function displayTotal() {
    const totalPrice = document.getElementById('totalPrice');
    let total = 0;

    productsFromCart.forEach(product => {
        const qt = product.quantity;
        const brut = productsFromApi.find((el) => el._id === product.id);
        const pr = brut.price;
        total += qt * pr;
    });

    let str = total.toString();
    if(str.length > 3) {
        const arr = str.split('');
        let pre = '';
        let post = '';
        while(arr.length - pre.length > 3){
            const i = pre.length;
            pre += '' + (arr[i]);
        }
        post = '' + arr[pre.length] + arr[pre.length + 1] + arr[pre.length + 2];
        str = pre + ' ' + post;
    }

    totalPrice.textContent = str;
}


/**  Removing the whole cart */

function removeCart() {
    while(cartItems.firstChild){
        cartItems.removeChild(cartItems.firstChild);
    }
}

/**  Display each product in cart */

function displayCart() {
    removeCart();
    document.getElementById('totalPrice').textContent = 0;
    productsFromCart.forEach((item) => {
        const productFromAPI = productsFromApi.find(prd => prd._id === item.id);

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

        newArticle.setAttribute('data-id', productFromAPI._id);
        newArticle.setAttribute('data-color', item.color);
        newImg.setAttribute('src', productFromAPI.imageUrl);
        newImg.setAttribute('alt', productFromAPI.altTxt);
        newInput.setAttribute('type', 'number');
        newInput.setAttribute('name', 'itemQuantity');
        newInput.setAttribute('min', '1');
        newInput.setAttribute('max', '100');
        newInput.setAttribute('value', item.quantity);

        newName.textContent = item.name;
        newColor.textContent = item.color;
        newPrice.textContent = displayPrice(productFromAPI._id) + ' €';
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

        newInput.addEventListener('change', (e) => changeQuantity(e, item.color, productFromAPI._id));
        newDeleteItem.addEventListener('click', () => deleteFromCart(productFromAPI._id, item.color))
    });

displayQuantity();
}


// Making the messages display : 

document.getElementById('firstName').addEventListener('change', (e) => checkFirstName(e));
document.getElementById('lastName').addEventListener('change', (e) => checkLastName(e));
document.getElementById('address').addEventListener('change', (e) => checkAdress(e));
document.getElementById('city').addEventListener('change', (e) => checkCity(e));
document.getElementById('email').addEventListener('change', (e) => checkEmail(e));

/** Checks the firstName with Regex 
 * @param {Event} e - the event of the document.
*/

function checkFirstName(e) {
    const re = /^[A-Z][A-Za-z\é\è\ê\ä\ë\-]+$/;
    if(re.test(e.target.value)){
        document.getElementById('firstNameErrorMsg').textContent = '';
    }
    else document.getElementById('firstNameErrorMsg').textContent = 'Prénom au mauvais format';
}

/** Checks the last name with Regex 
 * @param {Event} e - the event of the document.
*/

function checkLastName(e) {
    const re = /^[A-Z][A-Za-z\é\è\ê\ä\ë\-]+$/;
    if(re.test(e.target.value)){
        document.getElementById('lastNameErrorMsg').textContent = '';
    }
    else document.getElementById('lastNameErrorMsg').textContent = 'Nom au mauvais format';
}

/** Checks the adress with Regex 
 * @param {Event} e - the event of the document.
*/

function checkAdress(e) {
    const re = /(\d{1,}) [a-zA-Z0-9\s]+(\.)? [a-zA-Z]/;
    if(re.test(e.target.value)){
        document.getElementById('addressErrorMsg').textContent = '';
    }
    else document.getElementById('addressErrorMsg').textContent = 'Adresse au mauvais format';
}

/** Checks the city with Regex 
 * @param {Event} e - the event of the document.
*/

function checkCity(e) {
    const re = /^[A-Z][A-Za-z\é\è\ê\ä\ë\-]+$/;
    if(re.test(e.target.value)){
        document.getElementById('cityErrorMsg').textContent = '';
    }
    else document.getElementById('cityErrorMsg').textContent = 'Nom de ville au mauvais format';
}

/** Checks the email with Regex 
 * @param {Event} e - the event of the document.
*/

function checkEmail(e) {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if(re.test(e.target.value)){
        document.getElementById('emailErrorMsg').textContent = '';
    }
    else document.getElementById('emailErrorMsg').textContent = 'Email au mauvais format';
}

document.getElementById('order').addEventListener('click', (e) => order(e));

/** Orders the content of the cart
 * @param {Event} e - the event of the document.
 */

function order (e){
    e.preventDefault()
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const address = document.getElementById('address');
    const city = document.getElementById('city');
    const email = document.getElementById('email');
    const re1 = /^[A-Z][A-Za-z\é\è\ê\ä\ë\-]+$/;
    const re2 = /(\d{1,}) [a-zA-Z0-9\s]+(\.)? [a-zA-Z]/;
    const re3 = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if(productsFromCart.length<=0)  return alert('Votre panier est vide') ;
    if(
        re1.test(firstName.value) 
        && re1.test(lastName.value) 
        && re1.test(city.value) 
        && re2.test(address.value) 
        && re3.test(email.value)
    ){
        const products = productsFromCart.map(product => product.id);

        const contact = {
            firstName,
            lastName,
            city,
            address,
            email
            
        }


        fetch("http://localhost:3000/api/products/order", {
            method: 'post',
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({contact,products})
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
        }).then(value => {
            if(value.orderId !== ''){
                location.href = 'confirmation.html?id=' + value.orderId;
            }
        });
    }
    else {
        alert('Vous devez remplir tout le formulaire avant de passer commande')
    }
}