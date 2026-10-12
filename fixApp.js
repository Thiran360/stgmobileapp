const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/App.tsx', 'utf8');

// 1. Add import
if (!content.includes('PolicyScreen')) {
  content = content.replace(
    "import EditProfileScreen from './src/screens/EditProfileScreen';",
    "import EditProfileScreen from './src/screens/EditProfileScreen';\nimport PolicyScreen from './src/screens/PolicyScreen';"
  );
  
  // 2. Add Stack.Screen
  const target = `<Stack.Screen \n              name="EditProfileScreen" \n              component={EditProfileScreen} \n            />\n          </Stack.Navigator>`;
  const replacement = `<Stack.Screen \n              name="EditProfileScreen" \n              component={EditProfileScreen} \n            />\n            <Stack.Screen \n              name="PolicyScreen" \n              component={PolicyScreen} \n            />\n          </Stack.Navigator>`;
  
  content = content.replace(target, replacement);
  content = content.replace(target.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));
  
  fs.writeFileSync('C:/Office/STG/App.tsx', content, 'utf8');
  console.log('Added PolicyScreen to App.tsx');
}
