const regexp = /.ipynb$/i;

/** @type {import('@remark-embedder/core').Transformer} */
const jupyterTransformer = {
  name: 'jupyterTransformer',
  shouldTransform: async (url) => {
    return url && regexp.test(url);
  },
  getHTML: async (urlString, getConfig = {}) => {
    return `<div class="jupyter">
        <a href=${urlString} target="_blank" rel="noopener noreferrer"><img class="no-zoom" src="/jupyter.svg" alt="Jupyter" /> View Jupyter Notebook</a>
    </div>`;
  },
};

export default jupyterTransformer;
