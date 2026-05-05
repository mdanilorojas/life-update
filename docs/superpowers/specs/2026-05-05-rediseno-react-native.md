# Life Update - Rediseño React Native con Glass Morphism

**Fecha:** 2026-05-05  
**Proyecto:** life-update (React Native)  
**Propósito:** Rediseño completo con estética glass morphism, implementación React Native con Expo, notificaciones nativas iOS

---

## 1. Resumen General

Convertir Life Update de app web Next.js a app móvil nativa React Native con:
- Sistema de diseño glass morphism (gradientes naranja/ámbar)
- Notificaciones locales nativas iOS (recordatorio diario)
- Mismo backend de base de datos (Supabase PostgreSQL)
- Navegación con tabs inferior (Daily, History)
- Íconos profesionales Iconoir en toda la app

### Stack Tecnológico

**Framework y Plataforma:**
- React Native con Expo (managed workflow)
- Expo SDK 51+ para últimas funcionalidades
- TypeScript para type safety
- iOS como objetivo principal (Android-ready pero sin probar inicialmente)

**UI y Diseño:**
- React Native BlurView para efectos glass morphism
- Gradientes lineales (expo-linear-gradient)
- Íconos Iconoir React Native
- Componentes custom siguiendo iOS Human Interface Guidelines
- Interacciones animadas (Reanimated 3)

**Datos y Backend:**
- Supabase PostgreSQL (base de datos existente)
- @supabase/supabase-js para queries
- AsyncStorage para persistencia de sesión local
- Schema Prisma sin cambios en el backend

**Notificaciones:**
- expo-notifications para notificaciones locales programadas
- Recordatorio diario: 9:00 PM todos los días
- Permisos de notificación manejados in-app

**Gráficas y Visualización:**
- react-native-chart-kit O Victory Native para line charts
- Componentes SVG custom para visualizaciones simples

---

## 2. Estructura del Proyecto

```
life-update-mobile/
├── app/                          # Pantallas Expo Router
│   ├── (auth)/
│   │   └── login.tsx            # Pantalla de login
│   ├── (tabs)/                   # Navegación por tabs
│   │   ├── _layout.tsx          # Config del tab navigator
│   │   ├── daily.tsx            # Pantalla check-in diario
│   │   └── history.tsx          # Pantalla historial y stats
│   └── _layout.tsx              # Layout raíz
├── components/
│   ├── ui/                       # Componentes UI reutilizables
│   │   ├── GlassCard.tsx        # Tarjeta glass morphism
│   │   ├── GlassButton.tsx      # Botón con gradiente
│   │   ├── GlassInput.tsx       # Input con fondo glass
│   │   ├── CustomSlider.tsx     # Slider con brillo naranja
│   │   ├── CustomCheckbox.tsx   # Checkbox con gradiente
│   │   └── StatCard.tsx         # Tarjeta de estadísticas
│   ├── forms/
│   │   └── DailyEntryForm.tsx   # Formulario principal diario
│   ├── charts/
│   │   └── EnergyStressChart.tsx # Componente de gráfica líneas
│   └── navigation/
│       └── TabBar.tsx            # Barra de tabs personalizada
├── lib/
│   ├── supabase.ts              # Cliente Supabase
│   ├── auth.ts                  # Helpers de autenticación
│   ├── notifications.ts         # Programación notificaciones
│   ├── constants.ts             # Constantes de la app
│   └── theme.ts                 # Tokens de diseño
├── types/
│   └── index.ts                 # Tipos TypeScript
├── app.json                      # Config Expo
├── package.json
└── tsconfig.json
```

---

## 3. Sistema de Diseño

### Paleta de Colores

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

### Componentes Glass Morphism

