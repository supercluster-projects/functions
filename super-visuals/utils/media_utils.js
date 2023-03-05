
const isDocument = (url) => url.indexOf(".gif") > -1;
const isVideo = (url) => url.indexOf(".mp4") > -1;
const isImage = (url) => url.indexOf(".jpg") > -1 || (!isDocument(url) && !isVideo(url));
const extractFromLast = (link, last) => link.substring(link.lastIndexOf(last));

const appendLink = (prefix, source_url) => {
  if (source_url?.length > 0) {
    return `\n${prefix}: ${extractFromLast(source_url, 'https://')}`;
  }
  return '';
}

module.exports = {
  isDocument,
  isVideo,
  isImage,
  appendLink,
}
