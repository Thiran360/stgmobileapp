const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/App.tsx', 'utf8');

const regex = /<Stack\.Screen\s+name="EditProfileScreen"\s+component=\{EditProfileScreen\}\s+\/>\s+<\/Stack\.Navigator>/;

const replacement = `<Stack.Screen 
              name="EditProfileScreen" 
              component={EditProfileScreen} 
            />
            <Stack.Screen 
              name="PolicyScreen" 
              component={PolicyScreen} 
            />
          </Stack.Navigator>`;

content = content.replace(regex, replacement);
fs.writeFileSync('C:/Office/STG/App.tsx', content, 'utf8');
console.log('Fixed App.tsx Stack registration for PolicyScreen.');
