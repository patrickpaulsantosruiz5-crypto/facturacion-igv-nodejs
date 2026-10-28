// prueba_facturacion.js
// Ejecuta el módulo y muestra boleta, factura y verificación matemática.

const { calcularTotales, generarComprobante } = require("./facturacion.js");

// Carrito del ejemplo: suma exactamente 300 soles.
const carrito = [
    { nombre: "Polo",       precio: 50,  cantidad: 2 }, // 100
    { nombre: "Pantalón",   precio: 100, cantidad: 1 }, // 100
    { nombre: "Zapatillas", precio: 100, cantidad: 1 }, // 100
];                                                       // total: 300

const cliente = { nombre: "María López", ruc: "20123456789" };

// --- BOLETA: solo el total a pagar ---
console.log("\n===== BOLETA =====");
console.log(generarComprobante({ cliente, carrito, tipo: "boleta" }));

// --- FACTURA: desglose subtotal + IGV + total ---
console.log("\n===== FACTURA =====");
console.log(generarComprobante({ cliente, carrito, tipo: "factura" }));

// --- VERIFICACIÓN MATEMÁTICA ---
console.log("\n===== VERIFICACIÓN =====");
const { total, subtotal, igv } = calcularTotales(carrito);
console.log(`Total:    S/ ${total.toFixed(2)}`);
console.log(`Subtotal: S/ ${subtotal.toFixed(2)}`);  // 300 / 1.18 = 254.24
console.log(`IGV 18%:  S/ ${igv.toFixed(2)}`);       // 300 − 254.24 = 45.76
console.log(
    `¿Subtotal + IGV = Total? ${
        (subtotal + igv).toFixed(2) === total.toFixed(2) ? "SÍ ✔" : "NO ✘"
    }`
);