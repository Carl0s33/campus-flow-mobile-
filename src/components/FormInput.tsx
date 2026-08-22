import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { FONTS, SIZES, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface FormInputProps extends TextInputProps {
  label: string;
  wrapperStyle?: any;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

export function FormInput({ label, wrapperStyle, style, keyboardType, ...props }: FormInputProps) {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.formGroup, wrapperStyle]}>
      <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          { 
            backgroundColor: colors.surface,
            color: colors.textPrimary,
          },
          !isDark && styles.flatShadow,
          style
        ]}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formGroup: { gap: 8 },
  label: { fontFamily: FONTS.semiBold, fontSize: SIZES.sm },
  input: { 
    borderRadius: 16, 
    paddingHorizontal: 16, 
    paddingVertical: 14, 
    fontFamily: FONTS.regular, 
    fontSize: SIZES.md, 
  },
  flatShadow: {
    ...SHADOWS.light,
  }
});
