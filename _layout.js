import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import CustomerScreen from "./app/customers";
import EquipmentScreen from "./app/equipment";
import HomeScreen from "./app/index";
import AgregarMaterialScreen from "./app/materials";
import ReportsScreen from "./app/reports";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Customers" component={CustomerScreen} />
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="AgregarEquipo" component={EquipmentScreen} />
                    <Stack.Screen name="AgregarMaterial" component={AgregarMaterialScreen} />
                    <Stack.Screen name="Reports" component={ReportsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
