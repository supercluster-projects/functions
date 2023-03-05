const { Telegraf } = require('telegraf');

class TGService {
  constructor(token, group) {
    this.bot = new Telegraf(token);
    this.tg = this.bot.telegram;
    this.group = group;
  }

  async post(message, images, videos, docs) {
    console.log(`> TG - preparing: 
      ${images.length} photo(s); 
      ${videos.length} video(s); 
      ${docs.length} doc(s)
    `);
    const all = [];
    const caption = { caption: message };
    if (docs.length > 0) {
      console.log(`> TG - post(${this.group}) docs:`, docs);
      all.push(...docs.map(url => this.tg.sendDocument(this.group, url, caption)));
    }
    if (images.length > 1) {
      const media = images.map((url) => ({ type: 'photo', media: url }));
      media[0].caption = caption.caption;
      console.log(`> TG - post(${this.group}) images:`, media);
      all.push(this.tg.sendMediaGroup(this.group, media));
    }
    else if (images.length) {
      const media = images.shift();
      console.log(`> TG - post(${this.group}) single:`, media);
      all.push(this.tg.sendPhoto(this.group, media, caption))
    }
    if (videos.length > 0) {
      console.log(`> TG - post(${this.group}) videos:`, videos);
      all.push(...videos.map(url => this.tg.sendVideo(this.group, url, caption)))
    }
    return Promise.all(all).catch((e) => console.error(e));
  }
}

module.exports = TGService;