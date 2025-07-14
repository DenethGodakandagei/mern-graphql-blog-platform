import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comments.js";
import { generateToken } from "../utils/generateToken.js";

export const resolvers = {
  Query: {
    getPosts: async () => {
      return await Post.find()
        .populate("author")
        .populate("likes")
        .populate({
          path: "comments",
          populate: { path: "author" },
        });
    },
    getPost: async (_, { id }) => {
      return await Post.findById(id)
        .populate("author")
        .populate("likes")
        .populate({
          path: "comments",
          populate: { path: "author" },
        });
    },
  },

  Mutation: {
   register: async (_, { username, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already registered.");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashedPassword });

  const token = generateToken(user);

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    token
  };
},

login: async (_, { email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials.");

  const token = generateToken(user);

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    token
  };
},

    createPost: async (_, { title, body }, { user }) => {
      if (!user) throw new Error("Unauthorized");

      const post = await Post.create({ title, body, author: user.id });
      return post.populate("author");
    },

    deletePost: async (_, { id }, { user }) => {
      if (!user) throw new Error("Unauthorized");

      const post = await Post.findById(id);
      if (!post) throw new Error("Post not found.");
      if (post.author.toString() !== user.id) throw new Error("Not your post.");

      await Post.findByIdAndDelete(id);
      return "Post deleted.";
    },

   addComment: async (_, { postId, body }, { user }) => {
  if (!user) throw new Error("Unauthorized");

  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found.");

  const comment = await Comment.create({
    body,
    author: user.id,
    post: postId,
  });

  // Push comment id into post.comments and save
  post.comments.push(comment._id);
  await post.save();

  return comment.populate("author").populate("post");
},


    likePost: async (_, { postId }, { user }) => {
      if (!user) throw new Error("Unauthorized");

      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found.");

      const alreadyLiked = post.likes.includes(user.id);

      if (alreadyLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== user.id);
      } else {
        post.likes.push(user.id);
      }

      await post.save();
      return post.populate("author").populate("likes");
    },
  },
};
