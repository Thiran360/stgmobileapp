const fs = require('fs');
let content = fs.readFileSync('src/screens/TournamentFlyersScreen.tsx', 'utf8');

const oldRender = `  const renderTemplateItem = ({ item }: { item: any }) => {
    const isSelected = draftTournament?.selectedFlyers?.[item.category]?.templateId === item.id;
    const editedUri = isSelected ? draftTournament?.selectedFlyers?.[item.category]?.uri : null;
    const imageSource = (editedUri && typeof editedUri === 'string') ? { uri: editedUri } : (typeof item.image === 'string' ? { uri: item.image } : item.image);
    
    return (
      <TouchableOpacity 
        style={[styles.templateCard, isSelected && { borderWidth: 2, borderColor: '#10B981' }]} 
        activeOpacity={0.8}
        onPress={() => handleSelectTemplate(item.id, activeTab)}
      >
        <Image source={imageSource} style={styles.templateImage} />`;

const newRender = `  const renderTemplateItem = ({ item }: { item: any }) => {
    const isSelected = draftTournament?.selectedFlyers?.[item.category]?.templateId === item.id;
    const editedUri = isSelected ? draftTournament?.selectedFlyers?.[item.category]?.uri : null;
    const imageSource = (editedUri && typeof editedUri === 'string') ? { uri: editedUri } : (typeof item.image === 'string' ? { uri: item.image } : item.image);
    
    const showPreview = !editedUri;
    const globalData = draftTournament?.globalFlyerData || {};
    const specificData = draftTournament?.selectedFlyers?.[item.category]?.specificData || {};
    
    const defaultData: any = {};
    if (item.fields) {
      item.fields.forEach((f: any) => {
        defaultData[f.name] = f.default || '';
      });
    }
    const previewData = { ...defaultData, ...(draftTournament?.selectedFlyers?.[item.category]?.data || {}), ...(globalData.data || {}), ...(specificData.data || {}) };

    return (
      <TouchableOpacity 
        style={[styles.templateCard, isSelected && { borderWidth: 2, borderColor: '#10B981' }, { overflow: 'hidden' }]} 
        activeOpacity={0.8}
        onPress={() => handleSelectTemplate(item.id, activeTab)}
      >
        <Image source={imageSource} style={styles.templateImage} />
        
        {showPreview && item.fields && item.fields.map((field: any) => {
          const textValue = previewData[field.name];
          if (!textValue) return null;
          
          let topVal = field.y || '10%';
          let leftVal = field.x || '25%';
          
          const fontSize = (field.fontSize || 20) * 0.45; 
          const color = field.color || '#FFF';
          
          return (
            <View key={field.name} style={{ position: 'absolute', top: topVal, left: leftVal, width: '100%' }}>
              <Text style={{ color: color, fontSize: fontSize, fontWeight: field.fontWeight || 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }}>
                {textValue}
              </Text>
            </View>
          );
        })}
        `;

content = content.replace(oldRender, newRender);
fs.writeFileSync('src/screens/TournamentFlyersScreen.tsx', content, 'utf8');
console.log('Thumbnail preview added');
