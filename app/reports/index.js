import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function ReportsScreen() {
    const router = useRouter();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.push("/")} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Reportes</Text>
            </View>

            <Pressable style={styles.Button} onPress={() => router.push("/reports/technical-visit")}>
                <Text style={styles.ButtonText}>Crear nuevo Formato Visita Técnica</Text>
            </Pressable>

            <Pressable style={styles.Button}>
                <Text style={styles.ButtonText}>Ver todos los reportes</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingTop: 90,
        paddingHorizontal: 30,
    },

    header: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: "#208edb",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
        paddingTop: 15,
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
        backgroundColor: "#208edb",
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
