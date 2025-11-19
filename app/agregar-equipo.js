import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AgregarEquipoScreen() {
  const router = useRouter();

  const [nombreEquipo, setNombreEquipo] = useState("");

  const guardarEquipo = async () => {
    if (!nombreEquipo.trim()) {
      Alert.alert("Error", "El nombre del equipo es obligatorio");
      return;
    }

    const nuevoEquipo = {
      id: Date.now(),
      nombre: nombreEquipo,
    };

    try {
      const datos = await AsyncStorage.getItem("equipos");
      const equiposGuardados = datos ? JSON.parse(datos) : [];

      equiposGuardados.push(nuevoEquipo);

      await AsyncStorage.setItem("equipos", JSON.stringify(equiposGuardados));

      Alert.alert("Éxito", "Equipo guardado correctamente");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo guardar el equipo");
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

        {/* espacio para centrar el logo */}
        <View style={{ width: 30 }} />
      </View>

      {/* TÍTULO */}
      <Text style={styles.title}>Agregar un equipo</Text>

      {/* INPUT */}
      <Text style={styles.label}>Nombre del equipo</Text>
      <TextInput
        style={styles.input}
        value={nombreEquipo}
        onChangeText={setNombreEquipo}
        placeholder="Ingresa el nombre"
      />

      {/* BOTÓN GUARDAR */}
      <Pressable style={styles.saveButton} onPress={guardarEquipo}>
        <Text style={styles.saveText}>Guardar</Text>
      </Pressable>

      {/* BOTÓN CANCELAR */}
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
