# Life Update React Native - Plan de Implementación

> **Para trabajadores agénticos:** HABILIDAD REQUERIDA: Usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan sintaxis de checkbox (`- [ ]`) para tracking.

**Objetivo:** Crear app móvil nativa Life Update con React Native, Expo, glass morphism design, y notificaciones iOS

**Arquitectura:** Nueva app React Native con Expo managed workflow, mismo backend Supabase, componentes UI custom con BlurView y gradientes, navegación tabs inferior

**Stack Técnico:** React Native + Expo 51, TypeScript, expo-blur, expo-linear-gradient, expo-notifications, @supabase/supabase-js, iconoir-react-native, react-native-chart-kit

---

## Estructura de Archivos

**PROYECTO NUEVO - Crear en directorio separado:**
```
C:\dev\life-update-mobile\
```

**Archivos a crear:**

**Core:**
- `app/_layout.tsx` - Layout raíz con auth check
- `app/(auth)/login.tsx` - Pantalla login
- `app/(tabs)/_layout.tsx` - Config tab navigator
- `app/(tabs)/daily.tsx` - Pantalla daily check-in
- `app/(tabs)/history.tsx` - Pantalla history
- `.env.local` - Variables de entorno

**Lib:**
- `lib/theme.ts` - Sistema de diseño (colores, spacing, typography)
- `lib/constants.ts` - Constantes (CURRENT_USER_ID, APP_PASSWORD)
- `lib/auth.ts` - Helpers autenticación
- `lib/supabase.ts` - Cliente Supabase
- `lib/api.ts` - Funciones API (createDailyEntry, fetchHistoryEntries)
- `lib/notifications.ts` - Configuración notificaciones

**Componentes UI:**
- `components/ui/GlassCard.tsx` - Card con blur effect
- `components/ui/GlassButton.tsx` - Botón con gradiente/glass
- `components/ui/GlassInput.tsx` - Input con fondo glass
- `components/ui/CustomSlider.tsx` - Slider con glow naranja
- `components/ui/CustomCheckbox.tsx` - Checkbox con gradiente
- `components/ui/StatCard.tsx` - Tarjeta stats
- `components/ui/Toast.tsx` - Toast notification

**Forms:**
- `components/forms/DailyEntryForm.tsx` - Formulario daily completo

**Charts:**
- `components/charts/EnergyStressChart.tsx` - Line chart

**Navigation:**
- `components/navigation/CustomTabBar.tsx` - Tab bar personalizada

**Types:**
- `types/index.ts` - Tipos TypeScript

---

## Task 1: Configuración Inicial del Proyecto

**Files:**
- Create: `C:\dev\life-update-mobile\` (todo el proyecto)

- [ ] **Paso 1: Crear proyecto Expo**

```bash
cd C:\dev
npx create-expo-app@latest life-update-mobile --template tabs
```

Esperado: Proyecto creado en `C:\dev\life-update-mobile`

- [ ] **Paso 2: Navegar al proyecto e instalar dependencias core**

```bash
cd life-update-mobile
npm install expo-blur expo-linear-gradient expo-notifications
```

- [ ] **Paso 3: Instalar dependencias de datos y UI**

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage
npm install iconoir-react-native
npm install react-native-chart-kit react-native-svg
```

- [ ] **Paso 4: Crear archivo de environment**

```bash
# .env.local
EXPO_PUBLIC_SUPABASE_URL=https://xwonyamdunodygymzvrs.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3b255YW1kdW5vZHlneW16dnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MzgxODgsImV4cCI6MjA5MzUxNDE4OH0.amd3cTYGT5DBb9UQcM7gujamTMTagFseFZME5JYDYtE
```

- [ ] **Paso 5: Verificar que el proyecto arranca**

```bash
npx expo start
```

Esperado: Metro bundler arranca, ver código QR en terminal

- [ ] **Paso 6: Commit inicial**

```bash
git init
git add .
git commit -m "feat: initial Expo project setup"
```

---

## Task 2: Sistema de Diseño (Theme)

**Files:**
- Create: `lib/theme.ts`

- [ ] **Paso 1: Crear archivo theme.ts con colores**

