import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TurboModuleRegistry } from 'react-native';

const hasNativeModule = Boolean(TurboModuleRegistry?.get?.('RNCDatePicker'));

let NativePicker: any = null;
if (hasNativeModule) {
  try {
    NativePicker = require('@react-native-community/datetimepicker').default;
  } catch (e) {
    NativePicker = null;
  }
}

export const SafeDateTimePicker = (props: any) => {
  const { value, mode, onChange } = props;
  const [tempDate, setTempDate] = useState(value || new Date());

  if (NativePicker) {
    try {
      return <NativePicker {...props} />;
    } catch (e) {
      // Fallback
    }
  }

  return (
    <Modal transparent animationType="fade" visible={true} onRequestClose={() => onChange?.({ type: 'dismissed' })}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Select {mode === 'time' ? 'Time' : 'Date'}</Text>
          <Text style={styles.dateDisplay}>
            {mode === 'time'
              ? tempDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : tempDate.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
          </Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#9CA3AF' }]}
              onPress={() => onChange?.({ type: 'dismissed' })}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#E51025' }]}
              onPress={() => onChange?.({ type: 'set' }, tempDate)}
            >
              <Text style={styles.btnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  dateDisplay: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E51025',
    marginVertical: 16,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default SafeDateTimePicker;
