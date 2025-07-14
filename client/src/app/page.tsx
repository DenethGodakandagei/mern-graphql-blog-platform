"use client";

import { gql, useQuery } from "@apollo/client";

const GET_POSTS = gql`
  query {
    getPosts {
      id
      title
      body
      author {
        username
      }
    }
  }
`;

export default function Page() {
  const { loading, error, data } = useQuery(GET_POSTS);

  if (loading) return <p className="p-4">Loading posts...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error.message}</p>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>

      {data.getPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        data.getPosts.map((post: any) => (
          <article key={post.id} className="mb-6 p-4 border rounded shadow-sm bg-white">
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            <p className="mt-2">{post.body}</p>
            <p className="mt-1 text-sm text-gray-500">By: {post.author?.username || "Unknown"}</p>
          </article>
        ))
      )}
    </main>
  );
}
