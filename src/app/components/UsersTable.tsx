"use client";
import { useEffect, useState } from "react";

export interface User {
  id: number,
  name: string,
  phone: string,
  email: string,
  address: string,
}

export default function UsersTable(){
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  //Fetch Users from users table (http://localhost:3000/api/users)
  async function fetchUsers(){
      try{
        const token = localStorage.getItem("token");
        if(!token){
          alert("You must be logged in to access this page.")
          return;
        }
        const res = await fetch('/api/users', {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        });

        if(!res.ok){
          const data = await res.json();
          alert(data.error);
          return;
        }
        const data = await res.json();
        setUsers(data);

      } catch(error){
        console.error("Error fetching users: ", error);
      } finally{
        setLoading(false);
      }
    }

  useEffect(()=> {
    fetchUsers();
  }, [])

  //Delete a User from users table
  async function handleDelete(id: number){
    try{
      const token = localStorage.getItem("token");
      if(!token){
        alert("You must be logged in to access this page.")
        return;
      }
      if(!confirm("Are you sure you want to delete this user?")){
        return;
      }
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if(res.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        alert("User deleted successfully!");
      }else{
        const data = await res.json();
        alert("Failed to delete user!");
      }
    } catch(error){
        console.error("Error deleting user: ", error);
        alert("An unexpected error occured!");
    }
  }

  //Handle Edit button
  function handleEdit(user: User) {
    setEditingUser(user);
  }

  //Handle Save edit
  async function handleSaveEdit(){
    if(!editingUser) return;

    const token = localStorage.getItem("token");
    if(!token){
      alert("You must be logged in to access this page.")
      return;
    }

    const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {"Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`},
        body: JSON.stringify(editingUser),
    });

    if(res.ok){
        setUsers((prev) => prev.map((user) => (user.id === editingUser.id ? editingUser : user)));
        setEditingUser(null);
    } else {
        alert('Failed to update user');
    }
  }

  if(loading){
    return (
      <div className="">Loading users... tik..tok..tik..tok..</div>
    )
  }

  return(
    <div>
        <h1>Users</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address</th>
                </tr>
            </thead>
            <tbody>
                {users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user.id}>
                            <td className="">{user.id}</td>
                            <td className="">{user.name}</td>
                            <td className="">{user.phone}</td>
                            <td className="">{user.email}</td>
                            <td className="">{user.address}</td>
                            <td>
                                <button onClick={() => handleEdit(user)}>Edit</button>
                                <button onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={5}>
                            No users found.
                    </td>
                    </tr>
                )}
            </tbody>
        </table>
        {editingUser && (
            <div className="">
                <div className="">
                    <h2 className="">Edit User</h2>
                    <div className="">
                        <input
                            type="text"
                            value={editingUser.name}
                            onChange={(e) =>
                            setEditingUser({ ...editingUser, name: e.target.value })
                            }
                            className=""
                            placeholder="Name"
                        />
                        <input
                            type="text"
                            value={editingUser.phone}
                            onChange={(e) =>
                            setEditingUser({ ...editingUser, phone: e.target.value })
                            }
                            className=""
                            placeholder="Phone"
                        />
                        <input
                            type="email"
                            value={editingUser.email}
                            onChange={(e) =>
                            setEditingUser({ ...editingUser, email: e.target.value })
                            }
                            className=""
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            value={editingUser.address}
                            onChange={(e) =>
                            setEditingUser({ ...editingUser, address: e.target.value })
                            }
                            className=""
                            placeholder="Address"
                        />
                    </div>

                    <div className="">
                        <button onClick={() => setEditingUser(null)}>
                            Cancel
                        </button>
                        <button onClick={handleSaveEdit}                >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}