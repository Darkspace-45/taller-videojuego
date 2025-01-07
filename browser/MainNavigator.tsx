import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import WelcomenScreen from "../screens/WelcomenScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import Juego from "../screens/Juego";
import { ScoresScreen } from "../screens/ScoreScreen";
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from "react-native";
import Integrante from "../screens/Integrante";



const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Juego"
                component={Juego}
                options={{
                    headerShown: false,
                    tabBarIcon: () => (
                        <View>
                            <Text>🎮</Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Integrantes"
                component={Integrante}
            />
        </Tab.Navigator>
    );
}

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={WelcomenScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Juego"
                component={MyTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ScoreScreen"
                component={ScoresScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}

export default function MainNavigator() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}
