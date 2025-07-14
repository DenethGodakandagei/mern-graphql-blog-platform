"use client";

import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Layout from "../components/Layout";
import { useRouter } from "next/navigation";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      username
      email
      token
    }
  }
`;

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: form });
      localStorage.setItem("token", data.login.token);
      router.push("/");
    } catch {
      // error shown below
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl mb-6 font-bold">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4 bg-white p-6 rounded shadow"
      >
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
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-600">Error: {error.message}</p>}
      </form>
    </Layout>
  );
}
