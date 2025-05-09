import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PersonasApp() {
  const [personas, setPersonas] = useState([]);
  const [form, setForm] = useState({ nombre: "", apellido: "", edad: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/personas")
      .then((res) => res.json())
      .then((data) => setPersonas(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:3001/personas/${editId}`
      : "http://localhost:3001/personas";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        setForm({ nombre: "", apellido: "", edad: "" });
        setEditId(null);
        return fetch("http://localhost:3001/personas");
      })
      .then((res) => res.json())
      .then((data) => setPersonas(data));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/personas/${id}`, { method: "DELETE" })
      .then(() => fetch("http://localhost:3001/personas"))
      .then((res) => res.json())
      .then((data) => setPersonas(data));
  };

  const handleEdit = (persona) => {
    setForm({
      nombre: persona.nombre,
      apellido: persona.apellido,
      edad: persona.edad,
    });
    setEditId(persona.id);
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
          placeholder="Apellido"
          value={form.apellido}
          onChange={(e) => setForm({ ...form, apellido: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          placeholder="Edad"
          type="number"
          value={form.edad}
          onChange={(e) => setForm({ ...form, edad: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <Button type="submit">{editId ? "Actualizar" : "Agregar"}</Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {personas.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4">
              <p>
                <strong>Nombre:</strong> {p.nombre}
              </p>
              <p>
                <strong>Apellido:</strong> {p.apellido}
              </p>
              <p>
                <strong>Edad:</strong> {p.edad}
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
