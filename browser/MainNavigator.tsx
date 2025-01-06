import { createStackNavigator } from "@react-navigation/stack";
import WelcomenScreen from "../screens/WelcomenScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import Juego from "../screens/Juego";

const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Juego" component={Juego} />
        </Tab.Navigator>    
    );
}

const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={WelcomenScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Juego" component={MyTabs} options={{headerShown: false}}/>
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