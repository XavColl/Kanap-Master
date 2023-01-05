const href = window.location.href
const url = new URL(href);
const id = url.searchParams.get("id");

initPage()

// Displaying the order id in the page.

function initPage (){
    document.getElementById('orderId').textContent = id;
}