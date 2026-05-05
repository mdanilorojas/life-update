# Life Update - React Native Redesign with Glass Morphism

**Date:** 2026-05-05  
**Project:** life-update (React Native)  
**Purpose:** Complete redesign with glass morphism aesthetic, React Native implementation with Expo, iOS-native notifications

---

## 1. Overview

Convert Life Update from Next.js web app to native React Native mobile app with:
- Glass morphism design system (orange/amber gradients)
- iOS-native local notifications (daily reminder)
- Same database backend (Supabase PostgreSQL)
- Bottom tab navigation (Daily, History)
- Professional Iconoir icons throughout

### Tech Stack

**Framework & Platform:**
- React Native with Expo (managed workflow)
- Expo SDK 51+ for latest features
- TypeScript for type safety
- iOS as primary target (Android-ready but not tested initially)

**UI & Design:**
- React Native BlurView for glass morphism effects
- Linear gradients (expo-linear-gradient)
- Iconoir React Native icons
- Custom components following iOS Human Interface Guidelines
- Animated interactions (Reanimated 3)

**Data & Backend:**
- Supabase PostgreSQL (existing database)
- @supabase/supabase-js for queries
- AsyncStorage for local session persistence
- Prisma schema remains unchanged on backend

**Notifications:**
- expo-notifications for local scheduled notifications
- Daily reminder: 9:00 PM every day
- Notification permissions handled in-app

**Charts & Visualization:**
- react-native-chart-kit OR Victory Native for line charts
- Custom SVG components for simple visualizations

---

## 2. Project Structure

```
life-update-mobile/
├── app/                          # Expo Router screens
│   ├── (auth)/
│   │   └── login.tsx            # Login screen
│   ├── (tabs)/                   # Tab navigation
│   │   ├── _layout.tsx          # Tab navigator config
│   │   ├── daily.tsx            # Daily check-in screen
│   │   └── history.tsx          # History & stats screen
│   └── _layout.tsx              # Root layout
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── GlassCard.tsx        # Glass morphism card
│   │   ├── GlassButton.tsx      # Button with gradient
│   │   ├── GlassInput.tsx       # Input with glass bg
│   │   ├── CustomSlider.tsx     # Slider with orange glow
│   │   ├── CustomCheckbox.tsx   # Checkbox with gradient
│   │   └── StatCard.tsx         # Stats display card
│   ├── forms/
│   │   └── DailyEntryForm.tsx   # Main daily form
│   ├── charts/
│   │   └── EnergyStressChart.tsx # Line chart component
│   └── navigation/
│       └── TabBar.tsx            # Custom bottom tab bar
├── lib/
│   ├── supabase.ts              # Supabase client
│   ├── auth.ts                  # Auth helpers
│   ├── notifications.ts         # Notification scheduling
│   ├── constants.ts             # App constants
│   └── theme.ts                 # Design tokens
├── types/
│   └── index.ts                 # TypeScript types
├── app.json                      # Expo config
├── package.json
└── tsconfig.json
```

---

## 3. Design System

### Color Palette

```typescript
// lib/theme.ts
export const colors = {
  // Backgrounds
  bgPrimary: '#0a0a0a',
  bgSecondary: '#1a1a1a',
  bgElevated: '#171717',
  
  // Glass Effect
  glassBg: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassIntense: 'rgba(255, 255, 255, 0.08)',
  
  // Orange/Amber Gradients
  gradientStart: '#f97316',
  gradientEnd: '#fb923c',
  gradientAccentStart: '#ea580c',
  gradientAccentEnd: '#f97316',
  
  // Text
  textPrimary: '#ffffff',
  textSecondary: '#e5e7eb',
  textMuted: '#9ca3af',
  textDisabled: '#6b7280',
  
  // Semantic
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

### Glass Morphism Components

**GlassCard Component:**
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

**GlassButton Component:**
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
  
  // Secondary variant uses glass effect
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

## 4. Screen Specifications

### 4.1 Login Screen (`app/(auth)/login.tsx`)

**Layout:**
- Centered vertically and horizontally
- Logo at top (80x80 rounded square with gradient)
- Title "Life Update" + subtitle
- Glass card with password input
- Submit button with gradient
- Error message (glass card with red tint) appears above form when login fails

**Components:**
- Logo: View with LinearGradient + Iconoir Flash icon
- GlassCard for form container
- GlassInput for password field
- GlassButton (primary) for submit
- Error: Animated GlassCard with red border

**Behavior:**
- On mount: Check if already authenticated → navigate to (tabs)
- On submit: Validate password → store session in AsyncStorage → navigate to (tabs)
- On error: Show animated error card for 3 seconds
- Auto-focus password input on mount

**API:**
- POST to Supabase edge function `/auth/login` with password
- Store session token in AsyncStorage key: `life-update-session`

---

### 4.2 Daily Check-In Screen (`app/(tabs)/daily.tsx`)

**Layout:**
- ScrollView with SafeAreaView
- Header (sticky): App title + Logout button
- Title section: "Daily Check-In" + formatted date
- Form sections (each in separate GlassCard):
  1. Energy Level slider
  2. Stress Level slider
  3. Checkboxes (Physical Pain, Trained, Clean)
  4. Deep Work Hours input
  5. Quick Note textarea
- Submit button (fixed at bottom, above tab bar)
- Success toast notification on submit

**Energy & Stress Sliders:**
```tsx
<GlassCard>
  <View style={styles.sliderHeader}>
    <View style={styles.labelRow}>
      <Flash width={20} height={20} color={colors.gradientEnd} />
      <Text style={styles.label}>Energy Level</Text>
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
    <Text style={styles.labelText}>Dead (1)</Text>
    <Text style={styles.labelText}>Peak (10)</Text>
  </View>
