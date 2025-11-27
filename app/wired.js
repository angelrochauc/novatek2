import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import THEME from "./theme/light.js";

export default function WiredScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    useEffect(() => {
        getWiredList();
    }, []);

    const [wiredName, setWiredName] = useState("");
    const [wiredList, setWiredList] = useState([]);
    const [createWiredModalVisible, setCreateWiredModalVisible] = useState(false);
    const [editWiredModalVisible, setEditWiredModalVisible] = useState(false);
    const [currentEditingWiredId, setCurrentEditingWiredId] = useState(null);
    const getWiredList = async () => {
        try {
            const data = await AsyncStorage.getItem("wired");
            let savedWired = data ? JSON.parse(data) : [];
            setWiredList(savedWired);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo obtener la lista de cableados");
        }
    };

    const deleteWired = async (id) => {
        try {
            const data = await AsyncStorage.getItem("wired");
            let savedWired = data ? JSON.parse(data) : [];
            savedWired = savedWired.filter((wired) => wired.id !== id);
            await AsyncStorage.setItem("wired", JSON.stringify(savedWired));
            Alert.alert("Éxito", "Cableado eliminado correctamente");
            setWiredList(savedWired);
            setEditWiredModalVisible(false);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo eliminar el cableado");
        }
    };

    const saveWired = async (edit) => {
        if (!wiredName.trim()) {
            Alert.alert("Error", "El nombre del cableado es obligatorio");
            return;
        }

        const newWired = {
            id: edit ? currentEditingWiredId : uuid.v4(),
            name: wiredName,
        };

        try {
            const data = await AsyncStorage.getItem("wired");
            const savedWired = data ? JSON.parse(data) : [];
            if (edit) {
                const index = savedWired.findIndex((mat) => mat.id === currentEditingWiredId);
                if (index !== -1) {
                    savedWired[index] = newWired;
                }
            } else {
                savedWired.push(newWired);
            }
            await AsyncStorage.setItem("wired", JSON.stringify(savedWired));
            Alert.alert("Éxito", "Cableado guardado correctamente");
            setWiredList(savedWired);
            setCreateWiredModalVisible(false);
            setEditWiredModalVisible(false);
            setWiredName("");
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo guardar el cableado");
        }
    };

    const cleanField = () => {
        setWiredName("");
    };

    const editWired = (wired) => {
        setEditWiredModalVisible(true);
        setWiredName(wired.name);
        setCurrentEditingWiredId(wired.id);
    };

    return (
        <SafeAreaView style={[styles.container, { flex: 1 }]} edges={["top", "bottom"]}>
            <Modal visible={createWiredModalVisible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View style={{ width: "80%", backgroundColor: "#fff", borderRadius: 12, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>Agregar nuevo cableado</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20, placeholderTextColor: "#999" }} placeholder="Nombre del cableado" value={wiredName} onChangeText={setWiredName} />
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.modalButton} onPress={() => saveWired(false)}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setCreateWiredModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal visible={editWiredModalVisible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View style={{ width: "80%", backgroundColor: "#fff", borderRadius: 12, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>Agregar nuevo cableado</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20, placeholderTextColor: "#999" }} placeholder="Nombre del cableado" value={wiredName} onChangeText={setWiredName} />
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.modalButton} onPress={() => saveWired(true)}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setEditWiredModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonDelete]} onPress={() => deleteWired(currentEditingWiredId)}>
                                <Text style={styles.modalButtonText}>
                                    <FontAwesome5 name="trash" size={20} color="#fff" />
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
                <Pressable onPress={() => router.push("/")} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Cableado</Text>
            </View>

            <ScrollView style={styles.ScrollView}>
                <Pressable
                    style={styles.Button}
                    onPress={() => {
                        cleanField();
                        setCreateWiredModalVisible(true);
                    }}
                >
                    <Text style={styles.ButtonText}>Agregar nuevo cableado</Text>
                </Pressable>
                {wiredList.map((wired) => (
                    <Pressable key={wired.id} style={styles.materialItem} onPress={() => editWired(wired)}>
                        <View>
                            <Text style={{ fontSize: 17 }}>{wired.name}</Text>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
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
        paddingBottom: 15,
        backgroundColor: THEME.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingHorizontal: 20,
        paddingTop: 15,
        zIndex: 10,
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
        marginBottom: 20,
    },

    ButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalButton: {
        flex: 1,
        padding: 10,
        borderRadius: 6,
        backgroundColor: THEME.primary,
        alignItems: "center",
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    modalButtonCancel: {
        backgroundColor: "#999",
    },
    modalButtonDelete: {
        flex: 0.4,
        backgroundColor: "#8b0707",
    },
    materialItem: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 10,
        borderColor: "#ddd",
    },
});
