import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

export default function DateInput({ inputDate, onDateChange }) {
    const [date, setDate] = useState(inputDate || new Date());
    const [showPicker, setShowPicker] = useState(false);

    const formattedDate = date
        ? date.toISOString().split("T")[0] // yyyy-mm-dd
        : "";

    return (
        <View>
            <Pressable onPress={() => setShowPicker(true)}>
                <TextInput
                    value={formattedDate}
                    placeholder="YYYY-MM-DD"
                    editable={false}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 10,
                        borderRadius: 6,
                    }}
                />
            </Pressable>

            {showPicker && (
                <DateTimePicker
                    mode="date"
                    value={date || new Date()}
                    onChange={(event, selectedDate) => {
                        setShowPicker(false);

                        if (selectedDate) {
                            setDate(selectedDate);
                            onDateChange?.(selectedDate);
                        }
                    }}
                />
            )}
        </View>
    );
}
