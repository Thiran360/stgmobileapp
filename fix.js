const fs = require('fs');
const file = 'c:/Office/STG/src/screens/CreateTournamentScreen.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

const startIndex = 336; 
const endIndex = 353; 

const codeToMove = lines.slice(startIndex, endIndex).join('\n');
lines.splice(startIndex, endIndex - startIndex); 

const handleCreateIdx = lines.findIndex(l => l.includes('const handleCreate = () => {'));
lines.splice(handleCreateIdx + 2, 0, codeToMove);

fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed scope bug');