**Componente GlassCard:**
```tsx
import { BlurView } from 'expo-blur';

interface GlassCardProps {
  children: React.ReactNode;
  intensity?: number; // 0-100, default 20
  style?: ViewStyle;
}

export function GlassCard({ children, intensity = 20, style }: GlassCardProps) {
  return (
    <BlurView
      intensity={intensity}
      style={[styles.card, style]}
      tint="dark"
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

**Componente GlassButton:**
```tsx
interface GlassButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function GlassButton({ onPress, children, variant = 'primary', disabled, icon }: GlassButtonProps) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8}>
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
  
  // Variante secundaria usa efecto glass
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8}>
      <BlurView intensity={20} tint="dark" style={styles.secondaryButton}>
        <View style={styles.secondaryInner}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={styles.secondaryText}>{children}</Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}
```

---

## 4. Especificaciones de Pantallas

### 4.1 Pantalla Login (`app/(auth)/login.tsx`)

**Layout:**
- Centrado vertical y horizontalmente
- Logo arriba (80x80 cuadrado redondeado con gradiente)
- Título "Life Update" + subtítulo
- Tarjeta glass con input de contraseña
- Botón submit con gradiente
- Mensaje de error (tarjeta glass con tinte rojo) aparece arriba del form cuando falla login

**Componentes:**
- Logo: View con LinearGradient + ícono Flash de Iconoir
- GlassCard para contenedor del form
- GlassInput para campo de contraseña
- GlassButton (primary) para submit
- Error: GlassCard animada con borde rojo

**Comportamiento:**
- Al montar: Verificar si ya está autenticado → navegar a (tabs)
- Al enviar: Validar contraseña → guardar sesión en AsyncStorage → navegar a (tabs)
- En error: Mostrar tarjeta error animada por 3 segundos
- Auto-focus en input de contraseña al montar

**API:**
- Validar contraseña contra constante `APP_PASSWORD = "B dano"`
- Guardar token de sesión en AsyncStorage con key: `life-update-session`

---

### 4.2 Pantalla Check-In Diario (`app/(tabs)/daily.tsx`)

**Layout:**
- ScrollView con SafeAreaView
- Header (sticky): Título app + botón Logout
- Sección título: "Daily Check-In" + fecha formateada
- Secciones del formulario (cada una en GlassCard separada):
  1. Slider de nivel de energía
  2. Slider de nivel de estrés
  3. Checkboxes (Dolor físico, Entrenamiento, Limpieza)
  4. Input de horas de trabajo profundo
  5. Textarea de nota rápida
- Botón submit (fijo abajo, arriba de tab bar)
- Notificación toast de éxito al enviar

**Sliders de Energía y Estrés:**
```tsx
<GlassCard>
  <View style={styles.sliderHeader}>
    <View style={styles.labelRow}>
      <Flash width={20} height={20} color={colors.gradientEnd} />
      <Text style={styles.label}>Nivel de Energía</Text>
    </View>
    <Text style={styles.valueDisplay}>7</Text>
  </View>
  
  <CustomSlider
    value={energyLevel}
    onValueChange={setEnergyLevel}
    minimumValue={1}
    maximumValue={10}
    step={1}
    minimumTrackTintColor={colors.gradientStart}
    maximumTrackTintColor={colors.glassBorder}
    thumbTintColor={colors.gradientEnd}
  />
  
  <View style={styles.sliderLabels}>
    <Text style={styles.labelText}>Muerto (1)</Text>
    <Text style={styles.labelText}>Pico (10)</Text>
  </View>
</GlassCard>
```

**Checkboxes:**
```tsx
<GlassCard>
  <CustomCheckbox
    checked={physicalPain}
    onChange={setPhysicalPain}
    label="Dolor Físico Hoy"
  />
  <CustomCheckbox
    checked={trainedToday}
    onChange={setTrainedToday}
    label="Entrenamiento Hoy"
  />
  <CustomCheckbox
    checked={cleanToday}
    onChange={setCleanToday}
    label="Limpieza Hoy"
  />
