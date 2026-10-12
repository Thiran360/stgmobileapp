import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

interface WizardProgressIndicatorProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Points' },
  { id: 3, label: 'Flyers' },
  { id: 4, label: 'Publish' }
];

const WizardProgressIndicator: React.FC<WizardProgressIndicatorProps> = ({ currentStep }) => {
  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <React.Fragment key={step.id}>
            <View style={styles.stepContainer}>
              <View style={[
                styles.iconContainer,
                isCompleted ? styles.completedIcon : isActive ? styles.activeIcon : styles.inactiveIcon
              ]}>
                {isCompleted ? (
                  <Icon name="checkmark" size={16} color="#FFF" />
                ) : isActive ? (
                  <View style={styles.activeDot} />
                ) : (
                  <View style={styles.inactiveDot} />
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                (isActive || isCompleted) ? styles.activeLabel : styles.inactiveLabel
              ]}>
                {step.label}
              </Text>
            </View>
            
            {index < STEPS.length - 1 && (
              <View style={[
                styles.line,
                isCompleted ? styles.completedLine : styles.inactiveLine
              ]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  stepContainer: {
    alignItems: 'center',
    width: 80,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  completedIcon: {
    backgroundColor: colors.primary,
  },
  activeIcon: {
    backgroundColor: colors.primary,
  },
  inactiveIcon: {
    backgroundColor: '#E0E0E0',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  inactiveDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeLabel: {
    color: colors.primary,
  },
  inactiveLabel: {
    color: '#999',
  },
  line: {
    flex: 1,
    height: 2,
    marginBottom: 16,
    marginHorizontal: 5,
  },
  completedLine: {
    backgroundColor: colors.primary,
  },
  inactiveLine: {
    backgroundColor: '#E0E0E0',
  },
});

export default WizardProgressIndicator;
