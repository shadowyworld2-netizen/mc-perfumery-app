import './style.css'

const products = [
  { name: 'Chanel No. 5', price: 'R500', description: 'Classic floral fragrance' },
  { name: 'Dior Sauvage', price: 'R450', description: 'Fresh and masculine' },
  { name: 'Gucci Bloom', price: 'R400', description: 'Floral and romantic' },
  { name: 'Tom Ford Black Orchid', price: 'R600', description: 'Exotic and sensual' }
]

function buyProduct(productName) {
  const message = `Hi Mickey, I want to buy ${productName}.`
  const url = `https://wa.me/27799901892?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}

document.querySelector('#app').innerHTML = `
  <header>
    <h1>MC Perfumery</h1>
    <p>Buy exquisite perfumes directly from Mickey Pienaar</p>
  </header>
  <main>
    <div class="products">
      ${products.map(product => `
        <div class="product">
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <p class="price">${product.price}</p>
          <button onclick="buyProduct('${product.name}')">Buy Now</button>
        </div>
      `).join('')}
    </div>
  </main>
  <footer>
    <p>Contact: +27 79 990 1892</p>
  </footer>
`

// Make buyProduct global
window.buyProduct = buyProduct
