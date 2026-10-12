const fs = require('fs');
const file = 'c:/Office/STG/src/screens/CreateTournamentScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

// The block that was inserted:
const insertedBlock = \    const formatYYYYMMDDLocal = (ds) => {
      if (!ds) return "";
      const d = new Date(ds);
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return \\\\ \ \\\\;
    };

    const finalStages = stages.map((stg, idx) => {
      const datesForStage = Object.keys(matchDatesObj).filter(k => matchDatesObj[k].stageIndex === idx).sort();
      let dateStr = stg.date || "";
      if (datesForStage.length === 1) {
        dateStr = formatYYYYMMDDLocal(datesForStage[0]);
      } else if (datesForStage.length > 1) {
        dateStr = \\\\ - \\\\;
      }
      return { ...stg, date: dateStr };
    });
\;

// Remove the wrongly inserted block inside the if statement
content = content.replace('    if (currentStep === 1) {\\r\\n' + insertedBlock, insertedBlock + '\\n    if (currentStep === 1) {\\n');
// Also handle Unix line endings just in case
content = content.replace('    if (currentStep === 1) {\\n' + insertedBlock, insertedBlock + '\\n    if (currentStep === 1) {\\n');

fs.writeFileSync(file, content);
console.log('Fixed block scope!');
