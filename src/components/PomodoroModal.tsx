import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Play, Pause, X, RotateCcw } from 'lucide-react-native';
import { FONTS, SIZES, BORDER, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

interface PomodoroModalProps {
  visible: boolean;
  onClose: () => void;
  taskTitle: string;
}

const POMODORO_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function PomodoroModal({ visible, onClose, taskTitle }: PomodoroModalProps) {
  const { colors, isDark } = useTheme();
  const styles = makeStyles(colors, isDark);

  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Switch mode
      setIsBreak(!isBreak);
      setTimeLeft(!isBreak ? BREAK_TIME : POMODORO_TIME);
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isBreak ? BREAK_TIME : POMODORO_TIME);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>{isBreak ? '☕ Pausa Curta' : '🧠 Tempo de Foco'}</Text>
          <Text style={styles.taskTitle} numberOfLines={2}>Alvo: {taskTitle}</Text>

          <View style={styles.timerContainer}>
            <Text style={styles.timeText}>{minutes}:{seconds}</Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={resetTimer}>
              <RotateCcw size={28} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.playBtn} onPress={toggleTimer}>
              {isRunning ? <Pause size={32} color="#FFF" /> : <Play size={32} color="#FFF" />}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconBtn} 
              onPress={() => {
                setIsBreak(!isBreak);
                setTimeLeft(!isBreak ? BREAK_TIME : POMODORO_TIME);
                setIsRunning(false);
              }}
            >
              <Text style={styles.skipText}>Pular</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, alignItems: 'center', ...SHADOWS.light, minHeight: 400 },
    closeBtn: { position: 'absolute', top: 24, right: 24 },
    headerTitle: { fontFamily: FONTS.bold, fontSize: SIZES.lg, color: colors.textPrimary, marginBottom: 8, marginTop: 12 },
    taskTitle: { fontFamily: FONTS.medium, fontSize: SIZES.sm, color: colors.textSecondary, textAlign: 'center', marginBottom: 32 },
    timerContainer: { width: 220, height: 220, borderRadius: 110, borderWidth: 8, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
    timeText: { fontFamily: FONTS.bold, fontSize: 48, color: colors.textPrimary },
    controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32 },
    iconBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center' },
    skipText: { fontFamily: FONTS.bold, fontSize: SIZES.xs, color: colors.textSecondary },
    playBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', ...SHADOWS.postIt },
  });
}
