import { createDrawerNavigator } from "@react-navigation/drawer";
import WelcomenScreen from "../screens/WelcomenScreen";
import { NavigationContainer } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

function MyDrawer() {
    return (
        <Drawer.Navigator >
            <Drawer.Screen name="Home" component={WelcomenScreen} />
        </Drawer.Navigator>
    );
}

export default function MainNavigator() {
    return (
        <NavigationContainer>
            <MyDrawer />
        </NavigationContainer>
    );
}