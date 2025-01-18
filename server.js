import express from 'express';
import * as dotenv from 'dotenv';
import { generateTweet } from './generate-threads.js';
import { immediatePost } from './auto-post.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/post-thread', async (req, res) => {
    try {
        const { theme } = req.body;

        if (!theme) {
            return res.status(400).json({ error: "Theme is required" });
        }

        console.log("Generating thread content...");
        const threadContent = await generateTweet(theme);

        console.log("Posting to Threads...");
        await immediatePost(threadContent);

        res.json({ success: true, message: "Thread posted successfully!", content: threadContent });
    } catch (error) {
        console.error("Error posting thread:", error);
        res.status(500).json({ error: "Failed to post thread" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
