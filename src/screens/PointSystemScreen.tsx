import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const PointRow = ({ label, value, onChange, placeholder }: any) => {
  return (
    <View style={styles.pointRow}>
      {label ? (
        <View style={styles.pointLabelBadge}>
          <Text style={styles.pointLabelText}>{label}</Text>
        </View>
      ) : null}
      <TextInput 
        style={[styles.pointInput, !label && { marginLeft: 0 }]} 
        value={String(value)} 
        placeholder={placeholder}
        placeholderTextColor="#757575" 
        onChangeText={(text) => {
          // allow empty string to be handled gracefully, but fall back to 0 if parsed
          if (text === '') {
             onChange(''); // handle string state so it can be cleared
          } else {
             const num = parseInt(text);
             if (!isNaN(num)) onChange(num);
          }
        }}
        keyboardType="numeric" 
      />
    </View>
  );
};

const PointSystemScreen = ({ navigation, route }: any) => {
  const [killsPoint, setKillsPoint] = useState(1);
  const [positions, setPositions] = useState<{label: string, value: number | string}[]>(
    Array.from({ length: 25 }, (_, i) => {
      const pos = i + 1;
      let val: number | string = 0;
      if (pos === 1) val = 10;
      else if (pos === 2) val = 6;
      else if (pos === 3) val = 5;
      else if (pos === 4) val = 4;
      else if (pos === 5) val = 3;
      else if (pos === 6) val = 2;
      else if (pos === 7) val = 1;
      else if (pos === 8) val = 1;
      return { label: `#${pos}`, value: val };
    })
  );

  const handlePositionChange = (index: number, newValue: number | string) => {
    const newPositions = [...positions];
    newPositions[index].value = newValue;
    setPositions(newPositions);
  };

  const handleContinue = () => {
    navigation.navigate('CreateTournament', { 
      ...route.params,
      killsPoint,
      positions
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <SafeAreaView style={{ backgroundColor: colors.primary }} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Point System</Text>
        </View>
      </SafeAreaView>
      <KeyboardAwareScrollView style={styles.container} enableOnAndroid={true} extraScrollHeight={20}>

        <Text style={styles.sectionTitle}>Kills point</Text>
        <PointRow label="" value={killsPoint} onChange={setKillsPoint} placeholder="Enter points per kill" />
        <Text style={styles.hintText}>Points awarded per kill</Text>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Position points</Text>
        {positions.map((pos, index) => (
          <PointRow 
            key={pos.label} 
            label={pos.label} 
            value={pos.value} 
            onChange={(val: number) => handlePositionChange(index, val)} 
          />
        ))}

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Save Points System</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.primary,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  subTitle: {
    color: '#757575',
    fontSize: 16,
  },
  title: {
    color: colors.textBlack,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionTitle: {
    color: '#374151',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  hintText: {
    color: '#757575',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 15,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pointLabelBadge: {
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointLabelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pointInput: {
    flex: 1,
    color: colors.textBlack,
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    marginLeft: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default PointSystemScreen;
