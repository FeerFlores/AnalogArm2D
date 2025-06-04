// -----------------------------------------------------------------------------
// Archivo: js/serial.js
// Descripción: Lógica de conexión al puerto serie mediante Web Serial API.
//              Lee líneas "vx,vy\n" y las envía al sketch de Processing.js
//              invocando la función updateJoystick(vx, vy).
// -----------------------------------------------------------------------------

// 1) Cachear elementos del DOM para no buscarlos varias veces
const btnConnect = document.getElementById('btnConnect');
const logPanel  = document.getElementById('log');

// 2) Variable que contendrá la instancia de Processing.js
let pjsInstance = null;

// 3) Listener al botón "Conectar Serial"
btnConnect.addEventListener('click', async () => {
  // Verificar que el navegador soporta la Web Serial API
  if (!('serial' in navigator)) {
    logPanel.textContent += "❌ Este navegador NO soporta Web Serial API.\n";
    return;
  }

  try {
    // 3.1) Pedir permiso para seleccionar un puerto
    const port = await navigator.serial.requestPort();
    // 3.2) Abrir el puerto a 115200 baudios
    await port.open({ baudRate: 115200 });

    logPanel.textContent += "✅ Puerto serial abierto a 115200 baudios.\n";

    // 3.3) Crear TextDecoderStream para decodificar bytes a texto UTF-8
    const textDecoder = new TextDecoderStream();
    // Conectar el stream de lectura del puerto al decodificador
    port.readable.pipeTo(textDecoder.writable);
    // Obtener un reader (lector) de texto
    const reader = textDecoder.readable.getReader();

    // 3.4) Obtener la instancia de Processing.js vinculada al <canvas id="canvas1">
    // NOTA: es posible que Processing.js tarde un momento en inicializar;
    //       repetiremos hasta que la instancia no sea null.
    do {
      pjsInstance = Processing.getInstanceById('canvas1');
      // Si no está lista, esperar 100 ms antes de volver a consultar
      if (!pjsInstance) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } while (!pjsInstance);

    logPanel.textContent += "✅ Instancia de Processing.js lista.\n";

    // 3.5) Bucle infinito de lectura de datos seriales
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // Si el puerto se cerró o el flujo terminó, salimos del bucle.
        logPanel.textContent += "⚠️ El puerto serie se cerró.\n";
        break;
      }
      if (!value) continue; // No hay texto en este chunk

      // Acumular datos en el buffer
      buffer += value;
      // Sepapar en líneas usando '\n'
      const lines = buffer.split('\n');
      // El último elemento puede estar incompleto; lo dejamos en buffer
      buffer = lines.pop();

      // Procesar cada línea completa
      for (let line of lines) {
        line = line.trim();
        if (line === '') continue; // Línea vacía: ignorar

        // Se espera un formato "vx,vy", por ejemplo: "-30,15"
        const parts = line.split(',');
        if (parts.length !== 2) {
          console.warn("📥 Línea con formato inesperado:", line);
          continue;
        }

        // Intentar convertir a enteros
        let vx, vy;
        try {
          vx = parseInt(parts[0].trim(), 10);
          vy = parseInt(parts[1].trim(), 10);
        } catch (err) {
          console.warn("📥 No se pudieron parsear a int:", line);
          continue;
        }

        // Clamamos al sketch de Processing.js: updateJoystick(vx, vy)
        // Para ello, nos aseguramos de que la función exista
        if (pjsInstance && typeof pjsInstance.updateJoystick === 'function') {
          pjsInstance.updateJoystick(vx, vy);
        } else {
          console.warn("⚠️ updateJoystick() no está disponible todavía.");
        }

        // Mostrar en el log web los valores recibidos (opcional)
        logPanel.textContent = `Joystick → X: ${vx}   Y: ${vy}\n` + logPanel.textContent;
        // Mantener el scroll arriba para ver siempre la última lectura
        logPanel.scrollTop = 0;
      }
    }

    // Cuando salgamos del bucle, cerrar el lector y el puerto
    reader.releaseLock();
    await port.close();
    logPanel.textContent += "✅ Puerto serie cerrado.\n";

  } catch (err) {
    logPanel.textContent += `❌ Error: ${err.message}\n`;
    console.error(err);
  }
});
