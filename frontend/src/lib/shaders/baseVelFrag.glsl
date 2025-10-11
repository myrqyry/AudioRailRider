precision highp float;
varying vec2 vUv;

uniform sampler2D prevVel;
uniform sampler2D prevPos;
uniform float dt;
uniform float time;

uniform float audioForce;
uniform float subBass;
uniform float bass;
uniform float lowMid;
uniform float mid;
uniform float highMid;
uniform float treble;
uniform float sparkle;
uniform float neuralGain;
uniform float resonanceFloor;
uniform float consciousnessPersistence;
uniform float consciousnessDrive;

// Lightweight fallback noise/curl functions (used when LYGIA isn't available)
vec3 hash3(vec2 p) {
  vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)));
  return fract(sin(q) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec3 a = hash3(i + vec2(0.0, 0.0));
  vec3 b = hash3(i + vec2(1.0, 0.0));
  vec3 c = hash3(i + vec2(0.0, 1.0));
  vec3 d = hash3(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a.x, b.x, u.x), mix(c.x, d.x, u.x), u.y);
}

uniform float noiseScale;
uniform float noiseSpeed;
uniform float curlStrength;

vec3 curlNoise(vec3 p) {
  float n1 = noise(p.xy * noiseScale + time * noiseSpeed);
  float n2 = noise(p.yz * noiseScale + time * noiseSpeed * 1.1);
  float n3 = noise(p.zx * noiseScale + time * noiseSpeed * 0.95);
  // simple pseudo-curl using neighboring noise samples
  return normalize(vec3(n2 - n3, n3 - n1, n1 - n2));
}

void main() {
  vec3 v = texture2D(prevVel, vUv).rgb;
  vec3 p = texture2D(prevPos, vUv).rgb;

  vec3 accel = vec3(0.0, -0.98, 0.0);
  v += accel * dt;

  float bandPulse = clamp((sin(time * 10.0 + vUv.x * 50.0) * 0.5 + 0.5), 0.0, 1.0);
  float audio = bandPulse * audioForce;
  audio += subBass * 3.0;
  audio += bass * 2.0;
  audio += lowMid * 1.4;
  audio += mid * 1.2;
  audio += highMid * 1.0;
  audio += treble * 0.8;
  audio += sparkle * 0.6;
  v.y += audio * 2.5;

  float harmonicEnergy = max(resonanceFloor, subBass * 0.6 + bass * 0.8 + mid * 0.5 + sparkle * 0.35);
  float neural = neuralGain * (audioForce * 0.12 + harmonicEnergy);
  float drive = clamp(consciousnessDrive, 0.0, 3.0);
  neural *= (0.6 + drive * 0.4);

  vec3 c = curlNoise(p + v * 0.35 + vec3(time * 0.1, 0.0, 0.0));
  v += c * curlStrength * (0.5 + harmonicEnergy * 0.6);
  v.y += neural * 1.8;
  v += normalize(c + vec3(0.0, harmonicEnergy * 0.4, 0.0)) * neural * 0.35;

  float damping = mix(0.982, 0.998, clamp(consciousnessPersistence, 0.0, 1.0));
  v *= damping;

  gl_FragColor = vec4(v, 1.0);
}
