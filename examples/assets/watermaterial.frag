varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D crossSampler;

uniform vec4 filterArea;
uniform vec2 dimensions;

uniform float uTime;
uniform vec4 inputSize;
uniform vec4 outputFrame;

#define TAU 6.28318530718

#define TILING_FACTOR 1.
#define MAX_ITER 8

float waterHighlight(vec2 p,float ltime,float foaminess)
{
    vec2 i=vec2(p);
    float c=0.;
    float foaminess_factor=mix(1.,6.,foaminess);
    float inten=.005*foaminess_factor;
    
    for(int n=0;n<MAX_ITER;n++)
    {
        float t=ltime*(1.-(3.5/float(n+1)));
        i=p+vec2(cos(t-i.x)+sin(t+i.y),sin(t-i.y)+cos(t+i.x));
        c+=1./length(vec2(p.x/(sin(i.x+t)),p.y/(cos(i.y+t))));
    }
    c=.2+c/(inten*float(MAX_ITER));
    c=1.17-pow(c,1.4);
    c=pow(abs(c),8.);
    return c/sqrt(foaminess_factor);
}

void main()
{
    vec4 col=texture2D(uSampler,vTextureCoord);
    float ltime=uTime*.03;
    vec2 uv=gl_FragCoord.xy/filterArea.xy;
    vec2 uv_square=vec2(uv.x*filterArea.x/filterArea.y,uv.y);
    float dist_center=pow(2.*length(uv-.5),2.);
    
    float foaminess=smoothstep(.4,1.8,dist_center);
    float clearness=.1+.9*smoothstep(.1,.5,dist_center);
    
    vec2 p=mod(uv_square*TAU*TILING_FACTOR,TAU)-250.;
    
    float c=waterHighlight(p,ltime,foaminess);
    
    vec3 water_color=vec3(0.,.35,.5);
    vec3 color=vec3(c);
    color=clamp(color+water_color,0.,1.);
    
    color=mix(water_color,color,.9);
    
    gl_FragColor=vec4(color,.5)*vec4(col.rgb/col.a, col.a);
}