class BaseDeDatos{
    constructor(){
        this.productos = [];

        this.agregarRegistro(1, "Café molido (454 gramos)", 50, "Alimentos", "cafe_empaquetado.webp");
        this.agregarRegistro(2, "Café molido (222 gramos)", 25, "Alimentos", "cafe_empaquetado_2.webp");
        this.agregarRegistro(3, "Muffin de Chocolate (1 und)", 10, "Alimentos", "muffin.webp");
        this.agregarRegistro(4, "Muffin de Berries (1 und)", 10, "Alimentos", "muffin_berries.webp");
        this.agregarRegistro(5, "Empanada de carne (1 und)", 5, "Alimentos", "empanada_carne.webp");
    }

    agregarRegistro(id, nombre, precio, categoria, imagen){
        const producto = new Producto(id,nombre, precio, categoria, imagen);
        this.productos.push(producto);
    }
    traerRegistros() {
        return this.productos;
    }
    registroPorId(id){
        return this.productos.find((producto) => producto.id === id);
    }
    registrosPorNombre(palabra){
        return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra));
    }
}

//Clase carrito
class Carrito{
    constructor(){
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
        this.carrito = carritoStorage || [];
        this.total = 0;
        this.totalProductos = 0;
        this.listar();
    }
    estaEnCarrito({ id }) {
        return this.carrito.find((producto) => producto.id === id);
    }
    agregar(producto){
        let productoEnCarrito = this.estaEnCarrito(producto);
        if(productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            this.carrito.push({...producto, cantidad: 1});
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }

    quitar(id){
        const indice = this.carrito.findIndex((producto) => producto.id === id);
        if(this.carrito[indice].cantidad>1){
            this.carrito[indice].cantidad--;
        } else{
            this.carrito.splice(indice, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }

    listar(){
        this.total = 0;
        this.totalProductos = 0;
        divCarrito.innerHTML = "";
        for (const producto of this.carrito){
            divCarrito.innerHTML += `
                <div class="producto    ">
                    <h2>${producto.nombre}</h2>
                    <p>${producto.precio}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                    <a href="#" data-id="${producto.id}" class="btnQuitar text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"">Quitar del carrito</a>
                </div> 
            `;
            this.total += (producto.precio * producto.cantidad);
            this.totalProductos += producto.cantidad;
        }
        //Botones de quitar
        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar){
            boton.onclick = (event) =>{
                event.preventDefault();
                this.quitar(Number(boton.dataset.id));
            }
        }
        spanCantidadProductos.innerText = this.totalProductos;
        spanTotalCarrito.innerText = this.total;
    }
}



class Producto{
    constructor(id, nombre, precio, categoria, imagen = false){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

const bd = new BaseDeDatos();

const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const formBuscar = document.querySelector("#formBuscar");
const inputBuscar = document.querySelector("#inputBuscar");

cargarProductos(bd.traerRegistros());

//Muestra los registros de la base de datos en nuestro HTML
function cargarProductos(productos){
    divProductos.innerHTML ="";
    for (const producto of productos){
        divProductos.innerHTML += `
        <div class="producto">
            <h2>${producto.nombre}</h2>
            <p>${producto.precio}</p>
            <img src="img/${producto.imagen}" width="150"/>
            <p><a href="#" class="btnAgregar text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900" data-id="${producto.id}">Agregar al carrito</a></p>
        </div>`;
    }
    //Botones de agregar al carrito
    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    for (const boton of botonesAgregar){
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const id = Number(boton.dataset.id);
            const producto = bd.registroPorId(id);
            carrito.agregar(producto);
        })
    }
}

//Evento buscador
formBuscar.addEventListener("submit", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
})

inputBuscar.addEventListener("keyup", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    cargarProductos(bd.registrosPorNombre(palabra.toLowerCase()));
})

//Objeto carrito
const carrito = new Carrito();