const fs = require('fs');
let content = fs.readFileSync('src/screens/TournamentFlyerEditScreen.tsx', 'utf8');

const regex = /const \[data, setData\] = useState\(\{ \.\.\.\(initialData \|\| \{\}\), \.\.\.globalData\.data, \.\.\.specificData\.data \}\);/;
const regex2 = /const \[data, setData\] = useState\(\{ \.\.\.\(initialData \|\| \{\}\), \.\.\.globalData\.data, \.\.\.specificData\.data \}\);/g;

// Wait, I will just replace the specific line
const searchStr = `const [data, setData] = useState({ ...(initialData || {}), ...globalData.data, ...specificData.data });`;
const newStr = `const defaultData: any = {};
    if (selectedTemplate && selectedTemplate.fields) {
      selectedTemplate.fields.forEach((f: any) => {
        defaultData[f.name] = f.default || '';
      });
    }

    const [data, setData] = useState({ 
      ...defaultData, 
      ...(initialData || {}), 
      ...(globalData?.data || {}), 
      ...(specificData?.data || {}) 
    });`;

if (content.includes(searchStr)) {
    content = content.replace(searchStr, newStr);
    fs.writeFileSync('src/screens/TournamentFlyerEditScreen.tsx', content, 'utf8');
    console.log('Fixed default data initialization');
} else {
    console.log('Failed to find state block');
}
