# Copilot Instructions for SteakGrillingGuide

## Project Overview
- **React Native app** for guiding steak grilling, bootstrapped with `@react-native-community/cli`.
- Two main screens: `Home` (active grilling/timer workflow) and `Saved Steaks` (manage reusable steak profiles).
- Core logic is in `components/`, `views/`, and `stores/` (Zustand state management).
- Data models and helpers in `data/`.
- Cross-platform: Android (`android/`), iOS (`ios/`).

## Key Architecture & Data Flow
- **State**: Managed via custom Zustand stores in `stores/` (e.g., `SteakStore.tsx`, `TimerStore.tsx`).
- **UI**: Modular React Native components (see `components/`).
- **Persistence**: Uses `AsyncStorage` for saving user preferences and steak data.
- **Notifications**: Schedules local notifications for grilling events (see `views/Home.tsx`).
- **Modals**: All add/edit flows use modal components (e.g., `SteakModal`, `EditSavedSteakModal`).
- **Styling**: Centralized in `styles/globalStyles.tsx` and local `StyleSheet.create` blocks.

## Developer Workflows
- **Start Metro Bundler**: `npm start` or `yarn start` (run in its own terminal)
- **Run App (Android)**: `npm run android` or `yarn android`
- **Run App (iOS)**: `npm run ios` or `yarn ios`
- **Reload App**: Use simulator shortcuts (`Cmd+R` for iOS, double-`R` for Android)
- **Testing**: Tests in `__tests__/` (Jest, see `jest.config.js`). Run with `npm test` or `yarn test`.
- **Native code**: Android in `android/`, iOS in `ios/`. Most logic is JS/TS, but native config may be needed for notifications/assets.

## Project-Specific Patterns & Conventions
- **Steak objects**: Always have `personName`, `centerCook`, `thickness`, and timing fields. Saved steaks are linked by ID.
- **Modals**: All add/edit actions are modal-driven. Use the relevant modal component for any new workflow.
- **State updates**: Use store methods (e.g., `addSteak`, `editSteak`, `updateSteaksStatus`)—do not mutate state directly.
- **AsyncStorage keys**: Use descriptive, unique keys (e.g., `hideInfoModalOnStart`, `steakTimerData`).
- **Notifications**: Always schedule grouped notifications for "place" and "flip" events (see `groupSteaksByTime` in `views/Home.tsx`).
- **UI actions**: Use `globalStyles` for button/label consistency. Disable actions when timers are running.
- **Error handling**: All user-facing errors use `Alert.alert`.

## Integration Points
- **AsyncStorage**: For persistence of user settings and steak data.
- **Notifee**: For local notifications (see `App.tsx`, `views/Home.tsx`).
- **FontAwesome**: For icons in UI buttons.
- **BouncyCheckbox**: For "Do not show again" in info modals.

## Examples
- To add a new steak: Use `SteakModal` and update via `addSteak` in `SteakStore`.
- To persist a new setting: Use `AsyncStorage.setItem` with a unique key.
- To add a new notification: Use `scheduleNotification` in `views/Home.tsx`.

## References
- Main entry: `App.tsx`
- Navigation: `App.tsx` (Tab.Navigator)
- State: `stores/`
- UI: `components/`, `views/`
- Styles: `styles/globalStyles.tsx`
- Data: `data/SteakData.tsx`, `data/SteakSettings.json`

---
If any section is unclear or missing, please request clarification or provide feedback for further iteration.
