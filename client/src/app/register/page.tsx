"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Layout from "../components/Layout";
import { useRouter } from "next/navigation";

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      id
      username
      email
      token
    }
  }
`;

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [register, { loading, error }] = useMutation(REGISTER_MUTATION);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await register({ variables: form });
      localStorage.setItem("token", data.register.token);
      router.push("/");
    } catch {
      // Handle error silently, error message shows below
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl mb-6 font-bold">Register</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4 bg-white p-6 rounded shadow"
      >
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {error && <p className="text-red-600">Error: {error.message}</p>}
      </form>
    </Layout>
  );
}