```typescript
// lib/theme.ts
export const colors = {
  // Fondos
  bgPrimary: '#0a0a0a',
  bgSecondary: '#1a1a1a',
  bgElevated: '#171717',
  
  // Efecto Glass
  glassBg: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassIntense: 'rgba(255, 255, 255, 0.08)',
  
  // Gradientes Naranja/Ámbar
  gradientStart: '#f97316',
  gradientEnd: '#fb923c',
  gradientAccentStart: '#ea580c',
  gradientAccentEnd: '#f97316',
  
  // Texto
  textPrimary: '#ffffff',
  textSecondary: '#e5e7eb',
  textMuted: '#9ca3af',
  textDisabled: '#6b7280',
  
  // Semánticos
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};
```

- [ ] **Paso 2: Commit theme**

```bash
git add lib/theme.ts
git commit -m "feat: add design system theme"
```

---

## Task 3: Constantes y Auth Helpers

**Files:**
- Create: `lib/constants.ts`
- Create: `lib/auth.ts`

- [ ] **Paso 1: Crear constants.ts**

```typescript
// lib/constants.ts
export const CURRENT_USER_ID = 'danilo-main-user';
export const APP_PASSWORD = 'B dano';
export const SESSION_KEY = 'life-update-session';
```

- [ ] **Paso 2: Crear auth.ts con helpers**

```typescript
// lib/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_PASSWORD, SESSION_KEY } from './constants';

function generateRandomId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function login(password: string): Promise<boolean> {
  if (password !== APP_PASSWORD) {
    return false;
  }
  
  const sessionId = generateRandomId();
  await AsyncStorage.setItem(SESSION_KEY, sessionId);
  return true;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await AsyncStorage.getItem(SESSION_KEY);
  return !!session;
}
```

- [ ] **Paso 3: Commit auth**

```bash
git add lib/constants.ts lib/auth.ts
git commit -m "feat: add auth helpers with AsyncStorage"
```

---

## Task 4: Cliente Supabase y API

**Files:**
- Create: `lib/supabase.ts`
- Create: `lib/api.ts`
- Create: `types/index.ts`

- [ ] **Paso 1: Crear tipos TypeScript**

```typescript
// types/index.ts
export interface DailyEntryInput {
  energyLevel: number;
  stressLevel: number;
  physicalPain: boolean;
  painLocation: string;
  trainedToday: boolean;
  deepWorkHours: number;
  cleanToday: boolean;
  quickNote: string;
}

export interface DailyEntry extends DailyEntryInput {
  id: string;
  user_id: string;
  date: string;
  created_at: string;
  updated_at: string;
}
```

- [ ] **Paso 2: Crear cliente Supabase**

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Paso 3: Crear funciones API**

```typescript
// lib/api.ts
import { supabase } from './supabase';
import { CURRENT_USER_ID } from './constants';
import type { DailyEntryInput, DailyEntry } from '../types';

export async function createDailyEntry(data: DailyEntryInput): Promise<DailyEntry> {
  const { data: entry, error } = await supabase
    .from('daily_entries')
    .insert({
      user_id: CURRENT_USER_ID,
      energy_level: data.energyLevel,
      stress_level: data.stressLevel,
      physical_pain: data.physicalPain,
      pain_location: data.painLocation,
      trained_today: data.trainedToday,
      deep_work_hours: data.deepWorkHours,
      clean_today: data.cleanToday,
      quick_note: data.quickNote,
      date: new Date().toISOString().split('T')[0],
    })
    .select()
    .single();
  
  if (error) throw error;
  return entry as DailyEntry;
}

export async function fetchHistoryEntries(limit = 30): Promise<DailyEntry[]> {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('user_id', CURRENT_USER_ID)
    .order('date', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data as DailyEntry[];
}
```

- [ ] **Paso 4: Commit Supabase y API**

```bash
git add types/index.ts lib/supabase.ts lib/api.ts
git commit -m "feat: add Supabase client and API functions"
```

---

## Task 5: Componente GlassCard

**Files:**
- Create: `components/ui/GlassCard.tsx`

- [ ] **Paso 1: Crear GlassCard**

```typescript
// components/ui/GlassCard.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, spacing, borderRadius } from '../../lib/theme';

interface GlassCardProps {
  children: React.ReactNode;
  intensity?: number;
  style?: ViewStyle;
}

export function GlassCard({ children, intensity = 20, style }: GlassCardProps) {
  return (
    <BlurView
      intensity={intensity}
      tint="dark"
      style={[styles.card, style]}
    >
      <View style={styles.innerCard}>
        {children}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  innerCard: {
    backgroundColor: colors.glassBg,
    padding: spacing.lg,
  },
});
```

