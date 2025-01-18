import threadsPkg from 'threads-api';
const { ThreadsAPI } = threadsPkg;
import * as dotenv from 'dotenv';

dotenv.config();

console.log("🔐 Username:", process.env.USERNAME || "❌ Missing USERNAME");
console.log("🔐 Password:", process.env.PASSWORD ? "Loaded" : "❌ Missing PASSWORD");

const threadsAPI = new ThreadsAPI({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
});

async function authenticateThreadsAPI() {
    try {
        console.log("🔍 Logging into Threads...");
        await threadsAPI.login();
        console.log("✅ Successfully logged in!");

        console.log("📌 Available methods in ThreadsAPI:", Object.keys(threadsAPI));

        // ✅ Use getUserProfileLoggedIn() instead of getProfile()
        const { user } = await threadsAPI.getUserProfileLoggedIn();
        console.log("👤 User Profile:", JSON.stringify(user, null, 2));
    } catch (error) {
        console.error("❌ Authentication failed!", error);
        throw new Error("Threads API authentication failed. Check USERNAME/PASSWORD.");
    }
}

await authenticateThreadsAPI();

export const immediatePost = async (text, image = null) => {
    try {
        console.log("📝 Preparing to post...");
        console.log(`📢 Posting message: "${text}"`);
        if (image) {
            console.log(`📷 Image URL: ${image}`);
        }

        console.log("🔍 Checking ThreadsAPI instance:", threadsAPI);
        console.log("📌 Available methods:", Object.keys(threadsAPI));

        if (!threadsAPI || typeof threadsAPI.publish !== "function") {
            console.error("❌ ThreadsAPI instance is not initialized correctly.");
            return;
        }

        console.log("📤 Payload being sent to Threads API:", { text, image });

        const response = image 
            ? await threadsAPI.publish({ text, image }) 
            : await threadsAPI.publish({ text });

        console.log("✅ Response from Threads API:", response);
        console.log("✅ Successfully posted to Threads!");
    } catch (error) {
        console.error("❌ Error posting to Threads:", error);
        if (error.response) {
            console.error("📌 Error Response Data:", error.response.data);
        } else if (error.message) {
            console.error("📌 Error Message:", error.message);
        }
        throw error;
    }
};