</GlassCard>
```

**Flujo de Submit:**
1. Validar formulario (todos los campos requeridos llenos)
2. Mostrar estado loading en botón
3. INSERT a Supabase tabla `daily_entries` con `user_id: CURRENT_USER_ID`
4. En éxito: Mostrar toast + resetear form + scroll arriba
5. En error: Mostrar toast de error

**Animaciones:**
- Cards aparecen con fade in al montar (escalonadas, 50ms delay cada una)
- Botón submit escala al presionar
- Toast de éxito se desliza desde arriba

---

### 4.3 Pantalla Historial (`app/(tabs)/history.tsx`)

**Layout:**
- ScrollView con SafeAreaView
- Header (igual que Daily)
- Título: "Historial" + subtítulo
- Grid de Tarjetas de Stats (2x2):
  - Total Días Registrados
  - Promedio Nivel Energía
  - Promedio Nivel Estrés
  - Racha Actual
- Tarjeta Gráfica: Line chart (Energía + Estrés, últimos 30 días)
- Sección Entradas Recientes: Tarjetas de entrada colapsables

**Tarjetas de Stats:**
```tsx
<View style={styles.statsGrid}>
  <StatCard
    icon={<Calendar />}
    label="Días"
    value="47"
    subtitle="Total registrados"
  />
  <StatCard
    icon={<Flash />}
    label="Energía"
    value="7.2"
    subtitle="Promedio"
    gradient
  />
  <StatCard
    icon={<Plus />}
    label="Estrés"
    value="4.8"
    subtitle="Promedio"
  />
  <StatCard
    icon={<Star />}
    label="Racha"
    value="12"
    subtitle="Días seguidos"
    gradient
  />
</View>
```

**Tarjeta Gráfica:**
```tsx
<GlassCard style={styles.chartCard}>
  <View style={styles.chartHeader}>
    <Text style={styles.chartTitle}>Últimos 30 Días</Text>
    <View style={styles.legend}>
      <LegendItem color={colors.gradientStart} label="Energía" />
      <LegendItem color={colors.error} label="Estrés" />
    </View>
  </View>
  
  <EnergyStressChart
    data={historyData}
    width={Dimensions.get('window').width - 64}
    height={200}
  />
</GlassCard>
```

**Tarjetas de Entrada (Colapsables):**
```tsx
<TouchableOpacity onPress={() => toggleExpand(entry.id)}>
  <GlassCard>
    <View style={styles.entryHeader}>
      <View>
        <Text style={styles.entryDate}>Martes, 5 de Mayo</Text>
        <Text style={styles.entryYear}>2026</Text>
      </View>
      <ChevronDown
        style={[
          styles.chevron,
          expanded && styles.chevronExpanded
        ]}
      />
    </View>
    
    <View style={styles.entryMetrics}>
      <MetricBadge icon={<Flash />} value={7} color="orange" />
      <MetricBadge icon={<Plus />} value={5} color="red" />
      <MetricBadge icon={<Clock />} value="4.5h" color="gray" />
    </View>
    
    {expanded && (
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <View style={styles.entryDetails}>
          {/* Detalles completos de la entrada */}
        </View>
      </Animated.View>
    )}
  </GlassCard>
</TouchableOpacity>
```

**Obtención de Datos:**
- Al montar: Fetch últimas 30 entradas de Supabase
- Calcular stats client-side (total, promedios, racha)
- Datos de gráfica: Mapear entradas a array `{ date, energy, stress }`
- Entradas recientes: Mostrar últimas 10, cargar más al hacer scroll

---

### 4.4 Navegación con Tabs Inferior

**Tab Bar Personalizada:**
```tsx
export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <BlurView intensity={30} tint="dark" style={styles.tabBar}>
      <View style={styles.tabBarInner}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tab}
            >
              {isFocused ? (
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  style={styles.tabIconActive}
                >
                  {getIcon(route.name)}
                </LinearGradient>
              ) : (
                <View style={styles.tabIconInactive}>
                  {getIcon(route.name)}
                </View>
              )}
              <Text style={[
                styles.tabLabel,
                isFocused && styles.tabLabelActive
              ]}>
                {getLabel(route.name)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
}
```

**Tabs:**
- Daily: Ícono EditPencil
- History: Ícono StatsUpSquare

**Estilos:**
- Fija en la parte inferior
- Fondo con efecto glass y blur
- Tab activa: fondo con gradiente + label naranja
- Tab inactiva: fondo glass + label gris + ícono gris
- Tamaño ícono: 24x24
- Safe area insets para notch de iPhone

---

## 5. Flujo de Autenticación

**Gestión de Sesión:**
```typescript
// lib/auth.ts
export async function login(password: string): Promise<boolean> {
  const APP_PASSWORD = 'B dano';
  
  if (password !== APP_PASSWORD) {
    return false;
  }
  
  const sessionId = generateRandomId();
  await AsyncStorage.setItem('life-update-session', sessionId);
  return true;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem('life-update-session');
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await AsyncStorage.getItem('life-update-session');
  return !!session;
}
```

**Rutas Protegidas:**
```tsx
// app/_layout.tsx
export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  async function checkAuth() {
    const authenticated = await isAuthenticated();
    setIsAuthenticated(authenticated);
  }
  
  if (isAuthenticated === null) {
    return <SplashScreen />;
  }
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="(auth)" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}
```

---

## 6. Notificaciones

**Configuración:**
```typescript
// lib/notifications.ts
import * as Notifications from 'expo-notifications';