- [ ] **Paso 2: Commit GlassCard**

```bash
git add components/ui/GlassCard.tsx
git commit -m "feat: add GlassCard component with blur effect"
```

---

## Task 6: Componente GlassButton

**Files:**
- Create: `components/ui/GlassButton.tsx`

- [ ] **Paso 1: Crear GlassButton**

```typescript
// components/ui/GlassButton.tsx
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, spacing, borderRadius, typography } from '../../lib/theme';

interface GlassButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function GlassButton({
  onPress,
  children,
  variant = 'primary',
  disabled = false,
  icon,
  style,
}: GlassButtonProps) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={[styles.buttonContainer, style]}
      >
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryButton}
        >
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={styles.primaryText}>{children}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.buttonContainer, style]}
    >
      <BlurView intensity={20} tint="dark" style={styles.secondaryButton}>
        <View style={styles.secondaryInner}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={styles.secondaryText}>{children}</Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  primaryText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  secondaryButton: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  secondaryInner: {
    backgroundColor: colors.glassBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  secondaryText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
```

- [ ] **Paso 2: Commit GlassButton**

```bash
git add components/ui/GlassButton.tsx
git commit -m "feat: add GlassButton with primary and secondary variants"
```

---

## Task 7: Componente GlassInput

**Files:**
- Create: `components/ui/GlassInput.tsx`

- [ ] **Paso 1: Crear GlassInput**

```typescript
// components/ui/GlassInput.tsx
import React from 'react';
import { TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, spacing, borderRadius, typography } from '../../lib/theme';

interface GlassInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoFocus?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  style?: ViewStyle;
}

export function GlassInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoFocus,
  multiline,
  numberOfLines,
  maxLength,
  style,
}: GlassInputProps) {
  return (
    <BlurView intensity={20} tint="dark" style={[styles.container, style]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textDisabled}
        secureTextEntry={secureTextEntry}
        autoFocus={autoFocus}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        style={styles.input}
      />
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: colors.glassBg,
    padding: spacing.lg,
    ...typography.body,
    color: colors.textPrimary,
  },
});
```

- [ ] **Paso 2: Commit GlassInput**

```bash
git add components/ui/GlassInput.tsx
git commit -m "feat: add GlassInput component"
```

---

## Task 8: Componentes CustomSlider y CustomCheckbox

**Files:**
- Create: `components/ui/CustomSlider.tsx`
- Create: `components/ui/CustomCheckbox.tsx`

- [ ] **Paso 1: Crear CustomSlider**

```typescript
// components/ui/CustomSlider.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '../../lib/theme';

interface CustomSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step: number;
}

export function CustomSlider({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step,
}: CustomSliderProps) {
  return (
    <Slider
      value={value}
      onValueChange={onValueChange}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      step={step}
      minimumTrackTintColor={colors.gradientStart}
      maximumTrackTintColor={colors.glassBorder}
      thumbTintColor={colors.gradientEnd}
      style={styles.slider}
    />
  );
}

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    height: 40,
  },
});
```

- [ ] **Paso 2: Instalar dependencia slider**

```bash
npx expo install @react-native-community/slider
```

- [ ] **Paso 3: Crear CustomCheckbox**

```typescript
// components/ui/CustomCheckbox.tsx
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'iconoir-react-native';
import { colors, spacing, borderRadius, typography } from '../../lib/theme';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function CustomCheckbox({ checked, onChange, label }: CustomCheckboxProps) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!checked)}
      style={styles.container}
      activeOpacity={0.7}
    >
      {checked ? (
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.checkboxChecked}
        >
          <Check width={16} height={16} color={colors.textPrimary} strokeWidth={3} />
        </LinearGradient>
      ) : (
        <View style={styles.checkboxUnchecked} />
      )}
      <Text style={[styles.label, checked && styles.labelChecked]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxUnchecked: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassBg,
  },
  label: {
    ...typography.body,
    color: colors.textMuted,
  },
  labelChecked: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
});
```

- [ ] **Paso 4: Commit slider y checkbox**

```bash
git add components/ui/CustomSlider.tsx components/ui/CustomCheckbox.tsx
git commit -m "feat: add CustomSlider and CustomCheckbox components"
```

---

## Task 9: Componentes StatCard y Toast

**Files:**
- Create: `components/ui/StatCard.tsx`
- Create: `components/ui/Toast.tsx`

