import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Icon from "react-native-vector-icons/MaterialIcons";

// Create query client for data fetching
const queryClient = new QueryClient();

// Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Hemp Database API URL - update this to match your server
const API_BASE_URL = "http://localhost:5000/api";

// Home Screen Component
const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container} data-oid="-dc_n6l">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffffff"
        data-oid="4epgpf0"
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        data-oid="ws396hd"
      >
        <View style={styles.header} data-oid="n6b:eu_">
          <Text style={styles.title} data-oid="we.w52w">
            Hemp Database
          </Text>
          <Text style={styles.subtitle} data-oid="7g_fgmg">
            Explore Industrial Hemp Applications
          </Text>
        </View>

        <View style={styles.statsContainer} data-oid="two80gl">
          <View style={styles.statCard} data-oid=":ywq39:">
            <Text style={styles.statNumber} data-oid="y2p9f-l">
              10+
            </Text>
            <Text style={styles.statLabel} data-oid="o:esm4_">
              Hemp Products
            </Text>
          </View>
          <View style={styles.statCard} data-oid="hmx:rhe">
            <Text style={styles.statNumber} data-oid="u.p0ztd">
              8
            </Text>
            <Text style={styles.statLabel} data-oid=".ety9z2">
              Industries
            </Text>
          </View>
          <View style={styles.statCard} data-oid="8no-ad3">
            <Text style={styles.statNumber} data-oid="walfg6-">
              5+
            </Text>
            <Text style={styles.statLabel} data-oid="so20dof">
              Research Papers
            </Text>
          </View>
        </View>

        <View style={styles.section} data-oid="muvmqmu">
          <Text style={styles.sectionTitle} data-oid="ekhn9k9">
            Plant Types
          </Text>
          <TouchableOpacity style={styles.card} data-oid="dwr3x1w">
            <Text style={styles.cardTitle} data-oid="qgcuew8">
              Fiber Hemp
            </Text>
            <Text style={styles.cardDescription} data-oid="bhhsv62">
              Industrial hemp varieties optimized for fiber production
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} data-oid="oxsvm1:">
            <Text style={styles.cardTitle} data-oid="nq04zxa">
              Oil Hemp
            </Text>
            <Text style={styles.cardDescription} data-oid="hmb-d.8">
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
    <SafeAreaView style={styles.container} data-oid=":r8.y9n">
      <ScrollView style={styles.scrollView} data-oid="9wi5khl">
        <View style={styles.header} data-oid="6rg:9o1">
          <Text style={styles.title} data-oid="i-784:w">
            Hemp Products
          </Text>
        </View>

        <TouchableOpacity style={styles.productCard} data-oid="na6.zva">
          <Text style={styles.cardTitle} data-oid="4tqs:j4">
            Hemp Fiber Textiles
          </Text>
          <Text style={styles.cardDescription} data-oid="gm2ui4e">
            Sustainable textiles made from hemp fibers
          </Text>
          <Text style={styles.industryTag} data-oid="x0jgw_e">
            Textiles
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.productCard} data-oid="vrfw9:n">
          <Text style={styles.cardTitle} data-oid="la7vlbn">
            Hemp Oil
          </Text>
          <Text style={styles.cardDescription} data-oid="a81b:zq">
            Nutritious oil extracted from hemp seeds
          </Text>
          <Text style={styles.industryTag} data-oid="0jux6k9">
            Food & Nutrition
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.productCard} data-oid="o2tfu79">
          <Text style={styles.cardTitle} data-oid="kj4b1qz">
            Hemp Construction Materials
          </Text>
          <Text style={styles.cardDescription} data-oid="nbg5ui5">
            Sustainable building materials from hemp fibers
          </Text>
          <Text style={styles.industryTag} data-oid="nd-jgru">
            Construction
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// Research Screen Component
const ResearchScreen = () => {
  return (
    <SafeAreaView style={styles.container} data-oid="a8q2-lp">
      <ScrollView style={styles.scrollView} data-oid="st:278u">
        <View style={styles.header} data-oid="kk2f:1o">
          <Text style={styles.title} data-oid="qn59utm">
            Research Papers
          </Text>
        </View>

        <TouchableOpacity style={styles.researchCard} data-oid="uudlg:w">
          <Text style={styles.cardTitle} data-oid="2z0obiv">
            Hemp Fiber Applications in Automotive Industry
          </Text>
          <Text style={styles.cardDescription} data-oid="b8y1qgi">
            Comprehensive study on using hemp fibers in automotive components
          </Text>
          <Text style={styles.journalTag} data-oid="31ro04o">
            Journal of Industrial Hemp
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.researchCard} data-oid="_n7fcpt">
          <Text style={styles.cardTitle} data-oid="27chzih">
            Sustainable Hemp Cultivation Methods
          </Text>
          <Text style={styles.cardDescription} data-oid="40eke.g">
            Research on environmentally friendly hemp farming techniques
          </Text>
          <Text style={styles.journalTag} data-oid="3wc8t5g">
            Agricultural Sciences
          </Text>
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

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Products") {
            iconName = "inventory";
          } else if (route.name === "Research") {
            iconName = "library-books";
          }

          return (
            <Icon
              name={iconName || "home"}
              size={size}
              color={color}
              data-oid="867.p6m"
            />
          );
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
      data-oid="vhs13d2"
    >
      <Tab.Screen name="Home" component={HomeScreen} data-oid="ba:sjd." />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        data-oid="z7-qmsd"
      />
      <Tab.Screen
        name="Research"
        component={ResearchScreen}
        data-oid="ssgwqxk"
      />
    </Tab.Navigator>
  );
};

// Main App Component
const App = () => {
  return (
    <QueryClientProvider client={queryClient} data-oid="o.hwxze">
      <NavigationContainer data-oid="ffuidvv">
        <TabNavigator data-oid="fyokbth" />
      </NavigationContainer>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#E8F5E8",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  productCard: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  researchCard: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  industryTag: {
    fontSize: 12,
    color: "#4CAF50",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  journalTag: {
    fontSize: 12,
    color: "#2196F3",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
});

export default App;
