import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
}

export function PrimaryButton({ title, disabled, style, ...props }: PrimaryButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.saveBtn, disabled && styles.saveBtnDisabled, style]} 
      disabled={disabled}
      {...props}
    >
      <Text style={styles.saveBtnText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  saveBtn: { 
    backgroundColor: COLORS.primary, 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 16 
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { 
    fontFamily: FONTS.bold, 
    fontSize: SIZES.md, 
    color: COLORS.surface 
  },
});
