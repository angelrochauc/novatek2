import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import THEME from "./theme/light.js";

export default function DuctworkScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    useEffect(() => {
        getDuctworktList();
    }, []);

    const [ductworkName, setDuctworkName] = useState("");
    const [ductworkList, setDuctworkList] = useState([]);
    const [createDuctworkModalVisible, setCreateDuctworkModalVisible] = useState(false);
    const [editDuctworkModalVisible, setEditDuctworkModalVisible] = useState(false);
    const [currentEditingDuctworkId, setCurrentEditingDuctworkId] = useState(null);
    const getDuctworktList = async () => {
        try {
            const data = await AsyncStorage.getItem("ductwork");
            let savedDuctwork = data ? JSON.parse(data) : [];
            setDuctworkList(savedDuctwork);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo obtener la lista de ducterías");
        }
    };

    const deleteDuctwork = async (id) => {
        try {
            const data = await AsyncStorage.getItem("ductwork");
            let savedDuctwork = data ? JSON.parse(data) : [];
            savedDuctwork = savedDuctwork.filter((ductwork) => ductwork.id !== id);
            await AsyncStorage.setItem("ductwork", JSON.stringify(savedDuctwork));
            Alert.alert("Éxito", "Ductwork eliminado correctamente");
            setDuctworkList(savedDuctwork);
            setEditDuctworkModalVisible(false);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo eliminar la ductería");
        }
    };

    const saveDuctwork = async (edit) => {
        if (!ductworkName.trim()) {
            Alert.alert("Error", "El nombre de la ductería es obligatorio");
            return;
        }

        const newDuctwork = {
            id: edit ? currentEditingDuctworkId : uuid.v4(),
            name: ductworkName,
        };

        try {
            const data = await AsyncStorage.getItem("ductwork");
            const savedDuctwork = data ? JSON.parse(data) : [];
            if (edit) {
                const index = savedDuctwork.findIndex((mat) => mat.id === currentEditingDuctworkId);
                if (index !== -1) {
                    savedDuctwork[index] = newDuctwork;
                }
            } else {
                savedDuctwork.push(newDuctwork);
            }
            await AsyncStorage.setItem("ductwork", JSON.stringify(savedDuctwork));
            Alert.alert("Éxito", "Ductería guardada correctamente");
            setDuctworkList(savedDuctwork);
            setCreateDuctworkModalVisible(false);
            setEditDuctworkModalVisible(false);
            setDuctworkName("");
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo guardar la ductería");
        }
    };

    const cleanField = () => {
        setDuctworkName("");
    };

    const editDuctwork = (ductwork) => {
        setEditDuctworkModalVisible(true);
        setDuctworkName(ductwork.name);
        setCurrentEditingDuctworkId(ductwork.id);
    };

    return (
        <SafeAreaView style={[styles.container, { flex: 1 }]} edges={["top", "bottom"]}>
            <Modal visible={createDuctworkModalVisible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View style={{ width: "80%", backgroundColor: "#fff", borderRadius: 12, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>Agregar nuevo ductwork</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20, placeholderTextColor: "#999" }} placeholder="Nombre del ductwork" value={ductworkName} onChangeText={setDuctworkName} />
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.modalButton} onPress={() => saveDuctwork(false)}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setCreateDuctworkModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal visible={editDuctworkModalVisible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View style={{ width: "80%", backgroundColor: "#fff", borderRadius: 12, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>Agregar nuevo ductwork</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20, placeholderTextColor: "#999" }} placeholder="Nombre del ductwork" value={ductworkName} onChangeText={setDuctworkName} />
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.modalButton} onPress={() => saveDuctwork(true)}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setEditDuctworkModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonDelete]} onPress={() => deleteDuctwork(currentEditingDuctworkId)}>
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
                <Text style={styles.title}>Ducterías</Text>
            </View>

            <ScrollView style={styles.ScrollView}>
                <Pressable
                    style={styles.Button}
                    onPress={() => {
                        cleanField();
                        setCreateDuctworkModalVisible(true);
                    }}
                >
                    <Text style={styles.ButtonText}>Agregar nueva ductería</Text>
                </Pressable>
                {ductworkList.map((ductwork) => (
                    <Pressable key={ductwork.id} style={styles.materialItem} onPress={() => editDuctwork(ductwork)}>
                        <View>
                            <Text style={{ fontSize: 17 }}>{ductwork.name}</Text>
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