- [ ] **Paso 1: Crear StatCard**

```typescript
// components/ui/StatCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from './GlassCard';
import { colors, spacing, typography } from '../../lib/theme';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  gradient?: boolean;
}

export function StatCard({ icon, label, value, subtitle, gradient }: StatCardProps) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
      </View>
      {gradient ? (
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.valueGradient}
        >
          <Text style={styles.valueText}>{value}</Text>
        </LinearGradient>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
      <Text style={styles.subtitle}>{subtitle}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 16,
    height: 16,
  },
  label: {
    ...typography.caption,
    color: colors.textDisabled,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  value: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  valueGradient: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  valueText: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
```

- [ ] **Paso 2: Crear Toast**

```typescript
// components/ui/Toast.tsx
import React, { useEffect } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { GlassCard } from './GlassCard';
import { colors, spacing, typography } from '../../lib/theme';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  visible: boolean;
  onHide: () => void;
}

export function Toast({ message, type = 'success', visible, onHide }: ToastProps) {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }] },
      ]}
    >
      <GlassCard
        style={[
          styles.toast,
          type === 'error' && styles.toastError,
        ]}
      >
        <Text style={styles.message}>{message}</Text>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: spacing.xxl,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 1000,
  },
  toast: {
    borderWidth: 1,
    borderColor: colors.success,
  },
  toastError: {
    borderColor: colors.error,
  },
  message: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
```

- [ ] **Paso 3: Commit StatCard y Toast**

```bash
git add components/ui/StatCard.tsx components/ui/Toast.tsx
git commit -m "feat: add StatCard and Toast components"
```

---

## Task 10: Pantalla Login

**Files:**
- Create: `app/(auth)/login.tsx`

- [ ] **Paso 1: Crear pantalla login**

```typescript
// app/(auth)/login.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Flash, LogIn } from 'iconoir-react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassInput } from '../../components/ui/GlassInput';
import { GlassButton } from '../../components/ui/GlassButton';
import { Toast } from '../../components/ui/Toast';
import { login, isAuthenticated } from '../../lib/auth';
import { colors, spacing, borderRadius, typography } from '../../lib/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const authenticated = await isAuthenticated();
    if (authenticated) {
      router.replace('/(tabs)/daily');
    }
  }

  async function handleLogin() {
    if (!password) {
      setError('Por favor ingresa tu contraseña');
      setShowError(true);
      return;
    }

    setIsLoading(true);
    const success = await login(password);
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)/daily');
    } else {
      setError('Contraseña incorrecta');
      setShowError(true);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Toast
        message={error}
        type="error"
        visible={showError}
        onHide={() => setShowError(false)}
      />

      <View style={styles.content}>
        {/* Logo */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logo}
        >
          <Flash width={40} height={40} color={colors.textPrimary} strokeWidth={2.5} />
        </LinearGradient>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Life Update</Text>
          <Text style={styles.subtitle}>Trackea tu progreso diario</Text>
        </View>

        {/* Login Card */}
        <GlassCard style={styles.card}>
          <Text style={styles.label}>Contraseña</Text>
          <GlassInput
            value={password}
            onChangeText={setPassword}
            placeholder="Ingresa tu contraseña"
            secureTextEntry
            autoFocus
            style={styles.input}
          />
          <GlassButton
            onPress={handleLogin}
            disabled={isLoading}
            icon={<LogIn width={20} height={20} color={colors.textPrimary} />}
            style={styles.button}
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </GlassButton>
        </GlassCard>

        {/* Footer */}
        <Text style={styles.footer}>Solo para uso personal</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl * 1.5,
  },
  title: {
    ...typography.h1,
    fontSize: 32,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  card: {
    width: '100%',
    maxWidth: 360,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    marginBottom: spacing.lg,
  },
  button: {
    width: '100%',
  },
  footer: {
    ...typography.caption,
    color: colors.textDisabled,
    marginTop: spacing.xxl * 1.5,
  },
});
```

- [ ] **Paso 2: Commit login screen**

```bash
git add app/(auth)/login.tsx
git commit -m "feat: add login screen with glass morphism"
```

---

### Task 11: Root Layout con Auth Protection

**Files:**
- Create: `app/_layout.tsx`

- [ ] **Paso 1: Crear root layout con auth check**

