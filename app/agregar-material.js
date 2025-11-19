import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function AgregarMaterialScreen() {
  const router = useRouter();

  const [materiales, setMateriales] = useState([
    { id: Date.now(), nombre: "", cantidad: "" },
  ]);

  const agregarFila = () => {
    setMateriales([
      ...materiales,
      { id: Date.now(), nombre: "", cantidad: "" },
    ]);
  };

  const eliminarFila = (id) => {
    setMateriales(materiales.filter((m) => m.id !== id));
  };

  const actualizarCampo = (id, campo, valor) => {
    setMateriales(
      materiales.map((m) =>
        m.id === id ? { ...m, [campo]: valor } : m
      )
    );
  };

  const guardarMateriales = async () => {
    const vacios = materiales.some(
      (m) => !m.nombre.trim() || !m.cantidad.trim()
    );

    if (vacios) {
      Alert.alert("Error", "Todos los materiales deben tener nombre y cantidad");
      return;
    }

    try {
      const datos = await AsyncStorage.getItem("materiales");
      const guardados = datos ? JSON.parse(datos) : [];

      const nuevos = [...guardados, ...materiales];

      await AsyncStorage.setItem("materiales", JSON.stringify(nuevos));

      Alert.alert("Éxito", "Materiales guardados correctamente");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo guardar los materiales");
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

        <View style={{ width: 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Agregar materiales</Text>

        {materiales.map((item) => (
          <View key={item.id} style={styles.materialContainer}>
            <Text style={styles.label}>Nombre del material</Text>
            <TextInput
              style={styles.input}
              value={item.nombre}
              onChangeText={(t) => actualizarCampo(item.id, "nombre", t)}
            />

            <Text style={styles.label}>Cantidad</Text>
            <TextInput
              style={styles.input}
              value={item.cantidad}
              onChangeText={(t) => actualizarCampo(item.id, "cantidad", t)}
              keyboardType="numeric"
            />

            {/* Botón eliminar */}
            <Pressable
              style={styles.deleteButton}
              onPress={() => eliminarFila(item.id)}
            >
              <Text style={styles.deleteText}>Eliminar</Text>
            </Pressable>
          </View>
        ))}

        {/* Botón añadir otro material */}
        <Pressable style={styles.addButton} onPress={agregarFila}>
          <Ionicons name="add-circle-outline" size={24} color="#1976D2" />
          <Text style={styles.addButtonText}>Agregar otro material</Text>
        </Pressable>

        {/* Guardar */}
        <Pressable style={styles.saveButton} onPress={guardarMateriales}>
          <Text style={styles.saveText}>Guardar</Text>
        </Pressable>

        {/* Cancelar */}
        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
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

  materialContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },

  label: {
    marginTop: 10,
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

  deleteButton: {
    marginTop: 15,
    paddingVertical: 8,
    backgroundColor: "#d32f2f",
    borderRadius: 6,
    alignItems: "center",
  },

  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },

  addButtonText: {
    marginLeft: 8,
    color: "#1976D2",
    fontSize: 15,
    fontWeight: "600",
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
    marginBottom: 50,
  },

  cancelText: {
    color: "#1976D2",
    fontSize: 16,
    fontWeight: "600",
  },
});
