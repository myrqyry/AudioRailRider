varying vec2 vUv;

uniform sampler2D uColorMap;
uniform sampler2D uHeightMap;
uniform vec3 uCameraPosition;
uniform mat4 uInverseProjectionMatrix;
uniform mat4 uInverseViewMatrix;
uniform float uTime;
uniform float uFar;
uniform float uMapSize;
uniform float uVerticalScale;
uniform float uHorizonOffset;
uniform float uLodFactor;

const float INITIAL_MAX_HEIGHT = -9999.0;

void main() {
    vec3 ro = uCameraPosition;
    vec4 ndc = vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
    vec4 view = uInverseProjectionMatrix * ndc;
    vec3 rd = (uInverseViewMatrix * view).xyz - ro;
    rd = normalize(rd);

    float t = 1.0;
    float dt = 0.1;
    float max_height = INITIAL_MAX_HEIGHT;

    for (int i = 0; i < 200; i++) {
        if (t > uFar) break;

        vec3 p = ro + rd * t;
        float h = texture2D(uHeightMap, p.xz / uMapSize).r * 255.0;

        // Project height onto screen
        vec4 screen_pos = gl_FragCoord;
        screen_pos.y = (h - p.y) / t * uVerticalScale + uHorizonOffset;

        if (screen_pos.y > max_height) {
            vec4 color = texture2D(uColorMap, p.xz / uMapSize);
            gl_FragColor = color; // We only write color if it's visible.
            max_height = screen_pos.y;
        }

        // Level of detail - step farther as we go
        dt = t * uLodFactor;
        t += dt;
    }
    if (max_height == INITIAL_MAX_HEIGHT) {
       discard; // Nothing was rendered for this pixel
    }
}
