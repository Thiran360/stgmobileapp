const fs = require('fs');
let content = fs.readFileSync('src/screens/TournamentFlyersScreen.tsx', 'utf8');

// Fix handleSelectTemplate
const oldSelectLogic = `      const updatedSelectedFlyers = {
        ...(draftTournament?.selectedFlyers || {}),
        [template.category]: {
          templateId: template.id,
          uri: template.image,
        }
      };`;

const newSelectLogic = `      const existingData = draftTournament?.selectedFlyers?.[template.category] || {};
      const updatedSelectedFlyers = {
        ...(draftTournament?.selectedFlyers || {}),
        [template.category]: {
          ...existingData,
          templateId: template.id,
          uri: existingData.templateId === template.id ? existingData.uri : null,
        }
      };`;

content = content.replace(oldSelectLogic, newSelectLogic);

// Fix imageSource
const oldImageSource = `const imageSource = editedUri ? { uri: editedUri } : (typeof item.image === 'string' ? { uri: item.image } : item.image);`;
const newImageSource = `const imageSource = (editedUri && typeof editedUri === 'string') ? { uri: editedUri } : (typeof item.image === 'string' ? { uri: item.image } : item.image);`;

content = content.replace(oldImageSource, newImageSource);

fs.writeFileSync('src/screens/TournamentFlyersScreen.tsx', content, 'utf8');
console.log('Fixed selection logic');
