const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Office/STG/src';
const oldImg = 'bgmi_poster.png';
const newImg = 'bgmi_poster.jpg';

// 1. Rename the file
const oldPath = path.join(srcDir, 'assets/images', oldImg);
const newPath = path.join(srcDir, 'assets/images', newImg);
if (fs.existsSync(oldPath)) {
  fs.renameSync(oldPath, newPath);
  console.log('Renamed image file.');
}

// 2. Search and replace in all files
function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (file !== 'node_modules' && file !== 'assets') {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.js') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const files = walkSync(srcDir);
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(oldImg)) {
    content = content.replace(new RegExp(oldImg, 'g'), newImg);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated reference in ${file}`);
  }
});
