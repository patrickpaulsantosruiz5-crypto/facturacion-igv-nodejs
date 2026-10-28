// facturacion.js
// Módulo de facturación con IGV INCLUIDO (Perú 18%).
// Patrón: lógica aquí + module.exports → se usa con require() desde otro archivo.

const TASA_IGV = 0.18; // Constante: si cambia el IGV, solo se toca esta línea.

// Redondea a 2 decimales (centavos) evitando errores de coma flotante de JS.
function redondear(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
}

// ===== CORAZÓN DEL EJERCICIO =====
// Recibe el carrito y devuelve { total, subtotal, igv }.
function calcularTotales(carrito) {
    // Validación: debe ser arreglo con al menos un producto.
    if (!Array.isArray(carrito) || carrito.length === 0) {
        throw new Error("El carrito debe tener al menos un producto");
    }

    // 1) TOTAL = suma de (precio × cantidad).
    const total = redondear(
        carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)
    );

    // 2) SUBTOTAL = Total / 1.18   ← se DIVIDE, no se multiplica por 0.18.
    const subtotal = redondear(total / (1 + TASA_IGV));

    // 3) IGV = Total − Subtotal (el 18% real, sobre el subtotal).
    const igv = redondear(total - subtotal);

    return { total, subtotal, igv };
}

// Formatea el comprobante según el tipo (boleta o factura).
function generarComprobante({ cliente, carrito, tipo }) {
    if (tipo !== "boleta" && tipo !== "factura") {
        throw new Error("El tipo debe ser 'boleta' o 'factura'");
    }

    const { total, subtotal, igv } = calcularTotales(carrito);
    const lineas = [];
    const sep = "=".repeat(43);
    const guion = "-".repeat(43);

    // --- Cabecera ---
    lineas.push(sep);
    lineas.push(`          ${tipo.toUpperCase()}`);
    lineas.push(sep);
    lineas.push(`Cliente: ${cliente.nombre}`);
    if (tipo === "factura" && cliente.ruc) {
        lineas.push(`RUC:     ${cliente.ruc}`);
    }
    lineas.push(guion);

    // --- Detalle de productos ---
    for (const p of carrito) {
        const importe = p.precio * p.cantidad;
        lineas.push(
            `${p.cantidad} x ${p.nombre.padEnd(15)} ` +
            `S/ ${importe.toFixed(2).padStart(7)}`
        );
    }
    lineas.push(guion);

    // --- Totales ---
    // DIFERENCIA CLAVE: factura desglosa, boleta solo muestra el total.
    if (tipo === "factura") {
        lineas.push(`Subtotal (sin IGV):  S/ ${subtotal.toFixed(2).padStart(7)}`);
        lineas.push(`IGV (18%):           S/ ${igv.toFixed(2).padStart(7)}`);
    }
    lineas.push(`TOTAL A PAGAR:       S/ ${total.toFixed(2).padStart(7)}`);
    lineas.push(sep);

    return lineas.join("\n");
}

// Exporta lo que otros archivos pueden usar con require().
module.exports = { calcularTotales, generarComprobante, TASA_IGV };