export async function registerForNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert(
      'Notificaciones Deshabilitadas',
      'Por favor habilita las notificaciones en Ajustes para recibir recordatorios diarios.'
    );
    return false;
  }
  
  return true;
}

export async function scheduleDailyReminder() {
  // Cancelar notificaciones existentes
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  // Programar notificación diaria a las 9:00 PM
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Check-In Diario 📝',
      body: '¡Hora de registrar tu día! ¿Cómo estuvo tu energía y estrés?',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      hour: 21,
      minute: 0,
      repeats: true,
    },
  });
}
```

**Manejador de Notificaciones:**
```tsx
// app/_layout.tsx
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// En componente
useEffect(() => {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    // Usuario tocó la notificación → navegar a pantalla Daily
    navigation.navigate('(tabs)', { screen: 'daily' });
  });
  
  return () => subscription.remove();
}, []);
```

**Flujo de Configuración:**
1. Después del primer login exitoso → solicitar permisos de notificación
2. Si se otorgan → programar recordatorio diario a las 9 PM
3. Usuario puede deshabilitar en ajustes de app (agregar toggle en futuro)

---

## 7. Capa de Datos

**Cliente Supabase:**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Funciones API:**
```typescript
// lib/api.ts
export async function createDailyEntry(data: DailyEntryInput) {
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
  return entry;
}

export async function fetchHistoryEntries(limit = 30) {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('user_id', CURRENT_USER_ID)
    .order('date', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
}
```

**Schema de Base de Datos:** (Sin cambios - mismo schema Prisma de versión Next.js)

---

## 8. Dependencias

```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "react": "18.2.0",
    "react-native": "0.74.0",
    
    "expo-blur": "~13.0.0",
    "expo-linear-gradient": "~13.0.0",
    "expo-notifications": "~0.28.0",
    
    "@supabase/supabase-js": "^2.43.0",
    "@react-native-async-storage/async-storage": "1.23.0",
    
    "iconoir-react-native": "^7.6.0",
    
    "react-native-chart-kit": "^6.12.0",
    "react-native-svg": "15.2.0",
    
    "react-native-reanimated": "~3.10.0",
    "react-native-gesture-handler": "~2.16.0",
    "react-native-safe-area-context": "4.10.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.79",
    "typescript": "~5.3.0"
  }
}
```

---

## 9. Flujo de Desarrollo

**Configuración Inicial:**
```bash
# Crear nuevo proyecto Expo
npx create-expo-app life-update-mobile --template tabs

# Instalar dependencias
npm install [todos los paquetes de sección 8]

# Configurar environment
cp .env.example .env.local
# Agregar EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY
```

**Desarrollo:**
```bash
# Iniciar servidor dev de Expo
npx expo start

# Ejecutar en simulador iOS (Mac requerido)
npx expo run:ios

# Ejecutar en emulador Android
npx expo run:android

