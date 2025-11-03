varying vec2 vUv;

uniform sampler2D uColorMap;
uniform sampler2D uHeightMap;
uniform vec3 uCameraPosition;
uniform mat4 uInverseProjectionMatrix;
uniform mat4 uInverseViewMatrix;
uniform float uTime;
uniform float uFar;

void main() {
    vec3 ro = uCameraPosition;
    vec4 ndc = vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
    vec4 view = uInverseProjectionMatrix * ndc;
    vec3 rd = (uInverseViewMatrix * view).xyz - ro;
    rd = normalize(rd);

    float t = 1.0;
    float dt = 0.1;
    float max_height = -9999.0;

    for (int i = 0; i < 200; i++) {
        if (t > uFar) break;

        vec3 p = ro + rd * t;
        float h = texture2D(uHeightMap, p.xz / 1024.0).r * 255.0; // Assuming map size is 1024

        // Project height onto screen
        vec4 screen_pos = gl_FragCoord;
        screen_pos.y = (h - p.y) / t * 500.0 + 150.0; // magic numbers for scaling

        if (screen_pos.y > max_height) {
            vec4 color = texture2D(uColorMap, p.xz / 1024.0);
            gl_FragColor = color; // We only write color if it's visible.
            max_height = screen_pos.y;
        }

        // Level of detail - step farther as we go
        dt = t * 0.02;
        t += dt;
    }
    if (max_height == -9999.0) {
       discard; // Nothing was rendered for this pixel
    }
}
