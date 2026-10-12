const fs = require('fs');
let content = fs.readFileSync('src/screens/TournamentFlyersScreen.tsx', 'utf8');

const oldBlock = `      const isSelected = draftTournament?.selectedFlyers?.[item.category]?.templateId === item.id;
      
      return (
        <TouchableOpacity 
          style={[styles.templateCard, isSelected && { borderWidth: 2, borderColor: '#10B981' }]} 
          activeOpacity={0.8}
          onPress={() => handleSelectTemplate(item.id, activeTab)}
        >
          <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.templateImage} />`;

const newBlock = `      const isSelected = draftTournament?.selectedFlyers?.[item.category]?.templateId === item.id;
      const editedUri = isSelected ? draftTournament?.selectedFlyers?.[item.category]?.uri : null;
      const imageSource = editedUri ? { uri: editedUri } : (typeof item.image === 'string' ? { uri: item.image } : item.image);
      
      return (
        <TouchableOpacity 
          style={[styles.templateCard, isSelected && { borderWidth: 2, borderColor: '#10B981' }]} 
          activeOpacity={0.8}
          onPress={() => handleSelectTemplate(item.id, activeTab)}
        >
          <Image source={imageSource} style={styles.templateImage} />`;

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('src/screens/TournamentFlyersScreen.tsx', content, 'utf8');
    console.log('Thumbnail logic updated successfully');
} else {
    console.log('Could not find target block. Searching...');
}
