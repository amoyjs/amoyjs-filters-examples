varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D graySampler;

uniform vec4 filterArea;
uniform vec2 dimensions;

uniform float time;
uniform vec4 inputSize;
uniform vec4 outputFrame;

void main(void) {
    vec4 pixCol = texture2D(uSampler, vTextureCoord);

    vec4 gpixCol = texture2D(graySampler, vTextureCoord*(1./(outputFrame.zw * inputSize.zw)));

    float alpha = gpixCol.r;

    vec3 rgb=pixCol.rgb;

    if (pixCol.a>0.) {
        rgb=rgb.rgb/pixCol.a;
    }

    gl_FragColor = vec4(rgb, pixCol.a)*alpha;
}
