const socket = io();

document.getElementById("agregarProducto").addEventListener('submit', (e) => {
  e.preventDefault();
  const newProduct = {
      title: document.getElementById('title').value.trim(),
      description: document.getElementById('description').value.trim(),
      code: document.getElementById('code').value.trim(),
      price: document.getElementById('price').value.trim(),
      stock: document.getElementById('stock').value.trim(),
      category: document.getElementById('category').value.trim(),
  }

  socket.emit('nuevoProducto', newProduct);
})


document.getElementById("deleteProduct").addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('eliminarProducto', +document.getElementById('deleteById').value);
});

socket.on('actualizar', async () => {
    const productList = document.getElementById("productList");
    let ul = "";
    
    const response = await fetch("http://localhost:8080/api/products", {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
    },
    })

    const products = await response.json()

    products.forEach((producto) => {
      ul += `<li>${producto.title} - ${producto.productId}</li>`;
    });

    productList.innerHTML = ul;
});
