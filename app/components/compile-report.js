import * as Print from "expo-print";
import Handlebars from "handlebars";
import { Alert } from "react-native";

/**
 * CompileReport compatible con versiones legacy y nuevas de expo-file-system.
 * - reportTemplate: string Handlebars
 * - reportData: objeto con datos
 * - fileName: nombre sin extensión (se añade .pdf)
 */
export default async function CompileReport({ reportTemplate, reportData, fileName }) {
    if (!reportTemplate) {
        Alert.alert("Error", "La plantilla del reporte no existe.");
        return;
    }

    const template = Handlebars.compile(reportTemplate);
    const html = template(reportData);

    // 1) Generar PDF temporal (nombre que pone el sistema)
    const pdf = await Print.printToFileAsync({
        html,
        base64: false,
    });

    try {
        // Intentar usar la API nueva (expo-file-system que exporte File y Directory)
        const fs = require("expo-file-system");

        // Si existen File y Directory en el export, usamos la API nueva
        if (fs.File && fs.Directory) {
            const { File, Directory } = fs;
            const documentsDir = await Directory.documentDirectory(); // Directory object
            const finalFile = documentsDir.file(`${fileName}.pdf`);
            const tempFile = new File(pdf.uri);
            await tempFile.move(finalFile);
            return { filePath: finalFile.uri };
        }

        // Si no llegamos aquí, proseguimos al fallback legacy
    } catch (err) {
        // continúa al fallback; no hacemos nada aquí porque puede lanzar en algunas versiones
        console.log("No se pudo usar API nueva de expo-file-system:", err?.message || err);
    }

    // --- FALLBACK LEGACY: usar documentDirectory / moveAsync ---
    try {
        // Import dinámico del módulo legacy (algunas versiones requieren este path)
        // Primero intento importar la ruta "legacy" explícita; si falla, uso el módulo normal.
        let FileSystem;
        try {
            FileSystem = require("expo-file-system/legacy");
        } catch (_) {
            // si no existe el subpath, importo el módulo estándar (versión antigua)
            FileSystem = require("expo-file-system");
        }

        // Validar que documentDirectory exista
        if (!FileSystem.documentDirectory) {
            throw new Error("No se encontró documentDirectory en expo-file-system instalado.");
        }

        const newPath = `${FileSystem.documentDirectory}${fileName}.pdf`;

        // moveAsync puede estar deprecado en algunos SDK pero funcionará en versiones legacy
        if (typeof FileSystem.moveAsync === "function") {
            await FileSystem.moveAsync({ from: pdf.uri, to: newPath });
        } else if (typeof FileSystem.copyAsync === "function" && typeof FileSystem.deleteAsync === "function") {
            // fallback extra: copiar y borrar
            await FileSystem.copyAsync({ from: pdf.uri, to: newPath });
            await FileSystem.deleteAsync(pdf.uri, { idempotent: true });
        } else {
            throw new Error("La API de movimiento/copia no está disponible en expo-file-system.");
        }

        return { filePath: newPath };
    } catch (err) {
        console.error("Error moviendo/renombrando el PDF:", err);
        Alert.alert("Error", `No se pudo guardar el PDF: ${err.message || err}`);
        throw err;
    }
}
