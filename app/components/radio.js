import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RadioButton({ selected = false, label, onPress, disabled = false, size = 24, color = "#007AFF" }) {
    return (
        <TouchableOpacity style={styles.radioContainer} onPress={onPress} activeOpacity={0.7} disabled={disabled}>
            <View style={[styles.radio, { width: size, height: size, borderRadius: size / 2 }, selected && { borderColor: color }, disabled && styles.disabled]}>
                {selected && (
                    <View
                        style={[
                            styles.radioDot,
                            {
                                width: size * 0.5,
                                height: size * 0.5,
                                borderRadius: size * 0.25,
                                backgroundColor: color,
                            },
                        ]}
                    />
                )}
            </View>
            {label && <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>}
        </TouchableOpacity>
    );
}

export function RadioGroup({ options = [], value, onChange, disabled = false, size = 24, color = "#007AFF" }) {
    const [selected, setSelected] = useState(value);

    const handleSelect = (optionValue) => {
        if (disabled) return;
        setSelected(optionValue);
        onChange?.(optionValue);
    };

    return (
        <View style={styles.groupContainer}>
            {options.map((option) => (
                <RadioButton key={option.value} label={option.label} selected={selected === option.value} onPress={() => handleSelect(option.value)} disabled={disabled || option.disabled} size={size} color={color} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    radioContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    radio: {
        borderWidth: 2,
        borderColor: "#C4C4C4",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
    },
    radioDot: {
        // estilos dinámicos aplicados inline
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
    groupContainer: {
        flexDirection: "column",
    },
});

// Ejemplo de uso individual:
// <RadioButton
//   label="Opción A"
//   selected={true}
//   onPress={() => console.log('pressed')}
// />

// Ejemplo de uso con RadioGroup:
// const opciones = [
//   { label: 'Masculino', value: 'male' },
//   { label: 'Femenino', value: 'female' },
//   { label: 'Otro', value: 'other' },
// ];
//
// <RadioGroup
//   options={opciones}
//   value="male"
//   onChange={(val) => console.log(val)}
//   color="#6200EE"
// />
