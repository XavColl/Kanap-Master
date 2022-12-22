// Adds the whole tab of kanaps to the cart, usually with the new kanap

export function saveToLocalStorage(products) {
    localStorage.setItem('cart', JSON.stringify(products));
}

// Gets the cart from LocalStorage

export function getFromLocalStorage() {
    return localStorageHasKey() ? JSON.parse(localStorage.getItem('cart')) : [];
}

// Checks if the cart we want to use exists

export function localStorageHasKey() {
    return !!localStorage.getItem('cart');
}


// Clear the localStorage, used when the order has been passed

export function clearLocalStorage(){
    localStorage.clear();
}
