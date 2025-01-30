const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

app.use((req, res, next) => {

    const auth = req.headers.authorization;

    if (auth) {
        if(auth === `Bearer ${process.env.OLLAMA_TOKEN}`) {
            next();
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

app.use('/', createProxyMiddleware({ target: `http://127.0.0.1:${(process.env.OLLAMA_PORT === "") ? "11434" : process.env.OLLAMA_PORT}`, changeOrigin: true }));

app.listen((process.env.APP_PORT === "") ? 3000 : process.env.APP_PORT, () => {
    console.log(`Server is running on port ${(process.env.APP_PORT === "") ? 3000 : process.env.APP_PORT}`);

    if(process.env.OLLAMA_TOKEN === "") {
        throw new Error('OLLAMA_TOKEN is required, set it in .env file');
    }
});
