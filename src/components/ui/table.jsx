export function Table({ users, onEdit, onDelete }) {
  return (
    <table className="w-full border text-left">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Localização</th>
          <th>Idade</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.location}</td>
            <td>{user.age}</td>
            <td>
              <button className="text-blue-600 mr-2" onClick={() => onEdit(user)}>Editar</button>
              <button className="text-red-600" onClick={() => onDelete(user.id)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
