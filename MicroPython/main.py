from machine import ADC
import time

# ADC pins: VX on GPIO29 (ADC3), VY on GPIO27 (ADC1)
adc_vx = ADC(3)  # GPIO29
adc_vy = ADC(1)  # GPIO27

def calibrar_joystick():
    suma_vx = 0
    suma_vy = 0
    muestras = 100
    for _ in range(muestras):
        suma_vx += adc_vx.read_u16()
        suma_vy += adc_vy.read_u16()
        time.sleep_ms(10)
    offset_vx = suma_vx // muestras
    offset_vy = suma_vy // muestras
    return offset_vx, offset_vy

def leer_joystick(offset_vx, offset_vy):
    vx = adc_vx.read_u16() - offset_vx
    vy = adc_vy.read_u16() - offset_vy
    return vx, vy

def escalar(valor, max_valor=30000, rango=50):
    valor = max(min(valor, max_valor), -max_valor)
    return round((valor / max_valor) * rango)

offset_vx, offset_vy = calibrar_joystick()
time.sleep(1)

while True:
    vx, vy = leer_joystick(offset_vx, offset_vy)
    vx_esc = escalar(vx)
    vy_esc = escalar(vy)
    print(f"{vx_esc},{vy_esc}")
    time.sleep(0.05)  # 50 ms → ~20 FPS
