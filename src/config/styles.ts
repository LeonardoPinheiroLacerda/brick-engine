/**
 * Dynamically load all CSS files from the public/style directory.
 * This allows Webpack to bundle them without needing explicit imports for each file.
 */
require.context('../../public/style', true, /\.css$/);
