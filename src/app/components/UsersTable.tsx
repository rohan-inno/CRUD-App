"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchUsers, selectUsers } from "../slices/usersSlice";
import { logout } from "../slices/authSlice";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import AddUserForm from "./AddUserForm";

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
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    userId: number | null;
  }>({
    isOpen: false,
    userId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  function openDeleteModal(id: number) {
    setDeleteModalState({ isOpen: true, userId: id });
  }

  function closeDeleteModal() {
    if (!isDeleting) {
      setDeleteModalState({ isOpen: false, userId: null });
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        window.location.href = "/login";
        return;
      }

      if (users.length === 0) {
        const result = await dispatch(fetchUsers(token));

        if (
          fetchUsers.rejected.match(result) &&
          (result.payload === "Invalid or expired token" ||
            result.error.message?.includes("401"))
        ) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token");
          dispatch(logout());
          window.location.href = "/login";
        }
      }
    };

    fetchData();
  }, [dispatch, token]);

  // Delete a user
  async function handleConfirmDelete() {
    if (!token || !deleteModalState.userId || isDeleting) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/users/${deleteModalState.userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        dispatch(logout());
        window.location.href = "/login";
        return;
      }

      if (res.ok) {
        toast.success("User deleted successfully!");
        dispatch(fetchUsers(token));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Unexpected error occurred!");
    } finally {
      setIsDeleting(false);
      setDeleteModalState({ isOpen: false, userId: null });
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

    if (res.status === 401) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      dispatch(logout());
      window.location.href = "/login";
      return;
    }

    if (res.ok) {
      toast.success("User updated successfully!");
      setEditingUser(null);
      dispatch(fetchUsers(token));
    } else {
      toast.error("Failed to update user.");
    }
  }

  if (loading)
    return <div className="text-center mt-10 text-gray-600">Loading users...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-white border hover:bg-blue-300 text-black rounded-md transition-colors"
          >
            + Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-700 border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Address</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.phone}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.address}</td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="px-3 py-1 text-sm bg-white border hover:bg-blue-300 text-black rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(user.id)}
                        className="px-3 py-1 text-sm bg-red-400 hover:bg-red-600 text-white rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {editingUser && (
          <div className="mt-10 bg-gray-100 p-6 rounded-xl shadow-inner">
            <h2 className="text-lg font-medium mb-4 text-gray-700">Edit User</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={editingUser.name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, name: e.target.value })
                }
                placeholder="Name"
                className="p-2 border rounded-md w-full"
              />
              <input
                type="text"
                value={editingUser.phone}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, phone: e.target.value })
                }
                placeholder="Phone"
                className="p-2 border rounded-md w-full"
              />
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                placeholder="Email"
                className="p-2 border rounded-md w-full"
              />
              <input
                type="text"
                value={editingUser.address}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, address: e.target.value })
                }
                placeholder="Address"
                className="p-2 border rounded-md w-full"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <AddUserForm onClose={() => setIsAddModalOpen(false)} />
      )}

      <ConfirmModal
        isOpen={deleteModalState.isOpen}
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
}
