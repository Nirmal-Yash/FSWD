import React, { useState } from "react";
import axios from "axios";
import "./Auth.css"; // import css

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      setMessage(res.data.message);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="auth-container login-bg">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        {message && <p className="msg">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account? <a href="/register">Register now</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
