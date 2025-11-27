import { AntDesign, Entypo, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Dimensions, Image, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
export default function HomeScreen() {
    const router = useRouter();

    const routes = [
        { name: "Reportes", icon: "clipboard-text", path: "/reports", iconSource: "mci" },
        { name: "Clientes", icon: "person", path: "/customers", iconSource: "ionic" },
        { name: "Equipos", icon: "control", path: "/equipment", iconSource: "ant" },
        { name: "Materiales", icon: "toolbox", path: "/materials", iconSource: "fa6" },
        { name: "Ducterías", icon: "flow-line", path: "/ductwork", iconSource: "ent" },
        { name: "Cableado", icon: "cable", path: "/wired", iconSource: "mat" },
    ];

    return (
        <SafeAreaView style={[styles.container, { flex: 1 }]} edges={["top", "bottom"]}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <View style={styles.logoCard}>
                <Image source={require("../assets/logo3.png")} style={styles.logoImage} resizeMode="contain" />
            </View>
            {routes.map((route) => (
                <Pressable key={route.name} style={styles.cardButton} onPress={() => router.push(route.path)}>
                    <View style={styles.cardButton__inner}>
                        {route.iconSource === "mci" ? <MaterialCommunityIcons style={styles.cardButton__icon} size={22} name={route.icon} /> : route.iconSource === "ionic" ? <Ionicons style={styles.cardButton__icon} name={route.icon} size={22} color="#1E88E5" /> : route.iconSource === "fa5" ? <FontAwesome5 style={styles.cardButton__icon} name={route.icon} size={22} color="#1E88E5" /> : route.iconSource === "ant" ? <AntDesign style={styles.cardButton__icon} name={route.icon} size={22} color="#1E88E5" /> : route.iconSource === "fa6" ? <FontAwesome6 style={styles.cardButton__icon} name={route.icon} size={22} color="#1E88E5" /> : route.iconSource === "ent" ? <Entypo style={styles.cardButton__icon} name={route.icon} size={22} color="#1E88E5" /> : route.iconSource === "mat" ? <MaterialIcons style={styles.cardButton__icon} name={route.icon} size={22} color="#1E88E5" /> : null}
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
        paddingTop: 70,
        overflow: "hidden",
        backgroundColor: "#fefefe",
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
        borderColor: "#d1eefa",
        borderWidth: 1,
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
