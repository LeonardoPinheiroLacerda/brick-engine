/**
 * Consolidated resource context for static analysis by Webpack.
 * Webpack requires a static string literal for the context path to correctly bundle assets.
 */
require.context('../../public', true, /(\.(css|wav|png|gif|svg|ico)$)|CNAME|favicon.ico/);
