"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchUsers, selectUsers } from "../slices/usersSlice";

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export default function UsersTable() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const { loading, error } = useAppSelector((state) => state.users);
  const token = useAppSelector((state) => state.auth.token);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Fetch all users on mount
  useEffect(() => {
    if (token) {
      dispatch(fetchUsers(token));
    }
  }, [dispatch, token]);

  // Delete a user
  async function handleDelete(id: number) {
    if (!token) {
      alert("You must be logged in to access this page.");
      return;
    }

    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("User deleted successfully!");
        dispatch(fetchUsers(token)); // refresh list
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Unexpected error occurred!");
    }
  }

  // Save edits
  async function handleSaveEdit() {
    if (!editingUser || !token) return;

    const res = await fetch(`/api/users/${editingUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingUser),
    });

    if (res.ok) {
      alert("User updated successfully!");
      setEditingUser(null);
      dispatch(fetchUsers(token));
    } else {
      alert("Failed to update user.");
    }
  }

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Users</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Address</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>
                  <button onClick={() => setEditingUser(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={6}>No users found.</td></tr>
          )}
        </tbody>
      </table>

      {editingUser && (
        <div>
          <h2>Edit User</h2>
          <input
            type="text"
            value={editingUser.name}
            onChange={(e) =>
              setEditingUser({ ...editingUser, name: e.target.value })
            }
          />
          <input
            type="text"
            value={editingUser.phone}
            onChange={(e) =>
              setEditingUser({ ...editingUser, phone: e.target.value })
            }
          />
          <input
            type="email"
            value={editingUser.email}
            onChange={(e) =>
              setEditingUser({ ...editingUser, email: e.target.value })
            }
          />
          <input
            type="text"
            value={editingUser.address}
            onChange={(e) =>
              setEditingUser({ ...editingUser, address: e.target.value })
            }
          />

          <div>
            <button onClick={() => setEditingUser(null)}>Cancel</button>
            <button onClick={handleSaveEdit}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
