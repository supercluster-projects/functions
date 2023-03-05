const { VK, Upload } = require('vk-io')

class VKService {
  constructor(token, group, album) {
    this.vk = new VK({ token });
    this.group = group;
    this.album = album;
  }

  async uploadToAlbum(url, album, isDoc) {
    const method = isDoc ? 'document' : 'photoAlbum'
    console.log("> VKService -> uploadToAlbum begins, method =", method, url)
    const upload = new Upload({ api: this.vk.api });
    return upload[method]({
      source: { value: url },
      album_id: this.album,
      group_id: this.group,
    }).then((attachment) => {
      // console.log(attachment);
      return attachment;
    })
      .catch((e) => {
        console.log(e);
        throw e;
      });
  }

  async post(id, message, attachments){
    return this.vk.api.wall.post({ message: `${message}\n#SPRCLSTR : ${id}`,
      owner_id: -this.group, from_group: 1, friends_only: 0, attachments,
    });
  }
}

module.exports = VKService;