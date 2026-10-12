const fs = require('fs');
let c = fs.readFileSync('src/screens/LookingScreen.tsx', 'utf8');

// Replace top level return <View> with <SafeAreaView>
c = c.replace(
  'return (\n    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>',
  'return (\n    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }} edges={[\'top\', \'bottom\']}>'
);
c = c.replace(
  'return (\r\n    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>',
  'return (\r\n    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F4F6" }} edges={[\'top\', \'bottom\']}>'
);

// Close the top level View with SafeAreaView
c = c.replace(
  '      </Modal>\n\n    </View>\n  );\n};',
  '      </Modal>\n\n    </SafeAreaView>\n  );\n};'
);
c = c.replace(
  '      </Modal>\r\n\r\n    </View>\r\n  );\r\n};',
  '      </Modal>\r\n\r\n    </SafeAreaView>\r\n  );\r\n};'
);
c = c.replace(
  '      </Modal>\n    </View>\n  );\n};',
  '      </Modal>\n    </SafeAreaView>\n  );\n};'
);
c = c.replace(
  '      </Modal>\r\n    </View>\r\n  );\r\n};',
  '      </Modal>\r\n    </SafeAreaView>\r\n  );\r\n};'
);

// Modal 1: You Modal
c = c.replace(
  '<Modal visible={youModalVisible} animationType="slide" onRequestClose={() => setYouModalVisible(false)}>\n        <View style={{ flex: 1, backgroundColor: \'#F3F4F6\' }}>',
  '<Modal visible={youModalVisible} animationType="slide" onRequestClose={() => setYouModalVisible(false)}>\n        <SafeAreaView style={{ flex: 1, backgroundColor: \'#F3F4F6\' }} edges={[\'top\', \'bottom\']}>'
);
c = c.replace(
  '<Modal visible={youModalVisible} animationType="slide" onRequestClose={() => setYouModalVisible(false)}>\r\n        <View style={{ flex: 1, backgroundColor: \'#F3F4F6\' }}>',
  '<Modal visible={youModalVisible} animationType="slide" onRequestClose={() => setYouModalVisible(false)}>\r\n        <SafeAreaView style={{ flex: 1, backgroundColor: \'#F3F4F6\' }} edges={[\'top\', \'bottom\']}>'
);
c = c.replace(
  '              </ScrollView>\n          </View>\n        </Modal>',
  '              </ScrollView>\n          </SafeAreaView>\n        </Modal>'
);
c = c.replace(
  '              </ScrollView>\r\n          </View>\r\n        </Modal>',
  '              </ScrollView>\r\n          </SafeAreaView>\r\n        </Modal>'
);
c = c.replace(
  '            </View>\n          </View>\n        </Modal>',
  '            </View>\n          </SafeAreaView>\n        </Modal>'
);
c = c.replace(
  '            </View>\r\n          </View>\r\n        </Modal>',
  '            </View>\r\n          </SafeAreaView>\r\n        </Modal>'
);


// Modal 2: Post Modal
c = c.replace(
  '<Modal visible={postModalVisible} animationType="slide" onRequestClose={() => setPostModalVisible(false)}>\n        <View style={{ flex: 1, backgroundColor: \'#F3F4F6\' }}>',
  '<Modal visible={postModalVisible} animationType="slide" onRequestClose={() => setPostModalVisible(false)}>\n        <SafeAreaView style={{ flex: 1, backgroundColor: \'#F3F4F6\' }} edges={[\'top\', \'bottom\']}>'
);
c = c.replace(
  '<Modal visible={postModalVisible} animationType="slide" onRequestClose={() => setPostModalVisible(false)}>\r\n        <View style={{ flex: 1, backgroundColor: \'#F3F4F6\' }}>',
  '<Modal visible={postModalVisible} animationType="slide" onRequestClose={() => setPostModalVisible(false)}>\r\n        <SafeAreaView style={{ flex: 1, backgroundColor: \'#F3F4F6\' }} edges={[\'top\', \'bottom\']}>'
);
c = c.replace(
  '            </KeyboardAvoidingView>\n          </View>\n        </Modal>',
  '            </KeyboardAvoidingView>\n          </SafeAreaView>\n        </Modal>'
);
c = c.replace(
  '            </KeyboardAvoidingView>\r\n          </View>\r\n        </Modal>',
  '            </KeyboardAvoidingView>\r\n          </SafeAreaView>\r\n        </Modal>'
);

fs.writeFileSync('src/screens/LookingScreen.tsx', c, 'utf8');
console.log('Fixed safe areas');
