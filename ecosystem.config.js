module.exports = {
    apps : [{
        name: "app",
        script: "node index.js",
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
};
