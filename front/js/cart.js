const cartItems = document.getElementById('cart__items')
let listDifferentProducts = []


//get the cookie and transform it into an array of objects
const getCart = () => {
    const out = []
    const brut = document.cookie
    const net = brut.split('=')[1]
    const listItems = net.split('|')
    listItems.forEach((item) => {
        const json = JSON.parse(item)
        out.push(json)
    })
    return out
}


//cleaning cookie and returning the clean array
const filterCart = (list) => {
    const out = []
    list.forEach((item) => {
        let isAlreadyIn = false
        out.forEach((cleanItem) => {
            if(cleanItem.name === item.name && cleanItem.color === item.color){
                cleanItem.quantity += parseInt(item.quantity)
                isAlreadyIn = true
            }
        })
        if(!isAlreadyIn){
            out.push(item)
        }
    })
    return out
}

//afficher le panier
const displayCart = (list) => {
    list.forEach((item) => {
        fetch('http://localhost:3000/api/products/' + item.id)
        .then((res) => {
            if (res.ok) {
                return res.json()
                }
        })
        .then((value) => {
           const newArticle = document.createElement('article')
           const newCartItemImg = document.createElement('div')
           const newImg = document.createElement('img')
           const newCartItemContent = document.createElement('div')
           const newCartItemContentDescription = document.createElement('div')
           const newName = document.createElement('h2')
           const newColor = document.createElement('p')
           const newPrice = document.createElement('p')
           const newCartItemContentSettings = document.createElement('div')
           const newCartItemContentSettingsQuantity = document.createElement('div')
           const newQuantity = document.createElement('p')
           const newInput = document.createElement('input')
           const newCartItemContentSettingsDelete = document.createElement('div')
           const newDeleteItem = document.createElement('p')

           newArticle.classList.add('cart__item')
           newCartItemImg.classList.add('cart__item__img')
           newCartItemContent.classList.add('cart__item__content')
           newCartItemContentDescription.classList.add('cart__item__content__description')
           newCartItemContentSettings.classList.add('cart__item__content__settings')
           newInput.classList.add('itemQuantity')
           newCartItemContentSettingsDelete.classList.add('cart__item__content__settings__delete')
           newDeleteItem.classList.add('deleteItem')

            newArticle.setAttribute('data-id', value.id)
            newArticle.setAttribute('data-color', item.color)
            newImg.setAttribute('src', value.imageUrl)
            newImg.setAttribute('alt', value.altTxt)
            newInput.setAttribute('type', 'number')
            newInput.setAttribute('name', 'itemQuantity')
            newInput.setAttribute('min', '1')
            newInput.setAttribute('max', '100')
            newInput.setAttribute('value', item.quantity)

            newName.textContent = item.name
            newColor.textContent = item.color
            newPrice.textContent = item.price + ',00 €'
            newQuantity.textContent = 'Qté : '
            newDeleteItem.textContent = 'Supprimer'

            newCartItemContentSettingsDelete.append(newDeleteItem)
            newCartItemContentSettingsQuantity.append(newQuantity)
            newCartItemContentSettingsQuantity.append(newInput)
            newCartItemContentSettings.append(newCartItemContentSettingsQuantity)
            newCartItemContentSettings.append(newCartItemContentSettingsDelete)
            newCartItemContentDescription.append(newName)
            newCartItemContentDescription.append(newColor)
            newCartItemContentDescription.append(newPrice)
            newCartItemContent.append(newCartItemContentDescription)
            newCartItemContent.append(newCartItemContentSettings)
            newCartItemImg.append(newImg)
            newArticle.append(newCartItemImg)
            newArticle.append(newCartItemContent)
            cartItems.append(newArticle)
        })
        .catch((err) => {
            console.log(err)
        })
    })
}

displayCart(filterCart(getCart()))