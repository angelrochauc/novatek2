import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import uuid from "react-native-uuid";
import { THEME } from "./theme/light.js";

export default function CustomerScreen() {
    useEffect(() => {
        getCustomers();
    }, []);
    const router = useRouter();

    const getCustomers = async () => {
        try {
            const data = await AsyncStorage.getItem("customers");
            const savedCustomers = data ? JSON.parse(data) : [];
            setCustomersList(savedCustomers);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudieron cargar los clientes");
        }
    };

    const [createCustomerModalVisible, setCreateCustomerModalVisible] = useState(false);
    const [editCustomerModalVisible, setEditCustomerModalVisible] = useState(false);
    const [currentEditingCustomerId, setCurrentEditingCustomerId] = useState(null);
    const [customersList, setCustomersList] = useState([]);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [contact, setContact] = useState("");

    const cleanFields = () => {
        setName("");
        setContact("");
        setAddress("");
        setPhone("");
    };

    const saveCustomer = async (edit) => {
        if (!name.trim()) {
            Alert.alert("Error", "El nombre del cliente es obligatorio");
            return;
        }

        let newCustomer;
        if (edit) {
            newCustomer = {
                id: currentEditingCustomerId,
                name,
                contact,
                address,
                phone,
            };
        } else {
            newCustomer = {
                id: uuid.v4(),
                name,
                contact,
                address,
                phone,
            };
        }

        try {
            const data = await AsyncStorage.getItem("customers");
            const savedCustomers = data ? JSON.parse(data) : [];

            if (edit) {
                const index = savedCustomers.findIndex((customer) => customer.id === newCustomer.id);
                if (index !== -1) {
                    savedCustomers[index] = newCustomer;
                }
            } else {
                savedCustomers.push(newCustomer);
            }

            await AsyncStorage.setItem("customers", JSON.stringify(savedCustomers));
            getCustomers();
            Alert.alert("Éxito", "Cliente guardado correctamente");
            setCreateCustomerModalVisible(false);
            setEditCustomerModalVisible(false);
            cleanFields();
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo guardar el cliente");
        }
    };

    const editCustomer = (customer) => {
        setEditCustomerModalVisible(true);
        setCurrentEditingCustomerId(customer.id);
        setName(customer.name);
        setContact(customer.contact);
        setAddress(customer.address);
        setPhone(customer.phone);
    };

    const deleteCustomer = async (customerId) => {
        try {
            const data = await AsyncStorage.getItem("customers");
            const savedCustomers = data ? JSON.parse(data) : [];
            const updatedCustomers = savedCustomers.filter((customer) => customer.id !== customerId);
            await AsyncStorage.setItem("customers", JSON.stringify(updatedCustomers));
            getCustomers();
            Alert.alert("Éxito", "Cliente eliminado correctamente");
            cleanFields();
            setEditCustomerModalVisible(false);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudo eliminar el cliente");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Modal visible={createCustomerModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Agregar Nuevo Cliente</Text>
                        <TextInput placeholder="Nombre" style={styles.input} value={name} onChangeText={setName} />
                        <TextInput placeholder="Responsable" style={styles.input} value={contact} onChangeText={setContact} />
                        <TextInput placeholder="Dirección" style={styles.input} value={address} onChangeText={setAddress} />
                        <TextInput placeholder="Teléfono" style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.modalButton} onPress={() => saveCustomer(false)}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setCreateCustomerModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal visible={editCustomerModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Cliente</Text>
                        <TextInput placeholder="Nombre" style={styles.input} value={name} onChangeText={setName} />
                        <TextInput placeholder="Responsable" style={styles.input} value={contact} onChangeText={setContact} />
                        <TextInput placeholder="Dirección" style={styles.input} value={address} onChangeText={setAddress} />
                        <TextInput placeholder="Teléfono" style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.modalButton} onPress={() => saveCustomer(true)}>
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setEditCustomerModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </Pressable>
                            <Pressable style={[styles.modalButton, styles.modalButtonDelete]} onPress={() => deleteCustomer(currentEditingCustomerId)}>
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
                <Text style={styles.title}>Clientes</Text>
            </View>

            <Pressable style={styles.Button} onPress={() => setCreateCustomerModalVisible(true)}>
                <Text style={styles.ButtonText}>Agregar nuevo cliente</Text>
            </Pressable>

            {customersList.map((customer) => (
                <Pressable key={customer.id} style={styles.CustomerItem} onPress={() => editCustomer(customer)}>
                    <View>
                        <Text style={{ fontSize: 17, fontWeight: "600" }}>{customer.name}</Text>
                        <Text style={{ fontSize: 17, marginTop: 3 }}>Responsable: {customer.contact}</Text>
                        <Text style={{ fontSize: 17, marginTop: 3 }}>Dirección: {customer.address}</Text>
                        <Text style={{ fontSize: 17, marginTop: 3 }}>Teléfono: {customer.phone}</Text>
                    </View>
                </Pressable>
            ))}
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

    CustomerItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },

    backButton: {
        padding: 5,
    },

    input: {
        borderWidth: 1,
        borderColor: "#999",
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        marginTop: 5,
        minHeight: 42,
        outlineColor: THEME.primary,
        placeholderTextColor: "#999",
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    modalTitle: {
        color: "#164c72",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        padding: 10,
        borderRadius: 6,
        backgroundColor: THEME.primary,
        alignItems: "center",
        marginHorizontal: 5,
    },
    modalButtonCancel: {
        backgroundColor: "#999",
    },
    modalButtonDelete: {
        flex: 0.4,
        backgroundColor: "#8b0707",
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
