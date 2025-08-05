import fs from 'fs';
import path from 'path';

const adminIndexPath = path.join('dist', 'admin', 'index.html');

try {
  // Check if the file exists
  if (!fs.existsSync(adminIndexPath)) {
    console.error('❌ Admin index.html file not found at:', adminIndexPath);
    process.exit(1);
  }

  // Read the admin index.html file
  let content = fs.readFileSync(adminIndexPath, 'utf8');
  
  // Find all asset references and replace them
  const assetRegex = /src="\/admin\/assets\/([^"]+)"/g;
  const cssRegex = /href="\/admin\/assets\/([^"]+)"/g;
  
  let replacements = 0;
  
  // Replace JavaScript assets
  content = content.replace(assetRegex, (match, filename) => {
    replacements++;
    return `src="./assets/${filename}"`;
  });
  
  // Replace CSS assets
  content = content.replace(cssRegex, (match, filename) => {
    replacements++;
    return `href="./assets/${filename}"`;
  });
  
  if (replacements > 0) {
    // Write the modified content back
    fs.writeFileSync(adminIndexPath, content, 'utf8');
    console.log(`✅ Successfully fixed ${replacements} asset paths in admin/index.html`);
  } else {
    console.log('ℹ️  No asset path replacements needed');
  }
} catch (error) {
  console.error('❌ Error fixing asset paths:', error.message);
  process.exit(1);
} 