import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Table } from '@/components/ui/table.jsx';
import axios from 'axios';

const API_URL = window?.ENV?.API_URL || "http://localhost:3000/api";

if (!API_URL) {
  console.error("API_URL não foi definida no window.ENV.");
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", location: "", age: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/user`);
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_URL}/user/${editingId}`
      : `${API_URL}/newuser`;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          age: Number(formData.age),
        }),
      });
      setFormData({ name: "", location: "", age: "" });
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/deleteuser/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, location: user.location, age: user.age });
    setEditingId(user.id);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Usuários</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <Input
          placeholder="Nome"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <Input
          placeholder="Localização"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
        <Input
          placeholder="Idade"
          type="number"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        />
        <Button type="submit">
          {editingId ? "Atualizar" : "Cadastrar"}
        </Button>
      </form>

      <Table
        users={Array.isArray(users) ? users : []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
