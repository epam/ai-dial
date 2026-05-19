import transformer from '@remark-embedder/transformer-oembed';

const oembedTransformer = {
  ...transformer,
  getHTML: async (url, getConfig = {}) => {
    let html = await transformer.getHTML(url, getConfig);
    if (html?.startsWith('<iframe')) {
      html = html.replace('width="200"', 'class="iframe-video"');
      html = html.replace('height="113"', '');
    }
    return html;
  },
};

export default oembedTransformer;
