import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AgregarEquipoScreen from "./app/agregar-equipo";
import AgregarMaterialScreen from "./app/agregar-material";
import CustomerScreen from "./app/customers";
import HomeScreen from "./app/index";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <>
            <SafeAreaProvider>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="AgregarEquipo" component={AgregarEquipoScreen} />
                        <Stack.Screen name="Customers" component={CustomerScreen} />
                        <Stack.Screen name="AgregarMaterial" component={AgregarMaterialScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </>
    );
}
