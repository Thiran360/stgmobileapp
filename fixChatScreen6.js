const fs = require('fs');
let content = fs.readFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', 'utf8');

const lines = content.split('\n');
const startIdx = 342; // line 343
const endIdx = 396; // line 397 (</View>)

const replacement = `        {/* Input Footer */}
        <View style={styles.inputContainerWrapper}>
          {(isGroup && adminOnly && !iAmAdmin) ? (
            <View style={{ flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 12, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#6B7280', fontSize: 15, fontWeight: '500' }}>Only admins can send messages</Text>
            </View>
          ) : (
            <>
              {isRecording && (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 24, minHeight: 48, marginRight: 8, paddingHorizontal: 15, elevation: 1 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#E51025', marginRight: 10 }} />
                  <Text style={{ color: '#E51025', fontSize: 16, fontWeight: 'bold' }}>Recording... {recordTime.substring(0, 5)}</Text>
                </View>
              )}

              {!isRecording && (
                <View style={styles.waInputBox}>
                  <TouchableOpacity style={styles.waIconBtn} onPress={() => setEmojiVisible(true)}>
                    <Icon name="happy-outline" size={24} color="#6B7280" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.waTextInput}
                    placeholder="Message"
                    placeholderTextColor="#9CA3AF"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                  />
                  <TouchableOpacity style={[styles.waIconBtn, { marginRight: 4 }]} onPress={() => setAttachmentVisible(true)}>
                    <Icon name="attach" size={24} color="#6B7280" style={{ transform: [{ rotate: '-45deg' }] }} />
                  </TouchableOpacity>
                  {!message.trim() && (
                    <TouchableOpacity style={styles.waIconBtn} onPress={handleOpenCamera}>
                      <Icon name="camera" size={24} color="#6B7280" />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              <TouchableOpacity 
                onPress={() => {
                  if (message.trim().length > 0) {
                    sendMessage();
                  }
                }}
                onLongPress={() => {
                  if (message.trim().length === 0) {
                    onStartRecord();
                  }
                }}
                onPressOut={() => {
                  if (isRecording) {
                    onStopRecord();
                  }
                }}
                style={styles.waSendBtn}
              >
                <Icon name={message.trim().length > 0 ? "send" : "mic"} size={20} color="#FFFFFF" style={message.trim().length > 0 ? { marginLeft: 3 } : {}} />
              </TouchableOpacity>
            </>
          )}
        </View>`;

lines.splice(startIdx, endIdx - startIdx + 1, replacement);

fs.writeFileSync('C:/Office/STG/src/screens/ChatScreen.tsx', lines.join('\n'), 'utf8');
console.log('Replaced input container lines');