</GlassCard>
```

**Checkboxes:**
```tsx
<GlassCard>
  <CustomCheckbox
    checked={physicalPain}
    onChange={setPhysicalPain}
    label="Physical Pain Today"
  />
  <CustomCheckbox
    checked={trainedToday}
    onChange={setTrainedToday}
    label="Trained Today"
  />
  <CustomCheckbox
    checked={cleanToday}
    onChange={setCleanToday}
    label="Clean Today"
  />
</GlassCard>
```

**Submit Flow:**
1. Validate form (all required fields filled)
2. Show loading state on button
3. POST to Supabase `/daily-entry` with CURRENT_USER_ID
4. On success: Show toast + reset form + scroll to top
5. On error: Show error toast

**Animations:**
- Cards fade in on mount (staggered, 50ms delay each)
- Submit button scales down on press
- Success toast slides in from top

---

### 4.3 History Screen (`app/(tabs)/history.tsx`)

**Layout:**
- ScrollView with SafeAreaView
- Header (same as Daily)
- Title: "History" + subtitle
- Stats Cards Grid (2x2):
  - Total Days Logged
  - Avg Energy Level
  - Avg Stress Level
  - Current Streak
- Chart Card: Line chart (Energy + Stress, last 30 days)
- Recent Entries section: Collapsible entry cards

**Stats Cards:**
```tsx
<View style={styles.statsGrid}>
  <StatCard
    icon={<Calendar />}
    label="Days"
    value="47"
    subtitle="Total logged"
  />
  <StatCard
    icon={<Flash />}
    label="Energy"
    value="7.2"
    subtitle="Avg level"
    gradient
  />
  <StatCard
    icon={<Plus />}
    label="Stress"
    value="4.8"
    subtitle="Avg level"
  />
  <StatCard
    icon={<Star />}
    label="Streak"
    value="12"
    subtitle="Days in a row"
    gradient
  />
</View>
```

**Chart Card:**
```tsx
<GlassCard style={styles.chartCard}>
  <View style={styles.chartHeader}>
    <Text style={styles.chartTitle}>Last 30 Days</Text>
    <View style={styles.legend}>
      <LegendItem color={colors.gradientStart} label="Energy" />
      <LegendItem color={colors.error} label="Stress" />
    </View>
  </View>
  
  <EnergyStressChart
    data={historyData}
    width={Dimensions.get('window').width - 64}
    height={200}
  />
</GlassCard>
```

**Entry Cards (Collapsible):**
```tsx
<TouchableOpacity onPress={() => toggleExpand(entry.id)}>
  <GlassCard>
    <View style={styles.entryHeader}>
      <View>
        <Text style={styles.entryDate}>Tuesday, May 5</Text>
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
          {/* Full entry details */}
        </View>
      </Animated.View>
    )}
  </GlassCard>
