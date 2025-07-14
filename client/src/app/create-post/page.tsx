"use client";

import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import Layout from "../components/Layout";

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!) {
    createPost(title: $title, body: $body) {
      id
      title
      body
    }
  }
`;

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", body: "" });
  const [createPost, { loading, error }] = useMutation(CREATE_POST);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) router.push("/login");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost({ variables: form });
      router.push("/");
    } catch {
      // error shown below
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl mb-6 font-bold">Create New Post</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4 bg-white p-6 rounded shadow"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="body"
          placeholder="Body"
          value={form.body}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded h-32"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
        {error && <p className="text-red-600">Error: {error.message}</p>}
      </form>
    </Layout>
  );
}
