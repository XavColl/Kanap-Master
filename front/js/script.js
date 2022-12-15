//DOM elements

const domItems = document.getElementById('items')

// fetching all the products to sell and displaying them
const displayAllProducts = async () => {
    await fetch('http://localhost:3000/api/products/').then((res) => {
        if (res.ok) {
        return res.json()
        }
    })
    .then((value) => {
        value.forEach((item) => {
            const newLink = document.createElement('a')
            const newArticle = document.createElement('article')
            const newImg = document.createElement('img')
            const newHeader = document.createElement('h3')
            const newPar = document.createElement('p')

            newHeader.classList.add('productName')
            newPar.classList.add('productDescription')

            newHeader.textContent = item.name
            newPar.textContent = item.description

            newImg.setAttribute('src', item.imageUrl)
            newImg.setAttribute('alt', item.altTxt)
            newLink.setAttribute('href', `./product.html?id=${item._id}`)

            newArticle.append(newImg)
            newArticle.append(newHeader)
            newArticle.append(newPar)
            newLink.append(newArticle)
            domItems.append(newLink)
        })
    })
    .catch((err) => {
        console.log(err)
    })
}
displayAllProducts()