// [resolve] missing include: lygia/generative/simplex.glsl
// begin include: lygia/generative/curl.glsl
#include "snoise.glsl"

/*
contributors: Isaac Cohen
description: https://github.com/cabbibo/glsl-curl-noise/blob/master/curl.glsl
use: curl(<vec3|vec4> pos)
examples:
    - /shaders/generative_curl.frag
*/

#ifndef FNC_CURL
#define FNC_CURL

#ifndef CURL_FNC
vec2 curl( vec2 p ) {
    const float e = .1;
    vec2 dx = vec2( e   , 0.0 );
    vec2 dy = vec2( 0.0 , e   );

    vec2 p_x0 = snoise2( p - dx );
    vec2 p_x1 = snoise2( p + dx );
    vec2 p_y0 = snoise2( p - dy );
    vec2 p_y1 = snoise2( p + dy );

    float x = p_x1.y + p_x0.y;
    float y = p_y1.x - p_y0.x;

    const float divisor = 1.0 / ( 2.0 * e );
    #ifndef CURL_UNNORMALIZED
    return normalize( vec2(x, y) * divisor );
    #else
    return vec2(x, y) * divisor;
    #endif
}
#else
vec2 curl( vec2 p ) {
    vec2 e = vec2(0.1, 0.0);
    vec3 pos = vec3(p, 0.0);
    vec2 C = vec2(  (CURL_FNC(pos+e.yxy)-CURL_FNC(pos-e.yxy))/(2.0*e.x),
                   -(CURL_FNC(pos+e.xyy)-CURL_FNC(pos-e.xyy))/(2.0*e.x));

    #ifndef CURL_UNNORMALIZED
    return normalize(C);
    #else
    float divisor = 1.0 / (2.0 * e.x);
    return C * divisor;
    #endif
}
#endif

vec3 curl( vec3 p ){
    const float e = .1;
    vec3 dx = vec3( e   , 0.0 , 0.0 );
    vec3 dy = vec3( 0.0 , e   , 0.0 );
    vec3 dz = vec3( 0.0 , 0.0 , e   );

    vec3 p_x0 = snoise3( p - dx );
    vec3 p_x1 = snoise3( p + dx );
    vec3 p_y0 = snoise3( p - dy );
    vec3 p_y1 = snoise3( p + dy );
    vec3 p_z0 = snoise3( p - dz );
    vec3 p_z1 = snoise3( p + dz );

    float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

    const float divisor = 1.0 / ( 2.0 * e );
    #ifndef CURL_UNNORMALIZED
    return normalize( vec3( x , y , z ) * divisor );
    #else
    return vec3( x , y , z ) * divisor;
    #endif
}

vec3 curl( vec4 p ){
    const float e = .1;
    vec4 dx = vec4( e   , 0.0 , 0.0 , 1.0 );
    vec4 dy = vec4( 0.0 , e   , 0.0 , 1.0 );
    vec4 dz = vec4( 0.0 , 0.0 , e   , 1.0 );

    vec3 p_x0 = snoise3( p - dx );
    vec3 p_x1 = snoise3( p + dx );
    vec3 p_y0 = snoise3( p - dy );
    vec3 p_y1 = snoise3( p + dy );
    vec3 p_z0 = snoise3( p - dz );
    vec3 p_z1 = snoise3( p + dz );

    float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
    float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
    float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

    const float divisor = 1.0 / ( 2.0 * e );
    #ifndef CURL_UNNORMALIZED
    return normalize( vec3( x , y , z ) * divisor );
    #else
    return vec3( x , y , z ) * divisor;
    #endif
}

#endif
// end include: lygia/generative/curl.glsl
// [resolve] missing include: lygia/color/palettes.glsl
precision highp float; varying vec2 vUv;
uniform sampler2D prevVel; uniform sampler2D prevPos; uniform float dt; uniform float time;
uniform float audioForce; uniform float bass; uniform float mid; uniform float treble;
// Lightweight fallback noise/curl functions (used when LYGIA isn't available)
vec3 hash3(vec2 p) {
  vec3 q = vec3( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)), dot(p,vec2(419.2,371.9)) );
  return fract(sin(q) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec3 a = hash3(i + vec2(0.0,0.0));
  vec3 b = hash3(i + vec2(1.0,0.0));
  vec3 c = hash3(i + vec2(0.0,1.0));
  vec3 d = hash3(i + vec2(1.0,1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a.x,b.x,u.x), mix(c.x,d.x,u.x), u.y);
}

uniform float noiseScale;
uniform float noiseSpeed;
uniform float curlStrength;
vec3 curlNoise(vec3 p){
  float n1 = noise(p.xy * noiseScale + time * noiseSpeed);
  float n2 = noise(p.yz * noiseScale + time * noiseSpeed * 1.1);
  float n3 = noise(p.zx * noiseScale + time * noiseSpeed * 0.95);
  // simple pseudo-curl using neighboring noise samples
  return normalize(vec3(n2 - n3, n3 - n1, n1 - n2));
}

void main(){
  vec3 v = texture2D(prevVel, vUv).rgb;
  vec3 p = texture2D(prevPos, vUv).rgb;
  // simple gravity and damping
  vec3 accel = vec3(0.0, -0.98, 0.0);
  v += accel * dt;
    // audio-driven impulse: combine global audioForce with band-specific impulses
    float bandPulse = clamp((sin(time*10.0 + vUv.x*50.0) * 0.5 + 0.5), 0.0, 1.0);
    float audio = bandPulse * audioForce;
    // weighted band contributions (these uniforms are set from JS)
    audio += subBass * 3.0;
    audio += bass * 2.0;
    audio += lowMid * 1.4;
    audio += mid * 1.2;
    audio += highMid * 1.0;
    audio += treble * 0.8;
    audio += sparkle * 0.6;
    v.y += audio * 2.5;
    // Add curl noise perturbation to velocities for richer motion
    vec3 c = curlNoise(p + v * 0.5);
    v += c * curlStrength * (0.5 + bass);
  v *= 0.995; // damping

  // Time-step safety: clamp velocity to prevent explosions from large dt
  float vLen = length(v);
  if (vLen > 1000.0) {
    v = normalize(v) * 1000.0;
  }
  v = clamp(v, vec3(-1000.0), vec3(1000.0));

  gl_FragColor = vec4(v, 1.0);
}
