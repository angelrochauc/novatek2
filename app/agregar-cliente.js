import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function AgregarClienteScreen() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [responsable, setResponsable] = useState("");

  const guardarCliente = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre del cliente es obligatorio");
      return;
    }

    const nuevoCliente = {
      id: Date.now(),
      nombre,
      direccion,
      telefono,
      responsable,
    };

    try {
      const datos = await AsyncStorage.getItem("clientes");
      const clientesGuardados = datos ? JSON.parse(datos) : [];

      clientesGuardados.push(nuevoCliente);

      await AsyncStorage.setItem("clientes", JSON.stringify(clientesGuardados));

      Alert.alert("Éxito", "Cliente guardado correctamente");
      router.back();

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo guardar el cliente");
    }
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </Pressable>

        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        />

        {/* Espacio vacío para centrar el logo */}
        <View style={{ width: 30 }} />
      </View>

      <Text style={styles.title}>Agregar un cliente</Text>

      <Text style={styles.label}>Nombre del cliente</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Dirección</Text>
      <TextInput style={styles.input} value={direccion} onChangeText={setDireccion} />

      <Text style={styles.label}>Teléfono</Text>
      <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />

      <Text style={styles.label}>Responsable</Text>
      <TextInput style={styles.input} value={responsable} onChangeText={setResponsable} />

      <Pressable style={styles.saveButton} onPress={guardarCliente}>
        <Text style={styles.saveText}>Guardar</Text>
      </Pressable>

      <Pressable style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </Pressable>

    </View>
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
    height: 80,
    backgroundColor: "#1976D2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },

  backButton: {
    padding: 5,
  },

   logo: {
    width: 400,
    height: 120,
    resizeMode: "contain",
  },

  title: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },

  label: {
    marginTop: 20,
    fontSize: 13,
    color: "#555",
  },

  input: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
  },

  saveButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 12,
    marginTop: 30,
    borderRadius: 8,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  cancelButton: {
    borderWidth: 1,
    borderColor: "#1976D2",
    paddingVertical: 12,
    marginTop: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  cancelText: {
    color: "#1976D2",
    fontSize: 16,
    fontWeight: "600",
  },
});
