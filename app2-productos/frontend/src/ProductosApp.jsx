import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductosApp() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3002/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:3002/productos/${editId}`
      : "http://localhost:3002/productos";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        setForm({ nombre: "", descripcion: "", precio: "" });
        setEditId(null);
        return fetch("http://localhost:3002/productos");
      })
      .then((res) => res.json())
      .then((data) => setProductos(data));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3002/productos/${id}`, { method: "DELETE" })
      .then(() => fetch("http://localhost:3002/productos"))
      .then((res) => res.json())
      .then((data) => setProductos(data));
  };

  const handleEdit = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
    });
    setEditId(producto.id);
  };

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="Precio"
          type="number"
          value={form.precio}
          onChange={(e) => setForm({ ...form, precio: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <Button type="submit">{editId ? "Actualizar" : "Agregar"}</Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4">
              <p>
                <strong>Nombre:</strong> {p.nombre}
              </p>
              <p>
                <strong>Descripción:</strong> {p.descripcion}
              </p>
              <p>
                <strong>Precio:</strong> ${p.precio}
              </p>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => handleEdit(p)}>Editar</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(p.id)}
                >
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
