import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
export default async function getNextConsecutive(docConsecutiveKey) {
    try {
        const value = await AsyncStorage.getItem(docConsecutiveKey);
        if (value !== null) {
            await AsyncStorage.setItem(docConsecutiveKey, "1");
            return 1;
        } else {
            const nextConsecutive = parseInt(value, 10) + 1;
            await AsyncStorage.setItem(docConsecutiveKey, nextConsecutive.toString());
            return nextConsecutive;
        }
    } catch (error) {
        Alert.alert("Error al obtener el siguiente consecutivo:", error.message);
        return -1;
    }
}
