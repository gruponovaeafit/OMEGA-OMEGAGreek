const fs = require("fs");
const path = require("path");

const baseDir = "c:\\Personal\\OMEGA\\OMEGA-OMEGAGreek"; // Adjust to your project root
const baseUrl = "https://novaeafit.blob.core.windows.net/omega-2025";

function updateSrcAttributes(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      updateSrcAttributes(filePath);
    } else if (
      file.endsWith(".tsx") ||
      file.endsWith(".jsx") ||
      file.endsWith(".html")
    ) {
      let content = fs.readFileSync(filePath, "utf8");
      const updatedContent = content.replace(
        /src="(?!https?:\/\/|data:|#)([^"]*)"/g,
        (match, p1) => {
          return `src="${baseUrl}${p1}"`;
        },
      );

      if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, "utf8");
        console.log(`Updated: ${filePath}`);
      }
    }
  });
}

updateSrcAttributes(baseDir);
