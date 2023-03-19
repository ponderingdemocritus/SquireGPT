const fs = require('fs');
const path = require('path');
const frontMatter = require('front-matter');

const mdDirPath = '/home/os/Documents/biblio/docs/scroll/docs'; // Replace this with your desired markdown files directory
const outputPath = './output.json'; // Replace this with your desired output file path

function readDir(dirPath) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, { withFileTypes: true }, (err, entries) => {
      if (err) {
        reject(err);
      } else {
        resolve(entries);
      }
    });
  });
}

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
}

function writeFile(filePath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function crawlMdFiles(dirPath) {
  const entries = await readDir(dirPath);
  const mdObjects = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const nestedMdObjects = await crawlMdFiles(entryPath);
      mdObjects.push(...nestedMdObjects);
    } else if (entry.isFile() && path.extname(entry.name) === '.md') {
      const content = await readFile(entryPath);
      const parsedContent = frontMatter(content);

      mdObjects.push({
        pageContent: parsedContent.body,
        metadata: parsedContent.attributes,
      });
    }
  }

  return mdObjects;
}

(async () => {
  try {
    const mdObjects = await crawlMdFiles(mdDirPath);
    const jsonContent = JSON.stringify(mdObjects, null, 2);
    await writeFile(outputPath, jsonContent);
    console.log(`Output written to ${outputPath}`);
  } catch (err) {
    console.error('Error:', err);
  }
})();