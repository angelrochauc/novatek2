import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import { Modal } from "react-native-web";

export default function MaterialsScreen() {
    const router = useRouter();

    useEffect(() => {
        getMaterialstList();
    }, []);

    const [materialName, setMaterialName] = useState("");
    const [materialList, setMaterialList] = useState([]);
    const [createMaterialModalVisible, setCreateMaterialModalVisible] = useState(false);
    const [editMaterialModalVisible, setEditMaterialModalVisible] = useState(false);
    const [currentEditingMaterialId, setCurrentEditingMaterialId] = useState(null);

    const getMaterialstList = async () => {
        try {
            const data = await AsyncStorage.getItem("materials");
            let savedMaterials = data ? JSON.parse(data) : [];
            setMaterialList(savedMaterials);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo obtener la lista de materiales");
        }
    };

    const deleteMaterial = async (id) => {
        try {
            const data = await AsyncStorage.getItem("materials");
            let savedMaterials = data ? JSON.parse(data) : [];
            savedMaterials = savedMaterials.filter((mat) => mat.id !== id);
            await AsyncStorage.setItem("materials", JSON.stringify(savedMaterials));
            Alert.alert("Éxito", "Material eliminado correctamente");
            setMaterialList(savedMaterials);
            setEditMaterialModalVisible(false);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo eliminar el equipo");
        }
    };

    const saveMaterial = async (edit) => {
        if (!materialName.trim()) {
            Alert.alert("Error", "El nombre del material es obligatorio");
            return;
        }

        const newMaterial = {
            id: edit ? currentEditingMaterialId : uuid.v4(),
            name: materialName,
        };

        try {
            const data = await AsyncStorage.getItem("materials");
            const savedMaterials = data ? JSON.parse(data) : [];
            if (edit) {
                const index = savedMaterials.findIndex((mat) => mat.id === currentEditingMaterialId);
                if (index !== -1) {
                    savedMaterials[index] = newMaterial;
                }
            } else {
                savedMaterials.push(newMaterial);
            }
            await AsyncStorage.setItem("materials", JSON.stringify(savedMaterials));
            Alert.alert("Éxito", "Material guardado correctamente");
            setMaterialList(savedMaterials);
            setCreateMaterialModalVisible(false);
            setEditMaterialModalVisible(false);
            setMaterialName("");
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo guardar el material");
        }
    };

    const cleanField = () => {
        setMaterialName("");
    };

    const editMaterial = (material) => {
        setEditMaterialModalVisible(true);
        setMaterialName(material.name);
        setCurrentEditingMaterialId(material.id);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Modal visible={createMaterialModalVisible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View style={{ width: "80%", backgroundColor: "#fff", borderRadius: 12, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>Agregar nuevo material</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20, placeholderTextColor: "#999" }} placeholder="Nombre del material" value={materialName} onChangeText={setMaterialName} />
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.modalButton} onPress={() => saveMaterial(false)}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setCreateMaterialModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal visible={editMaterialModalVisible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View style={{ width: "80%", backgroundColor: "#fff", borderRadius: 12, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>Agregar nuevo material</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 20, placeholderTextColor: "#999" }} placeholder="Nombre del material" value={materialName} onChangeText={setMaterialName} />
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.modalButton} onPress={() => saveMaterial(true)}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setEditMaterialModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonDelete]} onPress={() => deleteMaterial(currentEditingMaterialId)}>
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
                        setCreateMaterialModalVisible(true);
                    }}
                >
                    <Text style={styles.ButtonText}>Agregar nuevo material</Text>
                </Pressable>
                {materialList.map((material) => (
                    <Pressable key={material.id} style={styles.materialItem} onPress={() => editMaterial(material)}>
                        <View>
                            <Text style={{ fontSize: 17 }}>{material.name}</Text>
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
        backgroundColor: "#208edb",
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
        backgroundColor: "#208edb",
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
        backgroundColor: "#208edb",
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
