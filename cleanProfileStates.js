const fs = require('fs');
let content = fs.readFileSync('src/screens/ProfileScreen.tsx', 'utf8');

// Remove states
content = content.replace(/const \[basicEditVisible, setBasicEditVisible\] = useState\(false\);\n?/g, '');
content = content.replace(/const \[contactEditVisible, setContactEditVisible\] = useState\(false\);\n?/g, '');
content = content.replace(/const \[firstName, setFirstName\] = useState\(''\);\n?/g, '');
content = content.replace(/const \[lastName, setLastName\] = useState\(''\);\n?/g, '');
content = content.replace(/const \[dob, setDob\] = useState\(''\);\n?/g, '');
content = content.replace(/const \[email, setEmail\] = useState\(''\);\n?/g, '');
content = content.replace(/const \[password, setPassword\] = useState\(''\);\n?/g, '');
content = content.replace(/const \[phone, setPhone\] = useState\(''\);\n?/g, '');
content = content.replace(/const \[region, setRegion\] = useState\(''\);\n?/g, '');
content = content.replace(/const \[language, setLanguage\] = useState\(''\);\n?/g, '');

// Remove functions using string manipulation
const stripFunc = (funcName) => {
    const start = content.indexOf(`const ${funcName} =`);
    if (start !== -1) {
        let end = content.indexOf('};', start);
        if (end !== -1) {
            content = content.substring(0, start) + content.substring(end + 2);
        }
    }
};

stripFunc('openBasicEdit');
stripFunc('saveBasicEdit');
stripFunc('openContactEdit');
stripFunc('saveContactEdit');

fs.writeFileSync('src/screens/ProfileScreen.tsx', content, 'utf8');
console.log('Removed unused functions and states');
