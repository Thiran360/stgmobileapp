const fs = require('fs');
let content = fs.readFileSync('src/screens/ProfileScreen.tsx', 'utf8');

// Replace openBasicEdit and openContactEdit usage with navigation
content = content.replace(/onPress={openBasicEdit}/g, "onPress={() => navigation.navigate('EditProfileScreen')}");
content = content.replace(/onPress={openContactEdit}/g, "onPress={() => navigation.navigate('EditProfileScreen')}");

// Remove the Modals from the return block. The Modals are at the end before </ScrollView> and </View>
// Instead of complex regex, let's just find where the first modal starts and chop it.
const modalStart = content.indexOf('{/* BASIC EDIT MODAL */}');
if (modalStart !== -1) {
    const endOfScrollView = content.lastIndexOf('</ScrollView>');
    if (endOfScrollView !== -1 && endOfScrollView > modalStart) {
        content = content.substring(0, modalStart) + content.substring(endOfScrollView);
        console.log('Removed Modals');
    }
} else {
    // If it's not named that, let's search for `<Modal`
    const firstModal = content.indexOf('<Modal');
    if (firstModal !== -1) {
        const endOfScrollView = content.lastIndexOf('</ScrollView>');
        content = content.substring(0, firstModal) + content.substring(endOfScrollView);
        console.log('Removed Modals via <Modal search');
    }
}

fs.writeFileSync('src/screens/ProfileScreen.tsx', content, 'utf8');
console.log('ProfileScreen cleaned up');
