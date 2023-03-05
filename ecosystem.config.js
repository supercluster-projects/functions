module.exports = {
  apps : [{
    name: 'super-visuals',
    cwd: 'super-visuals',
    script: 'index.js',
    exec_mode: 'fork',
    instances: 1,
    // watch: '.',
    ignore_watch : ["node_modules"],
    max_memory_restart: '100M',
    cron_restart: '1/30 * * * *',
    env: {
      DB_URL: process.env.DB_URL,
      DB_NAME: process.env.DB_NAME,
      DB_USER: process.env.DB_USER,
      DB_PASS: process.env.DB_PASS,

      DB_SUPER_VISUAL_ID: process.env.DB_SUPER_VISUAL_ID,

      TUMBLR_CONSUMER_KEY: process.env.TUMBLR_CONSUMER_KEY,
      TUMBLR_CONSUMER_SECRET: process.env.TUMBLR_CONSUMER_SECRET,
      TUMBLR_TOKEN: process.env.TUMBLR_TOKEN,
      TUMBLR_TOKEN_SECRET: process.env.TUMBLR_TOKEN_SECRET,

      TG_TOKEN: process.env.TG_BOT_SUPER_VISUAL_TOKEN,
      TG_GROUP_ID: process.env.TG_SUPER_VISUAL_GROUP_ID,

      VK_TOKEN: process.env.VK_APP_SPRCLSTR_TOKEN,
      VK_GROUP_ID: process.env.VK_SUPER_VISUAL_GROUP_ID,
      VK_ALBUM_ID: process.env.VK_SUPER_VISUAL_ALBUM_ID,
    }
  }],

  deploy : {
    production : {
      user : process.env.DEPLOY_USER,
      host : process.env.DEPLOY_HOST,
      ref  : process.env.DEPLOY_REF,
      repo : process.env.DEPLOY_REPO,
      path : process.env.DEPLOY_PATH,
      'pre-deploy-local': '',
      'post-deploy' : 'yarn && sh ./scripts/run.sh',
      'pre-setup': ''
    }
  }
};


// 'oauth.vk.com/authorize?client_id=[]&scope=pages,groups,notes,wall,docs,photos,offline&redirect_uri=http://oauth.vk.com/blank.html&display=page&response_type=token';
//
// 1. 'https://oauth.vk.com/authorize?client_id=[]&group_ids=[]&display=page&scope=wall,docs,photos&redirect_uri=http://oauth.vk.com/blank.html&v=5.131&response_type=code';
// 2. https://oauth.vk.com/blank.html#code=[]
// 3. "https://oauth.vk.com/access_token?client_id=6070130&client_secret=[]&redirect_uri=http://oauth.vk.com/blank.html&code=[]";
