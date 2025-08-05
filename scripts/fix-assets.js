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
  
  // Replace /admin/assets/ with ./assets/
  const originalContent = content;
  content = content.replace(/\/admin\/assets\//g, './assets/');
  
  // Check if any replacements were made
  if (content === originalContent) {
    console.log('ℹ️  No asset path replacements needed');
  } else {
    // Write the modified content back
    fs.writeFileSync(adminIndexPath, content, 'utf8');
    console.log('✅ Successfully fixed asset paths in admin/index.html');
  }
} catch (error) {
  console.error('❌ Error fixing asset paths:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
} 