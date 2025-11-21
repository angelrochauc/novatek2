import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Dimensions, Image, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
export default function HomeScreen() {
    const router = useRouter();

    const routes = [
        { name: "Nuevo Reporte", icon: "clipboard-text", path: "/nuevo-reporte", iconSource: "mci" },
        { name: "Agregar un cliente", icon: "person-add-sharp", path: "/agregar-cliente", iconSource: "ionic" },
        { name: "Agregar equipo", icon: "users", path: "/agregar-equipo", iconSource: "fa5" },
        { name: "Agregar material", icon: "file-document-edit", path: "/agregar-material", iconSource: "mci" },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <View style={styles.logoCard}>
                <Image source={require("../assets/logo3.png")} style={styles.logoImage} resizeMode="contain" />
            </View>
            {routes.map((route) => (
                <Pressable key={route.name} style={styles.cardButton} onPress={() => router.push(route.path)}>
                    <View style={styles.cardButton__inner}>
                        {route.iconSource === "mci" ? <MaterialCommunityIcons style={styles.cardButton__icon} size={22} name={route.icon} /> : route.iconSource === "ionic" ? <Ionicons style={styles.cardButton__icon} name={route.icon} size={22} color="#1E88E5" /> : route.iconSource === "fa5" ? <FontAwesome5 style={styles.cardButton__icon} name={route.icon} size={22} color="#1E88E5" /> : null}
                        <Text style={styles.cardButton__text}>{route.name}</Text>
                    </View>
                </Pressable>
            ))}
            <Text style={styles.footerText}>Desarrollado por HOD | {new Date().getFullYear()}</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 60,
        overflow: "hidden",
        backgroundColor: "#fefefe:",
    },

    logoCard: {
        width: "85%",
        height: 90,
        backgroundColor: "#E6F8FF",
        borderRadius: 12,
        marginBottom: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.025,
        shadowRadius: 1.1,
        shadowOffset: { width: 4, height: 4 },
        elevation: 4,
    },
    icon: {
        height: "100%",
        textAlign: "end",
    },

    logoImage: {
        height: "60%",
    },

    cardButton: {
        width: "75%",
        height: 52,
        backgroundColor: "#fdfeff",
        borderRadius: 12,
        marginBottom: 19,
        shadowColor: "#000",
        shadowOpacity: 0.16,
        shadowRadius: 3,
        shadowOffset: { width: 1, height: 1 },
        elevation: 4,
    },

    cardButton__inner: {
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
    },

    cardButton__icon: {
        color: "#0D47A150",
    },

    cardButton__text: {
        fontSize: width * 0.04,
        // fontSize: 19,
        marginLeft: 10,
        color: "#0D47A1",
        fontWeight: "500",
    },
    footerText: {
        position: "absolute",
        bottom: 20,
        fontSize: 12,
        color: "#888",
    },
});
