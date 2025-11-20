import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
    const router = useRouter();

    const routes = [
        { name: "Nuevo Reporte", icon: "clipboard-text", path: "/nuevo-reporte", iconSource: "mci" },
        { name: "Agregar un cliente", icon: "person-add-sharp", path: "/agregar-cliente", iconSource: "ionic" },
        { name: "Agregar equipo", icon: "users", path: "/agregar-equipo", iconSource: "fa5" },
        { name: "Agregar material", icon: "file-document-edit", path: "/agregar-material", iconSource: "mci" },
    ];

    return (
        <View style={styles.container}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 60,
        overflow: "hidden",
    },

    logoCard: {
        width: "85%",
        height: 90,
        backgroundColor: "#d7f4ffa1",
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
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 19,
        shadowColor: "#000",
        shadowOpacity: 0.16,
        shadowRadius: 3,
        shadowOffset: { width: 1, height: 1 },
        elevation: 4,
    },

    cardButton__inner: {
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        height: "100%",
        alignContent: "center",
        alignItems: "center",
    },

    cardButton__icon: {
        textAlign: "end",
        color: "#186ddb9c",
    },

    cardButton__text: {
        fontSize: 18,
        marginLeft: 10,
        color: "#0D47A1",
        fontWeight: "600",
    },
    footerText: {
        position: "absolute",
        bottom: 20,
        fontSize: 12,
        color: "#888",
    },
});
