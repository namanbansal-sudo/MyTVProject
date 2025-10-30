# Smart TV Dashboard

A React Native TV application built with Expo Router, featuring spatial navigation for seamless D-pad control on smart TV devices.

![Smart TV Dashboard](https://github.com/douglowder/examples/assets/6577821/a881466f-a7a0-4c66-b1fc-33235c466997)

## 🚀 Features

- **Spatial Navigation**: Seamless D-pad navigation between dashboard cards and drawer menu
- **Smart TV Optimized**: Built for Android TV and Apple TV platforms
- **Interactive Dashboard**: Navigate through US Map, Weather, News, and Settings
- **Visual Focus Indicators**: Clear visual feedback for focused elements
- **Responsive Design**: Adapts to different screen sizes and platforms

## 🛠️ Technologies

- [Expo](https://expo.dev) with [Expo Router](https://docs.expo.dev/router/introduction)
- [React Native TV](https://github.com/react-native-tvos/react-native-tvos)
- [React Native TV Config Plugin](https://github.com/react-native-tvos/config-tv)
- Custom spatial navigation implementation for React Native TV

## 🚀 How to use

### Prerequisites
- Node.js 18+
- Expo CLI
- Android Studio (for Android TV development)

### Development

```sh
# Install dependencies
npm install

# Start development server for TV
EXPO_TV=1 npm run start

# For mobile development (without TV features)
npm run start
```

### Building for TV Platforms

```sh
# Prebuild for TV
EXPO_TV=1 npm run prebuild:tv

# Build for Android TV
EXPO_TV=1 npm run android

# Build for Apple TV
EXPO_TV=1 npm run ios
```

## 📱 Navigation

Use your TV remote's D-pad to navigate:

- **Left/Right**: Navigate between dashboard cards and drawer button
- **Up/Down**: Move between rows of cards
- **SELECT/ENTER**: Activate focused items
- **Back**: Close drawer and return to dashboard

## 🎯 Dashboard Features

1. **US Map**: Interactive map with city clusters
2. **Weather**: Current weather conditions
3. **News**: Latest news and updates
4. **Settings**: App preferences and configuration

## 🔧 Development Notes

- Set `EXPO_TV=1` environment variable to enable TV-specific features
- The app uses custom spatial navigation implementation optimized for React Native TV
- Components include visual focus indicators for better UX on TV devices
- Deploy on iOS and Android using: `npx eas-cli build` — [Learn more](https://expo.dev/eas)

## TV specific file extensions

This project includes an [example Metro configuration](./metro.config.js) that allows Metro to resolve application source files with TV-specific code, indicated by specific file extensions (`*.ios.tv.tsx`, `*.android.tv.tsx`, `*.tv.tsx`).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/learn): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
