import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Create query client for data fetching
const queryClient = new QueryClient();

// Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Hemp Database API URL - update this to match your server
const API_BASE_URL = 'http://localhost:5000/api';

// Home Screen Component
const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Hemp Database</Text>
          <Text style={styles.subtitle}>Explore Industrial Hemp Applications</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>10+</Text>
            <Text style={styles.statLabel}>Hemp Products</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Industries</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5+</Text>
            <Text style={styles.statLabel}>Research Papers</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant Types</Text>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Fiber Hemp</Text>
            <Text style={styles.cardDescription}>
              Industrial hemp varieties optimized for fiber production
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Oil Hemp</Text>
            <Text style={styles.cardDescription}>
              Hemp varieties cultivated for seed oil extraction
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Products Screen Component
const ProductsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Hemp Products</Text>
        </View>
        
        <TouchableOpacity style={styles.productCard}>
          <Text style={styles.cardTitle}>Hemp Fiber Textiles</Text>
          <Text style={styles.cardDescription}>
            Sustainable textiles made from hemp fibers
          </Text>
          <Text style={styles.industryTag}>Textiles</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.productCard}>
          <Text style={styles.cardTitle}>Hemp Oil</Text>
          <Text style={styles.cardDescription}>
            Nutritious oil extracted from hemp seeds
          </Text>
          <Text style={styles.industryTag}>Food & Nutrition</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.productCard}>
          <Text style={styles.cardTitle}>Hemp Construction Materials</Text>
          <Text style={styles.cardDescription}>
            Sustainable building materials from hemp fibers
          </Text>
          <Text style={styles.industryTag}>Construction</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Research Screen Component
const ResearchScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Research Papers</Text>
        </View>
        
        <TouchableOpacity style={styles.researchCard}>
          <Text style={styles.cardTitle}>Hemp Fiber Applications in Automotive Industry</Text>
          <Text style={styles.cardDescription}>
            Comprehensive study on using hemp fibers in automotive components
          </Text>
          <Text style={styles.journalTag}>Journal of Industrial Hemp</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.researchCard}>
          <Text style={styles.cardTitle}>Sustainable Hemp Cultivation Methods</Text>
          <Text style={styles.cardDescription}>
            Research on environmentally friendly hemp farming techniques
          </Text>
          <Text style={styles.journalTag}>Agricultural Sciences</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Tab Navigator Component
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Products') {
            iconName = 'inventory';
          } else if (route.name === 'Research') {
            iconName = 'library-books';
          }

          return <Icon name={iconName || 'home'} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Research" component={ResearchScreen} />
    </Tab.Navigator>
  );
};

// Main App Component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  productCard: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  researchCard: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  industryTag: {
    fontSize: 12,
    color: '#4CAF50',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  journalTag: {
    fontSize: 12,
    color: '#2196F3',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});

export default App;