# Escanear código QR con app Expo Go en dispositivo físico
```

**Pruebas en iPhone:**
```bash
# Instalar Expo Go desde App Store
# Escanear código QR del terminal
# App corre instantáneamente en dispositivo
```

**Build para Producción:**
```bash
# Build app iOS (requiere cuenta Apple Developer)
eas build --platform ios

# Instalar en dispositivo vía TestFlight o instalación directa
eas submit --platform ios
```

---

## 10. Prioridad de Implementación

**Fase 1: Configuración Core (30 min)**
- Crear proyecto Expo con TypeScript
- Instalar todas las dependencias
- Configurar cliente Supabase
- Crear sistema de diseño (theme.ts)
- Configurar estructura Expo Router

**Fase 2: Componentes UI (45 min)**
- Componente GlassCard
- Componente GlassButton
- Componente GlassInput
- Componente CustomSlider
- Componente CustomCheckbox
- Componente StatCard

**Fase 3: Autenticación (30 min)**
- UI pantalla Login
- Helpers de auth (login, logout, isAuthenticated)
- Gestión de sesión AsyncStorage
- Configuración rutas protegidas

**Fase 4: Pantalla Daily (60 min)**
- Layout pantalla Daily
- Componente DailyEntryForm
- Todos los inputs del form con estilos glass
- Lógica submit + integración API
- Notificaciones toast éxito/error

**Fase 5: Pantalla History (60 min)**
- Layout pantalla History
- Tarjetas stats con cálculos
- Line chart con react-native-chart-kit
- Lista entradas recientes con expandir/colapsar
- Obtención datos de Supabase

**Fase 6: Navegación (20 min)**
- Tab bar personalizada inferior con efecto glass
- Íconos tabs (Iconoir)
- Estados activo/inactivo con gradientes

**Fase 7: Notificaciones (20 min)**
- Solicitud permisos notificación
- Programar recordatorio diario a 9 PM
- Manejador tap de notificación
- Probar en dispositivo

**Fase 8: Pulido y Pruebas (30 min)**
- Agregar animaciones (fade in, scale, etc.)
- Probar todos los flujos en dispositivo
- Arreglar cualquier problema de estilos
- Verificar que notificaciones funcionan

**Tiempo Total Estimado:** ~4.5 horas

---

## 11. Criterios de Éxito

- ✅ App se instala y corre en iPhone vía Expo Go
- ✅ Login con contraseña funciona
- ✅ Formulario check-in diario guarda a Supabase
- ✅ History muestra stats y gráfica correctamente
- ✅ Navegación inferior funciona suavemente
- ✅ Efecto glass morphism se ve correcto en dispositivo
- ✅ Notificación diaria se dispara a las 9:00 PM
- ✅ Tocar notificación abre app en pantalla Daily
- ✅ Todos los íconos Iconoir se renderizan correctamente
- ✅ Gradientes se ven suaves y vibrantes

---

## 12. Mejoras Futuras (Fase 2)

- Sistema de coaching con timers y prompts contextuales
- Tracking de actividades en tiempo real
- Múltiples notificaciones durante el día
- Sistema de cálculo de micropasos
- Tracking de progreso con modelos matemáticos
- Pantalla de ajustes
- Toggle tema dark/light (opcional)
- Feedback háptico en interacciones
- Pull to refresh en History

---

## 13. Notas

**Decisiones de Diseño:**
- React Native sobre PWA para notificaciones confiables
- Expo managed workflow para desarrollo más rápido
- Mismo backend Supabase (sin migración necesaria)
- ID de usuario único hardcodeado (igual que versión web)
- Iconoir para consistencia y calidad
- Naranja/ámbar para psicología de energía y motivación

**Limitaciones Conocidas:**
- iOS-first (Android no probado pero debería funcionar)
- Requiere Expo Go para desarrollo
- Sin soporte offline (requiere internet para llamadas API)
- Un solo usuario (igual que versión web)

**Migración desde Next.js:**
- Schema de base de datos sin cambios
- Mismo proyecto Supabase
- Mismo ID de usuario y enfoque de auth
- Endpoints API no necesarios (queries directas a Supabase)
- Versión web puede permanecer deployada para uso en desktop
