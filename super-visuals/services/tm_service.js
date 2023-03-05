const Tumblr = require('tumblr.js')

const logSkipped = (post) => console.log('> Tumblr -> Skipped:', post) || true

class TumblrService {
  // constructor() {}
  constructor(credentials) {
    this.client = Tumblr.createClient({ credentials, returnPromises: true});
  }

  async getPostFromBlog(post) {
    const { id_string: id } = post;
    const { uuid } = post.blog;
    const result = await this.client.getRequest(`/v2/blog/${uuid}/posts/${id}`)
    console.log('> Tumblr -> getTumblrPostFromBlog:', result)
    return result
  }

  async getPost(sinceId) {
    console.log(`> Tumblr -> getting post since id: ${sinceId}`)
    const { posts } = await this.client.userDashboard({
      since_id: sinceId,
      offset: 0,
      npf: false,
      limit: 2000
    })
    console.log(`> Tumblr -> posts received: ${posts?.length}`)
    let post = posts && Array.isArray(posts) && posts.length > 0 && posts.pop()
    const postId = post?.id_string;

    return (!!postId && postId !== sinceId.toString()
      && (console.log('> Tumblr -> different id:', postId) || true))
      ? (post.type === 'photo' && post.photos.length
        && (console.log('> Tumblr -> has photos:', post.photos.length) || true)
        ? post
        : (post.type === 'text' && !!(post = await this.getPostFromBlog(post), !!post)
          ? post
          : (post.type === 'video' && post.html5_capable && ['WIP'].includes(post.video_type)
            ? post
            : !!post && logSkipped(post) && await this.getPost(postId))))
      : null
  }
}

module.exports = TumblrService;