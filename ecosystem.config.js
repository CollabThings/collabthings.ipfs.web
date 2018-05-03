module.exports = {
  apps : [{
    name        : "ipfs.web",
    script      : "./server.js",
    watch       : true,
    ignore_watch : ["token", "src", "*.old", ".log", "logs", "ecosystem.config.js"],
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  }]
}

