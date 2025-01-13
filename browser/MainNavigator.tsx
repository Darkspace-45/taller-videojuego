import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import WelcomenScreen from "../screens/WelcomenScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import { ScoresScreen } from "../screens/ScoreScreen";
import { Text, View } from "react-native";
import Integrante from "../screens/Integrante";
import JuegoPoker from "../screens/Juego3";
import Dificultad from "../screens/Dificultad";
import JuegoMemory from "../screens/Juego";
import JuegoDoom from "../screens/Juego2";



const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Integrantes"
                component={Integrante}
                options={{
                    headerShown: false,
                    tabBarIcon: () => (
                        <View>
                            <Text>👥</Text>
                        </View>
                    ),
                }}
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
                name='dificultad'
                component={Dificultad}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="JuegoM"
                component={JuegoMemory}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="JuegoD"
                component={JuegoDoom}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="JuegoP"
                component={JuegoPoker}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ScoreScreen"
                component={ScoresScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Integrantes"
                component={MyTabs}
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
