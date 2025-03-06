import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", completed: false });
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data.slice(0, 8)); 
        } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  async function createPost() {
    try {
      const response = await axios.post(API_URL, newPost);

      // Assign a unique ID for local updates
      const createdPost = { ...response.data, id: Date.now() };

      setPosts([createdPost, ...posts]);
      setNewPost({ title: "", completed: false });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  function startEditing(post) {
    setEditingPost(post);
    setNewPost({ title: post.title, completed: post.completed });
  }

  function updatePost() {
    if (!editingPost) return;

    if (editingPost.id > 200) {
      setPosts(posts.map(post => 
        post.id === editingPost.id ? { ...post, ...newPost } : post
      ));
    } else {
      axios.put(`${API_URL}/${editingPost.id}`, newPost)
        .then(response => {
          setPosts(posts.map(post =>
            post.id === editingPost.id ? { ...post, ...response.data } : post
          ));
        })
        .catch(error => console.error("Error updating post:", error));
    }

    setEditingPost(null);
    setNewPost({ title: "", completed: false });
  }

  async function deletePost(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  return (
    <div className="container">
      <h2>To-Do List</h2>

      <div className="form-container">
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />

        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={newPost.completed}
            onChange={(e) => setNewPost({ ...newPost, completed: e.target.checked })}
          />
          Completed
        </label>

        <button onClick={editingPost ? updatePost : createPost} className="add-button">
          {editingPost ? "Update" : "Add"}
        </button>
      </div>

      <div className="card-grid">
        {posts.map((post) => (
          <div key={post.id} className="card">
            <h3>{post.title}</h3>
            <p>Completed: {post.completed ? "✅ Yes" : "❌ No"}</p>
            <div className="button-group">
              <button onClick={() => startEditing(post)} className="update-button">
                Edit
              </button>
              <button onClick={() => deletePost(post.id)} className="delete-button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