</TouchableOpacity>
```

**Data Fetching:**
- On mount: Fetch last 30 entries from Supabase
- Calculate stats client-side (total, averages, streak)
- Chart data: Map entries to { date, energy, stress } array
- Recent entries: Show latest 10, load more on scroll

---

### 4.4 Bottom Tab Navigation

**Custom Tab Bar:**
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
- Daily: EditPencil icon
- History: StatsUpSquare icon

**Styling:**
- Fixed at bottom
- Glass effect background with blur
- Active tab: gradient background + orange label
- Inactive tab: glass background + gray label + gray icon
- Icon size: 24x24
- Safe area insets for iPhone notch

---

## 5. Authentication Flow

**Session Management:**
```typescript
// lib/auth.ts
export async function login(password: string): Promise<boolean> {
  const APP_PASSWORD = 'B dano'; // Or from env
  
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

**Protected Routes:**
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

## 6. Notifications

**Setup:**
```typescript
// lib/notifications.ts
import * as Notifications from 'expo-notifications';

export async function registerForNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status !== 'granted') {
    Alert.alert(
      'Notifications Disabled',
      'Please enable notifications in Settings to receive daily reminders.'
    );
    return false;
  }
  
  return true;
}

export async function scheduleDailyReminder() {
  // Cancel existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  // Schedule daily notification at 9:00 PM
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily Check-In 📝',
      body: 'Time to log your day! How was your energy and stress?',
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

**Notification Handler:**
```tsx
// app/_layout.tsx
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// In component
useEffect(() => {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    // User tapped notification → navigate to Daily screen
    navigation.navigate('(tabs)', { screen: 'daily' });
  });
  
  return () => subscription.remove();
}, []);
```

**Setup Flow:**
1. After first successful login → request notification permissions
2. If granted → schedule daily reminder at 9 PM
3. User can disable in app settings (add toggle in future)

---

## 7. Data Layer

**Supabase Client:**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**API Functions:**
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

**Database Schema:** (No changes - same Prisma schema from Next.js version)

---

## 8. Dependencies

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

## 9. Development Workflow

**Initial Setup:**
```bash
# Create new Expo project
npx create-expo-app life-update-mobile --template tabs

# Install dependencies
npm install [all packages from section 8]

# Configure environment
cp .env.example .env.local
# Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
```

**Development:**
```bash
# Start Expo dev server
npx expo start

# Run on iOS simulator (Mac required)
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Scan QR code with Expo Go app on physical device
```

**Testing on iPhone:**
```bash
# Install Expo Go from App Store
# Scan QR code from terminal
# App runs instantly on device
```

**Building for Production:**
```bash
# Build iOS app (requires Apple Developer account)
eas build --platform ios

# Install on device via TestFlight or direct install
eas submit --platform ios
```

---

## 10. Implementation Priority

**Phase 1: Core Setup (30 min)**
- Create Expo project with TypeScript
- Install all dependencies
- Setup Supabase client
- Create design system (theme.ts)
- Configure Expo Router structure

**Phase 2: UI Components (45 min)**
- GlassCard component
- GlassButton component
- GlassInput component
- CustomSlider component
- CustomCheckbox component
- StatCard component

**Phase 3: Authentication (30 min)**
- Login screen UI
- Auth helpers (login, logout, isAuthenticated)
- AsyncStorage session management
- Protected routes setup

**Phase 4: Daily Screen (60 min)**
- Daily screen layout
- DailyEntryForm component
- All form inputs with glass styling
- Submit logic + API integration
- Success/error toast notifications

**Phase 5: History Screen (60 min)**
- History screen layout
- Stats cards with calculations
- Line chart with react-native-chart-kit
- Recent entries list with expand/collapse
- Data fetching from Supabase

**Phase 6: Navigation (20 min)**
- Custom bottom tab bar with glass effect
- Tab icons (Iconoir)
- Active/inactive states with gradients

**Phase 7: Notifications (20 min)**
- Notification permissions request
- Schedule daily reminder at 9 PM
- Notification tap handler
- Test on device

**Phase 8: Polish & Testing (30 min)**
- Add animations (fade in, scale, etc.)
- Test all flows on device
- Fix any styling issues
- Verify notifications work

**Total Estimated Time:** ~4.5 hours

---

## 11. Success Criteria

- ✅ App installs and runs on iPhone via Expo Go
- ✅ Login with password works
- ✅ Daily check-in form saves to Supabase
- ✅ History shows stats and chart correctly
- ✅ Bottom navigation works smoothly
- ✅ Glass morphism effect looks correct on device
- ✅ Daily notification fires at 9:00 PM
- ✅ Tapping notification opens app to Daily screen
- ✅ All Iconoir icons render properly
- ✅ Gradients look smooth and vibrant

---

## 12. Future Enhancements (Phase 2)

- Coaching system with timers and contextual prompts
- Activity tracking in real-time
- Multiple notifications throughout day
- Micropasos calculation system
- Progress tracking with mathematical models
- Settings screen
- Dark/light theme toggle (optional)
- Haptic feedback on interactions
- Pull to refresh on History

---

## 13. Notes

**Design Decisions:**
- React Native over PWA for reliable notifications
- Expo managed workflow for faster development
- Same Supabase backend (no migration needed)
- Single user ID hardcoded (same as web version)
- Iconoir for consistency and quality
- Orange/amber for energy and motivation psychology

**Known Limitations:**
- iOS-first (Android not tested but should work)
- Requires Expo Go for development
- No offline support (requires internet for API calls)
- Single user only (same as web version)

**Migration from Next.js:**
- Database schema unchanged
- Same Supabase project
- Same user ID and auth approach
- API endpoints not needed (direct Supabase queries)
- Web version can remain deployed for desktop use