```tsx
import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/lib/theme';
import { AUTH_STORAGE_KEY } from '@/lib/constants';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const sessionData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        const isValid = new Date(session.expiresAt) > new Date();
        setIsAuthenticated(isValid);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.gradientStart} />
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

- [ ] **Paso 2: Commit root layout**

```bash
git add app/_layout.tsx
git commit -m "feat: add root layout with auth protection"
```

---

### Task 12: Daily Screen Structure

**Files:**
- Create: `app/(tabs)/index.tsx`

- [ ] **Paso 1: Crear daily screen con header**

```tsx
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flash } from 'iconoir-react-native';
import { colors, spacing, typography, borderRadius } from '@/lib/theme';
import { GlassCard } from '@/components/GlassCard';
import { DailyEntryForm } from '@/components/DailyEntryForm';

export default function DailyScreen() {
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <Flash width={24} height={24} color={colors.textPrimary} strokeWidth={2.5} />
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={styles.title}>Daily Update</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
        </View>

        {/* Form Card */}
        <GlassCard style={styles.formCard}>
          <DailyEntryForm />
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  date: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  formCard: {
    padding: spacing.lg,
  },
});
```

- [ ] **Paso 2: Commit daily screen structure**

```bash
git add app/(tabs)/index.tsx
git commit -m "feat: add daily screen structure with header"
```

---

### Task 13: DailyEntryForm Component

**Files:**
- Create: `components/DailyEntryForm.tsx`

- [ ] **Paso 1: Crear form con todos los campos**

```tsx
import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { GlassButton } from './GlassButton';
import { GlassInput } from './GlassInput';
import { CustomSlider } from './CustomSlider';
import { CustomCheckbox } from './CustomCheckbox';
import { Toast } from './Toast';
import { colors, spacing, typography } from '@/lib/theme';
import { createDailyEntry } from '@/lib/api';

export function DailyEntryForm() {
  const [energyLevel, setEnergyLevel] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [exercised, setExercised] = useState(false);
  const [meditated, setMeditated] = useState(false);
  const [socializedFriends, setSocializedFriends] = useState(false);
  const [socializedFamily, setSocializedFamily] = useState(false);
  const [accomplishment, setAccomplishment] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await createDailyEntry({
        energyLevel,
        stressLevel,
        exercised,
        meditated,
        socializedFriends,
        socializedFamily,
        accomplishment: accomplishment.trim() || null,
        gratitude: gratitude.trim() || null,
      });

      setShowSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setEnergyLevel(5);
        setStressLevel(5);
        setExercised(false);
        setMeditated(false);
        setSocializedFriends(false);
        setSocializedFamily(false);
        setAccomplishment('');
        setGratitude('');
      }, 1000);
    } catch (error) {
      setErrorMessage('Error al guardar. Intenta de nuevo.');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Toast
        message="¡Entrada guardada!"
        type="success"
        visible={showSuccess}
        onHide={() => setShowSuccess(false)}
      />
      <Toast
        message={errorMessage}
        type="error"
        visible={showError}
        onHide={() => setShowError(false)}
      />

      {/* Energy Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nivel de Energía</Text>
        <CustomSlider
          value={energyLevel}
          onValueChange={setEnergyLevel}
          minimumValue={1}
          maximumValue={10}
          step={1}
        />
        <Text style={styles.sliderValue}>{energyLevel}/10</Text>
      </View>

      {/* Stress Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nivel de Estrés</Text>
        <CustomSlider
          value={stressLevel}
          onValueChange={setStressLevel}
          minimumValue={1}
          maximumValue={10}
          step={1}
        />
        <Text style={styles.sliderValue}>{stressLevel}/10</Text>
      </View>

      {/* Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actividades</Text>
        <CustomCheckbox
          checked={exercised}
          onChange={setExercised}
          label="Hice ejercicio"
        />
        <CustomCheckbox
          checked={meditated}
          onChange={setMeditated}
          label="Medité"
        />
        <CustomCheckbox
          checked={socializedFriends}
          onChange={setSocializedFriends}
          label="Socialicé con amigos"
        />
        <CustomCheckbox
          checked={socializedFamily}
          onChange={setSocializedFamily}
          label="Socialicé con familia"
        />
      </View>

      {/* Accomplishment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logro del día</Text>
        <GlassInput
          value={accomplishment}
          onChangeText={setAccomplishment}
          placeholder="¿Qué lograste hoy?"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Gratitude */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gratitud</Text>
        <GlassInput
          value={gratitude}
          onChangeText={setGratitude}
          placeholder="¿Por qué estás agradecido?"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Submit Button */}
      <GlassButton
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={styles.submitButton}
      >
        {isSubmitting ? 'Guardando...' : 'Guardar Entrada'}
      </GlassButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  sliderValue: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});
