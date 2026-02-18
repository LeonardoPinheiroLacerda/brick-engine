const asciidoctor = require('asciidoctor')();
const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '../docs');
const REFERENCE_DIR = path.join(DOCS_DIR, 'reference');
const PUBLIC_DOCS_DIR = path.join(__dirname, '../public/docs');
const README_FILE = path.join(__dirname, '../README.adoc');

function getAllFiles(dirPath, arrayOfFiles) {
    if (!fs.existsSync(dirPath)) return [];

    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (file.endsWith('.adoc')) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

/**
 * Copies a directory recursively.
 */
function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Ensure public/docs exists and is clean
if (fs.existsSync(PUBLIC_DOCS_DIR)) {
    fs.rmSync(PUBLIC_DOCS_DIR, { recursive: true, force: true });
}
fs.mkdirSync(PUBLIC_DOCS_DIR, { recursive: true });

// 1. Convert README.adoc to index.html
if (fs.existsSync(README_FILE)) {
    console.log(`Converting README.adoc -> index.html`);
    const indexPath = path.join(PUBLIC_DOCS_DIR, 'index.html');
    asciidoctor.convertFile(README_FILE, {
        to_file: indexPath,
        safe: 'safe',
        makedirs: true,
    });

    // Fix links in index.html:
    // - Replace 'href="docs/' with 'href="' (since index.html is in /public/docs)
    // - Ensure .adoc links are changed to .html
    let content = fs.readFileSync(indexPath, 'utf8');
    content = content.replace(/href="docs\//g, 'href="');
    content = content.replace(/\.adoc/g, '.html');

    fs.writeFileSync(indexPath, content);
    console.log('Fixed links in index.html');
} else {
    console.warn('README.adoc not found at root.');
}

// 2. Convert files in docs/reference
if (fs.existsSync(REFERENCE_DIR)) {
    const files = getAllFiles(REFERENCE_DIR);
    console.log(`Found ${files.length} .adoc files in reference to process.`);

    files.forEach(file => {
        const relativePath = path.relative(DOCS_DIR, file);
        const destPath = path.join(PUBLIC_DOCS_DIR, relativePath.replace(/\.adoc$/, '.html'));

        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        console.log(`Converting: ${relativePath} -> ${path.relative(process.cwd(), destPath)}`);
        asciidoctor.convertFile(file, { to_file: destPath, safe: 'safe', makedirs: true });

        // Fix internal links in reference files that might use docs/ prefix
        let content = fs.readFileSync(destPath, 'utf8');
        // If a file in reference/modules/ links to docs/reference/enums/
        // Asciidoctor might have kept 'docs/reference/' if it wasn't a proper xref.
        content = content.replace(/href="docs\//g, 'href="../../'); // Roughly 2 levels up
        // Note: This is a bit naive but should solve the reported issue if it occurs in modules.

        fs.writeFileSync(destPath, content);
    });
}

// 3. Copy images and diagrams for full documentation support
console.log('Copying images and diagrams...');
copyDir(path.join(DOCS_DIR, 'images'), path.join(PUBLIC_DOCS_DIR, 'images'));
copyDir(path.join(DOCS_DIR, 'diagrams'), path.join(PUBLIC_DOCS_DIR, 'diagrams'));

console.log('Documentation generation complete.');
