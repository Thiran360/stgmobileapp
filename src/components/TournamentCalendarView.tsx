import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '../theme/colors';

const CustomDay = ({ date, state, marking }: any) => {
  const isSelected = marking?.selected;
  const isReg = marking?.isReg;
  const stageTitle = marking?.stageTitle;
  const stageIndex = marking?.stageIndex ?? 0;
  const isMatch = stageTitle === 'Match';

  const stageColors = [
    { main: '#8B5CF6', pillBg: '#EDE9FE', pillText: '#6D28D9' }, // Purple
    { main: '#E51025', pillBg: '#DBEAFE', pillText: '#B91C1C' }, // Blue
    { main: '#10B981', pillBg: '#D1FAE5', pillText: '#047857' }, // Emerald
    { main: '#EC4899', pillBg: '#FCE7F3', pillText: '#BE185D' }, // Pink
    { main: '#06B6D4', pillBg: '#CFFAFE', pillText: '#0E7490' }, // Cyan
    { main: '#84CC16', pillBg: '#ECFCCB', pillText: '#4D7C0F' }, // Lime
  ];
  
  let colorSet = stageColors[stageIndex % stageColors.length];
  if (stageTitle) {
    const lowerTitle = stageTitle.toLowerCase();
    if (lowerTitle.includes('grand finals') || lowerTitle.includes('final')) {
      colorSet = { main: '#E51025', pillBg: '#FEE2E2', pillText: '#B91C1C' }; // Red
    } else if (lowerTitle.includes('semi')) {
      colorSet = { main: '#F97316', pillBg: '#FFEDD5', pillText: '#C2410C' }; // Orange
    }
  }

  let bgColor = 'transparent';
  let textColor = state === 'disabled' ? '#CBD5E1' : colors.textBlack;
  let shadowColor = 'transparent';

  if (isSelected) {
    if (isMatch) {
      bgColor = '#E51025'; 
      shadowColor = '#E51025';
    } else {
      bgColor = colorSet.main; 
      shadowColor = colorSet.main;
    }
    textColor = '#FFF';
  } else if (isReg) {
    bgColor = 'rgba(245, 158, 11, 0.15)'; 
    textColor = '#D97706'; 
  }

  const scale = useRef(new Animated.Value(isSelected ? 1.15 : 1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      delay: Math.random() * 150,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isSelected ? 1.15 : 1,
      friction: 5,
      tension: 120,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: 42, width: 42 }}>
      <Animated.View style={[
        { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', opacity, backgroundColor: bgColor },
        isSelected ? { shadowColor, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 } : {},
        { transform: [{ scale }] }
      ]}>
        <Text style={[{ fontSize: 14, includeFontPadding: false, textAlignVertical: 'center', textAlign: 'center', color: textColor }, isSelected && { fontWeight: 'bold' }]}>
          {date.day}
        </Text>
      </Animated.View>
      {stageTitle && !isMatch ? (
        <View style={{ position: 'absolute', bottom: -14, backgroundColor: colorSet.pillBg, paddingHorizontal: 2, paddingVertical: 1, borderRadius: 4, zIndex: 10, shadowColor: colorSet.main, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1, elevation: 2, width: 44, alignSelf: 'center' }}>
          <Text adjustsFontSizeToFit numberOfLines={2} style={{ fontSize: 6, lineHeight: 7, color: colorSet.pillText, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' }}>
            {stageTitle.replace(' ', '\n')}
          </Text>
        </View>
      ) : isMatch ? (
        <View style={{ position: 'absolute', bottom: -12, backgroundColor: '#FEE2E2', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4, zIndex: 10, shadowColor: '#E51025', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1, elevation: 2, alignSelf: 'center' }}>
          <Text style={{ fontSize: 7, color: '#B91C1C', fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' }}>MATCH</Text>
        </View>
      ) : isReg && !isSelected ? (
        <View style={{ position: 'absolute', bottom: -10, backgroundColor: '#FEF3C7', paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4, zIndex: 10, alignSelf: 'center' }}>
          <Text style={{ fontSize: 7, color: '#B45309', fontWeight: '900', textTransform: 'uppercase' }}>REG</Text>
        </View>
      ) : null}
    </View>
  );
};

const parseToYYYYMMDD = (dateStr: string) => {
  if (!dateStr) return null;
  const parts = dateStr.split(' ');
  if (parts.length !== 3) return null;
  const day = parts[0].padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = (months.indexOf(parts[1]) + 1).toString().padStart(2, '0');
  const year = parts[2];
  return `${year}-${month}-${day}`;
};

export const TournamentCalendarView = ({ regStartDate, regEndDate, matchDatesObj }: any) => {
  const getMarkedDates = () => {
    const marks: any = { ...(matchDatesObj || {}) };
    const start = parseToYYYYMMDD(regStartDate);
    const end = parseToYYYYMMDD(regEndDate);
    
    if (start && end) {
      let current = new Date(start);
      const endD = new Date(end);
      while (current <= endD) {
        const pad = (n: number) => n < 10 ? '0' + n : n;
        const dStr = `${current.getFullYear()}-${pad(current.getMonth() + 1)}-${pad(current.getDate())}`;
        if (!marks[dStr] || !marks[dStr].selected) {
          marks[dStr] = { ...marks[dStr], isReg: true };
        }
        current.setDate(current.getDate() + 1);
      }
    }
    return marks;
  };

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        dayComponent={({ date, state, marking }: any) => (
          <CustomDay date={date} state={state} marking={marking} />
        )}
        markedDates={getMarkedDates()}
        theme={{
          calendarBackground: '#FFFFFF',
          dayTextColor: '#1F2937',
          monthTextColor: '#111827',
          textDisabledColor: '#D1D5DB',
          arrowColor: colors.primary,
          todayTextColor: colors.primary,
          textMonthFontWeight: '700',
          textMonthFontSize: 18,
          textDayHeaderFontWeight: '600',
          textDayHeaderFontSize: 13,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 20,
  },
});


