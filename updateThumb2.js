const fs = require('fs');
let content = fs.readFileSync('src/screens/TournamentFlyersScreen.tsx', 'utf8');

const regex = /const isSelected = draftTournament\?\.selectedFlyers\?\.\[item\.category\]\?\.templateId === item\.id;\s*return \(\s*<TouchableOpacity\s*style=\{\[styles\.templateCard, isSelected && \{ borderWidth: 2, borderColor: '#10B981' \}\]\}\s*activeOpacity=\{0\.8\}\s*onPress=\{\(\) => handleSelectTemplate\(item\.id, activeTab\)\}\s*>\s*<Image source=\{typeof item\.image === 'string' \? \{ uri: item\.image \} : item\.image\} style=\{styles\.templateImage\} \/>/;

const newBlock = `const isSelected = draftTournament?.selectedFlyers?.[item.category]?.templateId === item.id;
    const editedUri = isSelected ? draftTournament?.selectedFlyers?.[item.category]?.uri : null;
    const imageSource = editedUri ? { uri: editedUri } : (typeof item.image === 'string' ? { uri: item.image } : item.image);
    
    return (
      <TouchableOpacity 
        style={[styles.templateCard, isSelected && { borderWidth: 2, borderColor: '#10B981' }]} 
        activeOpacity={0.8}
        onPress={() => handleSelectTemplate(item.id, activeTab)}
      >
        <Image source={imageSource} style={styles.templateImage} />`;

content = content.replace(regex, newBlock);
fs.writeFileSync('src/screens/TournamentFlyersScreen.tsx', content, 'utf8');
console.log('Regex replace done');
