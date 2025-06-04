const btnConnect = document.getElementById('btnConnect');
const logPanel  = document.getElementById('log');
let pjsInstance = null;

btnConnect.addEventListener('click', async () => {
  if (!('serial' in navigator)) {
    logPanel.textContent += "❌ Este navegador NO soporta Web Serial API.\n";
    return;
  }

  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    logPanel.textContent += "✅ Puerto serial abierto a 115200 baudios.\n";

    const textDecoder = new TextDecoderStream();
    port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    do {
      pjsInstance = Processing.getInstanceById('canvas1');
      if (!pjsInstance) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } while (!pjsInstance);

    logPanel.textContent += "✅ Instancia de Processing.js lista.\n";

    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        logPanel.textContent += "⚠️ El puerto serie se cerró.\n";
        break;
      }
      if (!value) continue;

      buffer += value;
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (let line of lines) {
        line = line.trim();
        if (line === '') continue;

        const parts = line.split(',');
        if (parts.length !== 2) continue;

        let vx = parseInt(parts[0].trim(), 10);
        let vy = parseInt(parts[1].trim(), 10);

        if (!isNaN(vx) && !isNaN(vy) && pjsInstance && typeof pjsInstance.updateJoystick === 'function') {
          pjsInstance.updateJoystick(vx, vy);
          logPanel.textContent = `Joystick → X: ${vx}   Y: ${vy}\n` + logPanel.textContent;
          logPanel.scrollTop = 0;
        }
      }
    }

    reader.releaseLock();
    await port.close();
    logPanel.textContent += "✅ Puerto serie cerrado.\n";

  } catch (err) {
    logPanel.textContent += `❌ Error: ${err.message}\n`;
    console.error(err);
  }
});
