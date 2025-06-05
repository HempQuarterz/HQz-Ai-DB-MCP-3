# Hemp Database Mobile App

This is the React Native mobile version of your Hemp Database web application.

## 🚀 Features

- **Browse Hemp Products**: Explore industrial hemp products by industry and application
- **Research Papers**: Access scientific research on hemp cultivation and applications
- **Plant Types**: Learn about different hemp varieties (Fiber Hemp, Oil Hemp, etc.)
- **Statistics Dashboard**: View comprehensive hemp industry data
- **Cross-Platform**: Works on both iOS and Android devices

## 📱 Setup Instructions

### Prerequisites

1. **Node.js** (version 18 or higher)
2. **React Native CLI**:
   ```bash
   npm install -g @react-native-community/cli
   ```

### For Android Development:
3. **Android Studio** with Android SDK
4. **Java Development Kit (JDK 17)**

### For iOS Development (Mac only):
3. **Xcode** (latest version)
4. **CocoaPods**:
   ```bash
   sudo gem install cocoapods
   ```

## 🛠️ Installation

1. **Navigate to the mobile directory**:
   ```bash
   cd mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **For iOS (Mac only)**:
   ```bash
   cd ios && pod install && cd ..
   ```

## 🔧 Configuration

### API Connection

Update the API URL in `src/services/api.ts`:

```typescript
// Replace localhost with your computer's IP address for device testing
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:5000/api';
```

To find your IP address:
- **Windows**: `ipconfig`
- **Mac/Linux**: `ifconfig` or `ip addr show`

### Backend Server

Make sure your hemp database server is running:
```bash
# In the main project directory
npm run dev
```

## 🏃‍♂️ Running the App

### Android
```bash
npm run android
```

### iOS (Mac only)
```bash
npm run ios
```

### Development Server
```bash
npm start
```

## 📂 Project Structure

```
mobile/
├── src/
│   ├── services/
│   │   └── api.ts          # API service for backend communication
│   ├── components/         # Reusable UI components
│   ├── screens/           # App screens
│   └── navigation/        # Navigation configuration
├── App.tsx                # Main app component
├── package.json           # Dependencies
└── README.md             # This file
```

## 🔗 API Integration

The mobile app connects to your existing hemp database backend using these endpoints:

- **Plant Types**: `/api/plant-types`
- **Hemp Products**: `/api/hemp-products`
- **Research Papers**: `/api/research-papers`
- **Industries**: `/api/industries`
- **Statistics**: `/api/stats`

## 📱 App Features

### Home Screen
- Overview statistics
- Quick access to plant types
- Navigation to main sections

### Products Screen
- Browse hemp products by category
- View product details and applications
- Industry classification

### Research Screen
- Access scientific papers
- Search research by topic
- View publication details

## 🎨 Customization

The app uses a green color scheme matching your hemp theme:
- Primary: `#2E7D32` (Dark Green)
- Accent: `#4CAF50` (Light Green)
- Background: `#E8F5E8` (Light Green Background)

## 🔧 Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npm start -- --reset-cache
   ```

2. **Android build issues**:
   ```bash
   cd android && ./gradlew clean && cd ..
   ```

3. **iOS build issues**:
   ```bash
   cd ios && xcodebuild clean && cd ..
   ```

4. **Network connectivity**:
   - Ensure your device and computer are on the same network
   - Update the API_BASE_URL with your computer's IP address
   - Check firewall settings

## 📋 Next Steps

1. **Install React Native CLI and dependencies**
2. **Set up Android Studio or Xcode**
3. **Install app dependencies with `npm install`**
4. **Update API URL in the configuration**
5. **Run the app on your device or emulator**

Your hemp database is now ready for mobile! The app will connect to your existing backend and display all your hemp products, research papers, and industry data in a beautiful mobile interface.