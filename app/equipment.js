import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import { THEME } from "./theme/light.js";

export default function EquipmentScreen() {
    const router = useRouter();

    useEffect(() => {
        getEquipmentList();
    }, []);

    const [equipName, setEquipName] = useState("");
    const [equipmentList, setEquipmentList] = useState([]);
    const [createEquipmentModalVisible, setCreateEquipmentModalVisible] = useState(false);
    const [editEquipmentModalVisible, setEditEquipmentModalVisible] = useState(false);
    const [currentEditingEquipmentId, setCurrentEditingEquipmentId] = useState(null);

    const getEquipmentList = async () => {
        try {
            const data = await AsyncStorage.getItem("equipment");
            let savedEquipment = data ? JSON.parse(data) : [];
            setEquipmentList(savedEquipment);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo obtener la lista de equipos");
        }
    };

    const deleteEquipment = async (id) => {
        try {
            const data = await AsyncStorage.getItem("equipment");
            let savedEquipment = data ? JSON.parse(data) : [];
            savedEquipment = savedEquipment.filter((eq) => eq.id !== id);
            await AsyncStorage.setItem("equipment", JSON.stringify(savedEquipment));
            Alert.alert("Éxito", "Equipo eliminado correctamente");
            setEquipmentList(savedEquipment);
            setEditEquipmentModalVisible(false);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo eliminar el equipo");
        }
    };

    const saveEquipment = async (edit) => {
        if (!equipName.trim()) {
            Alert.alert("Error", "El nombre del equipo es obligatorio");
            return;
        }

        const newEquipment = {
            id: edit ? currentEditingEquipmentId : uuid.v4(),
            name: equipName,
        };

        try {
            const data = await AsyncStorage.getItem("equipment");
            const savedEquipment = data ? JSON.parse(data) : [];
            if (edit) {
                const index = savedEquipment.findIndex((eq) => eq.id === currentEditingEquipmentId);
                if (index !== -1) {
                    savedEquipment[index] = newEquipment;
                }
            } else {
                savedEquipment.push(newEquipment);
            }
            await AsyncStorage.setItem("equipment", JSON.stringify(savedEquipment));
            Alert.alert("Éxito", "Equipo guardado correctamente");
            setEquipmentList(savedEquipment);
            setCreateEquipmentModalVisible(false);
            setEditEquipmentModalVisible(false);
            setEquipName("");
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo guardar el equipo");
        }
    };

    const cleanField = () => {
        setEquipName("");
    };

    const editEquipment = (equipment) => {
        setEditEquipmentModalVisible(true);
        setEquipName(equipment.name);
        setCurrentEditingEquipmentId(equipment.id);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Modal visible={createEquipmentModalVisible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View style={{ width: "80%", backgroundColor: "#fff", borderRadius: 12, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>Agregar nuevo equipo</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20, placeholderTextColor: "#999" }} placeholder="Nombre del equipo" value={equipName} onChangeText={setEquipName} />
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.modalButton} onPress={() => saveEquipment(false)}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setCreateEquipmentModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal visible={editEquipmentModalVisible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View style={{ width: "80%", backgroundColor: "#fff", borderRadius: 12, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>Agregar nuevo equipo</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20, placeholderTextColor: "#999" }} placeholder="Nombre del equipo" value={equipName} onChangeText={setEquipName} />
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.modalButton} onPress={() => saveEquipment(true)}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setEditEquipmentModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonDelete]} onPress={() => deleteEquipment(currentEditingEquipmentId)}>
                                <Text style={styles.modalButtonText}>
                                    <FontAwesome5 name="trash" size={20} color="#fff" />
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.header}>
                <Pressable onPress={() => router.push("/")} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Equipos</Text>
            </View>

            <ScrollView style={styles.ScrollView}>
                <Pressable
                    style={styles.Button}
                    onPress={() => {
                        cleanField();
                        setCreateEquipmentModalVisible(true);
                    }}
                >
                    <Text style={styles.ButtonText}>Agregar nuevo equipo</Text>
                </Pressable>
                {equipmentList.map((equipment) => (
                    <Pressable key={equipment.id} style={styles.equipmentItem} onPress={() => editEquipment(equipment)}>
                        <View>
                            <Text style={{ fontSize: 17 }}>{equipment.name}</Text>
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
        height: 70,
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
    equipmentItem: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 10,
        borderColor: "#ddd",
    },
});
