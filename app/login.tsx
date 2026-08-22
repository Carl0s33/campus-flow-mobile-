import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
  Alert, Image, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useCampusStore } from '@/hooks/useCampusStore';
import { useTheme } from '@/hooks/useTheme';
import { Eye, EyeOff, Camera, ArrowLeft } from 'lucide-react-native';
import { API_BASE_URL } from '@/services/api';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const { colors, isDark } = useTheme();
  const styles = makeStyles(colors, isDark);
  const loginStore = useCampusStore(state => state.login);

  // ── Tab state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // ── Login fields ───────────────────────────────────────────────────────────
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // ── Register fields ────────────────────────────────────────────────────────
  const [regName, setRegName] = useState('');
  const [regMatricula, setRegMatricula] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      Alert.alert('Atenção', 'Preencha o email/matrícula e a senha.');
      return;
    }
    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier.trim(), password: loginPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        Alert.alert('Erro', err.message || 'Credenciais inválidas.');
        return;
      }
      const data = await res.json();
      loginStore(data.name, data.matricula, data.email, data.photoUrl);
      onLoginSuccess();
    } catch {
      // Fallback offline
      loginStore(loginIdentifier, loginIdentifier);
      onLoginSuccess();
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regName.trim() || !regMatricula.trim() || !regEmail.trim() || !regPassword.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }
    setRegLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          matricula: regMatricula.trim(),
          email: regEmail.trim().toLowerCase(),
          password: regPassword,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        Alert.alert('Erro no cadastro', err.message || 'Não foi possível criar a conta.');
        return;
      }
      const data = await res.json();
      setRegisteredUserId(data.id);

      // Upload de foto se houver
      if (photoUri) {
        await uploadPhoto(data.id, photoUri);
      }

      loginStore(data.name, data.matricula, data.email, data.photoUrl);
      onLoginSuccess();
    } catch (e: any) {
      // Fallback offline
      loginStore(regName, regMatricula, regEmail, photoUri);
      onLoginSuccess();
    } finally {
      setRegLoading(false);
    }
  };

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos acessar sua galeria para escolher uma foto.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos acessar sua câmera para tirar uma foto.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const showPhotoPicker = () => {
    Alert.alert('Foto de perfil', 'Como deseja adicionar a foto?', [
      { text: 'Câmera', onPress: takePhoto },
      { text: 'Galeria', onPress: pickPhoto },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const uploadPhoto = async (userId: string, uri: string) => {
    try {
      const filename = uri.split('/').pop() || 'photo.jpg';
      const ext = filename.split('.').pop() || 'jpg';
      const formData = new FormData();
      formData.append('photo', { uri, name: filename, type: `image/${ext}` } as any);

      await fetch(`${API_BASE_URL}/auth/upload-photo/${userId}`, {
        method: 'POST',
        body: formData,
      });
    } catch (e) {
      console.warn('Erro ao fazer upload da foto:', e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "dark-content" : "dark-content"} backgroundColor={isDark ? '#F8FAFC' : colors.background} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView 
          contentContainerStyle={styles.scroll} 
          keyboardShouldPersistTaps="handled" 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ─── Top Curved Header ─── */}
          <View style={styles.headerBlock}>
            <SafeAreaView edges={['top']} style={{ flex: 1 }}>
              <View style={styles.headerContent}>
                <View style={styles.topIconRow}>
                  {activeTab === 'register' ? (
                    <TouchableOpacity onPress={() => setActiveTab('login')} hitSlop={{top:15,bottom:15,left:15,right:15}}>
                      <ArrowLeft size={24} color={styles.title.color} />
                    </TouchableOpacity>
                  ) : <View style={{ height: 24, width: 24 }} />}
                </View>

                <View style={styles.headerTexts}>
                  <Text style={styles.title}>
                    {activeTab === 'login' ? 'Bem-vindo\nde volta!' : 'Criar\nConta.'}
                  </Text>
                  <Text style={styles.subtitle}>
                    {activeTab === 'login' ? 'Continue sua jornada acadêmica.' : 'Organize e simplifique sua vida no campus.'}
                  </Text>
                </View>
              </View>
            </SafeAreaView>
          </View>

          {/* ─── Body & Forms ─── */}
          <View style={styles.bodyBlock}>
            
            {/* Login Form */}
            {activeTab === 'login' && (
              <View style={styles.formContainer}>
                <Field
                  label="Email ou Matrícula"
                  value={loginIdentifier}
                  onChangeText={setLoginIdentifier}
                  placeholder="Seu email institucional"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  styles={styles}
                  colors={colors}
                />
                <Field
                  label="Senha"
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  placeholder="Sua senha secreta"
                  secureTextEntry={!showLoginPass}
                  styles={styles}
                  colors={colors}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowLoginPass(p => !p)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                      {showLoginPass
                        ? <EyeOff size={18} color={colors.textSecondary} />
                        : <Eye size={18} color={colors.textSecondary} />}
                    </TouchableOpacity>
                  }
                />
                
                <TouchableOpacity style={styles.forgotPassBtn}>
                  <Text style={styles.forgotPassText}>Esqueceu a senha?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryBtn, loginLoading && styles.btnDisabled]}
                  onPress={handleLogin}
                  activeOpacity={0.85}
                  disabled={loginLoading}
                >
                  {loginLoading
                    ? <ActivityIndicator size="small" color="#FFF" />
                    : <Text style={styles.primaryBtnText}>Entrar</Text>}
                </TouchableOpacity>

                <View style={styles.switchRow}>
                  <Text style={styles.switchText}>Ainda não tem conta?</Text>
                  <TouchableOpacity onPress={() => setActiveTab('register')} hitSlop={{top:10,bottom:10}}>
                    <Text style={styles.switchLink}>Cadastre-se</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <View style={styles.formContainer}>
                
                {/* Photo Picker Premium */}
                <TouchableOpacity style={styles.photoArea} onPress={showPhotoPicker} activeOpacity={0.8}>
                  {photoUri ? (
                    <View>
                      <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                      <View style={styles.photoBadge}>
                        <Camera size={14} color="#FFF" />
                      </View>
                    </View>
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Camera size={28} color={colors.primary} />
                      <Text style={styles.photoLabel}>Adicionar Foto</Text>
                      <View style={styles.photoBadge}>
                        <Camera size={14} color="#FFF" />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>

                <Field label="Nome Completo" value={regName} onChangeText={setRegName} placeholder="Como quer ser chamado?" styles={styles} colors={colors} />
                <Field label="Matrícula" value={regMatricula} onChangeText={setRegMatricula} placeholder="Seu ID de estudante" autoCapitalize="none" styles={styles} colors={colors} />
                <Field label="Email" value={regEmail} onChangeText={setRegEmail} placeholder="nome@inst.edu.br" autoCapitalize="none" keyboardType="email-address" styles={styles} colors={colors} />
                <Field
                  label="Senha"
                  value={regPassword}
                  onChangeText={setRegPassword}
                  placeholder="Mínimo 4 caracteres"
                  secureTextEntry={!showRegPass}
                  styles={styles}
                  colors={colors}
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowRegPass(p => !p)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                      {showRegPass ? <EyeOff size={18} color={colors.textSecondary} /> : <Eye size={18} color={colors.textSecondary} />}
                    </TouchableOpacity>
                  }
                />

                <TouchableOpacity
                  style={[styles.primaryBtn, { marginTop: 24 }, regLoading && styles.btnDisabled]}
                  onPress={handleRegister}
                  activeOpacity={0.85}
                  disabled={regLoading}
                >
                  {regLoading
                    ? <ActivityIndicator size="small" color="#FFF" />
                    : <Text style={styles.primaryBtnText}>Criar Conta</Text>}
                </TouchableOpacity>

                <View style={styles.switchRow}>
                  <Text style={styles.switchText}>Já possui uma conta?</Text>
                  <TouchableOpacity onPress={() => setActiveTab('login')} hitSlop={{top:10,bottom:10}}>
                    <Text style={styles.switchLink}>Faça Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ── Componente de campo estilo Underline (Referência Imagem) ──
interface FieldProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  rightIcon?: React.ReactNode;
  styles: any;
  colors: any;
}

function Field({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize, rightIcon, styles, colors }: FieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'words'}
          autoCorrect={false}
          selectionColor={colors.primary}
        />
        {rightIcon && <View style={styles.eyeBtn}>{rightIcon}</View>}
      </View>
    </View>
  );
}

// ── Styles ──
function makeStyles(colors: any, isDark: boolean) {
  // Inverted Split-Screen logic
  const bgHeader = isDark ? '#F8FAFC' : '#121212';
  const bgBody = colors.background; // Dark: #121212, Light: Cool Slate
  const textHeader = isDark ? '#1A1C20' : '#FFFFFF';
  const subtitleHeader = isDark ? '#4A4A4A' : '#A0A4A8';
  const inputBorder = isDark ? '#F8FAFC' : '#121212'; // Underline constrasta com o bgBody
  const badgeBorder = isDark ? '#121212' : '#F8FAFC'; // Combina com o bgBody
  
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: bgBody },
    flex: { flex: 1 },
    scroll: { flexGrow: 1, backgroundColor: bgBody },

    // Header Curvo
    headerBlock: {
      backgroundColor: bgHeader,
      borderBottomRightRadius: 80,
      minHeight: 280,
      paddingHorizontal: 32,
      paddingBottom: 48,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
      zIndex: 10,
    },
    headerContent: {
      flex: 1,
      justifyContent: 'space-between',
      paddingTop: 16,
    },
    topIconRow: {
      flexDirection: 'row',
      marginBottom: 24,
    },
    headerTexts: {
      gap: 8,
    },
    title: {
      fontFamily: 'Inter-Bold',
      fontSize: 38,
      color: textHeader,
      lineHeight: 44,
      letterSpacing: -1,
    },
    subtitle: {
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: subtitleHeader,
    },

    // Body e Formulário
    bodyBlock: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 48,
      paddingBottom: 40,
      backgroundColor: bgBody,
    },
    formContainer: {
      flex: 1,
    },

    // Campos Underline
    fieldGroup: {
      marginBottom: 24,
    },
    label: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: inputBorder,
      paddingBottom: 10,
    },
    input: {
      flex: 1,
      fontFamily: 'Inter-Medium',
      fontSize: 16,
      color: colors.textPrimary,
      height: 30, // altura do texto
      padding: 0, // remove padding padrão do android
    },
    eyeBtn: {
      paddingLeft: 12,
    },

    // Botões e Ações
    forgotPassBtn: {
      alignSelf: 'flex-end',
      marginTop: -8,
      marginBottom: 32,
    },
    forgotPassText: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.textPrimary,
    },

    primaryBtn: {
      backgroundColor: colors.primary, // Verde IFRN
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    btnDisabled: {
      opacity: 0.6,
    },
    primaryBtnText: {
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      color: '#FFFFFF', // Branco no verde
    },

    // Switch de Aba (Rodapé)
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 'auto',
      gap: 8,
    },
    switchText: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.textSecondary,
    },
    switchLink: {
      fontFamily: 'Inter-Bold',
      fontSize: 14,
      color: colors.textPrimary,
    },

    // Foto de Perfil Premium
    photoArea: {
      alignSelf: 'center',
      marginBottom: 32,
      position: 'relative',
    },
    photoPreview: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: colors.primary, 
    },
    photoPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: colors.primary, 
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(47, 158, 65, 0.08)' : 'rgba(47, 158, 65, 0.04)', 
      gap: 4,
    },
    photoLabel: {
      fontFamily: 'Inter-Bold',
      fontSize: 10,
      color: colors.primary,
      textTransform: 'uppercase',
    },
    photoBadge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: badgeBorder, 
    },
  });
}
