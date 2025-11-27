import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import THEME from "../theme/light.js";
export default function ReportsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    return (
        <SafeAreaView style={[styles.container, { flex: 1 }]} edges={["top", "bottom"]}>
            <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
                <Pressable onPress={() => router.push("/")} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Reportes</Text>
            </View>

            <Pressable style={styles.Button} onPress={() => router.push("/reports/technical-visit")}>
                <Text style={styles.ButtonText}>Crear nuevo Formato Visita Técnica</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fefeff",
        paddingTop: 90,
        paddingHorizontal: 30,
    },

    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingBottom: 15,
        backgroundColor: THEME.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
        zIndex: 10,
    },

    backButton: {
        padding: 5,
    },

    title: {
        marginLeft: 20,
        fontSize: 19,
        textAlign: "center",
        color: "#fefefe",
        fontWeight: "600",
    },

    Button: {
        backgroundColor: THEME.primary,
        minHeight: 48,
        paddingVertical: 12,
        marginTop: 10,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

    ButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
