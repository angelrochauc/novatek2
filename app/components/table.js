import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Table({ headers = [], data = [], onDataChange, headerStyle = {}, rowStyle = {}, cellStyle = {}, striped = false, borderColor = "#E0E0E0", headerBgColor = "#F5F5F5", stripedColor = "#FAFAFA", fullWidth = false }) {
    useEffect(() => {
        setRows(data);
    }, [data]);

    const [rows, setRows] = React.useState(data);
    const keys = headers.map((h) => h.key);

    const handleDeleteRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
        onDataChange?.(newRows);
    };

    const getCellWidth = (index) => {
        if (fullWidth) return { flex: 1 };
        return { width: headers[index]?.width || 120 };
    };

    const Wrapper = fullWidth ? View : ScrollView;
    const wrapperProps = fullWidth ? {} : { horizontal: true, showsHorizontalScrollIndicator: false };

    return (
        <Wrapper {...wrapperProps}>
            <View style={[styles.table, { borderColor }, fullWidth && { width: "100%" }]}>
                {/* Header */}
                <View style={[styles.row, styles.headerRow, { backgroundColor: headerBgColor }]}>
                    {headers.map((header, index) => (
                        <View key={index} style={[styles.cell, { borderColor, width: header.width || 120 }, headerStyle]}>
                            <Text style={[styles.headerText, header.textStyle]}>{header.title || header}</Text>
                        </View>
                    ))}
                </View>

                {/* Body */}
                {rows.map((row, rowIndex) => (
                    <TouchableOpacity key={rowIndex} activeOpacity={0.7} onPress={() => handleDeleteRow(rowIndex)} style={[styles.row, striped && rowIndex % 2 !== 0 && { backgroundColor: stripedColor }, rowStyle]}>
                        {keys.map((key, cellIndex) => (
                            <View key={cellIndex} style={[styles.cell, { borderColor }, getCellWidth(cellIndex), cellStyle]}>
                                <Text style={styles.cellText}>{row[key] ?? "-"}</Text>
                            </View>
                        ))}
                    </TouchableOpacity>
                ))}

                {/* Empty state */}
                {rows.length === 0 && (
                    <View style={[styles.row, styles.emptyRow]}>
                        <Text style={styles.emptyText}>Sin datos</Text>
                    </View>
                )}
            </View>
        </Wrapper>
    );
}

const styles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderRadius: 8,
        overflow: "hidden",
    },
    row: {
        flexDirection: "row",
    },
    headerRow: {
        borderBottomWidth: 2,
        borderBottomColor: "#208ddb34",
    },
    cell: {
        padding: 12,
        borderRightWidth: 1,
        justifyContent: "center",
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#333",
    },
    cellText: {
        fontSize: 14,
        color: "#666",
    },
    emptyRow: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        color: "#999",
        fontStyle: "italic",
    },
});
