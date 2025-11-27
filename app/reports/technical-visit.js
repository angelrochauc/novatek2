import { AntDesign, FontAwesome5, FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import technicalVisitReportTemplate, { firmaArturoBase64, novatekLogoBase64 } from "../../templates/technical-visit.hbs.js";
import getNextConsecutive from "../components/code-generator.js";
import CompileReport from "../components/compile-report";
import DateInput from "../components/date-picker";
import ImagePicker from "../components/image-picker";
import { RadioGroup } from "../components/radio";
import Table from "../components/table";
import THEME from "../theme/light";

export default function TechnicalVisit() {
    useEffect(() => {
        getCustomers();
        getMaterials();
        getEquipment();
        getDuctwork();
        getWired();
    }, []);

    const scrollViewRef = useRef(null);

    const router = useRouter();
    // Form state
    const [date, setDate] = useState(new Date());
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [requestType, setRequestType] = useState(null);
    const [systemQuantity, setSystemQuantity] = useState("");
    const [systemType, setSystemType] = useState("");
    const [equipmentToQuote, setEquipmentToQuote] = useState("");
    const [cableTypes, setCableTypes] = useState("");
    const [ducting, setDucting] = useState("");
    const [initialSystemState, setInitialSystemState] = useState(null);
    const [otherInitialSystemState, setOtherInitialSystemState] = useState("");
    const [equipmentList, setEquipmentList] = useState([]);
    const [materialList, setMaterialList] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [summary, setSummary] = useState("");

    // Modals state
    // Customer
    const [selectCustomerModalVisible, setSelectCustomerModalVisible] = useState(false);
    // Equipment
    const [addEquipmentModalVisible, setAddEquipmentModalVisible] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [equipmentQuantity, setEquipmentQuantity] = useState(0);
    const [equipmentObservations, setEquipmentObservations] = useState("");
    // Material
    const [addMaterialModalVisible, setAddMaterialModalVisible] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [materialQuantity, setMaterialQuantity] = useState(0);
    const [materialObservations, setMaterialObservations] = useState("");
    // Ductwork
    const [selectDuctworkModalVisible, setSelectDuctworkModalVisible] = useState(false);

    // Wired
    const [selectWiredModalVisible, setSelectWiredModalVisible] = useState(false);

    // Data state
    const [customers, setCustomers] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [ductwork, setDuctwork] = useState([]);
    const [wired, setWired] = useState([]);

    // Generate report
    const [generatingReport, setGeneratingReport] = useState(false);

    // Other
    const [showResetButton, setShowResetButton] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const getCustomers = async () => {
        try {
            const data = await AsyncStorage.getItem("customers");
            const savedCustomers = data ? JSON.parse(data) : [];
            setCustomers(savedCustomers);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudieron cargar los clientes");
        }
    };

    const getMaterials = async () => {
        try {
            const data = await AsyncStorage.getItem("materials");
            const savedMaterials = data ? JSON.parse(data) : [];
            setMaterials(savedMaterials);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudieron cargar los materiales");
            return [];
        }
    };

    const getEquipment = async () => {
        try {
            const data = await AsyncStorage.getItem("equipment");
            const savedEquipment = data ? JSON.parse(data) : [];
            setEquipment(savedEquipment);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudieron cargar los equipos");
            return [];
        }
    };

    const getDuctwork = async () => {
        try {
            const data = await AsyncStorage.getItem("ductwork");
            const savedDuctwork = data ? JSON.parse(data) : [];
            setDuctwork(savedDuctwork);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudieron cargar los ductos");
            return [];
        }
    };

    const getWired = async () => {
        try {
            const data = await AsyncStorage.getItem("wired");
            const savedWired = data ? JSON.parse(data) : [];
            setWired(savedWired);
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "No se pudieron cargar los cableados");
            return [];
        }
    };

    const addEquipmentToList = () => {
        if (!selectedEquipment) {
            Alert.alert("Error", "Debe seleccionar un equipo");
            return;
        }
        if (equipmentQuantity <= 0) {
            Alert.alert("Error", "La cantidad debe ser mayor que cero");
            return;
        }
        const newEquipment = {
            description: selectedEquipment.name,
            quantity: equipmentQuantity,
            observations: equipmentObservations,
        };
        setEquipmentList([...equipmentList, newEquipment]);
        setAddEquipmentModalVisible(false);
        setSelectedEquipment(null);
        setEquipmentQuantity(0);
        setEquipmentObservations("");
    };

    const addMaterialToList = () => {
        if (!selectedMaterial) {
            Alert.alert("Error", "Debe seleccionar un material");
            return;
        }
        if (materialQuantity <= 0) {
            Alert.alert("Error", "La cantidad debe ser mayor que cero");
            return;
        }
        const newMaterial = {
            description: selectedMaterial.name,
            quantity: materialQuantity,
            observations: materialObservations,
        };
        setMaterialList([...materialList, newMaterial]);
        setAddMaterialModalVisible(false);
        setSelectedMaterial(null);
        setMaterialQuantity(0);
        setMaterialObservations("");
    };

    const generateReport = async () => {
        if (!selectedCustomer) {
            setSubmitStatus({ success: false, message: "Es necesario seleccionar el cliente" });
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            return;
        }
        setSubmitStatus({ success: true, message: "" });
        setGeneratingReport(true);
        const reportNumber = "ITV " + date.getFullYear().toString().slice(-2) + String(await getNextConsecutive("reportConsecutive")).padStart(3, "0");
        const newReport = {
            image: novatekLogoBase64,
            firmaArturo: firmaArturoBase64,
            date: {
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
            },
            reportNumber: reportNumber,
            customer: selectedCustomer,
            requestTypeIsCot: requestType === "cotizacion",
            requestTypeIsMqt: requestType === "mantenimiento",
            requestTypeIsDgn: requestType === "diagnostico",
            systemQuantity,
            systemType: systemType || "N/A",
            equipmentQuoted: equipmentToQuote || "N/A",
            typesOfCabling: cableTypes || "N/A",
            ductwork: ducting || "N/A",
            initialStatus: {
                functional: initialSystemState === "funcional",
                doesNotTurnOn: initialSystemState === "no_enciende",
                notInstalled: initialSystemState === "sin_instalacion",
                other: otherInitialSystemState,
            },
            equipment: equipmentList.map((equipment, index) => ({
                ...equipment,
                n: index + 1,
            })),
            materials: materialList.map((material, index) => ({
                ...material,
                n: index + 1,
            })),
            summary,
            images: photos.map((photo, index) => ({ base64: "data:image/png;base64," + photo.base64, n: index + 1 })),
        };
        const pdf = await CompileReport({
            reportTemplate: technicalVisitReportTemplate,
            reportData: newReport,
            fileName: `reporte_visita_tecnica_${Date.now()}`,
        });
        await Sharing.shareAsync(pdf.filePath);
        setGeneratingReport(false);
        setShowResetButton(true);
    };

    const resetForm = () => {
        setDate(new Date());
        setSelectedCustomer(null);
        setRequestType(null);
        setSystemQuantity("");
        setSystemType("");
        setEquipmentToQuote("");
        setCableTypes("");
        setDucting("");
        setInitialSystemState("");
        setOtherInitialSystemState("");
        setEquipmentList([]);
        setMaterialList([]);
        setPhotos([]);
        setSummary("");
        setSelectedEquipment(null);
        setEquipmentQuantity(0);
        setEquipmentObservations("");
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        setShowResetButton(false);
    };

    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={[styles.container, { flex: 1 }]} edges={["top", "bottom"]}>
            <View style={[styles.header, { paddingTop: insets.top + 15 }]}>
                <Pressable onPress={() => router.push("/reports")} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </Pressable>
                <Text style={styles.title}>Formulario de visita técnica</Text>
            </View>
            <Modal visible={selectCustomerModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modal}>
                    <View style={{ width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Seleccionar Cliente</Text>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {customers.map((customer, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => {
                                        setSelectedCustomer(customer);
                                        setSelectCustomerModalVisible(false);
                                    }}
                                    style={styles.modalPressable}
                                >
                                    <Text style={{ fontSize: 16 }}>{customer.name}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                        <Pressable onPress={() => setSelectCustomerModalVisible(false)} style={{ backgroundColor: "#ccc", padding: 10, borderRadius: 6, marginTop: 10 }}>
                            <Text style={{ color: "#333", textAlign: "center" }}>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal visible={addEquipmentModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modal}>
                    <View style={{ width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Agregar Equipo</Text>
                        <ScrollView style={styles.modalScrollView}>
                            {equipment.map((equip, index) => (
                                <Pressable key={index} onPress={() => setSelectedEquipment(equip)} style={[styles.modalPressable, selectedEquipment?.id === equip.id && styles.modalPressableSelected]}>
                                    <Text style={{ fontSize: 16 }}>{equip.name}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                        <Text style={styles.label}>Cantidad</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 8, textAlign: "center" }} keyboardType="numeric" value={equipmentQuantity} onChangeText={setEquipmentQuantity} />
                        <Text style={styles.label}>Observaciones</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 8 }} multiline={true} rows={3} value={equipmentObservations} onChangeText={setEquipmentObservations} />
                        <Pressable onPress={() => addEquipmentToList()} style={{ backgroundColor: THEME.primary, padding: 10, borderRadius: 6, marginTop: 10 }}>
                            <Text style={{ color: "#fff", textAlign: "center" }}>Agregar</Text>
                        </Pressable>
                        <Pressable onPress={() => setAddEquipmentModalVisible(false)} style={{ backgroundColor: "#ccc", padding: 10, borderRadius: 6, marginTop: 10 }}>
                            <Text style={{ color: "#333", textAlign: "center" }}>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal visible={addMaterialModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modal}>
                    <View style={{ width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Agregar Equipo</Text>
                        <ScrollView style={styles.modalScrollView}>
                            {materials.map((material, index) => (
                                <Pressable key={index} onPress={() => setSelectedMaterial(material)} style={[styles.modalPressable, selectedMaterial?.id === material.id && styles.modalPressableSelected]}>
                                    <Text style={{ fontSize: 16 }}>{material.name}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                        <Text style={styles.label}>Cantidad</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 8, textAlign: "center" }} keyboardType="numeric" value={materialQuantity} onChangeText={setMaterialQuantity} />
                        <Text style={styles.label}>Observaciones</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 8 }} multiline={true} rows={3} value={materialObservations} onChangeText={setMaterialObservations} />
                        <Pressable onPress={() => addMaterialToList()} style={{ backgroundColor: THEME.primary, padding: 10, borderRadius: 6, marginTop: 10 }}>
                            <Text style={{ color: "#fff", textAlign: "center" }}>Agregar</Text>
                        </Pressable>
                        <Pressable onPress={() => setAddMaterialModalVisible(false)} style={{ backgroundColor: "#ccc", padding: 10, borderRadius: 6, marginTop: 10 }}>
                            <Text style={{ color: "#333", textAlign: "center" }}>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal visible={selectDuctworkModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modal}>
                    <View style={{ width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Agregar Ductería</Text>
                        {ductwork.map((duct, index) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    setDucting(duct.name);
                                    setSelectDuctworkModalVisible(false);
                                }}
                                style={styles.modalPressable}
                            >
                                <Text style={{ fontSize: 16 }}>{duct.name}</Text>
                            </Pressable>
                        ))}
                        <Pressable onPress={() => setSelectDuctworkModalVisible(false)} style={{ backgroundColor: "#ccc", padding: 10, borderRadius: 6, marginTop: 10 }}>
                            <Text style={{ color: "#333", textAlign: "center" }}>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal visible={selectWiredModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modal}>
                    <View style={{ width: "80%", backgroundColor: "#fff", padding: 20, borderRadius: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Agregar Cableado</Text>
                        {wired.map((wire, index) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    setCableTypes(wire.name);
                                    setSelectWiredModalVisible(false);
                                }}
                                style={styles.modalPressable}
                            >
                                <Text style={{ fontSize: 16 }}>{wire.name}</Text>
                            </Pressable>
                        ))}
                        <Pressable onPress={() => setSelectWiredModalVisible(false)} style={{ backgroundColor: "#ccc", padding: 10, borderRadius: 6, marginTop: 10 }}>
                            <Text style={{ color: "#333", textAlign: "center" }}>Cancelar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <ScrollView ref={scrollViewRef} style={styles.scroll} showsVerticalScrollIndicator={false}>
                <Pressable
                    style={styles.Button}
                    onPress={() => {
                        setSelectCustomerModalVisible(true);
                        setSubmitStatus(null);
                    }}
                >
                    <Ionicons name="person" size={26} color="#fff" />
                    <Text style={styles.ButtonText}>Seleccionar Cliente</Text>
                </Pressable>
                {selectedCustomer && (
                    <Pressable style={[styles.modalPressable, { marginBottom: 10 }]} onPress={() => setSelectedCustomer(null)}>
                        <Text>Cliente seleccionado: {selectedCustomer.name}</Text>
                    </Pressable>
                )}
                {submitStatus !== null && !submitStatus.success && <Text style={{ marginBottom: 10, color: "red", fontWeight: "600" }}>{submitStatus.message}</Text>}
                <Text style={[styles.label, { marginTop: 0 }]}>Fecha</Text>
                <DateInput inputDate={date} onDateChange={setDate} />
                <Text style={styles.label}>Tipo de Solicitud</Text>
                <RadioGroup
                    options={[
                        { label: "Visita de cotización", value: "cotizacion" },
                        { label: "Visita de cotización de mantenimiento", value: "mantenimiento" },
                        { label: "Diagnóstico", value: "diagnostico" },
                    ]}
                    value={requestType}
                    onChange={setRequestType}
                    color={THEME.primary}
                />
                <Text style={styles.label}>Cantidad de Sistemas</Text>
                <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 8 }} keyboardType="numeric" value={systemQuantity} onChangeText={setSystemQuantity} />
                <Text style={styles.label}>Tipo de Sistema</Text>
                <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 8 }} value={systemType} onChangeText={setSystemType} />
                <Text style={styles.label}>Equipos a Cotizar</Text>
                <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 8 }} value={equipmentToQuote} onChangeText={setEquipmentToQuote} />
                <Text style={styles.label}>Tipos de Cableado</Text>
                <Pressable style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 8 }} onPress={() => setSelectWiredModalVisible(true)}>
                    {cableTypes !== "" && <Text>{cableTypes}</Text>}
                    {cableTypes === "" && <Text style={{ color: "#999" }}>Seleccionar tipos de cableado</Text>}
                </Pressable>
                <Text style={styles.label}>Ductería</Text>
                <Pressable style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 8 }} onPress={() => setSelectDuctworkModalVisible(true)}>
                    {ducting !== "" && <Text>{ducting}</Text>}
                    {ducting === "" && <Text style={{ color: "#999" }}>Seleccionar ductería</Text>}
                </Pressable>
                <Text style={styles.label}>Estado Inicial del Sistema</Text>
                <RadioGroup
                    style={{ marginBottom: 30 }}
                    options={[
                        { label: "Funcional", value: "funcional" },
                        { label: "No enciende", value: "no_enciende" },
                        { label: "Sin instalación", value: "sin_instalacion" },
                        { label: "Otro", value: "otro" },
                    ]}
                    value={initialSystemState}
                    onChange={setInitialSystemState}
                    color={THEME.primary}
                />
                {initialSystemState === "otro" && (
                    <>
                        <Text style={styles.label}>¿Cuál?</Text>
                        <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginTop: 8 }} value={otherInitialSystemState} onChangeText={setOtherInitialSystemState} />
                    </>
                )}
                <Pressable style={styles.Button} onPress={() => setAddEquipmentModalVisible(true)}>
                    <AntDesign name="control" size={26} color="#fff" />
                    <Text style={styles.ButtonText}>Agregar Equipo</Text>
                </Pressable>
                <Table
                    headers={[
                        { key: "description", title: "Equipo", width: "30%" },
                        { key: "quantity", title: "Cantidad", width: "25%" },
                        { key: "observations", title: "Observaciones", width: "45%" },
                    ]}
                    fullWidth={true}
                    data={equipmentList}
                    onDataChange={setEquipmentList}
                    headerBgColor="#F0F0F4"
                ></Table>
                <Pressable style={styles.Button} onPress={() => setAddMaterialModalVisible(true)}>
                    <FontAwesome6 name="toolbox" size={26} color="#fff" />
                    <Text style={styles.ButtonText}>Agregrar Material</Text>
                </Pressable>
                <Table
                    headers={[
                        { key: "description", title: "Material", width: "30%" },
                        { key: "quantity", title: "Cantidad", width: "25%" },
                        { key: "observations", title: "Observaciones", width: "45%" },
                    ]}
                    fullWidth={true}
                    data={materialList}
                    headerBgColor="#F0F0F4"
                    onDataChange={setMaterialList}
                ></Table>
                <Text style={styles.label}>Resumen de visita</Text>
                <TextInput style={styles.Textarea} multiline={true} numberOfLines={4} onChangeText={setSummary} value={summary} />
                <ImagePicker inputImages={photos} onImagesChange={setPhotos} maxImages={20} />

                <Pressable style={[styles.Button, { marginBottom: 30 }]} onPress={generateReport}>
                    {generatingReport && (
                        <>
                            <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 10 }} />
                            <Text style={styles.ButtonText}>Generando...</Text>
                        </>
                    )}
                    {!generatingReport && (
                        <>
                            <FontAwesome5 name="file-download" size={26} color="#fff" />
                            <Text style={styles.ButtonText}>Generar Reporte</Text>
                        </>
                    )}
                </Pressable>
                {showResetButton && (
                    <>
                        <Pressable style={[styles.Button, { marginBottom: 30, marginTop: -20, backgroundColor: "#8b0707" }]} onPress={resetForm}>
                            <MaterialIcons name="restart-alt" size={26} color="#fff" />
                            <Text style={styles.ButtonText}>Reiniciar</Text>
                        </Pressable>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.background,
        paddingTop: 40,
        paddingHorizontal: 30,
    },
    scroll: {
        marginTop: 50,
        marginBottom: 20,
    },

    modal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    modalPressable: {
        backgroundColor: THEME.background,
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        borderColor: "#ddd",
        borderWidth: 1,
        marginBottom: 10,
    },

    modalPressableSelected: {
        borderColor: THEME.primary,
        borderWidth: 2,
    },

    modalScrollView: {
        maxHeight: 200,
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
    label: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },

    Button: {
        backgroundColor: THEME.primary,
        flexDirection: "row",
        gap: 10,
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

    Textarea: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginTop: 8,
        marginBottom: 10,
    },
});
