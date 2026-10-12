
const fs = require("fs");
let content = fs.readFileSync("src/screens/LookingScreen.tsx", "utf8");

content = content.replace(
  "<!-- <Icon name=\"ellipsis-vertical\" size={20} color=\"#6B7280\" /> -->",
  ""
);
content = content.replace(
  "<Icon name=\"ellipsis-vertical\" size={20} color=\"#6B7280\" />",
  ""
);

fs.writeFileSync("src/screens/LookingScreen.tsx", content, "utf8");

