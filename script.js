// GLOBALS VARIABLES;
const itemSection = document.querySelector('.items');
const olCart = document.querySelector('.cart__items');
const btnClearCart = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');
const totalPrice = document.querySelector('.total-price');

const saveCart = () => {
  localStorage.setItem('savedProducts', olCart.innerHTML);
};

const loadCart = () => {
  olCart.innerHTML = localStorage.getItem('savedProducts');
};

const savePrice = () => {
  localStorage.setItem('savedPrice', totalPrice.innerHTML);
};

const loadPrice = () => {
  totalPrice.innerHTML = localStorage.getItem('savedPrice');
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const priceCalculate = (salePrice, operator) => {
  let price = Number(totalPrice.innerHTML) || 0;
  if (operator === '+') {
    price += (salePrice);
  } else {
    price -= (salePrice) / 2;
  }
  totalPrice.innerHTML = price;
  savePrice();
};

function cartItemClickListener(event) {
  event.target.remove();
  const priceTreatment = event.target.innerHTML.split('$')[1];
  priceCalculate(priceTreatment, '-');
  saveCart();
}

olCart.addEventListener('click', (cartItemClickListener));

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  olCart.appendChild(li);
  priceCalculate(salePrice, '+');
  saveCart();
  return li;
}

const getId = (itemId) => fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => {
    response.json().then((results) => {
      const { title, id, price } = results;
      createCartItemElement({ sku: id, name: title, salePrice: price });
    });
  });

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', (event) => {
    const id = event.target.parentElement.firstElementChild.innerHTML;
    (getId(id));
  });
  section.appendChild(button);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchApiList = (produto = 'computador') => {
  setTimeout(() => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto} `)
      .then((response) => {
        response.json().then(({ results }) => {
          results.forEach(({ id, title, thumbnail }) => {
            const section = createProductItemElement({ sku: id, name: title, image: thumbnail });
            itemSection.appendChild(section);
            loading.remove();
          });
        });
      });
  }, 0);
};
// BOTÃO DE LIMPAR CARRINHO;
const clearCart = () => {
  olCart.innerHTML = '';
  totalPrice.innerHTML = 0;
  saveCart();
  savePrice();
};

btnClearCart.addEventListener('click', (clearCart));

window.onload = () => {
  fetchApiList();
  loadCart();
  loadPrice();
};
