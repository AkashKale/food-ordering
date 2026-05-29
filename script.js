document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://mp263ab9bd142335b39a.free.beeceptor.com/data');
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

function renderProducts(data)
{
    let container = document.getElementById('products');
    let htmlString='';
    const productLookup={};
    data.forEach(element => {
            productLookup[element.id]=element;
            element["count"]=0;
            htmlString+=createCard(element);
        });
    container.innerHTML=htmlString;
    container.addEventListener("click", (event)=>{
        const card = event.target.closest('.product-card');
        //eventlistner to change 'Add to card' button with 'increment/decrement' buttons'
        if(event.target.classList.contains("idle"))
        {
            event.target.style.display="none";
            event.target.nextElementSibling.style.display="flex";
            productLookup[card.dataset.id].count++;
            let p=document.getElementById(card.dataset.id+'-count');
            console.log(p);
            p.innerText=productLookup[card.dataset.id].count;
        }
        if(event.target.classList.contains("inner-btn"))
        {
            console.log(event.target);
            if(event.target.id.includes("inc"))
            {
                console.log("inc");
                increment(card.dataset.id, event.target);
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
                    <button class="inner-btn" id="${cardData.id}-dec-btn">
                        <img src="assets/images/icon-decrement-quantity.svg">
                    </button>
                    <p id="${cardData.id}-count">Add to cart</p>
                    <button class="inner-btn" id="${cardData.id}-inc-btn">
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

function increment(selectedID, clickedButton)
{
    
}