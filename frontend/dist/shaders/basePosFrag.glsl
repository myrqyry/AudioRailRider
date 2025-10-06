precision highp float; varying vec2 vUv;
uniform sampler2D prevPos; uniform sampler2D velTex; uniform float dt;
void main(){
  vec3 p = texture2D(prevPos, vUv).rgb;
  vec3 v = texture2D(velTex, vUv).rgb;
  p += v * dt;
  // bounds
  if (p.y < -100.0) p.y = -9999.0;
  gl_FragColor = vec4(p, 1.0);
}
