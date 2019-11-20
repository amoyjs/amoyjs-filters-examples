varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D crossSampler;

uniform vec4 filterArea;
uniform vec2 dimensions;

uniform float time;

void main(void) {
    vec4 pixCol = texture2D(uSampler, vTextureCoord);
    

    vec3 curvesColor;

    curvesColor.r = texture2D(crossSampler, vec2(pixCol.r, 0.)).r;
    curvesColor.g = texture2D(crossSampler, vec2(pixCol.g, 0.)).g;
    curvesColor.b = texture2D(crossSampler, vec2(pixCol.b, 0.)).b;

    gl_FragColor = vec4(curvesColor, 1.0);
}
