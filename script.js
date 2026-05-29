const productLookup={};
const cartItems={};
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://mpd05c24322d93275f75.free.beeceptor.com/data');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data loaded successfully");
        renderProducts(data);
    } catch (error) {
        console.error("Failed to fetch local JSON:", error);
    }
});

let cart = document.getElementById('cart');
cart.addEventListener("click", (event)=>{
    if(event.target.classList.contains("remove-item-btn")){
            console.log("remove btn clicked");
            const selectedID = event.target.id.replace("-remove-btn", "");
            console.log(selectedID);
            productLookup[selectedID].count=0;
            delete cartItems[selectedID];
            let buttonToReset=document.getElementById(selectedID+"-add-btn");
            buttonToReset.style.display="flex";
            buttonToReset.nextElementSibling.style.display="none";
            cartRefresh();
        }
    if(event.target.classList.contains("confirm-order-btn")){
        let finalOrder=[];
        for(let key in cartItems){
            finalOrder.push({
                id: cartItems[key].id,
                qty: productLookup[key].count
            });
        }
        console.log(finalOrder);
        fetch('https://your-api-endpoint.com', {
            method: 'POST', // Specify the method
            headers: {
                'Content-Type': 'application/json', // Tell the server you're sending JSON
            },
            body: JSON.stringify(finalOrder), // Convert JS object to JSON string
        })
        .then(response => response.json()) // Parse the backend's JSON response
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
    }    
});

function renderProducts(data)
{
    let container = document.getElementById('products');
    let htmlString='';
    data.forEach(element => {
            productLookup[element.id]=element;
            element["count"]=0;
            htmlString+=createCard(element);
        });
    container.innerHTML=htmlString;
    container.addEventListener("click", (event)=>{
        const card = event.target.closest('.product-card');
        //eventlistner to change 'Add to card' button with 'increment/decrement' buttons'
        if(event.target.classList.contains("idle")){
            event.target.style.display="none";
            event.target.nextElementSibling.style.display="flex";
            increment(card.dataset.id);
        }
        //eventlistner for 'increment/decrement' buttons'
        if(event.target.classList.contains("icon-btn")){
            if(event.target.id.includes("inc")){
                increment(card.dataset.id);
            }
            if(event.target.id.includes("dec")){
                decrement(card.dataset.id, event.target);
            }
        }
    })
}

function createCard(cardData)
{
    return `
        <article class="product-card" data-id="${cardData.id}">
            <div class="image-container">
                <img src="${cardData.image.desktop}" class="product-image"/>
                <button class="add-btn idle" id="${cardData.id}-add-btn">
                    <img src="assets/images/icon-add-to-cart.svg">
                    Add to cart
                </button>
                <span class="add-btn added-to-cart">
                    <button class="icon-btn" id="${cardData.id}-dec-btn">
                        <img src="assets/images/icon-decrement-quantity.svg">
                    </button>
                    <p id="${cardData.id}-count">Add to cart</p>
                    <button class="icon-btn" id="${cardData.id}-inc-btn">
                        <img src="assets/images/icon-increment-quantity.svg">
                    </button>
                </span>
            </div>
            <div class="product-info">
                <p class="product-category">${cardData.category}</p>
                <p class="product-name">${cardData.name}</p>
                <p class="product-price">$ ${cardData.price.toFixed(2)}</p>
            </div>
        </article>
    `;
}

function increment(selectedID){
    productLookup[selectedID].count++;
    let p=document.getElementById(selectedID+'-count');
    p.innerText=productLookup[selectedID].count;
    cartIncrement(selectedID);
}

function decrement(selectedID, clickedButton){
    productLookup[selectedID].count--;
    let p=document.getElementById(selectedID+'-count');
    if(productLookup[selectedID].count==0)
    {
        clickedButton.parentElement.style.display="none";
        clickedButton.parentElement.previousElementSibling.style.display="flex";
    }
    p.innerText=productLookup[selectedID].count;
    cartDecrement(selectedID);
}

function cartIncrement(selectedID)
{
    if(!cartItems[selectedID]){
        cartItems[selectedID]=productLookup[selectedID];
    }
    cartRefresh();
}

function cartDecrement(selectedID)
{
    if(cartItems[selectedID].count==0){
        delete cartItems[selectedID];
    }
    cartRefresh();
}

function cartRefresh()
{
    if(Object.keys(cartItems).length==0){
     console.log("cart is empty");
        document.getElementById('cart-content-true').style.display="none";
        document.getElementById('cart-content-empty').style.display="flex";
        document.getElementById('cart-count').innerText=0;
        return;
    }
    document.getElementById('cart-content-true').style.display="block";
    document.getElementById('cart-content-empty').style.display="none";
    let container=document.getElementById('cart-items-list');
    let htmlString='';
    for(let key in cartItems){
        htmlString+=renderCartItem(key);
    }
    container.innerHTML=htmlString;
    document.getElementById('cart-count').innerText=Object.keys(cartItems).length;
    document.getElementById('cart-order-total').innerText=calculateCartTotal();
}

function renderCartItem(selectedID)
{
    return `
        <li class="cart-item" id="${selectedID}-cart-item">
            <div class="caert-item-details-container">
                <p class="cart-item-name">${productLookup[selectedID].name}</p>
                <span class="cart-item-details" id="${selectedID}-cart-item-details">
                    <p class="cart-item-qty">${productLookup[selectedID].count}x</p>
                    <p class="cart-item-price">@ ${productLookup[selectedID].price}</p>
                    <p class="cart-item-total">${productLookup[selectedID].count*productLookup[selectedID].price}</p>
                </span>
            </div>
            <button class="remove-item-btn" id="${selectedID}-remove-btn">
                <img src="assets/images/icon-remove-item.svg">
            </button>
        </li>
    `;
}

function calculateCartTotal()
{
    let total=0;
    for(let key in cartItems){
        total+=cartItems[key].count*cartItems[key].price;
    }
    return '$ '+total.toFixed(2);
}