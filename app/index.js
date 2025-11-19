import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {

  const router = useRouter(); // ← ESTA ES LA NAVEGACIÓN CORRECTA

  return (
    <View style={styles.container}>

      {/* CARD DEL LOGO */}
      <View style={styles.logoCard}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* BOTÓN DE AGREGAR CLIENTE */}
      <Pressable
        style={styles.cardButton}
        onPress={() => router.push("/agregar-cliente")}
      >
        <Ionicons name="person-add-outline" size={22} color="#1E88E5" />
        <Text style={styles.cardText}>Agregar un cliente</Text>
      </Pressable>

      <Pressable style={styles.cardButton}
        onPress={() => router.push("/agregar-equipo")}>
        <FontAwesome5 name="users" size={20} color="#1E88E5" />
        <Text style={styles.cardText}>Agregar equipo</Text>
      </Pressable>

      <Pressable  style={styles.cardButton}
        onPress={() => router.push("/agregar-material")}>
        <MaterialCommunityIcons name="file-document-edit" size={22} color="#1E88E5" />
        <Text style={styles.cardText}>Agregar material</Text>
      </Pressable>

      <Pressable style={styles.cardButton}>
        <MaterialCommunityIcons name="clipboard-text" size={22} color="#1E88E5" />
        <Text style={styles.cardText}>Formatos</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1976D2',
    alignItems: 'center',
    paddingTop: 60,
  },

  logoCard: {
    width: '85%',
    height: 90,
    backgroundColor: '#E3F2FD',
    borderRadius: 18,
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  logoImage: {
    width: '150%',
    height: '150%',
  },

  cardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "75%",
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  cardText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#0D47A1",
    fontWeight: "600",
  }
});
