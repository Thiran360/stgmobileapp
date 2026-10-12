
const fs = require("fs");
let content = fs.readFileSync("src/screens/CreateTournamentScreen.tsx", "utf8");

const oldStr = `    if (isEdit && tournament) {`;

const newStr = `
    const formatYYYYMMDDLocal = (ds) => {
      if (!ds) return "";
      const d = new Date(ds);
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return \`\${d.getDate()} \${months[d.getMonth()]} \${d.getFullYear()}\`;
    };

    const finalStages = stages.map((stg, idx) => {
      const datesForStage = Object.keys(matchDatesObj).filter(k => matchDatesObj[k].stageIndex === idx).sort();
      let dateStr = stg.date || "";
      if (datesForStage.length === 1) {
        dateStr = formatYYYYMMDDLocal(datesForStage[0]);
      } else if (datesForStage.length > 1) {
        dateStr = \`\${formatYYYYMMDDLocal(datesForStage[0])} - \${formatYYYYMMDDLocal(datesForStage[datesForStage.length - 1])}\`;
      }
      return { ...stg, date: dateStr };
    });

    if (isEdit && tournament) {`;

content = content.replace(oldStr, newStr);
content = content.replace(/stages,/g, "stages: finalStages,");

fs.writeFileSync("src/screens/CreateTournamentScreen.tsx", content, "utf8");
console.log("Success");

