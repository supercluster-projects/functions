const VKService = require('./services/vk_service');
const TGService = require('./services/tg_service');
const TMService = require('./services/tm_service');
const DBService = require('./services/db_service');
const MediaUtils = require('./utils/media_utils')

const VK_GROUP_ID = process.env.VK_GROUP_ID;
const VK_GROUP_ALBUM_ID = process.env.VK_ALBUM_ID;
const TG_GROUP_ID = process.env.TG_GROUP_ID;
const DB_DOCUMENT_ID = process.env.DB_SUPER_VISUAL_ID;

const parsePostContents = async (post) => {
  console.log(`> parsePostContents = ${post.type}`)
  const result = { post: post, content: [] };
  switch (post.type) {
    case 'photo':
      result.content = post.photos.slice(0, 10).map(({ original_size }) => original_size.url);
      break;
    case 'video':
      result.content = [post.video_url];
      break;
    case 'blocks':
      result.content = post.content?.length
      ? post.content.filter(({ type }) => type === 'image').map((c) => {
          return (c.media.filter(m => m.has_original_dimensions)?.url || c.media[0].url)
        })
      : (post.trail.length === 0 ? []
          : await (new Promise((resolve) => {
              const trail = post.trail.shift();
              console.log(`> parsePostContents trailPost:`, trail)
              tm.getPostFromBlog({
                id_string: trail.post.id.toString(),
                blog: trail.blog
              })
                .then((post) => {
                  return parsePostContents(post).then((second) => {
                    result.post = second.post;
                    return second.content;
                  });
                })
                .then((items) => resolve(items))
                .catch(() => resolve([]));
          })));
      break;
  }
  return result;
}

const tm = new TMService({
  consumer_key: process.env.TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
  token: process.env.TUMBLR_TOKEN,
  token_secret: process.env.TUMBLR_TOKEN_SECRET,
});
const vk = new VKService(process.env.VK_APP_SPRCLSTR_TOKEN, VK_GROUP_ID, VK_GROUP_ALBUM_ID);
const tg = new TGService(process.env.TG_BOT_SUPER_VISUAL_TOKEN, TG_GROUP_ID);
const db = new DBService(process.env.DB_URL, process.env.DB_NAME);

async function main() {
  await db.login(process.env.DB_USER, process.env.DB_PASS)
    .then(() => db.get(DB_DOCUMENT_ID))
    .then(async (document) => {
      console.log('document', document);

      return tm.getPost(document.cid)
        .then(async (post) => {
          if (post) {
            const result = await parsePostContents(post);
            const contents = result.content;
            const hasContent = contents.length > 0;

            console.log(`> Main -> post: id = ${result.post.id_string}`)
            console.log(`> Main -> post: contents = ${contents}`)

            const updateDocument = () => db.update(document, { cid: post.id_string });

            if (!hasContent) return updateDocument();

            let summary = result.post.summary + MediaUtils.appendLink('source:', result.post.source_url);

            return Promise.all([
              Promise
                .all(contents.map(url => vk.uploadToAlbum(url, MediaUtils.isDocument(url))))
                .then(attachments => vk.post(post.id_string, summary, attachments))
                .then(() => console.log('> VK -> Posted')),
              tg.post(
                summary,
                contents.filter((url) => MediaUtils.isImage(url)),
                contents.filter((url) => MediaUtils.isVideo(url)),
                contents.filter((url) => MediaUtils.isDocument(url))
              ).then(() => console.log('> TG -> Posted')),
            ])
              .then(() => updateDocument())
              .then(() => console.log('> Completed'))
              .catch((err) => new Error(`> ERROR: ${err}`))
          } else {
            console.log('> No posts')
            return false;
          }
        })
    }).catch(e => console.error(e));
}

main();



