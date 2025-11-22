import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Checkbox({ label, checked = false, onChange, disabled = false, size = 24, color = "#007AFF" }) {
    const [isChecked, setIsChecked] = useState(checked);

    const handlePress = () => {
        if (disabled) return;
        const newValue = !isChecked;
        setIsChecked(newValue);
        onChange?.(newValue);
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7} disabled={disabled}>
            <View style={[styles.checkbox, { width: size, height: size, borderRadius: size * 0.15 }, isChecked && { backgroundColor: color, borderColor: color }, disabled && styles.disabled]}>{isChecked && <Text style={[styles.checkmark, { fontSize: size * 0.6 }]}>✓</Text>}</View>
            {label && <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    checkbox: {
        borderWidth: 2,
        borderColor: "#C4C4C4",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
    },
    checkmark: {
        color: "#FFF",
        fontWeight: "bold",
    },
    label: {
        marginLeft: 10,
        fontSize: 16,
        color: "#333",
    },
    disabled: {
        opacity: 0.5,
    },
    labelDisabled: {
        color: "#999",
    },
});

// Ejemplo de uso:
// <Checkbox
//   label="Acepto los términos"
//   onChange={(value) => console.log(value)}
//   color="#6200EE"
// />
