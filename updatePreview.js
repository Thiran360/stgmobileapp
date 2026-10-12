const fs = require('fs');
let content = fs.readFileSync('src/screens/TournamentFlyersScreen.tsx', 'utf8');

const regex = /const previewData = \{ \.\.\.defaultData, \.\.\.\(draftTournament\?\.selectedFlyers\?\.\[item\.category\]\?\.data \|\| \{\}\), \.\.\.\(globalData\.data \|\| \{\}\), \.\.\.\(specificData\.data \|\| \{\}\) \};\s*return \([\s\S]*?\{\showPreview && item\.fields && item\.fields\.map\(\(field: any\) => \{[\s\S]*?\}\)\]\}[\s\S]*?\)\s*\}\)/;

const newBlock = `
    const previewData = { ...defaultData, ...(draftTournament?.selectedFlyers?.[item.category]?.data || {}), ...(globalData.data || {}), ...(specificData.data || {}) };
    const fieldStyles = specificData.fieldStyles || globalData.fieldStyles || {};
    const gameLogo = specificData.gameLogo !== undefined ? specificData.gameLogo : globalData.gameLogo;
    const eventLogo = specificData.eventLogo !== undefined ? specificData.eventLogo : globalData.eventLogo;

    return (
      <TouchableOpacity 
        style={[styles.templateCard, isSelected && { borderWidth: 2, borderColor: '#10B981' }, { overflow: 'hidden' }]} 
        activeOpacity={0.8}
        onPress={() => handleSelectTemplate(item.id, activeTab)}
      >
        <Image source={imageSource} style={styles.templateImage} />
        
        {showPreview && eventLogo && (
          <View style={{ position: 'absolute', top: '5%', left: '75%', width: 20, height: 20, borderRadius: 10, overflow: 'hidden' }}>
            <Image source={{ uri: eventLogo }} style={{ width: '100%', height: '100%' }} />
          </View>
        )}

        {showPreview && gameLogo && (
          <View style={{ position: 'absolute', top: '5%', left: '5%', width: 25, height: 25, overflow: 'hidden' }}>
            <Image source={{ uri: gameLogo }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
          </View>
        )}

        {showPreview && item.fields && item.fields.map((field: any) => {
          const textValue = previewData[field.name];
          if (!textValue) return null;
          
          let topVal = field.y || '10%';
          let leftVal = field.x || '25%';
          
          const customStyle = fieldStyles[field.name] || {};
          const fontSize = (customStyle.fontSize || field.fontSize || 20) * 0.45; 
          const color = customStyle.color || field.color || '#FFF';
          
          return (
            <View key={field.name} style={{ position: 'absolute', top: topVal, left: leftVal, width: '100%' }}>
              <Text style={{ color: color, fontSize: fontSize, fontWeight: field.fontWeight || 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }}>
                {textValue}
              </Text>
            </View>
          );
        })}
        `;

// It's safer to just split and replace based on a known sub-string to avoid regex headaches
const parts = content.split(`const previewData = { ...defaultData, ...(draftTournament?.selectedFlyers?.[item.category]?.data || {}), ...(globalData.data || {}), ...(specificData.data || {}) };`);

if (parts.length === 2) {
    const bottomPart = parts[1];
    const endOfMap = bottomPart.indexOf(`})}`);
    
    if (endOfMap !== -1) {
        // Find the end of the return statement
        const newBottom = newBlock + bottomPart.substring(endOfMap + 3);
        content = parts[0] + newBottom;
        fs.writeFileSync('src/screens/TournamentFlyersScreen.tsx', content, 'utf8');
        console.log('Thumbnail text and logos updated');
    } else {
        console.log('Failed to find end of map');
    }
} else {
    console.log('Failed to split content properly', parts.length);
}