```

- [ ] **Paso 2: Commit daily entry form**

```bash
git add components/DailyEntryForm.tsx
git commit -m "feat: add daily entry form with all fields"
```

---

### Task 14: History Screen Structure

**Files:**
- Create: `app/(tabs)/history.tsx`

- [ ] **Paso 1: Crear history screen con stats**

```tsx
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { BarChart } from 'iconoir-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius } from '@/lib/theme';
import { GlassCard } from '@/components/GlassCard';
import { StatCard } from '@/components/StatCard';
import { EnergyStressChart } from '@/components/EnergyStressChart';
import { getRecentEntries, getStats } from '@/lib/api';
import type { DailyEntry, Stats } from '@/lib/types';

export default function HistoryScreen() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [entriesData, statsData] = await Promise.all([
        getRecentEntries(30),
        getStats(30),
      ]);
      setEntries(entriesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <BarChart width={24} height={24} color={colors.textPrimary} strokeWidth={2.5} />
          </LinearGradient>
          <View style={styles.headerText}>
            <Text style={styles.title}>Historial</Text>
            <Text style={styles.subtitle}>Últimos 30 días</Text>
          </View>
        </View>

        {/* Stats Cards */}
        {stats && (
          <View style={styles.statsGrid}>
            <StatCard
              label="Energía Promedio"
              value={stats.avgEnergy.toFixed(1)}
              trend={stats.energyTrend}
            />
            <StatCard
              label="Estrés Promedio"
              value={stats.avgStress.toFixed(1)}
              trend={stats.stressTrend}
            />
            <StatCard
              label="Días con Ejercicio"
              value={`${stats.exerciseDays}/${stats.totalDays}`}
            />
            <StatCard
              label="Días Meditación"
              value={`${stats.meditationDays}/${stats.totalDays}`}
            />
          </View>
        )}

        {/* Chart */}
        {entries.length > 0 && (
          <GlassCard style={styles.chartCard}>
            <Text style={styles.chartTitle}>Energía vs Estrés</Text>
            <EnergyStressChart entries={entries} />
          </GlassCard>
        )}

        {/* Empty State */}
        {entries.length === 0 && (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No hay entradas aún. Comienza a registrar tu día.
            </Text>
          </GlassCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  chartCard: {
    padding: spacing.lg,
  },
  chartTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
```

- [ ] **Paso 2: Commit history screen**

```bash
git add app/(tabs)/history.tsx
git commit -m "feat: add history screen with stats display"
```

---

### Task 15: EnergyStressChart Component

**Files:**
- Create: `components/EnergyStressChart.tsx`

- [ ] **Paso 1: Crear chart component con react-native-chart-kit**

```tsx
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '@/lib/theme';
import type { DailyEntry } from '@/lib/types';

interface EnergyStressChartProps {
  entries: DailyEntry[];
}

export function EnergyStressChart({ entries }: EnergyStressChartProps) {
  const screenWidth = Dimensions.get('window').width - 64;

  // Prepare data (last 7 days)
  const recentEntries = entries.slice(0, 7).reverse();
  const labels = recentEntries.map(entry => {
    const date = new Date(entry.date);
    return date.toLocaleDateString('es-ES', { weekday: 'short' });
  });
  const energyData = recentEntries.map(entry => entry.energyLevel);
  const stressData = recentEntries.map(entry => entry.stressLevel);

  const chartData = {
    labels,
    datasets: [
      {
        data: energyData,
        color: () => colors.gradientStart,
        strokeWidth: 3,
      },
      {
        data: stressData,
        color: () => colors.accent,
        strokeWidth: 3,
      },
    ],
    legend: ['Energía', 'Estrés'],
  };

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(229, 231, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(255,255,255,0.05)',
    },
  };

  if (recentEntries.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines
        withOuterLines
        withVerticalLabels
        withHorizontalLabels
        fromZero
        segments={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
```

- [ ] **Paso 2: Commit chart component**

```bash
git add components/EnergyStressChart.tsx
git commit -m "feat: add energy vs stress line chart"
```

---

### Task 16: Custom Tab Bar Component

**Files:**
- Create: `components/CustomTabBar.tsx`
- Modify: `app/(tabs)/_layout.tsx`

- [ ] **Paso 1: Crear custom tab bar con glass effect**

```tsx
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, BarChart } from 'iconoir-react-native';
import { colors, spacing, typography, borderRadius } from '@/lib/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <BlurView intensity={80} tint="dark" style={styles.blur}>
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const Icon = route.name === 'index' ? Home : BarChart;
            const label = route.name === 'index' ? 'Hoy' : 'Historial';

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tab}
              >
                {isFocused && (
                  <LinearGradient
                    colors={[colors.gradientStart, colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <Icon
                  width={24}
                  height={24}
                  color={isFocused ? colors.textPrimary : colors.textMuted}
                  strokeWidth={2}
                />
                <Text
                  style={[
                    styles.label,
                    { color: isFocused ? colors.textPrimary : colors.textMuted },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  blur: {
    overflow: 'hidden',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    paddingHorizontal: spacing.sm,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.xs,
    overflow: 'hidden',
  },
  label: {
    ...typography.caption,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
});
```

- [ ] **Paso 2: Crear tabs layout que usa custom tab bar**

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { CustomTabBar } from '@/components/CustomTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="history" />
    </Tabs>
  );
}
```

- [ ] **Paso 3: Commit custom tab bar**

```bash
git add components/CustomTabBar.tsx app/(tabs)/_layout.tsx
git commit -m "feat: add custom glass tab bar with gradients"
```

---

### Task 17: Notifications Setup

**Files:**
- Create: `lib/notifications.ts`
- Modify: `app/_layout.tsx`

- [ ] **Paso 1: Crear notifications helper functions**

```tsx
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForNotifications(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-reminder', {
        name: 'Daily Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#f97316',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions denied');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error registering for notifications:', error);
    return false;
  }
}

export async function scheduleDailyReminder() {
  try {
    // Cancel existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule daily notification at 9:00 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Life Update 🌟',
        body: '¿Cómo estuvo tu día? Es hora de registrar tu progreso.',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: {
        hour: 21,
        minute: 0,
        repeats: true,
      },
    });

    console.log('Daily reminder scheduled successfully');
    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
}

export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
}
```

- [ ] **Paso 2: Integrar notifications en root layout**

```tsx
// Modify app/_layout.tsx - add at top of file after imports
import { registerForNotifications, scheduleDailyReminder } from '@/lib/notifications';

// Add inside RootLayout function, after checkAuth definition:
useEffect(() => {
  if (isAuthenticated) {
    setupNotifications();
  }
}, [isAuthenticated]);

const setupNotifications = async () => {
  const hasPermission = await registerForNotifications();
  if (hasPermission) {
    await scheduleDailyReminder();
  }
};
```

- [ ] **Paso 3: Commit notifications setup**

```bash
git add lib/notifications.ts app/_layout.tsx
git commit -m "feat: add daily notifications at 9:00 PM"
```

---

### Task 18: Testing and Polish

**Files:**
- Test all screens and functionality

- [ ] **Paso 1: Run development build on device**

```bash
npx expo run:ios
```

Expected: App installs on iPhone, starts on login screen

- [ ] **Paso 2: Test login flow**

Manual test:
1. Enter password "B dano"
2. Tap "Ingresar"
3. Should navigate to Daily screen

- [ ] **Paso 3: Test daily entry form**

Manual test:
1. Adjust energy slider (1-10)
2. Adjust stress slider (1-10)
3. Toggle all checkboxes
4. Fill accomplishment text
5. Fill gratitude text
6. Tap "Guardar Entrada"
7. Should show success toast
8. Form should reset

- [ ] **Paso 4: Test history screen**

Manual test:
1. Navigate to "Historial" tab
2. Should show stats cards
3. Should show chart (if entries exist)
4. Should show empty state (if no entries)

- [ ] **Paso 5: Test notifications**

Manual test:
1. Check iOS Settings → Notifications → Life Update
2. Should show "Allowed"
3. Wait until 9:00 PM (or change time in code for testing)
4. Should receive notification
5. Tap notification → should open app

- [ ] **Paso 6: Test tab navigation**

Manual test:
1. Navigate between "Hoy" and "Historial"
2. Glass tab bar should blur background
3. Active tab should have orange gradient
4. Icons and labels should change color

- [ ] **Paso 7: Final commit**

```bash
git add .
git commit -m "chore: final testing and polish"
```

---