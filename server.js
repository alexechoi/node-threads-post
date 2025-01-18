require("dotenv").config();
const express = require("express");
const { ThreadsAPI } = require("threads-api");
const { generateThread } = require("./openaiHelper");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Threads API with credentials
console.log("Initializing Threads API...");
const threadsAPI = new ThreadsAPI({
  username: process.env.THREADS_USERNAME,
  password: process.env.THREADS_PASSWORD,
});
console.log("Threads API initialized successfully!");

// Test endpoint
app.get("/test", (req, res) => {
  console.log("Received request to /test");
  res.json({ success: true, message: "Server is running!" });
});

// Endpoint for logging in and fetching user profile
app.get("/login", async (req, res) => {
  console.log("Received request to /login");
  try {
    const { user } = await threadsAPI.getUserProfileLoggedIn();
    console.log("User logged in successfully:", user);
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to generate and post a Threads post
app.post("/generate-post", async (req, res) => {
  console.log("Received request to /generate-post with body:", req.body);

  const { theme } = req.body;
  if (!theme) {
    console.log("Missing theme in request body");
    return res.status(400).json({ success: false, error: "Theme is required" });
  }

  try {
    // Generate content using OpenAI
    console.log(`Generating Threads post for theme: "${theme}"...`);
    const threadContent = await generateThread(theme);
    console.log("Generated Threads content:", threadContent);

    // Publish to Threads
    console.log("Publishing post to Threads...");
    const postID = await threadsAPI.publish({ text: threadContent });
    console.log("Post published successfully with ID:", postID);

    res.json({ success: true, message: "Post created successfully!", threadContent, postID });
  } catch (error) {
    console.error("Error creating Threads post:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});