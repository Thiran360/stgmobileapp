const fs = require('fs');
let content = fs.readFileSync('src/screens/TournamentFlyersScreen.tsx', 'utf8');

const searchBlock = `{showPreview && item.fields && item.fields.map((field: any) => {`;
const insertion = `
        {showPreview && (() => {
          const socials = specificData.socials || globalData.socials || {};
          const sColor = specificData.socialColor || globalData.socialColor || '#FFFFFF';
          const sSize = (specificData.socialSize || globalData.socialSize || 12) * 0.45;
          return (
            <View style={{ position: 'absolute', top: '85%', left: '30%', flexDirection: 'row', width: '100%' }}>
              {socials.instagram ? <Text style={{ color: sColor, fontSize: sSize, marginRight: 15 }}>IG: {socials.instagram}</Text> : null}
              {socials.youtube ? <Text style={{ color: sColor, fontSize: sSize, marginRight: 15 }}>YT: {socials.youtube}</Text> : null}
            </View>
          );
        })()}

        `;

content = content.replace(searchBlock, insertion + searchBlock);
fs.writeFileSync('src/screens/TournamentFlyersScreen.tsx', content, 'utf8');
console.log('Socials added to preview');
