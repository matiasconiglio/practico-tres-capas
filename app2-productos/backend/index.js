const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json());

let productos = [];
let currentId = 1;

// Obtener todos los productos
app.get("/productos", (req, res) => {
  res.json(productos);
});

// Crear un nuevo producto
app.post("/productos", (req, res) => {
  const nuevoProducto = { id: currentId++, ...req.body };
  productos.push(nuevoProducto);
  res.json(nuevoProducto);
});

// Actualizar un producto existente
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const index = productos.findIndex((p) => p.id == id);
  if (index !== -1) {
    productos[index] = { id: parseInt(id), ...req.body };
    res.json(productos[index]);
  } else {
    res.status(404).send("Producto no encontrado");
  }
});

// Eliminar un producto
app.delete("/productos/:id", (req, res) => {
  productos = productos.filter((p) => p.id != req.params.id);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Servidor de productos corriendo en http://localhost:${port}`);
});
