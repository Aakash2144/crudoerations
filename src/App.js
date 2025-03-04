import React, { useState, useEffect } from "react";
import axios from "axios";
require("./App.css");

const API_URL = "https://jsonplaceholder.typicode.com/posts";

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [editingPost, setEditingPost] = useState(null);

  useEffect(function () {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data.slice(0, 20)); 
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  async function createPost() {
    try {
      const response = await axios.post(API_URL, newPost);
      setPosts([response.data, ...posts]);
      setNewPost({ title: "", body: "" });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  function startEditing(post) {
    setEditingPost(post);
    setNewPost({ title: "", body: "" }); 
  }

  async function updatePost() {
    if (!editingPost) return;
    try {
      const response = await axios.put(`${API_URL}/${editingPost.id}`, newPost);
      setPosts(posts.map(function (post) {
        return post.id === editingPost.id ? { ...post, ...response.data } : post;
      }));
      setEditingPost(null);
      setNewPost({ title: "", body: "" });
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  async function deletePost(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter(function (post) {
        return post.id !== id;
      }));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  return (
    React.createElement("div", { className: "container" },
      React.createElement("h2", null, "CRUD Operations with JSONPlaceholder"),
      React.createElement("div", { className: "form-container" },
        React.createElement("input", {
          type: "text",
          placeholder: "Title",
          value: newPost.title,
          onChange: function (e) { setNewPost({ ...newPost, title: e.target.value }); }
        }),
        React.createElement("input", {
          type: "text",
          placeholder: "Body",
          value: newPost.body,
          onChange: function (e) { setNewPost({ ...newPost, body: e.target.value }); }
        }),
        React.createElement("button", {
          onClick: editingPost ? updatePost : createPost,
          className: "add-button"
        }, editingPost ? "Update Post" : "Add Post")
      ),
      React.createElement("div", { className: "card-grid" },
        posts.map(function (post) {
          return React.createElement("div", { key: post.id, className: "card" },
            React.createElement("h3", null, post.title),
            React.createElement("p", null, post.body),
            React.createElement("div", { className: "button-group" },
              React.createElement("button", {
                onClick: function () { startEditing(post); },
                className: "update-button"
              }, "Edit"),
              React.createElement("button", {
                onClick: function () { deletePost(post.id); },
                className: "delete-button"
              }, "Delete")
            )
          );
        })
      )
    )
  );
}

export default App;
