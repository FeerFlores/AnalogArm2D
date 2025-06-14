# Analog Arm 2D

A project that uses an analog joystick connected to a **Dual MCU** to control a 2D two-segment arm in Processing. The joystick’s X/Y position not only moves the arm but also dynamically changes the background color of the window.
<div align="center">
<a href='https://postimages.org/' target='_blank'><img src='https://i.postimg.cc/zG9ymHgw/brazo-robotico.gif' border='0' alt='brazo-robotico' width="200px"/></a>
</div>

---

## Objectives

- Read two ADC channels from an analog joystick on a Dual MCU (RP2040) using MicroPython.  
- Calibrate the joystick’s center position to eliminate offset.  
- Send scaled joystick values (–50 to +50) over USB serial (CDC).  
- In Processing, receive those serial values and draw a 2D two-segment arm whose angles correspond to the joystick position.  
- Change the background color dynamically based on the arm’s orientation (joystick values).

---

## Requirements

1. **Hardware**  
   - [Dual MCU](https://uelectronics.com/producto/unit-dualmcu-esp32-rp2040-tarjeta-de-desarrollo/)  
   - Analog [Joystick module](https://uelectronics.com/producto/joystick-ejexy-ky-023/) connected to two ADC pins (for X and Y axes).  
   - USB Micro-B cable to connect the Dual MCU - RP2040 to your computer.

2. **Software for the Pico (MicroPython)**  
   - MicroPython firmware installed on the Dual MCU - RP2040.  
   - Thonny (or another compatible IDE) to upload `main.py` onto the device.

3. **Software on the PC**  
   - Processing 4.x (download from [processing.org](https://processing.org)).  
   - The built-in Serial library in Processing (bundled with Processing).

---

## Installation & Usage

### 1. Configure the Dual MCU

1. Connect the joystick’s X-axis pin to GPIO29 (ADC channel 3) and the Y-axis pin to GPIO27 (ADC channel 1).  
2. Open **Thonny** (or your preferred MicroPython IDE) and select **MicroPython (Raspberry Pi Pico)** as the interpreter.  
3. Create a new file named `main.py` (in the `MicroPython/` folder) and paste the contents of `MicroPython/main.py` (see below).  
4. Save the file directly onto the Pico (File → Save as… → “This computer” → “Raspberry Pi Pico” → `main.py`).  
5. After saving, the Dual MCU will automatically reboot and begin printing scaled joystick values (`vx,vy`) over USB serial every 50 ms.

### 2. Run the Processing Sketch

1. Open Processing and load `Processing/arm.pde`.  
2. In the **Processing console**, you will see something like:

[0] COM3

[1] COM4

> (the exact labels depend on your OS and connected devices).  

3. Identify which index corresponds to your Dual’s USB serial port (e.g., `[0]` or `[1]`).  
4. In `arm.pde`, locate the line:

```java
myPort = new Serial(this, Serial.list()[0], 115200);
```

and replace [0] with the correct index for your RP2040.

5. Press the ▶ Run button. A window will open showing a two-segment arm. Moving the joystick on the Dual MCU will rotate the arm segments in real time, and the background color will change based on the joystick’s X (red component) and Y (blue component) values.







