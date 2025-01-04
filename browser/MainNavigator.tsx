import { createDrawerNavigator } from "@react-navigation/drawer";
import WelcomenScreen from "../screens/WelcomenScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RegisterScreen from "../screens/RegisterScreen";

const Drawer = createDrawerNavigator();

function MyDrawer() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={WelcomenScreen} options={{headerShown: false}}/>
            <Drawer.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
        </Drawer.Navigator>
    );
}

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
    return (
        <NavigationContainer>
            <MyDrawer />
        </NavigationContainer>
    );
}