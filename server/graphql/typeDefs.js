import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    author: User!
    comments: [Comment]!
    likes: [User]!
    createdAt: String!
  }

  type Comment {
    id: ID!
    body: String!
    author: User!
    post: Post!
    createdAt: String!
  }

  type Query {
    getPosts: [Post]!
    getPost(id: ID!): Post
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): User!
    createPost(title: String!, body: String!): Post!
    deletePost(id: ID!): String!
    addComment(postId: ID!, body: String!): Comment!
    likePost(postId: ID!): Post!
  }
`;
