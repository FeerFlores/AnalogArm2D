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
}

void draw() {
  float r = map(vx_esc, -50, 50, 0, 255);
  float g = 100;
  float b = map(vy_esc, -50, 50, 0, 255);
  background(r, g, b);

  angle1 = (vx_esc / 50.0) * (-PI / 2);
  angle2 = (vy_esc / 50.0) * (PI / 2);

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

// Método llamado desde JavaScript para actualizar el joystick
public void updateJoystick(int vx, int vy) {
  vx_esc = vx;
  vy_esc = vy;
}
