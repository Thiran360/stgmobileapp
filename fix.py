import re

with open(r'c:\Office\STG\src\screens\LookingScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Define replacements
replacements = [
    # Team
    (r'<TextInput style=\{styles\.modalInput\} placeholder="Enter your team name"', 
     r'<TextInput style={styles.modalInput} value={formData.teamName} onChangeText={t => setFormData({...formData, teamName: t})} placeholder="Enter your team name"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. Mortal"', 
     r'<TextInput style={styles.modalInput} value={formData.player1Name} onChangeText={t => setFormData({...formData, player1Name: t})} placeholder="e.g. Mortal"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. IGL"', 
     r'<TextInput style={styles.modalInput} value={formData.player1Role} onChangeText={t => setFormData({...formData, player1Role: t})} placeholder="e.g. IGL"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. Viper"', 
     r'<TextInput style={styles.modalInput} value={formData.player2Name} onChangeText={t => setFormData({...formData, player2Name: t})} placeholder="e.g. Viper"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. Assaulter"', 
     r'<TextInput style={styles.modalInput} value={formData.player2Role} onChangeText={t => setFormData({...formData, player2Role: t})} placeholder="e.g. Assaulter"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. Regaltos"', 
     r'<TextInput style={styles.modalInput} value={formData.player3Name} onChangeText={t => setFormData({...formData, player3Name: t})} placeholder="e.g. Regaltos"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. Entry Fragger"', 
     r'<TextInput style={styles.modalInput} value={formData.player3Role} onChangeText={t => setFormData({...formData, player3Role: t})} placeholder="e.g. Entry Fragger"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. Scout"', 
     r'<TextInput style={styles.modalInput} value={formData.player4Name} onChangeText={t => setFormData({...formData, player4Name: t})} placeholder="e.g. Scout"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. Flanker"', 
     r'<TextInput style={styles.modalInput} value={formData.player4Role} onChangeText={t => setFormData({...formData, player4Role: t})} placeholder="e.g. Flanker"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. Jonathan"', 
     r'<TextInput style={styles.modalInput} value={formData.player5Name} onChangeText={t => setFormData({...formData, player5Name: t})} placeholder="e.g. Jonathan"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. Support"', 
     r'<TextInput style={styles.modalInput} value={formData.player5Role} onChangeText={t => setFormData({...formData, player5Role: t})} placeholder="e.g. Support"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. Mavi"', 
     r'<TextInput style={styles.modalInput} value={formData.player6Name} onChangeText={t => setFormData({...formData, player6Name: t})} placeholder="e.g. Mavi"'),
    
    (r'<TextInput style=\{styles\.modalTextArea\} multiline placeholder="e\.g\. We are looking for an aggressive Assaulter"', 
     r'<TextInput style={styles.modalTextArea} multiline value={formData.description} onChangeText={t => setFormData({...formData, description: t})} placeholder="e.g. We are looking for an aggressive Assaulter"'),

    # Players
    (r'<TextInput style=\{styles\.modalInput\} placeholder="Enter your name"', 
     r'<TextInput style={styles.modalInput} value={formData.playerName} onChangeText={t => setFormData({...formData, playerName: t})} placeholder="Enter your name"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. Assaulter, Sniper, etc\."', 
     r'<TextInput style={styles.modalInput} value={formData.role} onChangeText={t => setFormData({...formData, role: t})} placeholder="e.g. Assaulter, Sniper, etc."'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. iPhone 15"', 
     r'<TextInput style={styles.modalInput} value={formData.deviceModel} onChangeText={t => setFormData({...formData, deviceModel: t})} placeholder="e.g. iPhone 15"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. 2\+ Years"', 
     r'<TextInput style={styles.modalInput} value={formData.experience} onChangeText={t => setFormData({...formData, experience: t})} placeholder="e.g. 2+ Years"'),
    (r'<TextInput style=\{styles\.modalTextArea\} multiline placeholder="Tell us about your gameplay and achievements\.\.\."', 
     r'<TextInput style={styles.modalTextArea} multiline value={formData.description} onChangeText={t => setFormData({...formData, description: t})} placeholder="Tell us about your gameplay and achievements..."'),

    # Organisation
    (r'<TextInput style=\{styles\.modalInput\} placeholder="Enter your organisation name"', 
     r'<TextInput style={styles.modalInput} value={formData.orgName} onChangeText={t => setFormData({...formData, orgName: t})} placeholder="Enter your organisation name"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="e\.g\. 2023"', 
     r'<TextInput style={styles.modalInput} value={formData.established} onChangeText={t => setFormData({...formData, established: t})} placeholder="e.g. 2023"'),
    (r'<TextInput style=\{styles\.modalTextArea\} multiline placeholder="Tell us about your organisation and what you are looking for\.\.\."', 
     r'<TextInput style={styles.modalTextArea} multiline value={formData.description} onChangeText={t => setFormData({...formData, description: t})} placeholder="Tell us about your organisation and what you are looking for..."'),

    # Unknown / General
    (r'<TextInput style=\{styles\.modalInput\} placeholder="Enter your BGMI ID"', 
     r'<TextInput style={styles.modalInput} value={formData.inGameId} onChangeText={t => setFormData({...formData, inGameId: t})} placeholder="Enter your BGMI ID"'),
    (r'<TextInput style=\{styles\.modalInput\} placeholder="Enter your in-game name"', 
     r'<TextInput style={styles.modalInput} value={formData.inGameName} onChangeText={t => setFormData({...formData, inGameName: t})} placeholder="Enter your in-game name"'),
    (r'<TextInput style=\{styles\.modalTextArea\} multiline placeholder="Mention your achievements"', 
     r'<TextInput style={styles.modalTextArea} multiline value={formData.achievements} onChangeText={t => setFormData({...formData, achievements: t})} placeholder="Mention your achievements"'),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(r'c:\Office\STG\src\screens\LookingScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done replacing.')
