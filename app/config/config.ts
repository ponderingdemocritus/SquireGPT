require('dotenv').config();
export const twitterConfig = {
    consumer_key: process.env.CONSUMER_KEY || "",
    consumer_secret: process.env.CONSUMER_SECRET || "",
    access_token: process.env.ACCESS_TOKEN_KEY || "",
    access_token_secret: process.env.ACCESS_TOKEN_SECRET || "",
};