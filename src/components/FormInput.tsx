import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';

interface FormInputProps extends TextInputProps {
  label: string;
  wrapperStyle?: any;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

export function FormInput({ label, wrapperStyle, style, keyboardType, ...props }: FormInputProps) {
  return (
    <View style={[styles.formGroup, wrapperStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={COLORS.textTertiary}
        keyboardType={keyboardType}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formGroup: { gap: 8 },
  label: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm, color: COLORS.textPrimary },
  input: { 
    backgroundColor: COLORS.surface, 
    borderWidth: 1, 
    borderColor: COLORS.borderLight, 
    borderRadius: 12, 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    fontFamily: FONTS.regular, 
    fontSize: SIZES.md, 
    color: COLORS.textPrimary 
  },
});
