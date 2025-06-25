
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import QuizListScreen from './src/screens/quiz/QuizListScreen';
import QuizScreen from './src/screens/quiz/QuizScreen';
import QuizResultScreen from './src/screens/quiz/QuizResultScreen';
import TutorScreen from './src/screens/TutorScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProgressScreen from './src/screens/ProgressScreen';

// Components
import LoadingSpinner from './src/components/LoadingSpinner';

// Services & Store
import { store } from './src/store/store';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f8fafc' }
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Quiz Stack Navigator
function QuizStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#3b82f6' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    >
      <Stack.Screen 
        name="QuizList" 
        component={QuizListScreen}
        options={{ title: 'Quizzes' }}
      />
      <Stack.Screen 
        name="Quiz" 
        component={QuizScreen}
        options={{ title: 'Take Quiz' }}
      />
      <Stack.Screen 
        name="QuizResult" 
        component={QuizResultScreen}
        options={{ title: 'Results' }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Quizzes':
              iconName = 'quiz';
              break;
            case 'Tutor':
              iconName = 'chat';
              break;
            case 'Progress':
              iconName = 'trending-up';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'home';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: { backgroundColor: '#3b82f6' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Quizzes" 
        component={QuizStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Tutor" 
        component={TutorScreen}
        options={{ title: 'AI Tutor' }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ title: 'Progress' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator
function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AuthProvider>
          <NotificationProvider>
            <NavigationContainer>
              <StatusBar style="light" backgroundColor="#3b82f6" />
              <AppNavigator />
            </NavigationContainer>
          </NotificationProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

// Additional configuration for notifications and deep linking
const linking = {
  prefixes: ['smartstudy://'],
  config: {
    screens: {
      Main: {
        screens: {
          Dashboard: 'dashboard',
          Quizzes: {
            screens: {
              QuizList: 'quizzes',
              Quiz: 'quiz/:id',
              QuizResult: 'quiz/:id/result',
            },
          },
          Tutor: 'tutor',
          Progress: 'progress',
          Profile: 'profile',
        },
      },
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
    },
  },
};

// Export linking config for NavigationContainer
export { linking };