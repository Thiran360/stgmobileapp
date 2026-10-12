
const fs = require("fs");
let content = fs.readFileSync("src/screens/CreateTournamentScreen.tsx", "utf8");

content = content.replace("const [stages: finalStages, setStages]", "const [stages, setStages]");
content = content.replace("setStages([...stages: finalStages, { title:", "setStages([...stages, { title:");

fs.writeFileSync("src/screens/CreateTournamentScreen.tsx", content, "utf8");
console.log("Fixed");

