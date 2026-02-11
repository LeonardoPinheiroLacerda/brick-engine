// Dynamically import all CSS files from public/style
const styleContext = (require as any).context(
    '../public/style',
    false,
    /\.css$/,
);
styleContext.keys().forEach(styleContext);

// Dynamically import all WAV files from public/sounds
const soundContext = (require as any).context(
    '../public/sounds',
    false,
    /\.wav$/,
);
soundContext.keys().forEach(soundContext);

// Dynamically import all image files from public/images
const imageContext = (require as any).context(
    '../public/images',
    false,
    /\.(png|gif|svg)$/,
);
imageContext.keys().forEach(imageContext);

// Explicit imports for specific files as they are handled individually by webpack config
import '../public/favicon.ico';
import '../public/CNAME';
