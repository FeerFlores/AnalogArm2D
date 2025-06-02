import processing.serial.*;

Serial myPort;
int vx_esc = 0;
int vy_esc = 0;

float x, y;
float angle1 = 0.0;
float angle2 = 0.0;
float segLength = 100;

void setup() {
  size(640, 360);
  strokeWeight(30);
  stroke(255, 160);
  
  x = width * 0.3;
  y = height * 0.5;

  println(Serial.list());             // Print available serial ports in console
  myPort = new Serial(this, Serial.list()[0], 115200);
}

void draw() {
  // Map joystick X (–50..50) to red component (0..255)
  float r = map(vx_esc, -50, 50, 0, 255);
  // Keep green fixed at 100
  float g = 100;
  // Map joystick Y (–50..50) to blue component (0..255)
  float b = map(vy_esc, -50, 50, 0, 255);
  background(r, g, b);

  // Read new serial data if available
  if (myPort.available() > 0) {
    String inString = myPort.readStringUntil('\n');
    if (inString != null) {
      inString = trim(inString);
      String[] parts = split(inString, ',');
      if (parts.length == 2) {
        try {
          vx_esc = int(parts[0]);
          vy_esc = int(parts[1]);
        } catch (NumberFormatException e) {
          // Ignore malformed lines
        }
      }
    }
  }
  
  // Convert scaled joystick (–50..50) to angles (–PI/2..+PI/2)
  angle1 = (vx_esc / 50.0) * (-PI/2);
  angle2 = (vy_esc / 50.0) * ( PI/2);

  // Draw two-segment arm
  pushMatrix();
    segment(x, y, angle1);
    segment(segLength, 0, angle2);
  popMatrix();
}

void segment(float x, float y, float a) {
  translate(x, y);
  rotate(a);
  line(0, 0, segLength, 0);
}

