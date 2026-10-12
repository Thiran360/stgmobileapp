const fs = require('fs');
let c = fs.readFileSync('src/context/AppContext.tsx', 'utf8');

c = c.replace(
    "if (apiData && !apiData.error) {",
    "if (apiData && !apiData.error && !apiData.detail) {"
);

fs.writeFileSync('src/context/AppContext.tsx', c, 'utf8');
console.log("Fixed AppContext DRF 404 handling");
