const fs = require('fs');
let content = fs.readFileSync('src/screens/CreateTournamentScreen.tsx', 'utf8');

const regex = /const handleCreate = \(\) => {[\s\S]*?setCurrentStep\(2\);\s*return;\s*}/;
const replacement = const handleCreate = () => {
    if (currentStep === 1) {
      if (!tournamentName.trim()) {
        Alert.alert('Error', 'Tournament Name is required.');
        return;
      }
      setCurrentStep(2);
      return;
    }

    // Populate stage dates from matchDatesObj before saving
    const formatYYYYMMDDLocal = (ds) => {
      if (!ds) return '';
      const d = new Date(ds);
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return \\ \ \\;
    };

    const finalStages = stages.map((stg, idx) => {
      const datesForStage = Object.keys(matchDatesObj).filter(k => matchDatesObj[k].stageIndex === idx).sort();
      let dateStr = stg.date || '';
      if (datesForStage.length === 1) {
        dateStr = formatYYYYMMDDLocal(datesForStage[0]);
      } else if (datesForStage.length > 1) {
        dateStr = \\ - \\;
      }
      return { ...stg, date: dateStr };
    });
;

content = content.replace(regex, replacement);

content = content.replace(/stages,/g, 'stages: finalStages,');

fs.writeFileSync('src/screens/CreateTournamentScreen.tsx', content, 'utf8');
