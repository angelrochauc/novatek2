import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../theme/light.js";

export default function ImagePickerComponent({ inputImages, maxImages = 5, onImagesChange }) {
    const [images, setImages] = useState(inputImages || []);
    const [loading, setLoading] = useState(false);

    const requestPermissions = async (type) => {
        if (type === "camera") {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Required", "Camera permission is needed to take photos.");
                return false;
            }
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Required", "Gallery permission is needed to select photos.");
                return false;
            }
        }
        return true;
    };

    const handleImageResult = (result) => {
        if (!result.canceled && result.assets?.length > 0) {
            const newImages = result.assets.map((asset) => ({
                uri: asset.uri,
                base64: asset.base64,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            }));

            const updatedImages = [...images, ...newImages].slice(0, maxImages);
            setImages(updatedImages);
            console.log("Selected Images: ", updatedImages);
            onImagesChange?.(updatedImages);
        }
    };

    const takePhoto = async () => {
        if (images.length >= maxImages) {
            Alert.alert("Limit Reached", `You can only add up to ${maxImages} images.`);
            return;
        }

        const hasPermission = await requestPermissions("camera");
        if (!hasPermission) return;

        setLoading(true);
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                base64: true,
            });
            handleImageResult(result);
        } catch (error) {
            Alert.alert("Error", "Failed to take photo. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const pickFromGallery = async () => {
        if (images.length >= maxImages) {
            Alert.alert("Limit Reached", `You can only add up to ${maxImages} images.`);
            return;
        }

        const hasPermission = await requestPermissions("gallery");
        if (!hasPermission) return;

        setLoading(true);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsMultipleSelection: true,
                selectionLimit: maxImages - images.length,
                allowsEditing: false,
                quality: 0.8,
            });
            handleImageResult(result);
        } catch (error) {
            Alert.alert("Error", "Failed to select images. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const removeImage = (id) => {
        const updatedImages = images.filter((img) => img.id !== id);
        setImages(updatedImages);
        onImagesChange?.(updatedImages);
    };

    const showOptions = () => {
        Alert.alert("Add Photo", "Choose an option", [
            { text: "Take Photo", onPress: takePhoto },
            { text: "Choose from Gallery", onPress: pickFromGallery },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    const renderImageItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(item.id)}>
                <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Subir Fotos</Text>
            <Text style={styles.subtitle}>
                {images.length}/{maxImages} imágenes seleccionadas
            </Text>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            )}

            {images.length > 0 && <FlatList data={images} renderItem={renderImageItem} keyExtractor={(item) => item.id} horizontal showsHorizontalScrollIndicator={false} style={styles.imageList} contentContainerStyle={styles.imageListContent} />}

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={takePhoto} disabled={loading || images.length >= maxImages}>
                    <FontAwesome name="camera" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Cámara</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.galleryButton]} onPress={pickFromGallery} disabled={loading || images.length >= maxImages}>
                    <FontAwesome name="image" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Galería</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.addButton, (loading || images.length >= maxImages) && styles.disabledButton]} onPress={showOptions} disabled={loading || images.length >= maxImages}>
                <Text style={styles.addButtonText}>+ Agregar Foto</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 16,
    },
    loadingContainer: {
        padding: 20,
        alignItems: "center",
    },
    imageList: {
        marginBottom: 16,
    },
    imageListContent: {
        gap: 12,
    },
    imageContainer: {
        position: "relative",
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeButton: {
        position: "absolute",
        top: -8,
        right: -8,
        backgroundColor: "#FF3B30",
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    removeButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12,
    },
    button: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 14,
        borderRadius: 10,
        gap: 8,
    },
    cameraButton: {
        backgroundColor: THEME.primary,
    },
    galleryButton: {
        backgroundColor: THEME.secondary,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    addButton: {
        backgroundColor: "#F2F2F7",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#007AFF",
        borderStyle: "dashed",
    },
    addButtonText: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
    },
    disabledButton: {
        opacity: 0.5,
    },
});
