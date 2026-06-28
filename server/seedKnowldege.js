require("dotenv").config();;
const mongoose = require("mongoose");
const Knowledge = require("./models/Knowledge.js");
const navalTweets = require("./data/navalTweets.json");

async function seedKnowledge() {
    try {

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connected to mongoDB");

        const formattedTweets = navalTweets.map((tweet) => ({
            externalId: tweet.id,
            text: tweet.text,
            source: tweet.source,
            topic: tweet.topic,
            keywords: [tweet.topic],
        }));

        await Knowledge.deleteMany({});
        console.log("Old tweets deleted");

        await Knowledge.insertMany(formattedTweets);
        console.log("New tweets inserted");
        
        console.log(`Inserted ${formattedTweets.length} items`);     
        process.exit();

    } catch (error) {
        console.error("seeding failed", error.message);
        process.exit(1)        
    }
}

seedKnowledge();