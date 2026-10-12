const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ProfileScreen.tsx', 'utf8');

// 1. Add logoutUser to context
content = content.replace(
  'const { userProfile, updateUserProfile } = useContext(AppContext);',
  'const { userProfile, updateUserProfile, logoutUser } = useContext(AppContext);'
);

// 2. Add logout button at bottom of ScrollView
const targetStr = `            <Text style={styles.detailValue}>{userProfile.languages || 'N/A'}</Text>
          </View>
        </View>
      </ScrollView>`;

const replacement = `            <Text style={styles.detailValue}>{userProfile.languages || 'N/A'}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={{ backgroundColor: '#DC2626', marginHorizontal: 20, marginTop: 30, marginBottom: 50, paddingVertical: 14, borderRadius: 10, alignItems: 'center' }} 
          onPress={() => {
            Alert.alert('Logout', 'Are you sure you want to logout?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', style: 'destructive', onPress: async () => {
                await logoutUser();
                navigation.replace('Login');
              }}
            ]);
          }}
        >
          <Text style={{ color: '#FFF', fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacement);
    fs.writeFileSync('C:/Office/STG/src/screens/ProfileScreen.tsx', content, 'utf8');
    console.log('Added logout button to profile page');
} else {
    // try with regex for windows line endings
    const fallbackStr = targetStr.replace(/\n/g, '\r\n');
    if (content.includes(fallbackStr)) {
        content = content.replace(fallbackStr, replacement.replace(/\n/g, '\r\n'));
        fs.writeFileSync('C:/Office/STG/src/screens/ProfileScreen.tsx', content, 'utf8');
        console.log('Added logout button to profile page (Windows CRLF)');
    } else {
        console.log('Target string not found');
    }
}
