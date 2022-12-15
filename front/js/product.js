const id = location.search.split('=')[1]


//displaying one product according to the id in the url
const displayOneProduct = async () => {
    fetch('http://localhost:3000/api/products/' + id).then((res) => {
        if (res.ok) {
            return res.json()
            }
    })
    .then((value) => {
        value.colors.forEach((color) => {
            const newOption = document.createElement('option')
            newOption.setAttribute('value', color)
            newOption.textContent = color
            document.getElementById('colors').append(newOption)
        })

        const newImg = document.createElement('img')

        newImg.setAttribute('src', value.imageUrl)
        newImg.setAttribute('alt', value.altTxt)

        document.querySelector('.item__img').append(newImg)
        document.getElementById('title').textContent = value.name
        document.getElementById('price').textContent = value.price
        document.getElementById('description').textContent = value.description
        
    
    })
    
    .catch((err) => {
        console.log(err)
    })
}


//Function triggered by the button, which adds items in cookie
const addToCart = () => {
    const obj = {
        name : document.getElementById('title').textContent,
        price : parseInt(document.getElementById('price').textContent),
        color : document.getElementById('colors').value,
        quantity : parseInt(document.getElementById('quantity').value),
        id
    }
    let cookie = ''
    if(document.cookie.length<2){
        cookie = 'basket=' + JSON.stringify(obj)
    }else cookie = document.cookie + '|' +JSON.stringify(obj)
    document.cookie = cookie
}


displayOneProduct()