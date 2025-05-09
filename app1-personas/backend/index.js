const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let personas = [];
let currentId = 1;

// Obtener todas las personas
app.get("/personas", (req, res) => {
  res.json(personas);
});

// Crear una nueva persona
app.post("/personas", (req, res) => {
  const nuevaPersona = { id: currentId++, ...req.body };
  personas.push(nuevaPersona);
  res.json(nuevaPersona);
});

// Actualizar una persona existente
app.put("/personas/:id", (req, res) => {
  const { id } = req.params;
  const index = personas.findIndex((p) => p.id == id);
  if (index !== -1) {
    personas[index] = { id: parseInt(id), ...req.body };
    res.json(personas[index]);
  } else {
    res.status(404).send("Persona no encontrada");
  }
});

// Eliminar una persona
app.delete("/personas/:id", (req, res) => {
  personas = personas.filter((p) => p.id != req.params.id);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
