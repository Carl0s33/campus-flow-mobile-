import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { FONTS, SIZES, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
}

export function PrimaryButton({ title, disabled, style, ...props }: PrimaryButtonProps) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[
        styles.saveBtn, 
        { backgroundColor: colors.primary },
        disabled && styles.saveBtnDisabled, 
        style
      ]} 
      disabled={disabled}
      {...props}
    >
      <Text style={styles.saveBtnText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  saveBtn: { 
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 16,
    ...SHADOWS.light,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { 
    fontFamily: FONTS.bold, 
    fontSize: SIZES.md, 
    color: '#FFFFFF' 
  },
});
