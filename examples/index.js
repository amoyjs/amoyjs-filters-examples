(function (PIXI$1, core) {
    'use strict';

    var EventEmitter = PIXI$1.utils.EventEmitter;

    // patch dat.GUI removeFolder function
    dat.GUI.prototype.removeFolder = function(name) {
        var folder = this.__folders[name];
        if (!folder) {
            return;
        }
        folder.close();
        this.__ul.removeChild(folder.domElement.parentNode);
        delete this.__folders[name];
        this.onResize();
    };

    /*global dat,ga*/
    /**
     * Demo show a bunch of fish and a dat.gui controls
     * @class
     * @extends PIXI.Application
     */
    var ExampleApplication = /*@__PURE__*/(function (Application) {
        function ExampleApplication(examples) {
            var gui = new dat.GUI();
            gui.useLocalStorage = false;
            this.examples = examples;
            // Get the initial dementions for the application
            var domElement = document.querySelector('#container');
            var initWidth = domElement.offsetWidth;
            var initHeight = domElement.offsetHeight;

            // Get the initial dementions for the application
            var canvas = document.querySelector('#stage');
            var canvasWidth = canvas.offsetWidth;
            var canvasHeight = canvas.offsetHeight;

            var designW = canvasWidth;
            var desginH = canvasHeight;

            var viewW = desginH*canvasWidth/canvasHeight;
            var viewH = desginH;

            this.contentOffsetX = (viewW - designW)/2;

            Application.call(this, {
                view: document.querySelector('#stage'),
                width: viewW,
                height: viewH,
                autoStart: false,
                antialias:true,
                backgroundColor:0x000000,
            });


            PIXI$1.settings.PRECISION_FRAGMENT = 'highp';

            this.domElement = domElement;
            this.gui = gui;
            this.initWidth = initWidth;
            this.initHeight = initHeight;
            this.animating = true;
            this.rendering = true;
            this.viewH = viewH;
            this.viewW = viewW;
            this.events = new EventEmitter();
            this.animateTimer = 0;
            this.example=null;
            this.exampleParamsFolderGui=null;
        }

        if ( Application ) ExampleApplication.__proto__ = Application;
        ExampleApplication.prototype = Object.create( Application && Application.prototype );
        ExampleApplication.prototype.constructor = ExampleApplication;

        var prototypeAccessors = { ExampleName: { configurable: true },resources: { configurable: true } };

        ExampleApplication.prototype.startExample = function startExample () {
            if(this.examples && (this.examples.length > 0)){
                this._exampleName=this.examples[0].name;

                var examplenames= [];
                this.examples.forEach(function (element) {
                    examplenames.push(element.name);
                });
                this.gui.add(this, "ExampleName", examplenames);
                this.ExampleName = this._exampleName;
            }
        };

        prototypeAccessors.ExampleName.set = function (name){
            console.log("-----change Example--------"+name);
            this.changeExample(name);
        };

        prototypeAccessors.ExampleName.get = function (){
            return this._exampleName;
        };

        ExampleApplication.prototype.changeExample = function changeExample (name){
            var this$1 = this;


            if(this.exampleParamsFolderGui){
                this.gui.removeFolder("Params");
                this.exampleParamsFolderGui=null;
            }

            if(this.example){
                this.destroyCurrentExample();
            }
            
            this.examples.forEach(function (element) {
                if(element.name == name){
                    this$1.example = new element(this$1);
                }
            });
        };

        /**
         * Convenience for getting resources
         * @member {object}
         */
        prototypeAccessors.resources.get = function () {
            return this.loader.resources;
        };

        /**
         * Load resources
         * @param {object} manifest Collection of resources to load
         */
        ExampleApplication.prototype.load = function load (manifest, callback) {
            var this$1 = this;

            this.loader.add(manifest).load(function () {
                callback();
                this$1.init();
                this$1.start();
            });
        };

        /**
         * Called when the load is completed
         */
        ExampleApplication.prototype.init = function init () {
            // Handle fish animation
            this.ticker.add(this.animate, this);
        };

        /**
         * Resize the demo when the window resizes
         */
        ExampleApplication.prototype.setAppViewAndRender = function setAppViewAndRender (w, h) {
            var stage =  document.querySelector('#stage');
            stage.style.width = w + 'px';
            stage.style.height = h + 'px';
            this.render();
        };

        /**
         * Animate the fish, overlay and filters (if applicable)
         * @param {number} delta - % difference in time from last frame render
         */
        ExampleApplication.prototype.animate = function animate (delta) {

            this.animateTimer += delta;

            var ref = this;
            var animateTimer = ref.animateTimer;

            this.events.emit('animate', delta, animateTimer);

        };

        ExampleApplication.prototype.destroyCurrentExample = function destroyCurrentExample (){
            this.example.destroy();
            this.example = null;
        };

        Object.defineProperties( ExampleApplication.prototype, prototypeAccessors );

        return ExampleApplication;
    }(PIXI$1.Application));

    /*!
     * @amoy/filter-pixel-vibration - v3.0.21
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-pixel-vibration is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var testVert = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var testFrag = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\n\nuniform sampler2D uSampler; // 2d texture\n\nuniform float uIntensity;\nuniform float uBlursize;\nuniform float uThreshold;\n\n#define T(t, c, u, v, m) texture2D(t, c + vec2(u, v), m)\n\nvec4 B(in vec2 C, in sampler2D X, in float m)\n{\n\tvec2 d = m / filterArea.xy;\n    \n    vec4  c = texture2D(X, C, m);\n    c += T(X, C,  d.x, 0.0, m);    \t\n    c += T(X, C, -d.x, 0.0, m);    \t\n    c += T(X, C, 0.0,  d.y, m);    \t\n    c += T(X, C, 0.0, -d.y, m);    \t\n    c += T(X, C,  d.x, d.y, m);    \t\n    c += T(X, C, -d.x, d.y, m);    \t\n    c += T(X, C,  d.x,-d.y, m);    \t\n    c += T(X, C, -d.x,-d.y, m);    \n    return c / 9.0;\n}\n\nint modi(int x, int y) {\n    return x - y * (x / y);\n}\n\nint and(int a, int b) {\n    int result = 0;\n    int n = 1;\n\tconst int BIT_COUNT = 32;\n\n    for(int i = 0; i < BIT_COUNT; i++) {\n        if ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {\n            result += n;\n        }\n\n        a = a / 2;\n        b = b / 2;\n        n = n * 2;\n\n        if (!(a > 0 && b > 0))\n            break;\n    }\n    return result;\n}\n\nvec4 vibrance(vec4 inCol, float vibrance) //r,g,b 0.0 to 1.0,  vibrance 1.0 no change, 0.0 image B&W.\n{\n    vec4 outCol;\n    if (vibrance <= 1.0)\n    {\n        float avg = dot(inCol.rgb, vec3(0.3, 0.6, 0.1));\n        outCol.rgb = mix(vec3(avg), inCol.rgb, vibrance); \n    }\n    else // vibrance > 1.0\n    {\n        float hue_a, a, f, p1, p2, p3, i, h, s, v, amt, _max, _min, dlt;\n        float br1, br2, br3, br4, br5, br2_or_br1, br3_or_br1, br4_or_br1, br5_or_br1;\n        int use;\n\n        _min = min(min(inCol.r, inCol.g), inCol.b);\n        _max = max(max(inCol.r, inCol.g), inCol.b);\n        dlt = _max - _min + 0.00001 /*Hack to fix divide zero infinities*/;\n        h = 0.0;\n        v = _max;\n\n\t\tbr1 = step(_max, 0.0);\n        s = (dlt / _max) * (1.0 - br1);\n        h = -1.0 * br1;\n\n\t\tbr2 = 1.0 - step(_max - inCol.r, 0.0); \n        br2_or_br1 = max(br2, br1);\n        h = ((inCol.g - inCol.b) / dlt) * (1.0 - br2_or_br1) + (h*br2_or_br1);\n\n\t\tbr3 = 1.0 - step(_max - inCol.g, 0.0); \n        \n        br3_or_br1 = max(br3, br1);\n        h = (2.0 + (inCol.b - inCol.r) / dlt) * (1.0 - br3_or_br1) + (h*br3_or_br1);\n\n        br4 = 1.0 - br2*br3;\n        br4_or_br1 = max(br4, br1);\n        h = (4.0 + (inCol.r - inCol.g) / dlt) * (1.0 - br4_or_br1) + (h*br4_or_br1);\n\n        h = h*(1.0 - br1);\n\n        hue_a = abs(h); // between h of -1 and 1 are skin tones\n        a = dlt;      // Reducing enhancements on small rgb differences\n\n        // Reduce the enhancements on skin tones.    \n        a = step(1.0, hue_a) * a * (hue_a * 0.67 + 0.33) + step(hue_a, 1.0) * a;                                    \n        a *= (vibrance - 1.0);\n        s = (1.0 - a) * s + a * pow(s, 0.25);\n\n        i = floor(h);\n        f = h - i;\n\n        p1 = v * (1.0 - s);\n        p2 = v * (1.0 - (s * f));\n        p3 = v * (1.0 - (s * (1.0 - f)));\n\n        inCol.rgb = vec3(0.0); \n        i += 6.0;\n        //use = 1 << ((int)i % 6);\n        use = int(pow(2.0,mod(i,6.0)));\n        a = float(and(use , 1)); // i == 0;\n        use = use / 2;\n        inCol.rgb += a * vec3(v, p3, p1);\n\n        a = float(and(use , 1)); // i == 1;\n        use = use / 2;\n        inCol.rgb += a * vec3(p2, v, p1); \n\n        a = float( and(use,1)); // i == 2;\n        use = use / 2;\n        inCol.rgb += a * vec3(p1, v, p3);\n\n        a = float(and(use, 1)); // i == 3;\n        use = use / 2;\n        inCol.rgb += a * vec3(p1, p2, v);\n\n        a = float(and(use, 1)); // i == 4;\n        use = use / 2;\n        inCol.rgb += a * vec3(p3, p1, v);\n\n        a = float(and(use, 1)); // i == 5;\n        use = use / 2;\n        inCol.rgb += a * vec3(v, p1, p2);\n\n        outCol = inCol;\n    }\n    return outCol;\n}\n\nvec4 mainImage()\n{\n    float t = uThreshold, // threshold\n\t \t  I = uIntensity, // intensity\n          b = uBlursize; // blursize\n\n    vec4 c = texture2D(uSampler, vTextureCoord);//采样\n    vec4 H = clamp(B(vTextureCoord, uSampler, b) - t, 0.0, 1.0) * 1.0 / (1.0 - t); // highlight\n    vec4 imgC = 1.0 - (1.0 - c) * (1.0 - H * I); //Screen Blend Mode\n    \n    imgC = vibrance(imgC, 2.0);\n    return imgC;\n}\n\nvoid main(void)\n{ \n    gl_FragColor = mainImage();\n}";

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-pixel-vibration}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     * @param {number} [intensity = 3.0] blur strength
     * @param {number} [blursize = 2.0] blur size
     */

    var AmoyPixelVibrationFilter = /*@__PURE__*/(function (Filter) {
        function AmoyPixelVibrationFilter(intensity, blursize){
            if ( intensity === void 0 ) { intensity = 3.0; }
            if ( blursize === void 0 ) { blursize = 2.0; }

            Filter.call(this, testVert, testFrag);
            this.intensity = intensity;
            this.blursize = blursize;
            this.threshold = 0.5;
        }

        if ( Filter ) { AmoyPixelVibrationFilter.__proto__ = Filter; }
        AmoyPixelVibrationFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyPixelVibrationFilter.prototype.constructor = AmoyPixelVibrationFilter;

        var prototypeAccessors = { intensity: { configurable: true },blursize: { configurable: true },threshold: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyPixelVibrationFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uIntensity = this.intensity <= 0 ? 3.0 : this.intensity;
            this.uniforms.uBlursize = this.blursize <= 0 ? 2.0 : this.blursize;
            this.uniforms.uThreshold = this.threshold <= 0 ? 0.0 : this.threshold;
            filterManager.applyFilter(this, input, output, clear);
        };

        /**
         * intensity
         *
         * @member {number}
         * @default 3.0
         */
        prototypeAccessors.intensity.get = function () {
            return this.uniforms.uIntensity;
        };

        prototypeAccessors.intensity.set = function (value) {
            this.uniforms.uIntensity = Math.min(Math.max(2.0, value), 6.0);
        };

        /**
         * blursize
         *
         * @member {number}
         * @default 2.0
         */
        prototypeAccessors.blursize.get = function () {
            return this.uniforms.uBlursize;
        };

        prototypeAccessors.blursize.set = function (value) {
            this.uniforms.uBlursize = Math.min(Math.max(2.0, value), 6.0);
        };

        /**
         * threshold
         *
         * @member {number}
         * @default 2.0
         */
        prototypeAccessors.threshold.get = function () {
            return this.uniforms.uThreshold;
        };

        prototypeAccessors.threshold.set = function (value) {
            this.uniforms.uThreshold = Math.min(Math.max(0.0, value), 1.0);
        };

        Object.defineProperties( AmoyPixelVibrationFilter.prototype, prototypeAccessors );

        return AmoyPixelVibrationFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-light2d - v3.0.21
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-light2d is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nuniform float uPosx;\nuniform float uPosy;\n\nvoid main(void)\n{\nvec2 uv=vTextureCoord;\n\nvec3 col=texture2D(uSampler,uv).xyz;\n\nvec2 fragCoord=vTextureCoord*filterArea.xy;\n\nfloat lightY=0.1*filterArea.y;\n\nvec3 lightPos=vec3(uPosx,lightY,uPosy);\n\nvec3 lightDir=lightPos-vec3(fragCoord.x,0.,fragCoord.y);\n\nfloat diffuse=max(dot(normalize(lightDir),vec3(0.,1.,0.)),0.);\n\ngl_FragColor=vec4(col,1.)*diffuse;\n\n}";

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-light2d}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     * @param {number} [posx=10.0] light  x position
     * @param {number} [posy=10.0] light  y position
     */

    var AmoyLight2dFilter = /*@__PURE__*/(function (Filter) {
        function AmoyLight2dFilter(posx, posy) {
            if ( posx === void 0 ) { posx = 10.0; }
            if ( posy === void 0 ) { posy = 10.0; }

            Filter.call(this, vertex, fragment);
            // sub class
            this.posx = posx;
            this.posy = posy;

        }

        if ( Filter ) { AmoyLight2dFilter.__proto__ = Filter; }
        AmoyLight2dFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyLight2dFilter.prototype.constructor = AmoyLight2dFilter;

        var prototypeAccessors = { posx: { configurable: true },posy: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyLight2dFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
            this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
            filterManager.applyFilter(this, input, output, clear);
        };

        /**
         * filter area point x
         */
        prototypeAccessors.posx.get = function () {
            return this.uniforms.uPosx;
        };

        prototypeAccessors.posx.set = function (value) {
            this.uniforms.uPosx = value;
        };

        /**
         * filter area point y
         */
        prototypeAccessors.posy.get = function () {
            return this.uniforms.uPosy;
        };

        prototypeAccessors.posy.set = function (value) {
            this.uniforms.uPosy = value;
        };

        Object.defineProperties( AmoyLight2dFilter.prototype, prototypeAccessors );

        return AmoyLight2dFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-lens-halo - v3.0.21
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-lens-halo is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$1 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$1 = "varying vec2 vTextureCoord;//passed from vect shader\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uPosx;\nuniform float uPosy;\nuniform float uTime;\n\nfloat noise(float t)\n{\n\treturn texture2D(uSampler,vec2(t,0.)/filterArea.xy).x;\n}\n\nfloat noise(vec2 t)\n{\n\treturn texture2D(uSampler,(t+vec2(uTime))/filterArea.xy).x;\n}\n\nvec3 lenshalo(vec2 uv,vec2 pos)\n{\n\tvec2 m=uv-pos;\n\tvec2 uvd=uv*(length(uv));\n\t\n\tfloat ang=atan(m.y,m.x);\n\tfloat dist=length(m);dist=pow(dist,.1);\n\tfloat n=noise(vec2((ang-uTime/9.)*16.,dist*32.));\n\t\n\tfloat f0=1./(length(uv-pos)*16.+1.);\n\t\n\tf0=f0+f0*(sin((ang+uTime/18.+noise(abs(ang)+n/2.)*2.)*12.)*.1+dist*.1+.8);\n\t\n\tfloat f2=max(1./(1.+32.*pow(length(uvd+.8*pos),2.)),.0)*.25;\n\tfloat f22=max(1./(1.+32.*pow(length(uvd+.85*pos),2.)),.0)*.23;\n\tfloat f23=max(1./(1.+32.*pow(length(uvd+.9*pos),2.)),.0)*.21;\n\t\n\tvec2 uvx=mix(uv,uvd,-.5);\n\t\n\tfloat f4=max(.01-pow(length(uvx+.4*pos),2.4),.0)*6.;\n\tfloat f42=max(.01-pow(length(uvx+.45*pos),2.4),.0)*5.;\n\tfloat f43=max(.01-pow(length(uvx+.5*pos),2.4),.0)*3.;\n\t\n\tuvx=mix(uv,uvd,-.4);\n\t\n\tfloat f5=max(.01-pow(length(uvx+.2*pos),5.5),.0)*2.;\n\tfloat f52=max(.01-pow(length(uvx+.4*pos),5.5),.0)*2.;\n\tfloat f53=max(.01-pow(length(uvx+.6*pos),5.5),.0)*2.;\n\t\n\tuvx=mix(uv,uvd,-.5);\n\t\n\tfloat f6=max(.01-pow(length(uvx-.3*pos),1.6),.0)*6.;\n\tfloat f62=max(.01-pow(length(uvx-.325*pos),1.6),.0)*3.;\n\tfloat f63=max(.01-pow(length(uvx-.35*pos),1.6),.0)*5.;\n\t\n\tvec3 c=vec3(.0);\n\t\n\tc.r+=f2+f4+f5+f6;c.g+=f22+f42+f52+f62;c.b+=f23+f43+f53+f63;\n\tc+=vec3(f0);\n\t\n\treturn c;\n}\n\nvec3 cc(vec3 color,float factor,float factor2)// color modifier\n{\n\tfloat w=color.x+color.y+color.z;\n\treturn mix(color,vec3(w)*factor,w*factor2);\n}\n\nvoid main(void)\n{\n\tvec2 uv=vTextureCoord.xy-.5;\n\t\n\tuv.x*=filterArea.x/filterArea.y;//fix aspect ratio\n\t\n\tvec3 mouse=vec3(vec2(uPosx,uPosy).xy/filterArea.xy-.5,0.);\n\t\n\tmouse.x*=filterArea.x/filterArea.y;//fix aspect ratio\n\t\n\tvec3 color=vec3(1.4,1.2,1.)*lenshalo(uv,mouse.xy);\n\t\n\tcolor=cc(color,.5,.1);\n\t\n\tgl_FragColor=vec4(color,1.)+texture2D(uSampler,vTextureCoord);\n}";

    /**
     * The AmoyInnerOutlineFilter applies the effect to an object.<br>
     * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyLensHaloFilter.gif)
     *
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-lens-halo}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     */

    var AmoyLensHaloFilter = /*@__PURE__*/(function (Filter) {
        function AmoyLensHaloFilter(posx, posy, delta) {
            if ( posx === void 0 ) { posx = 10.0; }
            if ( posy === void 0 ) { posy = 10.0; }
            if ( delta === void 0 ) { delta = 0.0; }

            Filter.call(this, vertex$1, fragment$1);
            // sub class
            this.posx = posx;
            this.posy = posy;
            this.delta = delta;
        }

        if ( Filter ) { AmoyLensHaloFilter.__proto__ = Filter; }
        AmoyLensHaloFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyLensHaloFilter.prototype.constructor = AmoyLensHaloFilter;

        var prototypeAccessors = { posx: { configurable: true },posy: { configurable: true },delta: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyLensHaloFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
            this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
            this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
            filterManager.applyFilter(this, input, output, clear);
        };

        /**
         * current x
         */
        prototypeAccessors.posx.get = function () {
            return this.uniforms.uPosx;
        };

        prototypeAccessors.posx.set = function (value) {
            this.uniforms.uPosx = value;
        };

        /**
         * current y
         */
        prototypeAccessors.posy.get = function () {
            return this.uniforms.uPosy;
        };

        prototypeAccessors.posy.set = function (value) {
            this.uniforms.uPosy = value;
        };

        /**
         * time for animation
         *
         * @member {number}
         * @default 0.0
         */
        prototypeAccessors.delta.get = function () {
            return this.uniforms.uTime;
        };

        prototypeAccessors.delta.set = function (value) {
            this.uniforms.uTime = value;
        };

        Object.defineProperties( AmoyLensHaloFilter.prototype, prototypeAccessors );

        return AmoyLensHaloFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-page-curl - v3.0.21
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-page-curl is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$2 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$2 = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform sampler2D uSampler;// 2d texture\nuniform sampler2D nextPageTexture;// 2d texture\n\nuniform vec4 filterArea;\n\nuniform float uPosx;\nuniform float uPosy;\nuniform float uStartPosx;\nuniform float uStartPosy;\nuniform float uRadius;//翻卷半径\nuniform int uFlipmode;//反向翻转模式 0 or 1\n\n\n#define pi 3.14159265359\n//#define uRadius .04\n\n#define iResolution filterArea\n#define iTime uTime\n#define fragColor gl_FragColor\n#define texture texture2D\n\nvoid main(void)\n{\n\tfloat aspect=iResolution.x/iResolution.y;\n\tfloat radius = uRadius;\n\n\tvec2 uv=vTextureCoord*filterArea.xy*vec2(aspect,1.)/iResolution.xy;\n\tvec2 maxuv = filterArea.xy*vec2(aspect,1.)/iResolution.xy;\n\tif(uFlipmode > 0){\n\t\tuv.x = maxuv.x - uv.x;\n\t}else{\n\t\tvec2 maxuv = vec2(1.0);\n\t}\n\t\n\tvec4 virtualMouse=vec4(uPosx,uPosy,uStartPosx,uStartPosy);\n\tvec2 mouse=virtualMouse.xy*vec2(aspect,1.)/iResolution.xy;\n\tvec2 mouseDir=normalize(abs(virtualMouse.zw)-virtualMouse.xy);\n\tvec2 origin=clamp(mouse-mouseDir*mouse.x/mouseDir.x,0.,1.);\n\t\n\tfloat mouseDist=clamp(length(mouse-origin)+(aspect-(abs(virtualMouse.z)/iResolution.x)*aspect)/mouseDir.x,0.,aspect/mouseDir.x);\n\t\n\tif(mouseDir.x<0.)\n\t{\n\t\tmouseDist=distance(mouse,origin);\n\t}\n\t\n\tfloat proj=dot(uv-origin,mouseDir);\n\tfloat dist=proj-mouseDist;\n\t\n\tvec2 linePoint=uv-dist*mouseDir;\n\t\n\tif(dist>radius)\n\t{\n\t\t//下一页面\n\t\tif(uFlipmode > 0){\n\t\t\tuv.x = maxuv.x- uv.x;\n\t\t}\n\t\tfragColor=texture(nextPageTexture,uv*vec2(1./aspect,1.));\n\t\tfragColor.rgb*= clamp(min(.99, .5 + 1. - radius/.04), 1.0, pow(clamp((dist-radius)*14.0,0.,1.),max(.05,5.*radius)));\n\t}\n\telse if(dist>=0.)\n\t{\n\t\t// 圆柱面点映射\n\t\tfloat theta=asin(dist/radius);\n\t\tvec2 p2=linePoint+mouseDir*(pi-theta)*radius;\n\t\tvec2 p1=linePoint+mouseDir*theta*radius;\n\t\tif(p2.x<=aspect&&p2.y<=1.&&p2.x>0.&&p2.y>0.){\n\t\t\tuv = p2;\n\t\t\t//背面页 圆柱面\n\t\t\tif(uFlipmode > 0){\n\t\t\t\tuv = (maxuv- uv*vec2(1./aspect,1.));\n\t\t\t\tuv.y = maxuv.y- uv.y;\n\t\t\t\tuv.x = maxuv.x- uv.x;\n\t\t\t}else{\n\t\t\t\tuv = (1.0- uv*vec2(1./aspect,1.));\n\t\t\t\tuv.y = 1.0- uv.y;\n\t\t\t}\n\t\t\tfragColor = texture(nextPageTexture, uv);\n\t\t\tfragColor.rgb*=clamp(min(.99, .6 + 1. - uRadius/.04), 1.0, pow(clamp((radius-dist)/radius,0.,1.), max(.05,5.*radius)));\n\t\t\tfragColor.a = 1.;\n\t\t}else{\n\t\t\t//corer 圆角\n\t\t\tuv = p1;\n\t\t\tif(uFlipmode > 0){\n\t\t\t\tuv.x = maxuv.x- uv.x;\n\t\t\t}\n\t\t\tfragColor = texture(uSampler, uv * vec2(1. / aspect, 1.));\n\t\t\tfragColor.rgb*=clamp(.94, 1.0, pow(clamp((radius-dist)/radius,0.,1.),max(.05,5.*radius)));\n\t\t}\n\t}\n\telse\n\t{\n\t\tvec2 p=linePoint+mouseDir*(abs(dist)+pi*radius);\n\t\tif(p.x<=aspect&&p.y<=1.&&p.x>0.&&p.y>0.&&length(mouseDir)>0.){\n\t\t\tuv = p ;\n\t\t\t// 背面页平面区域\n\t\t\tif(uFlipmode > 0){\n\t\t\t\tuv = (maxuv - uv*vec2(1./aspect,1.));\n\t\t\t\tuv.y = maxuv.y - uv.y;\n\t\t\t\tuv.x = maxuv.x- uv.x;\n\t\t\t}else{\n\t\t\t\tuv = (1.0 - uv*vec2(1./aspect,1.));\n\t\t\t\tuv.y = 1.0 - uv.y;\n\t\t\t}\n\t\t\tfragColor=texture(nextPageTexture,uv);\n\t\t\tfragColor.a = 1.;\n\t\t}else{\n\t\t\t// 正面页面\n\t\t\tif(uFlipmode > 0){\n\t\t\t\tuv.x = maxuv.x- uv.x;\n\t\t\t}\n\t\t\tfragColor=texture(uSampler,uv*vec2(1./aspect,1.));\n\t\t}\n\t\t\n\t}\n}";

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-page-curl}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     * @param {number} [posx=0.] drag moving x position
     * @param {number} [posy=0.] drag moving y position
     * @param {number} [startPosx=0.] drag start x position
     * @param {number} [startPosy=0.] drag start y position
     */

    var AmoyPageCurlFilter = /*@__PURE__*/(function (Filter) {
        function AmoyPageCurlFilter(posx, posy, startPosx, startPosy, nextPageTexture, radius, flipMode) {
            if ( posx === void 0 ) { posx = 0.0; }
            if ( posy === void 0 ) { posy = 0.0; }
            if ( startPosx === void 0 ) { startPosx = 0.; }
            if ( startPosy === void 0 ) { startPosy = 0.0; }
            if ( radius === void 0 ) { radius=0.04; }
            if ( flipMode === void 0 ) { flipMode=false; }

            Filter.call(this, vertex$2, fragment$2);
            // sub class
            this.posx = posx;
            this.posy = posy;

            this._size = 0;
            this._sliceSize = 0;
            this._slicePixelSize = 0;
            this._sliceInnerSize = 0;
            this._flipMode = flipMode;

            this._scaleMode = null;

            this.radius = radius;

            this.startPosx = startPosx;
            this.startPosy = startPosy;

            this.nextPageTexture = nextPageTexture;
        }

        if ( Filter ) { AmoyPageCurlFilter.__proto__ = Filter; }
        AmoyPageCurlFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyPageCurlFilter.prototype.constructor = AmoyPageCurlFilter;

        var prototypeAccessors = { flipMode: { configurable: true },posx: { configurable: true },radius: { configurable: true },posy: { configurable: true },startPosx: { configurable: true },startPosy: { configurable: true },nextPageTexture: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyPageCurlFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uPosx = this.posx <= 0 ? 0.0 : this.posx;
            this.uniforms.uPosy = this.posy <= 0 ? 0.0 : this.posy;
            this.uniforms.uRadius = this.radius;
            this.uniforms.uFlipmode = this._flipMode ? 1:0;
            this.uniforms.uStartPosx = this.startPosx <= 0 ? 0.0 : this.startPosx;
            this.uniforms.uStartPosy = this.startPosy <= 0 ? 0.0 : this.startPosy;

            filterManager.applyFilter(this, input, output, clear);
        };

        /**
         * current pos x
         */
        prototypeAccessors.flipMode.get = function () {
            return this.uFlipmode.uFlipMode;
        };

        prototypeAccessors.flipMode.set = function (value) {
            this._flipMode = value;
            this.uniforms.uFlipmode = this._flipMode ? 1:0;
        };

        /**
         * current pos x
         */
        prototypeAccessors.posx.get = function () {
            return this.uniforms.uPosx;
        };

        prototypeAccessors.posx.set = function (value) {
            this.uniforms.uPosx = value;
        };

        /**
         * current pos x
         */
        prototypeAccessors.radius.get = function () {
            return this.uniforms.uRadius;
        };

        prototypeAccessors.radius.set = function (value) {
            this.uniforms.uRadius = Math.max(Math.min(value, 0.04), 0.000001);
        };


        /**
         * current pos y
         */
        prototypeAccessors.posy.get = function () {
            return this.uniforms.uPosy;
        };

        prototypeAccessors.posy.set = function (value) {
            this.uniforms.uPosy = value;
        };

        /**
         * start pos x
         */
        prototypeAccessors.startPosx.get = function () {
            return this.uniforms.uStartPosx;
        };

        prototypeAccessors.startPosx.set = function (value) {
            this.uniforms.uStartPosx = value;
        };

        /**
         * start pos y
         */
        prototypeAccessors.startPosy.get = function () {
            return this.uniforms.uStartPosy;
        };

        prototypeAccessors.startPosy.set = function (value) {
            this.uniforms.uStartPosy = value;
        };

        /**
         * the nextPageTexture texture
         * @member {PIXI.Texture}
         */
        prototypeAccessors.nextPageTexture.get = function () {
            return this._nextPageTexture;
        };
        prototypeAccessors.nextPageTexture.set = function (nextPageTexture) {
            if (!(nextPageTexture instanceof core.Texture)) {
                nextPageTexture = core.Texture.from(nextPageTexture);
            }
            if (nextPageTexture && nextPageTexture.baseTexture) {
                nextPageTexture.baseTexture.scaleMode = this._scaleMode;
                nextPageTexture.baseTexture.mipmap = false;

                this._size = nextPageTexture.height;
                this._sliceSize = 1 / this._size;
                this._slicePixelSize = this._sliceSize / this._size;
                this._sliceInnerSize = this._slicePixelSize * (this._size - 1);

                this.uniforms._size = this._size;
                this.uniforms._sliceSize = this._sliceSize;
                this.uniforms._slicePixelSize = this._slicePixelSize;
                this.uniforms._sliceInnerSize = this._sliceInnerSize;

                this.uniforms.nextPageTexture = nextPageTexture;
            }

            this._nextPageTexture = nextPageTexture;
        };

        /**
         * If the nextPageTexture is based on canvas , and the content of canvas has changed,
         *   then call `updateColorMap` for update texture.
         */
        AmoyPageCurlFilter.prototype.updateNextPageTexture = function updateNextPageTexture () {
            var texture = this._nextPageTexture;

            if (texture && texture.baseTexture) {
                texture._updateID++;
                texture.baseTexture.emit('update', texture.baseTexture);

                this.nextPageTexture = texture;
            }
        };

        /**
         * Destroys this filter
         *
         * @param {boolean} [destroyBase=false] Whether to destroy the base texture of nextPageTexture as well
         */
        AmoyPageCurlFilter.prototype.destroy = function destroy (destroyBase) {
            if (this._nextPageTexture) {
                this._nextPageTexture.destroy(destroyBase);
            }
            Filter.prototype.destroy.call(this);
        };

        Object.defineProperties( AmoyPageCurlFilter.prototype, prototypeAccessors );

        return AmoyPageCurlFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-sparks-drifting - v3.0.21
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-sparks-drifting is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$3 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$3 = "\nvarying vec2 vTextureCoord;//passed from vect shader \n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uHeight;\nuniform float uWidth;\nuniform float uStrength;\nuniform float uTime;\n\n#define iResolution filterArea\n#define iTime uTime\n#define texture texture2D\n\n//模拟汽油燃烧\n// Description : Array and textureless GLSL 2D/3D/4D simplex \n//\t\t\t\t\t\t\t noise functions.\n//\t\t\tAuthor : Ian McEwan, Ashima Arts.\n//\tMaintainer : ijm\n//\t\t Lastmod : 20110822 (ijm)\n//\t\t License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//\t\t\t\t\t\t\t Distributed under the MIT License. See LICENSE file.\n//\t\t\t\t\t\t\t https://github.com/ashima/webgl-noise\n// \n\nvec3 mod289(vec3 x){\n\treturn x-floor(x*(1./289.))*289.;\n}\n\nvec4 mod289(vec4 x){\n\treturn x-floor(x*(1./289.))*289.;\n}\n\nvec4 permute(vec4 x){\n\treturn mod289(((x*34.)+1.)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n\treturn 1.79284291400159-.85373472095314*r;\n}\n\nfloat snoise(vec3 v)\n{\n\tconst vec2 C=vec2(1./6.,1./3.);\n\tconst vec4 D=vec4(0.,.5,1.,2.);\n\t\n\t// First corner\n\tvec3 i=floor(v+dot(v,C.yyy));\n\tvec3 x0=v-i+dot(i,C.xxx);\n\t\n\t// Other corners\n\tvec3 g=step(x0.yzx,x0.xyz);\n\tvec3 l=1.-g;\n\tvec3 i1=min(g.xyz,l.zxy);\n\tvec3 i2=max(g.xyz,l.zxy);\n\t\n\t//\t x0 = x0 - 0.0 + 0.0 * C.xxx;\n\t//\t x1 = x0 - i1\t+ 1.0 * C.xxx;\n\t//\t x2 = x0 - i2\t+ 2.0 * C.xxx;\n\t//\t x3 = x0 - 1.0 + 3.0 * C.xxx;\n\tvec3 x1=x0-i1+C.xxx;\n\tvec3 x2=x0-i2+C.yyy;// 2.0*C.x = 1/3 = C.y\n\tvec3 x3=x0-D.yyy;// -1.0+3.0*C.x = -0.5 = -D.y\n\t\n\t// Permutations\n\ti=mod289(i);\n\tvec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));\n\t\n\t// Gradients: 7x7 points over a square, mapped onto an octahedron.\n\t// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n\tfloat n_=.142857142857;// 1.0/7.0\n\tvec3 ns=n_*D.wyz-D.xzx;\n\t\n\tvec4 j=p-49.*floor(p*ns.z*ns.z);//\tmod(p,7*7)\n\t\n\tvec4 x_=floor(j*ns.z);\n\tvec4 y_=floor(j-7.*x_);// mod(j,N)\n\t\n\tvec4 x=x_*ns.x+ns.yyyy;\n\tvec4 y=y_*ns.x+ns.yyyy;\n\tvec4 h=1.-abs(x)-abs(y);\n\t\n\tvec4 b0=vec4(x.xy,y.xy);\n\tvec4 b1=vec4(x.zw,y.zw);\n\t\n\t//vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n\t//vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n\tvec4 s0=floor(b0)*2.+1.;\n\tvec4 s1=floor(b1)*2.+1.;\n\tvec4 sh=-step(h,vec4(0.));\n\t\n\tvec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;\n\tvec4 a1=b1.xzyw+s1.xzyw*sh.zzww;\n\t\n\tvec3 p0=vec3(a0.xy,h.x);\n\tvec3 p1=vec3(a0.zw,h.y);\n\tvec3 p2=vec3(a1.xy,h.z);\n\tvec3 p3=vec3(a1.zw,h.w);\n\t\n\t//Normalise gradients\n\t//vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n\tvec4 norm=inversesqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));\n\tp0*=norm.x;\n\tp1*=norm.y;\n\tp2*=norm.z;\n\tp3*=norm.w;\n\t\n\t// Mix final noise value\n\tvec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);\n\tm=m*m;\n\treturn 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));\n}\n\n//////////////////////////////////////////////////////////////\n\n// PRNG\n// From https://www.shadertoy.com/view/4djSRW\nfloat prng(in vec2 seed){\n\tseed=fract(seed*vec2(5.3983,5.4427));\n\tseed+=dot(seed.yx,seed.xy+vec2(21.5351,14.3137));\n\treturn fract(seed.x*seed.y*95.4337);\n}\n\n//////////////////////////////////////////////////////////////\n\nfloat PI=3.1415926535897932384626433832795;\n\nfloat noiseStack(vec3 pos,int octaves,float falloff){\n\tfloat noise=snoise(vec3(pos));\n\tfloat off=1.;\n\tif(octaves>1){\n\t\tpos*=2.;\n\t\toff*=falloff;\n\t\tnoise=(1.-off)*noise+off*snoise(vec3(pos));\n\t}\n\tif(octaves>2){\n\t\tpos*=2.;\n\t\toff*=falloff;\n\t\tnoise=(1.-off)*noise+off*snoise(vec3(pos));\n\t}\n\tif(octaves>3){\n\t\tpos*=2.;\n\t\toff*=falloff;\n\t\tnoise=(1.-off)*noise+off*snoise(vec3(pos));\n\t}\n\treturn(1.+noise)/2.;\n}\n\nvec2 noiseStackUV(vec3 pos,int octaves,float falloff,float diff){\n\tfloat displaceA=noiseStack(pos,octaves,falloff);\n\tfloat displaceB=noiseStack(pos+vec3(3984.293,423.21,5235.19),octaves,falloff);\n\treturn vec2(displaceA,displaceB);\n}\n\nvoid main(){\n\tfloat time=iTime;\n\tvec2 resolution=iResolution.xy;\n\tvec2 fragCoord=vTextureCoord*filterArea.xy;\n\tvec2 offset=vec2(0.);\n\t//\n\tfloat xpart=fragCoord.x/resolution.x;\n\tfloat ypart=fragCoord.y/resolution.y;\n\t//\n\tfloat clip=uHeight;\n\tfloat ypartClip=1.0 - fragCoord.y/clip;//开始Y方向\n\tfloat ypartClippedFalloff=clamp(2.-ypartClip,0.,1.);//【0-1】\n\tfloat ypartClipped=min(ypartClip,1.);\n\tfloat ypartClippedn=1.-ypartClipped;\n\t//X方向油量\n\tfloat xfuel=pow(1.-abs(2.*xpart-1.),(1.0 - (uWidth/resolution.x))*5.0);\n\t//\n\tfloat timeSpeed=.5;\n\tfloat realTime=timeSpeed*time;\n\t//\n\tvec2 coordScaled=.01*fragCoord-.02*vec2(offset.x,0.);\n\tvec3 position=vec3(coordScaled,0.)+vec3(1223.,6434.,8425.);\n\tvec3 flow=vec3(4.1*(.5-xpart)*pow(ypartClippedn,4.),-2.*xfuel*pow(ypartClippedn,64.),0.);\n\tvec3 timing=realTime*vec3(0.,1.7,1.1)+flow;\n\t//\n\tvec3 displacePos=vec3(1.,.5,1.)*2.4*position+realTime*vec3(.01,.7,1.3);\n\tvec3 displace3=vec3(noiseStackUV(displacePos,2,.4,.1),0.);\n\t//\n\tvec3 noiseCoord=(vec3(2.,1.,1.)*position+timing+.4*displace3)/1.;\n\tfloat noise=noiseStack(noiseCoord,3,.4);\n\t//\n\tfloat flames=pow(ypartClipped,.3*xfuel)*pow(noise,.3*xfuel);\n\t//\n\tfloat f=ypartClippedFalloff*pow(1.-flames*flames*flames,8.);\n\tfloat fff=f*f*f;\n\tvec3 fire=uStrength*vec3(f,fff,fff*fff);\n\t\n\t// smoke\n\tfloat smokeNoise=.5+snoise(.4*position+timing*vec3(1.,1.,.2))/2.;\n\tvec3 smoke=vec3(.3*pow(xfuel,3.)*pow(ypart,2.)*(smokeNoise+.4*(1.-noise)));\n\t\n\t// sparks\n\tfloat sparkGridSize=30.*uStrength;\n\tvec2 sparkCoord=0.0 - fragCoord-vec2(2.*offset.x,190.*realTime);\n\tsparkCoord-=30.*noiseStackUV(.01*vec3(sparkCoord,30.*time),1,.4,.1);\n\tsparkCoord+=100.*flow.xy;\n\tif(mod(sparkCoord.y/sparkGridSize,2.)<1.)sparkCoord.x+=.5*sparkGridSize;\n\tvec2 sparkGridIndex=vec2(floor(sparkCoord/sparkGridSize));\n\tfloat sparkRandom=prng(sparkGridIndex);\n\tfloat sparkLife=min(10.*(1.-min((sparkGridIndex.y+(190.*realTime/sparkGridSize))/(24.-20.*sparkRandom),1.)),1.);\n\tvec3 sparks=vec3(0.);\n\tif(sparkLife>0.){\n\t\tfloat sparkSize=xfuel*xfuel*sparkRandom*.08;\n\t\tfloat sparkRadians=999.*sparkRandom*2.*PI+2.*time;\n\t\tvec2 sparkCircular=vec2(sin(sparkRadians),cos(sparkRadians));\n\t\tvec2 sparkOffset=(.5-sparkSize)*sparkGridSize*sparkCircular;\n\t\tvec2 sparkModulus=mod(sparkCoord+sparkOffset,sparkGridSize)-.5*vec2(sparkGridSize);\n\t\tfloat sparkLength=length(sparkModulus);\n\t\tfloat sparksGray=max(0.,1.-sparkLength/(sparkSize*sparkGridSize));\n\t\tsparks=sparkLife*sparksGray*vec3(0.9333, 0.498, 0.1412);\n\t}\n\t//\n\tvec4 effect = vec4(max(fire,sparks)+smoke,1.);\n\teffect.a = effect.r;\n\tgl_FragColor = effect + texture2D(uSampler, vTextureCoord);\n}";

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/spark-drfting}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     * @param {number} [height=0.0] spark height
     * @param {number} [widht=0.0] spark width
     * @param {number} [strength=0.0] strength
     * @param {number} [delta=0.0] time for shader animation
     */

    var AmoySparksDriftingFilter = /*@__PURE__*/(function (Filter) {
        function AmoySparksDriftingFilter(height, width, strength, delta) {
            if ( height === void 0 ) { height = 0.0; }
            if ( width === void 0 ) { width = 0.0; }
            if ( strength === void 0 ) { strength = 2.; }
            if ( delta === void 0 ) { delta = 0.0; }

            Filter.call(this, vertex$3, fragment$3);
            // sub class
            this.height = height;
            this.width = width;
            this.strength = strength;
            this.delta = delta;
        }

        if ( Filter ) { AmoySparksDriftingFilter.__proto__ = Filter; }
        AmoySparksDriftingFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoySparksDriftingFilter.prototype.constructor = AmoySparksDriftingFilter;

        var prototypeAccessors = { width: { configurable: true },height: { configurable: true },strength: { configurable: true },delta: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoySparksDriftingFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uWidth = this.width;
            this.uniforms.uHeight = this.height;
            this.uniforms.uStrength = this.strength;
            this.uniforms.uTime = this.delta;
            filterManager.applyFilter(this, input, output, clear);
        };

        /**
         * fire w
         */
        prototypeAccessors.width.get = function () {
            return this.uniforms.uWidth;
        };

        prototypeAccessors.width.set = function (value) {
            this.uniforms.uWidth = value;
        };

        /**
         * fire H
         */
        prototypeAccessors.height.get = function () {
            return this.uniforms.uHeight;
        };

        prototypeAccessors.height.set = function (value) {
            this.uniforms.uHeight = value;
        };

        /**
         * fire strength
         */
        prototypeAccessors.strength.get = function () {
            return this.uniforms.uStrength;
        };

        prototypeAccessors.strength.set = function (value) {
            this.uniforms.uStrength = value;
        };

        /**
         * time for animation
         *
         * @member {number}
         * @default 0.0
         */
        prototypeAccessors.delta.get = function () {
            return this.uniforms.uTime;
        };

        prototypeAccessors.delta.set = function (value) {
            this.uniforms.uTime = value;
        };

        Object.defineProperties( AmoySparksDriftingFilter.prototype, prototypeAccessors );

        return AmoySparksDriftingFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-gameboy-style - v3.0.24
     * Compiled Tue, 03 Dec 2019 15:39:17 UTC
     *
     * @amoy/filter-gameboy-style is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$4 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$4 = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uPosx;\nuniform float uPosy;\nuniform float uTime;\n\nvoid main(){\n\tvec2 fragCoord=vTextureCoord*filterArea.xy;\n\tvec2 uv=fragCoord.xy/filterArea.xy;\n\tconst float resolution=160.;//步长\n\tuv=floor(uv*resolution)/resolution;// 0 or 1\n\t\n\tvec3 color=texture2D(uSampler,uv).rgb;\n\t\n\tfloat intensity=(color.r+color.g+color.b)/3.;\n\tint index=int(intensity*4.);\n\n\tif(index == 0){\n\t\tgl_FragColor=vec4(vec3(15./255., 56./255., 15./255.),1.);\n\t}else if(index == 1){\n\t\tgl_FragColor=vec4(vec3(48./255., 98./255., 48./255.),1.);\n\t}else if(index == 2){\n\t\tgl_FragColor=vec4(vec3(139./255., 172./255., 15./255.),1.);\n\t}else{\n\t\tgl_FragColor=vec4(vec3(155./255., 188./255., 15./255.),1.);\n\t}\n}";

    /**
     *
     *  * The AmoyGameboyStyleFilter applies the effect to an object.<br>
     * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyGameboyStyleFilter.png)
     *
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-gameboy-style}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     */

    var AmoyGameboyStyleFilter = /*@__PURE__*/(function (Filter) {
        function AmoyGameboyStyleFilter() {
            Filter.call(this, vertex$4, fragment$4);
            // sub class
        }

        if ( Filter ) { AmoyGameboyStyleFilter.__proto__ = Filter; }
        AmoyGameboyStyleFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyGameboyStyleFilter.prototype.constructor = AmoyGameboyStyleFilter;

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyGameboyStyleFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            filterManager.applyFilter(this, input, output, clear);
        };

        return AmoyGameboyStyleFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-snow - v3.0.21
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-snow is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$5 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$5 = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform int uBlizard;\nuniform float uTime;\n\nconst mat3 p=mat3(13.323122,23.5112,21.71123,21.1212,28.7312,11.9312,21.8112,14.7212,61.3934);\n\t\nvec3 createSnow(int i,float depth,float width,float speed,float dof,vec2 uv){\n\tfloat fi=float(i);\n\tvec2 q=uv*(1.+fi*depth);\n\tq+=vec2(q.y*(width*mod(fi*7.238917,1.)-width*.5),speed*uTime/(1.+fi*depth*.03));\n\tvec3 n=vec3(floor(q),31.189+fi);\n\tvec3 m=floor(n)*.00001+fract(n);\n\tvec3 mp=(31415.9+m)/fract(p*m);\n\tvec3 r=fract(mp);\n\tvec2 s=abs(mod(q,1.)-.5+.9*r.xy-.45);\n\ts+=.01*abs(2.*fract(10.*q.yx)-1.);\n\tfloat d=.6*max(s.x-s.y,s.x+s.y)+max(s.x,s.y)-.01;\n\tfloat edge=.005+.05*min(.5*abs(fi-5.-dof),1.);\n\treturn vec3(smoothstep(edge,-edge,d)*(r.x/(1.+.02*fi*depth)));\n}\n\nvoid main()\n{\n\tvec2 fragCoord=vTextureCoord*filterArea.xy;\n\tvec2 uv=vec2(1.,filterArea.y/filterArea.x)*fragCoord.xy/filterArea.xy;\n\tvec3 acc=vec3(0.);\n\tfloat dof=5.*sin(uTime*.1);\n\tif(uBlizard==1){\n\t\tfor(int i=0;i<100;i++){\n\t\t\tacc+=createSnow(i,.1,.8,-1.5,dof,uv);\n\t\t}\n\t}else{\n\t\tfor(int i=0;i<50;i++){\n\t\t\tacc+=createSnow(i,.5,.3,-.6,dof,uv);\n\t\t}\n\t}\n\tgl_FragColor=vec4(vec3(acc),1.) + texture2D(uSampler, vTextureCoord);\n}";

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/snow}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     * @param {Boolen} [blizard=false] snow mode true or false
     * @param {number} [delta=0] time for animation
     */

    var AmoySnowFilter = /*@__PURE__*/(function (Filter) {
        function AmoySnowFilter(blizard, delta) {
            if ( blizard === void 0 ) { blizard = false; }
            if ( delta === void 0 ) { delta = 0.0; }

            Filter.call(this, vertex$5, fragment$5);
            // sub class
            this._blizard = blizard;
            this.blizard = this._blizard;
            this.delta = delta;
        }

        if ( Filter ) { AmoySnowFilter.__proto__ = Filter; }
        AmoySnowFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoySnowFilter.prototype.constructor = AmoySnowFilter;

        var prototypeAccessors = { blizard: { configurable: true },delta: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoySnowFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uBlizard = this._blizard?1:0;
            this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
            filterManager.applyFilter(this, input, output, clear);
        };

        /**
         *  snow model
         */
        prototypeAccessors.blizard.get = function () {
            return this._blizard;
        };

        prototypeAccessors.blizard.set = function (value) {
            this._blizard = value;
            this.uniforms.uBlizard = value?1:0;
        };

        /**
         * time for animation
         *
         * @member {number}
         * @default 0.0
         */
        prototypeAccessors.delta.get = function () {
            return this.uniforms.uTime;
        };

        prototypeAccessors.delta.set = function (value) {
            this.uniforms.uTime = value;
        };

        Object.defineProperties( AmoySnowFilter.prototype, prototypeAccessors );

        return AmoySnowFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-light-sweep - v3.0.21
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-light-sweep is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$6 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$6 = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uTime;\n\nvoid main()\n{\n\t\n\tvec2 uv=vTextureCoord;\n\tuv.x *=.5;\n\tfloat col=sin(uv.y+uv.x*3.-uTime*6.)*.9;\n\tcol*=col*col*.6;\n\n\tcol= clamp(col,0.,1.);\n\t\n\tvec4 tex=texture2D(uSampler,vTextureCoord);\n\tif(tex.a < .005){\n\t\tdiscard;\n\t}\n\tgl_FragColor=tex+vec4(col,col,col,tex.a);\n}";

    /**
     * The AmoyLightSweepFilter applies the effect to an object.<br>
     * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyLightSweepFilter.gif)
     *
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-light-sweep}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     * @param {number} [delta=0] time for shader animation
     */

    var AmoyLightSweepFilter = /*@__PURE__*/(function (Filter) {
        function AmoyLightSweepFilter(delta) {
            if ( delta === void 0 ) { delta = 0.0; }

            Filter.call(this, vertex$6, fragment$6);
            this.delta = delta;
        }

        if ( Filter ) { AmoyLightSweepFilter.__proto__ = Filter; }
        AmoyLightSweepFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyLightSweepFilter.prototype.constructor = AmoyLightSweepFilter;

        var prototypeAccessors = { delta: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyLightSweepFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
            filterManager.applyFilter(this, input, output, clear);
        };
        /**
         * time for animation
         *
         * @member {number}
         * @default 0.0
         */
        prototypeAccessors.delta.get = function () {
            return this.uniforms.uTime;
        };

        prototypeAccessors.delta.set = function (value) {
            this.uniforms.uTime = value;
        };

        Object.defineProperties( AmoyLightSweepFilter.prototype, prototypeAccessors );

        return AmoyLightSweepFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-reflection - v3.0.21
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-reflection is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$7 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$7 = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nvoid main(void)\n{\n\tvec2 uv;\n\tuv.x=vTextureCoord.x;\n\tuv.y=1.-vTextureCoord.y;\n\t\n\tgl_FragColor=texture2D(uSampler,uv)*uv.y;\n}";

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-reflection}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     */

    var AmoyReflectionFilter = /*@__PURE__*/(function (Filter) {
        function AmoyReflectionFilter() {
            Filter.call(this, vertex$7, fragment$7);
            // sub class
        }

        if ( Filter ) { AmoyReflectionFilter.__proto__ = Filter; }
        AmoyReflectionFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyReflectionFilter.prototype.constructor = AmoyReflectionFilter;

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyReflectionFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            filterManager.applyFilter(this, input, output, clear);
        };

        return AmoyReflectionFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-water-reflection - v3.0.21
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-water-reflection is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$8 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$8 = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\nuniform float boundary;\nuniform float uTime;\n\nvoid main()\n{\n    vec2 uv=vTextureCoord;\n    vec4 waterColor=vec4(1.);\n    float reflactionY=boundary;\n    if(uv.y>reflactionY)\n    {\n        float oy=uv.y;\n        uv.y=2.*reflactionY-uv.y;\n        uv.y=uv.y+sin(1./(oy-reflactionY)+uTime*10.)*.003;\n        waterColor=vec4(.5882,.7529,.9216,1.);\n    }\n    \n    gl_FragColor=texture2D(uSampler,uv)*waterColor;\n}\n";

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-weather-reflection}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     * @param {number} [delta = 0] time for animation
     */

    var AmoyWaterReflectionFilter = /*@__PURE__*/(function (Filter) {
        function AmoyWaterReflectionFilter(delta, boundary) {
            if ( delta === void 0 ) { delta = 0.0; }
            if ( boundary === void 0 ) { boundary = .5; }

            Filter.call(this, vertex$8, fragment$8);
            // sub class
            this.delta = delta;
            this.boundary = boundary;
        }

        if ( Filter ) { AmoyWaterReflectionFilter.__proto__ = Filter; }
        AmoyWaterReflectionFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyWaterReflectionFilter.prototype.constructor = AmoyWaterReflectionFilter;

        var prototypeAccessors = { delta: { configurable: true },boundary: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyWaterReflectionFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
            filterManager.applyFilter(this, input, output, clear);
        };

        /**
         * time for animation
         *
         * @member {number}
         * @default 0.0
         */
        prototypeAccessors.delta.get = function () {
            return this.uniforms.uTime;
        };

        prototypeAccessors.delta.set = function (value) {
            this.uniforms.uTime = value;
        };

        /**
         * Vertical position of the reflection point, default is 50% (middle)
         * smaller numbers produce a larger reflection, larger numbers produce a smaller reflection.
         *
         * @member {number}
         * @default 0.5
         */
        prototypeAccessors.boundary.set = function (value) {
            this.uniforms.boundary = value;
        };
        prototypeAccessors.boundary.get = function () {
            return this.uniforms.boundary;
        };

        Object.defineProperties( AmoyWaterReflectionFilter.prototype, prototypeAccessors );

        return AmoyWaterReflectionFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-weather-rainy - v3.0.21
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-weather-rainy is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$9 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$9 = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uTime;\n\nfloat rand(vec2 p){\n\tp+=.2127+p.x+.3713*p.y;\n\tvec2 r=4.789*sin(789.123*(p));\n\treturn fract(r.x*r.y);\n}\n//sample noise\nfloat sn(vec2 p){\n\tvec2 i=floor(p-.5);\n\tvec2 f=fract(p-.5);\n\tf=f*f*f*(f*(f*6.-15.)+10.);\n\tfloat rt=mix(rand(i),rand(i+vec2(1.,0.)),f.x);\n\tfloat rb=mix(rand(i+vec2(0.,1.)),rand(i+vec2(1.,1.)),f.x);\n\treturn mix(rt,rb,f.y);\n}\n\nvoid main(void)\n{\n\tvec2 uv=vTextureCoord;\n\tuv.y = 1.0 - uv.y;\n\tvec2 newUV=uv;\n\tnewUV.x-=uTime*.3;\n\tnewUV.y+=uTime*3.;\n\tfloat strength=sin(uTime*.5+sn(newUV))*.1+.2;\n\tfloat rain=sn(vec2(newUV.x*20.1,newUV.y*40.1+newUV.x*400.1-20.*strength));\n\tfloat rain2=sn(vec2(newUV.x*45.+uTime*.5,newUV.y*30.1+newUV.x*100.1));\n\train=strength-rain;\n\train+=rain2*(sin(strength)-.4)*2.;\n\train=clamp(rain,0.,.5)*.8;\n\t\n\tgl_FragColor=vec4(vec3(rain),1.)+texture2D(uSampler,vTextureCoord);\n}";

    /**
     * @class
     * @extends PIXI.Filter
     * @see {@link https://www.npmjs.com/package/@amoy/weather-rainy|@amoy/weather-rainy}
     * @see {@link https://www.npmjs.com/package/@amoy/filters|@amoy/filters}
     * @memberof AMOY.filters
     * @param {number} [delta = 0] time for animation
     */

    var AmoyWeatherRainyFilter = /*@__PURE__*/(function (Filter) {
        function AmoyWeatherRainyFilter(delta) {
            if ( delta === void 0 ) { delta = 0.0; }

            Filter.call(this, vertex$9, fragment$9);
            // sub class
            this.delta = delta;
        }

        if ( Filter ) { AmoyWeatherRainyFilter.__proto__ = Filter; }
        AmoyWeatherRainyFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyWeatherRainyFilter.prototype.constructor = AmoyWeatherRainyFilter;

        var prototypeAccessors = { delta: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyWeatherRainyFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
            filterManager.applyFilter(this, input, output, clear);
        };

        /**
         * time for animation
         *
         * @member {number}
         * @default 0.0
         */
        prototypeAccessors.delta.get = function () {
            return this.uniforms.uTime;
        };

        prototypeAccessors.delta.set = function (value) {
            this.uniforms.uTime = value;
        };

        Object.defineProperties( AmoyWeatherRainyFilter.prototype, prototypeAccessors );

        return AmoyWeatherRainyFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-weather-cloud - v3.0.21
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-weather-cloud is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$a = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$a = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uPosx;\nuniform float uPosy;\nuniform float uTime;\n\nvec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}\nvec4 mod289(vec4 x){\n\treturn x-floor(x*(1./289.))*289.;\n}\nvec4 permute(vec4 x){\n\treturn mod289(((x*34.)+1.)*x);\n}\nvec4 taylorInvSqrt(vec4 r){\n\treturn 1.79284291400159-.85373472095314*r;\n}\nvec3 fade(vec3 t){\n\treturn t*t*t*(t*(t*6.-15.)+10.);\n}\nfloat noise(vec3 P){\n\tvec3 i0=mod289(floor(P)),i1=mod289(i0+vec3(1.)),\n\tf0=fract(P),f1=f0-vec3(1.),f=fade(f0);\n\tvec4 ix=vec4(i0.x,i1.x,i0.x,i1.x),iy=vec4(i0.yy,i1.yy),\n\tiz0=i0.zzzz,iz1=i1.zzzz,\n\tixy=permute(permute(ix)+iy),ixy0=permute(ixy+iz0),ixy1=permute(ixy+iz1),\n\tgx0=ixy0*(1./7.),gy0=fract(floor(gx0)*(1./7.))-.5,\n\tgx1=ixy1*(1./7.),gy1=fract(floor(gx1)*(1./7.))-.5;\n\tgx0=fract(gx0);gx1=fract(gx1);\n\tvec4 gz0=vec4(.5)-abs(gx0)-abs(gy0),sz0=step(gz0,vec4(0.)),\n\tgz1=vec4(.5)-abs(gx1)-abs(gy1),sz1=step(gz1,vec4(0.));\n\tgx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);\n\tgx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);\n\tvec3 g0=vec3(gx0.x,gy0.x,gz0.x),g1=vec3(gx0.y,gy0.y,gz0.y),\n\tg2=vec3(gx0.z,gy0.z,gz0.z),g3=vec3(gx0.w,gy0.w,gz0.w),\n\tg4=vec3(gx1.x,gy1.x,gz1.x),g5=vec3(gx1.y,gy1.y,gz1.y),\n\tg6=vec3(gx1.z,gy1.z,gz1.z),g7=vec3(gx1.w,gy1.w,gz1.w);\n\tvec4 norm0=taylorInvSqrt(vec4(dot(g0,g0),dot(g2,g2),dot(g1,g1),dot(g3,g3))),\n\tnorm1=taylorInvSqrt(vec4(dot(g4,g4),dot(g6,g6),dot(g5,g5),dot(g7,g7)));\n\tg0*=norm0.x;g2*=norm0.y;g1*=norm0.z;g3*=norm0.w;\n\tg4*=norm1.x;g6*=norm1.y;g5*=norm1.z;g7*=norm1.w;\n\tvec4 nz=mix(vec4(dot(g0,vec3(f0.x,f0.y,f0.z)),dot(g1,vec3(f1.x,f0.y,f0.z)),\n\tdot(g2,vec3(f0.x,f1.y,f0.z)),dot(g3,vec3(f1.x,f1.y,f0.z))),\n\tvec4(dot(g4,vec3(f0.x,f0.y,f1.z)),dot(g5,vec3(f1.x,f0.y,f1.z)),\n\tdot(g6,vec3(f0.x,f1.y,f1.z)),dot(g7,vec3(f1.x,f1.y,f1.z))),f.z);\n\treturn 2.2*mix(mix(nz.x,nz.z,f.y),mix(nz.y,nz.w,f.y),f.x);\n}\n\nvoid main()\n{\n\t// Normalized pixel coordinates (from 0 to 1) and center pos\n\tvec2 uv=vTextureCoord;\n\tuv = uv -.5;\n\n\tfloat c=0.;\n\t// BUILD A FRACTAL TEXTURE USING\n\t// NOISE THAT ANIMATES THROUGH Z\n\tfloat x=uv.x+uTime*.2;\n\tfloat y=uv.y;\n\n\tfor(int n=1;n<=5;n++){\n\t\tfloat z=float(n);\n\t\tvec3 p=vec3(x,y,z+.05*uTime);\n\t\tfloat frequency=pow(2.,z);\n\t\tc+=(noise(frequency*p)/frequency);\n\t}\n\t\n\n\t// CLOUDS SHOT WITH COLOR\n\tvec3 sky=vec3(.1,.3,.9);\n\tvec3 white=vec3(1.0, 1.0, 1.0);\n\tvec3 pink=vec3(0.8549, 0.7569, 0.7569);\n\tvec3 cloud=mix(pink,white,c);\n\tc=clamp(c+y,0.,1.);\n\tvec3 color=mix(sky,cloud,c);\n\t\n\t// Output to screen\n\tgl_FragColor=vec4(sqrt(color),1.);\n\n}";

    /**
     * @author lilieming
     * original shader :https://www.shadertoy.com/view/Wl2XWR by @lilieming
     */

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-weather-cloud}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     * @param {number} [delta = 0] time for animation
     */

    var AmoyWeatherCloudFilter = /*@__PURE__*/(function (Filter) {
        function AmoyWeatherCloudFilter(delta) {
            if ( delta === void 0 ) { delta = 0.0; }

            Filter.call(this, vertex$a, fragment$a);
            // sub class
            this.delta = delta;
        }

        if ( Filter ) { AmoyWeatherCloudFilter.__proto__ = Filter; }
        AmoyWeatherCloudFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyWeatherCloudFilter.prototype.constructor = AmoyWeatherCloudFilter;

        var prototypeAccessors = { delta: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyWeatherCloudFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
            filterManager.applyFilter(this, input, output, clear);
        };

        /**
         * time for animation
         *
         * @member {number}
         * @default 0.0
         */
        prototypeAccessors.delta.get = function () {
            return this.uniforms.uTime;
        };

        prototypeAccessors.delta.set = function (value) {
            this.uniforms.uTime = value;
        };

        Object.defineProperties( AmoyWeatherCloudFilter.prototype, prototypeAccessors );

        return AmoyWeatherCloudFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-inner-outline - v3.0.21
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-inner-outline is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$b = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$b = "varying vec2 vTextureCoord;//passed from vect shader\nuniform sampler2D uSampler;// 2d texture\nuniform vec4 filterArea;\n\nuniform float uTime;\nuniform vec3 uColor;\n\nfloat rand(vec2 n){\n\treturn fract(sin(dot(n,vec2(12.9898,12.1414)))*83758.5453);\n}\n\nfloat noise(vec2 n){\n\tconst vec2 d=vec2(0.,1.);\n\tvec2 b=floor(n);\n\tvec2 f=mix(vec2(0.),vec2(1.),fract(n));\n\treturn mix(mix(rand(b),rand(b+d.yx),f.x),mix(rand(b+d.xy),rand(b+d.yy),f.x),f.y);\n}\n\nvec3 ramp(float t){\n\treturn t<=.5?vec3(1.-t*1.4,.2,1.05)/t:vec3(.3*(1.-t)*2.,.2,1.05)/t;\n}\n\nfloat fire(vec2 n){\n\treturn noise(n)+noise(n*2.1)*.6+noise(n*5.4)*.42;\n}\n\nvec3 getLine(vec3 col,vec2 fc,mat2 mtx,float shift){\n\tfloat t=uTime;\n\tvec2 uv=(fc/filterArea.xy)*mtx;\n\t\n\tuv.x+=uv.y<.5?23.+t*.35:-11.+t*.3;\n\tuv.y=abs(uv.y-shift);\n\tuv*=5.;\n\t\n\tfloat q=fire(uv-t*.013)/2.;\n\tvec2 r=vec2(fire(uv+q/2.+t-uv.x-uv.y),fire(uv+q-t));\n\tvec3 color=vec3(1./(pow(vec3(.5,0.,.1)+1.61,vec3(4.))));\n\t\n\tfloat grad=pow((r.y+r.y)*max(.0,uv.y)+.1,4.);\n\tcolor=ramp(grad);\n\tcolor/=(1.50+max(vec3(0),color));\n\t\n\tif(color.b<.00000005)\n\tcolor=vec3(.0);\n\t\n\treturn mix(col,color,color.b);\n}\n\nvoid main(){\n\tvec2 fragCoord=vTextureCoord.xy*filterArea.xy;\n\tvec2 uv=fragCoord/filterArea.xy;\n\tvec3 color=vec3(0.);\n\tcolor=getLine(color,fragCoord,mat2(1.,1.,0.,1.),1.02);\n\tcolor=getLine(color,fragCoord,mat2(1.,1.,1.,0.),1.02);\n\tcolor=getLine(color,fragCoord,mat2(1.,1.,0.,1.),-.02);\n\tcolor=getLine(color,fragCoord,mat2(1.,1.,1.,0.),-.02);\n\tgl_FragColor=vec4(vec3(color.b)*uColor,1.)+texture2D(uSampler,vTextureCoord);\n}";

    /**
     * The AmoyInnerOutlineFilter applies the effect to an object.<br>
     * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/AmoyInnerOutlineFilter.gif)
     *
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-gameboy-style}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     * @param {Object} [color={r:1.0, g:0, b:0}] outline color
     * @param {number} [delta=0.0] time for shader animation
     */

    var AmoyInnerOutlineFilter = /*@__PURE__*/(function (Filter) {
        function AmoyInnerOutlineFilter(color, delta) {
            if ( color === void 0 ) { color={r:1.0, g:0, b:0}; }
            if ( delta === void 0 ) { delta = 0.0; }

            Filter.call(this, vertex$b, fragment$b);
            this.uniforms.uColor  = new Float32Array(3);
            this._color = {r:color.r, g:color.g, b:color.b};
            this.delta = delta;
        }

        if ( Filter ) { AmoyInnerOutlineFilter.__proto__ = Filter; }
        AmoyInnerOutlineFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyInnerOutlineFilter.prototype.constructor = AmoyInnerOutlineFilter;

        var prototypeAccessors = { color: { configurable: true },delta: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyInnerOutlineFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uColor[0] = this._color.r;
            this.uniforms.uColor[1] = this._color.g;
            this.uniforms.uColor[2] = this._color.b;
            this.uniforms.uTime = this.delta <= 0 ? 2.0 : this.delta;
            filterManager.applyFilter(this, input, output, clear);
        };


        prototypeAccessors.color.get = function (){
            return this._color;
        };

        prototypeAccessors.color.set = function (value) {
            this._color = value;
            this.uniforms.uColor[0] = value.r;
            this.uniforms.uColor[1] = value.g;
            this.uniforms.uColor[2] = value.b;
        };

        /**
         * time for animation
         *
         * @member {number}
         * @default 0.0
         */
        prototypeAccessors.delta.get = function () {
            return this.uniforms.uTime;
        };

        prototypeAccessors.delta.set = function (value) {
            this.uniforms.uTime = value;
        };

        Object.defineProperties( AmoyInnerOutlineFilter.prototype, prototypeAccessors );

        return AmoyInnerOutlineFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-fluid - v3.0.29
     * Compiled Tue, 03 Dec 2019 15:46:54 UTC
     *
     * @amoy/filter-fluid is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var isMobile = createCommonjsModule(function (module) {
    (function(global) {
      var apple_phone = /iPhone/i,
        apple_ipod = /iPod/i,
        apple_tablet = /iPad/i,
        android_phone = /\bAndroid(?:.+)Mobile\b/i, // Match 'Android' AND 'Mobile'
        android_tablet = /Android/i,
        amazon_phone = /\bAndroid(?:.+)SD4930UR\b/i,
        amazon_tablet = /\bAndroid(?:.+)(?:KF[A-Z]{2,4})\b/i,
        windows_phone = /Windows Phone/i,
        windows_tablet = /\bWindows(?:.+)ARM\b/i, // Match 'Windows' AND 'ARM'
        other_blackberry = /BlackBerry/i,
        other_blackberry_10 = /BB10/i,
        other_opera = /Opera Mini/i,
        other_chrome = /\b(CriOS|Chrome)(?:.+)Mobile/i,
        other_firefox = /Mobile(?:.+)Firefox\b/i; // Match 'Mobile' AND 'Firefox'

      function match(regex, userAgent) {
        return regex.test(userAgent);
      }

      function isMobile(userAgent) {
        var ua =
          userAgent ||
          (typeof navigator !== 'undefined' ? navigator.userAgent : '');

        // Facebook mobile app's integrated browser adds a bunch of strings that
        // match everything. Strip it out if it exists.
        var tmp = ua.split('[FBAN');
        if (typeof tmp[1] !== 'undefined') {
          ua = tmp[0];
        }

        // Twitter mobile app's integrated browser on iPad adds a "Twitter for
        // iPhone" string. Same probably happens on other tablet platforms.
        // This will confuse detection so strip it out if it exists.
        tmp = ua.split('Twitter');
        if (typeof tmp[1] !== 'undefined') {
          ua = tmp[0];
        }

        var result = {
          apple: {
            phone: match(apple_phone, ua) && !match(windows_phone, ua),
            ipod: match(apple_ipod, ua),
            tablet:
              !match(apple_phone, ua) &&
              match(apple_tablet, ua) &&
              !match(windows_phone, ua),
            device:
              (match(apple_phone, ua) ||
                match(apple_ipod, ua) ||
                match(apple_tablet, ua)) &&
              !match(windows_phone, ua)
          },
          amazon: {
            phone: match(amazon_phone, ua),
            tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
            device: match(amazon_phone, ua) || match(amazon_tablet, ua)
          },
          android: {
            phone:
              (!match(windows_phone, ua) && match(amazon_phone, ua)) ||
              (!match(windows_phone, ua) && match(android_phone, ua)),
            tablet:
              !match(windows_phone, ua) &&
              !match(amazon_phone, ua) &&
              !match(android_phone, ua) &&
              (match(amazon_tablet, ua) || match(android_tablet, ua)),
            device:
              (!match(windows_phone, ua) &&
                (match(amazon_phone, ua) ||
                  match(amazon_tablet, ua) ||
                  match(android_phone, ua) ||
                  match(android_tablet, ua))) ||
              match(/\bokhttp\b/i, ua)
          },
          windows: {
            phone: match(windows_phone, ua),
            tablet: match(windows_tablet, ua),
            device: match(windows_phone, ua) || match(windows_tablet, ua)
          },
          other: {
            blackberry: match(other_blackberry, ua),
            blackberry10: match(other_blackberry_10, ua),
            opera: match(other_opera, ua),
            firefox: match(other_firefox, ua),
            chrome: match(other_chrome, ua),
            device:
              match(other_blackberry, ua) ||
              match(other_blackberry_10, ua) ||
              match(other_opera, ua) ||
              match(other_firefox, ua) ||
              match(other_chrome, ua)
          }
        };
        (result.any =
          result.apple.device ||
          result.android.device ||
          result.windows.device ||
          result.other.device),
          // excludes 'other' devices and ipods, targeting touchscreen phones
          (result.phone =
            result.apple.phone || result.android.phone || result.windows.phone),
          (result.tablet =
            result.apple.tablet || result.android.tablet || result.windows.tablet);

        return result;
      }

      if (
        
        module.exports &&
        typeof window === 'undefined'
      ) {
        // Node.js
        module.exports = isMobile;
      } else if (
        
        module.exports &&
        typeof window !== 'undefined'
      ) {
        // Browserify
        module.exports = isMobile();
        module.exports.isMobile = isMobile;
      } else {
        global.isMobile = isMobile();
      }
    })(commonjsGlobal);
    });
    var isMobile_1 = isMobile.isMobile;

    /*!
     * @pixi/settings - v5.1.3
     * Compiled Mon, 09 Sep 2019 04:51:53 UTC
     *
     * @pixi/settings is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    /**
     * The maximum recommended texture units to use.
     * In theory the bigger the better, and for desktop we'll use as many as we can.
     * But some mobile devices slow down if there is to many branches in the shader.
     * So in practice there seems to be a sweet spot size that varies depending on the device.
     *
     * In v4, all mobile devices were limited to 4 texture units because for this.
     * In v5, we allow all texture units to be used on modern Apple or Android devices.
     *
     * @private
     * @param {number} max
     * @returns {number}
     */
    function maxRecommendedTextures(max)
    {
        var allowMax = true;

        if (isMobile.tablet || isMobile.phone)
        {
            allowMax = false;

            if (isMobile.apple.device)
            {
                var match = (navigator.userAgent).match(/OS (\d+)_(\d+)?/);

                if (match)
                {
                    var majorVersion = parseInt(match[1], 10);

                    // All texture units can be used on devices that support ios 11 or above
                    if (majorVersion >= 11)
                    {
                        allowMax = true;
                    }
                }
            }
            if (isMobile.android.device)
            {
                var match$1 = (navigator.userAgent).match(/Android\s([0-9.]*)/);

                if (match$1)
                {
                    var majorVersion$1 = parseInt(match$1[1], 10);

                    // All texture units can be used on devices that support Android 7 (Nougat) or above
                    if (majorVersion$1 >= 7)
                    {
                        allowMax = true;
                    }
                }
            }
        }

        return allowMax ? max : 4;
    }

    /**
     * Uploading the same buffer multiple times in a single frame can cause performance issues.
     * Apparent on iOS so only check for that at the moment
     * This check may become more complex if this issue pops up elsewhere.
     *
     * @private
     * @returns {boolean}
     */
    function canUploadSameBuffer()
    {
        return !isMobile.apple.device;
    }

    /**
     * User's customizable globals for overriding the default PIXI settings, such
     * as a renderer's default resolution, framerate, float precision, etc.
     * @example
     * // Use the native window resolution as the default resolution
     * // will support high-density displays when rendering
     * PIXI.settings.RESOLUTION = window.devicePixelRatio;
     *
     * // Disable interpolation when scaling, will make texture be pixelated
     * PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
     * @namespace PIXI.settings
     */
    var settings = {

        /**
         * If set to true WebGL will attempt make textures mimpaped by default.
         * Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
         *
         * @static
         * @name MIPMAP_TEXTURES
         * @memberof PIXI.settings
         * @type {PIXI.MIPMAP_MODES}
         * @default PIXI.MIPMAP_MODES.POW2
         */
        MIPMAP_TEXTURES: 1,

        /**
         * Default anisotropic filtering level of textures.
         * Usually from 0 to 16
         *
         * @static
         * @name ANISOTROPIC_LEVEL
         * @memberof PIXI.settings
         * @type {number}
         * @default 0
         */
        ANISOTROPIC_LEVEL: 0,

        /**
         * Default resolution / device pixel ratio of the renderer.
         *
         * @static
         * @name RESOLUTION
         * @memberof PIXI.settings
         * @type {number}
         * @default 1
         */
        RESOLUTION: 1,

        /**
         * Default filter resolution.
         *
         * @static
         * @name FILTER_RESOLUTION
         * @memberof PIXI.settings
         * @type {number}
         * @default 1
         */
        FILTER_RESOLUTION: 1,

        /**
         * The maximum textures that this device supports.
         *
         * @static
         * @name SPRITE_MAX_TEXTURES
         * @memberof PIXI.settings
         * @type {number}
         * @default 32
         */
        SPRITE_MAX_TEXTURES: maxRecommendedTextures(32),

        // TODO: maybe change to SPRITE.BATCH_SIZE: 2000
        // TODO: maybe add PARTICLE.BATCH_SIZE: 15000

        /**
         * The default sprite batch size.
         *
         * The default aims to balance desktop and mobile devices.
         *
         * @static
         * @name SPRITE_BATCH_SIZE
         * @memberof PIXI.settings
         * @type {number}
         * @default 4096
         */
        SPRITE_BATCH_SIZE: 4096,

        /**
         * The default render options if none are supplied to {@link PIXI.Renderer}
         * or {@link PIXI.CanvasRenderer}.
         *
         * @static
         * @name RENDER_OPTIONS
         * @memberof PIXI.settings
         * @type {object}
         * @property {HTMLCanvasElement} view=null
         * @property {number} resolution=1
         * @property {boolean} antialias=false
         * @property {boolean} forceFXAA=false
         * @property {boolean} autoDensity=false
         * @property {boolean} transparent=false
         * @property {number} backgroundColor=0x000000
         * @property {boolean} clearBeforeRender=true
         * @property {boolean} preserveDrawingBuffer=false
         * @property {number} width=800
         * @property {number} height=600
         * @property {boolean} legacy=false
         */
        RENDER_OPTIONS: {
            view: null,
            antialias: false,
            forceFXAA: false,
            autoDensity: false,
            transparent: false,
            backgroundColor: 0x000000,
            clearBeforeRender: true,
            preserveDrawingBuffer: false,
            width: 800,
            height: 600,
            legacy: false,
        },

        /**
         * Default Garbage Collection mode.
         *
         * @static
         * @name GC_MODE
         * @memberof PIXI.settings
         * @type {PIXI.GC_MODES}
         * @default PIXI.GC_MODES.AUTO
         */
        GC_MODE: 0,

        /**
         * Default Garbage Collection max idle.
         *
         * @static
         * @name GC_MAX_IDLE
         * @memberof PIXI.settings
         * @type {number}
         * @default 3600
         */
        GC_MAX_IDLE: 60 * 60,

        /**
         * Default Garbage Collection maximum check count.
         *
         * @static
         * @name GC_MAX_CHECK_COUNT
         * @memberof PIXI.settings
         * @type {number}
         * @default 600
         */
        GC_MAX_CHECK_COUNT: 60 * 10,

        /**
         * Default wrap modes that are supported by pixi.
         *
         * @static
         * @name WRAP_MODE
         * @memberof PIXI.settings
         * @type {PIXI.WRAP_MODES}
         * @default PIXI.WRAP_MODES.CLAMP
         */
        WRAP_MODE: 33071,

        /**
         * Default scale mode for textures.
         *
         * @static
         * @name SCALE_MODE
         * @memberof PIXI.settings
         * @type {PIXI.SCALE_MODES}
         * @default PIXI.SCALE_MODES.LINEAR
         */
        SCALE_MODE: 1,

        /**
         * Default specify float precision in vertex shader.
         *
         * @static
         * @name PRECISION_VERTEX
         * @memberof PIXI.settings
         * @type {PIXI.PRECISION}
         * @default PIXI.PRECISION.HIGH
         */
        PRECISION_VERTEX: 'highp',

        /**
         * Default specify float precision in fragment shader.
         * iOS is best set at highp due to https://github.com/pixijs/pixi.js/issues/3742
         *
         * @static
         * @name PRECISION_FRAGMENT
         * @memberof PIXI.settings
         * @type {PIXI.PRECISION}
         * @default PIXI.PRECISION.MEDIUM
         */
        PRECISION_FRAGMENT: isMobile.apple.device ? 'highp' : 'mediump',

        /**
         * Can we upload the same buffer in a single frame?
         *
         * @static
         * @name CAN_UPLOAD_SAME_BUFFER
         * @memberof PIXI.settings
         * @type {boolean}
         */
        CAN_UPLOAD_SAME_BUFFER: canUploadSameBuffer(),

        /**
         * Enables bitmap creation before image load. This feature is experimental.
         *
         * @static
         * @name CREATE_IMAGE_BITMAP
         * @memberof PIXI.settings
         * @type {boolean}
         * @default false
         */
        CREATE_IMAGE_BITMAP: false,

        /**
         * If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
         * Advantages can include sharper image quality (like text) and faster rendering on canvas.
         * The main disadvantage is movement of objects may appear less smooth.
         *
         * @static
         * @constant
         * @memberof PIXI.settings
         * @type {boolean}
         * @default false
         */
        ROUND_PIXELS: false,
    };

    /**
     * The NTFluidFilter applies a Fluid effect to an object.<br>
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-fluid}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof PIXI.filters
     * @param {number} [strength=15] - the strength of blur
     */
    var AmoyFluidFilter = /*@__PURE__*/(function (Filter) {
        function AmoyFluidFilter(strength) {
            Filter.call(this);
            this._blurFilter = new PIXI.filters.BlurFilter(strength || 15);
            this._colFilter = new PIXI.filters.ColorMatrixFilter();

            //use this matrix to change alpha value
            this._colFilter.matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 100, -12];
            this.resolution = settings.RESOLUTION;

            this.padding = Math.abs(this._blurFilter.blur) * 2;
        }

        if ( Filter ) { AmoyFluidFilter.__proto__ = Filter; }
        AmoyFluidFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyFluidFilter.prototype.constructor = AmoyFluidFilter;

        var prototypeAccessors = { resolution: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyFluidFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            var renderTarget = filterManager.getFilterTexture();
            var renderTarget1 = filterManager.getFilterTexture();

            this._blurFilter.apply(filterManager, input, renderTarget, true);
            this._colFilter.apply(filterManager, renderTarget, renderTarget1, true);

            filterManager.applyFilter(this, renderTarget1, output, clear);

            filterManager.returnFilterTexture(renderTarget1);
            filterManager.returnFilterTexture(renderTarget);
        };

        /**
         * The resolution of the filter.
         *
         * @member {number}
         */
        prototypeAccessors.resolution.get = function () {
            return this._resolution;
        };

        prototypeAccessors.resolution.set = function (value) {
            this._resolution = value;

            if (this._colFilter) {
                this._colFilter.resolution = value;
            }
            if (this._blurFilter) {
                this._blurFilter.resolution = value;
            }
        };

        Object.defineProperties( AmoyFluidFilter.prototype, prototypeAccessors );

        return AmoyFluidFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-blood-splash - v3.0.24
     * Compiled Wed, 27 Nov 2019 03:13:09 UTC
     *
     * @amoy/filter-blood-splash is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$c = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$c = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nuniform float uPosx;\nuniform float uPosy;\nuniform float uTime;\nuniform vec3 uColor;\n\n#define SEED 0.12345679\n#define GRAV vec2(0.,-.26)\n#define SIZE 0.024\n#define DIE_TIME 0.9\n#define PARTICLE_COUNT 120.0\n#define PI 3.14159265359\n\nfloat rand (vec2 p) {\n    return fract(sin(dot(p.xy,vec2(6.8245,7.1248)))*9.1283);\n}\n\nfloat particle(vec2 uv, float identifier, vec2 anchor, vec2 velocity, float creationTime) {\n    float particleTime = max(0., uTime - creationTime);\n\n    float size = max(0., DIE_TIME - particleTime) * SIZE;\n\n    vec2 velocityOffset = velocity * particleTime;\n    vec2 gravityOffset = GRAV * pow(particleTime, 1.798);\n    \n    vec2 point = anchor + velocityOffset + gravityOffset;\n    \n    float dist = distance(uv, point);\n    float hit = smoothstep(size, 0., dist);\n    \n    return hit;\n}\n\nvec3 currentColor() {\n    float c = uTime * 0.2;\n    float r = sin(c * PI) / 2. + .5;\n    float g = sin((c + .6) * PI) / 2. + .5;\n    float b = sin((c + 1.2) * PI) / 2. + .5;\n    return vec3(r, g, b);\n}\n\nvoid main( )\n{\n    vec2 uv = vTextureCoord;\n    vec3 col = vec3(0.);\n\n    \n    for (float i = 0.0; i < PARTICLE_COUNT; i++) {\n        float seed = SEED + floor(i / PARTICLE_COUNT + uTime);\n\n        vec2 anchor = vec2(uPosx/filterArea.x, uPosy/filterArea.y);\n\n        vec2 velocity = vec2(mix(-.5, .5, rand(vec2(seed, i))), mix(-.5, .5, rand(vec2(i, seed) / 3.)));\n\n        float creationTime = uTime - fract(i / PARTICLE_COUNT + uTime);\n\n      col += particle(uv, 0., anchor, velocity, creationTime) * uColor;\n    }\n\n    col = smoothstep(.6, .9, col);\n\n    vec4 tc = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = vec4(col, col.r)*col.r + tc*(1.0 -col.r);\n}";

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-blood-splash}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     * @param {number} [posx=10.0] light  x position
     * @param {number} [posy=10.0] light  y position
     */

    var AmoyBloodSplashFilter = /*@__PURE__*/(function (Filter) {
        function AmoyBloodSplashFilter(posx, posy, delta, color) {
            if ( posx === void 0 ) { posx = 10.0; }
            if ( posy === void 0 ) { posy = 10.0; }
            if ( delta === void 0 ) { delta=0.; }
            if ( color === void 0 ) { color={r:1.0, g:0, b:0}; }

            Filter.call(this, vertex$c, fragment$c);
            // sub class
            this.posx = posx;
            this.posy = posy;
            this.delta = delta;
            this.uniforms.uColor  = new Float32Array(3);
            this._color = {r:color.r, g:color.g, b:color.b};

        }

        if ( Filter ) { AmoyBloodSplashFilter.__proto__ = Filter; }
        AmoyBloodSplashFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyBloodSplashFilter.prototype.constructor = AmoyBloodSplashFilter;

        var prototypeAccessors = { posx: { configurable: true },color: { configurable: true },delta: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyBloodSplashFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
            this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
            this.uniforms.uColor[0] = this._color.r;
            this.uniforms.uColor[1] = this._color.g;
            this.uniforms.uColor[2] = this._color.b;
            filterManager.applyFilter(this, input, output, clear);
        };

        /**
         * filter area point x
         * @member {number}
         */
        prototypeAccessors.posx.get = function () {
            return this.uniforms.uPosx;
        };

        prototypeAccessors.posx.set = function (value) {
            this.uniforms.uPosx = value;
        };

        /**
         *  the color of blood
         * @member {object}
         */
        prototypeAccessors.color.get = function (){
            return this._color;
        };

        prototypeAccessors.color.set = function (value) {
            this._color = value;
            this.uniforms.uColor[0] = value.r;
            this.uniforms.uColor[1] = value.g;
            this.uniforms.uColor[2] = value.b;
        };

        /**
         * time for animation
         *
         * @member {number}
         * @default 0.0
         */
        prototypeAccessors.delta.get = function () {
            return this.uniforms.uTime;
        };

        prototypeAccessors.delta.set = function (value) {
            this.uniforms.uTime = value;
        };

        Object.defineProperties( AmoyBloodSplashFilter.prototype, prototypeAccessors );

        return AmoyBloodSplashFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-magnify - v3.0.23
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-magnify is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$d = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$d = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nuniform float uPosx;\nuniform float uPosy;\n\nuniform float uMagnification;\nuniform float uLensRadius;\n\n\nconst float border_thickness = 0.01;\n\nvoid main( )\n{   \n    //Convert to UV coordinates, accounting for aspect ratio\n    vec2 uv = vTextureCoord;\n    float aspect = filterArea.x / filterArea.y;\n    uv.x = uv.x * aspect;\n\n    float lens_radius = uLensRadius / filterArea.y;\n    float magnification = uMagnification;\n    \n    //at the beginning of the sketch, center the magnifying glass.\n    //Thanks to FabriceNeyret2 for the suggestion\n    vec2 mouse = vec2(uPosx, uPosy);\n    if (mouse == vec2(0.0)) {\n        mouse = filterArea.xy / 2.0;\n    }\n    \n    //UV coordinates of mouse\n    vec2 mouse_uv = mouse / filterArea.y;\n    \n    //Distance to mouse\n    float mouse_dist = distance(uv, mouse_uv);\n    \n    //Draw the texture\n\tgl_FragColor = texture2D(uSampler, vTextureCoord);\n    \n    //Draw the outline of the glass\n    if (mouse_dist < lens_radius + border_thickness) {\n        gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);\n    }\n    \n    //Draw a zoomed-in version of the texture\n    if (mouse_dist < lens_radius) {\n        uv.x = uv.x / aspect;\n        mouse_uv.x = mouse_uv.x / aspect;\n        \n        gl_FragColor = texture2D(uSampler, mouse_uv + (uv - mouse_uv) / magnification);\n    }    \n}";

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-magnify}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     * @param {number} [posx=10.0] light  x position
     * @param {number} [posy=10.0] light  y position
     * @param {number} [magnification=2.0] magnification
     * @param {number} [lensRadius=10.0] lensRadius
     */

    var AmoyMagnifyFilter = /*@__PURE__*/(function (Filter) {
        function AmoyMagnifyFilter(posx, posy, magnification, lensRadius) {
            if ( posx === void 0 ) { posx = 10.0; }
            if ( posy === void 0 ) { posy = 10.0; }
            if ( magnification === void 0 ) { magnification=2.0; }
            if ( lensRadius === void 0 ) { lensRadius=50.; }

            Filter.call(this, vertex$d, fragment$d);
            // sub class
            this.posx = posx;
            this.posy = posy;
            this.magnification = magnification;
            this.lensRadius = lensRadius;
        }

        if ( Filter ) { AmoyMagnifyFilter.__proto__ = Filter; }
        AmoyMagnifyFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyMagnifyFilter.prototype.constructor = AmoyMagnifyFilter;

        var prototypeAccessors = { posx: { configurable: true },posy: { configurable: true },magnification: { configurable: true },lensRadius: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyMagnifyFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uMagnification =  this.magnification;
            this.uniforms.uLensRadius =  this.lensRadius;
            this.uniforms.uPosx = this.posx <= 0 ? 10.0 : this.posx;
            this.uniforms.uPosy = this.posy <= 0 ? 10.0 : this.posy;
            filterManager.applyFilter(this, input, output, clear);
        };

        /**
         * center x pos of lens circle
         */
        prototypeAccessors.posx.get = function () {
            return this.uniforms.uPosx;
        };

        prototypeAccessors.posx.set = function (value) {
            this.uniforms.uPosx = value;
        };

        /**
         * center y pos of lens circle
         */
        prototypeAccessors.posy.get = function () {
            return this.uniforms.uPosy;
        };

        prototypeAccessors.posy.set = function (value) {
            this.uniforms.uPosy = value;
        };

        prototypeAccessors.magnification.get = function () {
            return this.uniforms.uMagnification;
        };

        prototypeAccessors.magnification.set = function (value) {
            this.uniforms.uMagnification = value;
        };

        prototypeAccessors.lensRadius.get = function () {
            return this.uniforms.uLensRadius;
        };

        prototypeAccessors.lensRadius.set = function (value) {
            this.uniforms.uLensRadius = value;
        };

        Object.defineProperties( AmoyMagnifyFilter.prototype, prototypeAccessors );

        return AmoyMagnifyFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-fisheye - v1.0.0
     * Compiled Thu, 21 Nov 2019 07:47:39 UTC
     *
     * @amoy/filter-fisheye is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$e = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$e = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nconst float PI = 3.1415926535;\n\nvoid main(void)\n{\n    float aperture = 178.0;\n    float apertureHalf = 0.5 * aperture * (PI / 180.0);\n    float maxFactor = sin(apertureHalf);\n    \n    vec2 uv;\n    vec2 xy = 2.0 * vTextureCoord.xy - 1.0;\n    float d = length(xy);\n    if (d < (2.0-maxFactor))\n    {\n        d = length(xy * maxFactor);\n        float z = sqrt(1.0 - d * d);\n        float r = atan(d, z) / PI;\n        float phi = atan(xy.y, xy.x);\n        \n        uv.x = r * cos(phi) + 0.5;\n        uv.y = r * sin(phi) + 0.5;\n    }\n    else\n    {\n        uv = vTextureCoord.xy;\n    }\n    vec4 c = texture2D(uSampler, uv);\n\n    gl_FragColor= c;\n}";

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-fisheye}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     */

    var AmoyFishEyeFilter = /*@__PURE__*/(function (Filter) {
        function AmoyFishEyeFilter() {
            Filter.call(this, vertex$e, fragment$e);

        }

        if ( Filter ) { AmoyFishEyeFilter.__proto__ = Filter; }
        AmoyFishEyeFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyFishEyeFilter.prototype.constructor = AmoyFishEyeFilter;

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyFishEyeFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            filterManager.applyFilter(this, input, output, clear);
        };

        return AmoyFishEyeFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-barrel-distortion - v3.0.24
     * Compiled Wed, 27 Nov 2019 03:13:09 UTC
     *
     * @amoy/filter-barrel-distortion is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$f = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$f = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nuniform float uBarrelPower;\n\nvec2 Distort(vec2 p)\n{\n    float theta=atan(p.y,p.x);\n    float radius=length(p);\n    radius=pow(radius,uBarrelPower);\n    p.x=radius*cos(theta);\n    p.y=radius*sin(theta);\n    return .5*(p+1.);\n}\n\nvoid main()\n{\n    vec2 xy=2.*vTextureCoord.xy-1.;\n    vec2 uv;\n    float d=length(xy);\n    if(d<1.)\n    {\n        uv=Distort(xy);\n    }\n    else\n    {\n        uv=vTextureCoord.xy;\n    }\n    vec4 c=texture2D(uSampler,uv);\n    gl_FragColor=c;\n}";

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-barreldistortion}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     */

    var AmoyBarrelDistortionFilter = /*@__PURE__*/(function (Filter) {
        function AmoyBarrelDistortionFilter(barrelPower) {
            if ( barrelPower === void 0 ) { barrelPower=2.0; }

            Filter.call(this, vertex$f, fragment$f);
            this.barrelPower = barrelPower;
        }

        if ( Filter ) { AmoyBarrelDistortionFilter.__proto__ = Filter; }
        AmoyBarrelDistortionFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyBarrelDistortionFilter.prototype.constructor = AmoyBarrelDistortionFilter;

        var prototypeAccessors = { barrelPower: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyBarrelDistortionFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uBarrelPower = this.barrelPower;
            filterManager.applyFilter(this, input, output, clear);
        };

        /**
         * barrelPower , the strength of distortion
         * @member {number}
         */
        prototypeAccessors.barrelPower.get = function () {
            return this.uniforms.uBarrelPower;
        };

        prototypeAccessors.barrelPower.set = function (value) {
            this.uniforms.uBarrelPower = value;
        };

        Object.defineProperties( AmoyBarrelDistortionFilter.prototype, prototypeAccessors );

        return AmoyBarrelDistortionFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-clear-background - v3.0.28
     * Compiled Tue, 03 Dec 2019 15:39:17 UTC
     *
     * @amoy/filter-clear-background is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$g = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$g = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\nuniform vec3 uColor;\nuniform float uOffset;\n\n\nvec3 rgb2hsl(vec3 rgb)\n{\n    float h;\n    float s;\n    float l;\n\n    float maxval = max(rgb.r , max(rgb.g, rgb.b));\n    float minval = min(rgb.r, min(rgb.g, rgb.b));\n    float delta = maxval - minval;\n \n    l = (minval + maxval) / 2.0;\n    s = 0.0;\n    if (l > 0.0 && l < 1.0)\n        s = delta / (l < 0.5 ? 2.0 * l : 2.0 - 2.0 * l);\n    h = 0.0;\n    if (delta > 0.0)\n    {\n        if (rgb.r == maxval && rgb.g != maxval)\n            h += (rgb.g - rgb.b ) / delta;\n        if (rgb.g == maxval && rgb.b != maxval)\n            h += 2.0  + (rgb.b - rgb.r) / delta;\n        if (rgb.b == maxval && rgb.r != maxval)\n            h += 4.0 + (rgb.r - rgb.g) / delta;\n        h *= 60.0;\n    }\n\n    return vec3(h,s,l);\n}\n\n\nvoid main( )\n{\n    vec2 uv = vTextureCoord;\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    vec3 hsl;\n    hsl = rgb2hsl(c.rgb);\n\n    vec3 hsl1;\n    hsl1 = rgb2hsl(uColor);\n\n    float a = 1.;\n    if(abs(hsl.x - hsl1.x) < uOffset &&(abs(hsl.y - hsl1.y) < uOffset) && (abs(hsl.z - hsl1.z) < uOffset)){\n        a = 0.0;\n    }\n\n    c *= a;\n    gl_FragColor = c;\n}";

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-clear-background}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     * @param {object} [{r:1.0, g:0, b:0}] default color for clear
     * @param {number} [offset=5.0] the color offset range [0, 20]
     */

    var AmoyClearBackgroundFilter = /*@__PURE__*/(function (Filter) {
        function AmoyClearBackgroundFilter(color, offset) {
            if ( color === void 0 ) { color={r:1.0, g:0, b:0}; }
            if ( offset === void 0 ) { offset=5.; }

            Filter.call(this, vertex$g, fragment$g);
            // sub class
            this.uniforms.uColor  = new Float32Array(3);
            this.offset = offset;
            this._color = {r:color.r, g:color.g, b:color.b};
        }

        if ( Filter ) { AmoyClearBackgroundFilter.__proto__ = Filter; }
        AmoyClearBackgroundFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyClearBackgroundFilter.prototype.constructor = AmoyClearBackgroundFilter;

        var prototypeAccessors = { color: { configurable: true },offset: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyClearBackgroundFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            this.uniforms.uColor[0] = this._color.r;
            this.uniforms.uColor[1] = this._color.g;
            this.uniforms.uColor[2] = this._color.b;
            this.uniforms.uOffset = this.offset;
            filterManager.applyFilter(this, input, output, clear);
        };

        /**
         *  the color is need to be removed
         * @member {object}
         */
        prototypeAccessors.color.get = function (){
            return this._color;
        };

        prototypeAccessors.color.set = function (value) {
            this._color = value;
            this.uniforms.uColor[0] = value.r;
            this.uniforms.uColor[1] = value.g;
            this.uniforms.uColor[2] = value.b;
        };

        prototypeAccessors.offset.get = function (){
            return this.uniforms.uOffset;
        };

        prototypeAccessors.offset.set = function (value) {
            this.uniforms.uOffset = value;
        };

        Object.defineProperties( AmoyClearBackgroundFilter.prototype, prototypeAccessors );

        return AmoyClearBackgroundFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-warhol - v3.0.24
     * Compiled Tue, 03 Dec 2019 15:39:17 UTC
     *
     * @amoy/filter-warhol is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$h = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$h = "varying vec2 vTextureCoord;//passed from vect shader \n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\n\n\nvoid main(void)\n{\n    vec3 col = texture2D(uSampler, vTextureCoord).bgr;\n    float y = 0.3 *col.r + 0.59 * col.g + 0.11 * col.b;\n    y = y < 0.3 ? 0.0 : (y < 0.6 ? 0.5 : 1.0);\n    if (y == 0.5)\n        col = vec3(0.8, 0.0, 0.0);\n    else if (y == 1.0)\n        col = vec3(0.9, 0.9, 0.0);\n    else\n        col = vec3(0.0, 0.0, 0.0);\n        \n    gl_FragColor.a = 1.0;\n    gl_FragColor.rgb = col;\n\n}";

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-Warhol}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     * @param {number} [posx=10.0] light  x position
     * @param {number} [posy=10.0] light  y position
     */

    var AmoyWarholFilter = /*@__PURE__*/(function (Filter) {
        function AmoyWarholFilter() {
            Filter.call(this, vertex$h, fragment$h);
            // sub class
        }

        if ( Filter ) { AmoyWarholFilter.__proto__ = Filter; }
        AmoyWarholFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyWarholFilter.prototype.constructor = AmoyWarholFilter;

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyWarholFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            filterManager.applyFilter(this, input, output, clear);
        };

        return AmoyWarholFilter;
    }(core.Filter));

    /*!
     * @amoy/filter-colorblind - v3.0.29
     * Compiled Wed, 04 Dec 2019 07:31:38 UTC
     *
     * @amoy/filter-colorblind is licensed under the MIT License.
     * http://www.opensource.org/licenses/mit-license
     */

    var vertex$i = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";

    var fragment$i = "varying vec2 vTextureCoord;//passed from vect shader\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;// 2d texture\nuniform float m[20];\n\nfloat fu(float n){\n    return(n<0.?0.:(n<1.?n:1.));\n}\n\nvec4 colorMatrix(vec4 o){\n    float r=((o.r*m[0])+(o.g*m[1])+(o.b*m[2])+(o.a*m[3])+m[4]);\n    float g=((o.r*m[5])+(o.g*m[6])+(o.b*m[7])+(o.a*m[8])+m[9]);\n    float b=((o.r*m[10])+(o.g*m[11])+(o.b*m[12])+(o.a*m[13])+m[14]);\n    float a=((o.r*m[15])+(o.g*m[16])+(o.b*m[17])+(o.a*m[18])+m[19]);\n    \n    return vec4(fu(r),fu(g),fu(b),fu(a));\n    \n}\n\nvoid main(void)\n{\n    vec4 col=texture2D(uSampler,vTextureCoord);\n    \n    gl_FragColor=colorMatrix(col);\n    \n}";

    var AMOY_CLORBLINDE_TYPE_ENUM = {
        Protanopia:1,
        Protanomaly:2,
        Deuteranopia:3,
        Deuteranomaly:4,
        Tritanopia:5,
        Tritanomaly:6,
        Achromatopsia:7,
        Achromatomaly:8
    };

    var Protanopia = [0.567,0.433,0,0,0, 0.558,0.442,0,0,0, 0,0.242,0.758,0,0, 0,0,0,1,0, 0,0,0,0,1];

    var Protanomaly= [0.817,0.183,0,0,0, 0.333,0.667,0,0,0, 0,0.125,0.875,0,0, 0,0,0,1,0, 0,0,0,0,1];

    var Deuteranopia= [0.625,0.375,0,0,0, 0.7,0.3,0,0,0, 0,0.3,0.7,0,0, 0,0,0,1,0, 0,0,0,0,1];

    var Deuteranomaly = [0.8,0.2,0,0,0, 0.258,0.742,0,0,0, 0,0.142,0.858,0,0, 0,0,0,1,0, 0,0,0,0,1];

    var Tritanopia = [0.95,0.05,0,0,0, 0,0.433,0.567,0,0, 0,0.475,0.525,0,0, 0,0,0,1,0, 0,0,0,0,1];

    var Tritanomaly = [0.967,0.033,0,0,0, 0,0.733,0.267,0,0, 0,0.183,0.817,0,0, 0,0,0,1,0, 0,0,0,0,1];

    var Achromatopsia = [0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0.299,0.587,0.114,0,0, 0,0,0,1,0, 0,0,0,0,1];

    var Achromatomaly = [0.618,0.320,0.062,0,0, 0.163,0.775,0.062,0,0, 0.163,0.320,0.516,0,0,0,0,0,1,0,0,0,0,0];

    /**
     * @class
     * @see {@link https://www.npmjs.com/package/@amoy/filter-Warhol}
     * @see {@link https://www.npmjs.com/package/@amoy/filters}
     * @extends PIXI.Filter
     * @memberof AMOY.filters
     */

    var AmoyColorblindFilter = /*@__PURE__*/(function (Filter) {
        function AmoyColorblindFilter() {
            Filter.call(this, vertex$i, fragment$i);
            // sub class
            this.blindType = AMOY_CLORBLINDE_TYPE_ENUM.Protanopia;
        }

        if ( Filter ) { AmoyColorblindFilter.__proto__ = Filter; }
        AmoyColorblindFilter.prototype = Object.create( Filter && Filter.prototype );
        AmoyColorblindFilter.prototype.constructor = AmoyColorblindFilter;

        var prototypeAccessors = { blindType: { configurable: true } };

        /**
         * Override existing apply method in PIXI.Filter
         * @private
         */
        AmoyColorblindFilter.prototype.apply = function apply (filterManager, input, output, clear) {
            filterManager.applyFilter(this, input, output, clear);
        };

        prototypeAccessors.blindType.set = function (value){
            this._blindType = value;
            switch(this._blindType) {
                case AMOY_CLORBLINDE_TYPE_ENUM.Protanopia:{
                    this.uniforms.m = Protanopia;
                    break;
                }
                case AMOY_CLORBLINDE_TYPE_ENUM.Protanomaly:{
                    this.uniforms.m = Protanomaly;
                    break;
                }
                case AMOY_CLORBLINDE_TYPE_ENUM.Tritanopia:{
                    this.uniforms.m = Tritanopia;
                    break;
                }
                case AMOY_CLORBLINDE_TYPE_ENUM.Tritanomaly:{
                    this.uniforms.m = Tritanomaly;
                    break;
                }
                case AMOY_CLORBLINDE_TYPE_ENUM.Deuteranopia:{
                    this.uniforms.m = Deuteranopia;
                    break;
                }
                case AMOY_CLORBLINDE_TYPE_ENUM.Deuteranomaly:{
                    this.uniforms.m = Deuteranomaly;
                    break;
                }
                case AMOY_CLORBLINDE_TYPE_ENUM.Achromatopsia:{
                    this.uniforms.m = Achromatopsia;
                    break;
                }
                case AMOY_CLORBLINDE_TYPE_ENUM.Achromatomaly:{
                    this.uniforms.m = Achromatomaly;
                    break;
                }
            }
        };

        prototypeAccessors.blindType.get = function (){
            return this._blindType;
        };

        Object.defineProperties( AmoyColorblindFilter.prototype, prototypeAccessors );

        return AmoyColorblindFilter;
    }(core.Filter));

    /*!
     * VERSION: 2.1.3
     * DATE: 2019-05-17
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
     * This work is subject to the terms at http://greensock.com/standard-license or for
     * Club GreenSock members, the software agreement that was issued with your membership.
     *
     * @author: Jack Doyle, jack@greensock.com
     */
    /* eslint-disable */

    /* ES6 changes:
    	- declare and export _gsScope at top.
    	- set var TweenLite = the result of the main function
    	- export default TweenLite at the bottom
    	- return TweenLite at the bottom of the main function
    	- pass in _gsScope as the first parameter of the main function (which is actually at the bottom)
    	- remove the "export to multiple environments" in Definition().
     */
    var _gsScope = (typeof(window) !== "undefined") ? window : (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : undefined || {};

    var TweenLite = (function(window) {
    		var _exports = {},
    			_doc = window.document,
    			_globals = window.GreenSockGlobals = window.GreenSockGlobals || window;
    		if (_globals.TweenLite) {
    			return _globals.TweenLite; //in case the core set of classes is already loaded, don't instantiate twice.
    		}
    		var _namespace = function(ns) {
    				var a = ns.split("."),
    					p = _globals, i;
    				for (i = 0; i < a.length; i++) {
    					p[a[i]] = p = p[a[i]] || {};
    				}
    				return p;
    			},
    			gs = _namespace("com.greensock"),
    			_tinyNum = 0.00000001,
    			_slice = function(a) { //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
    				var b = [],
    					l = a.length,
    					i;
    				for (i = 0; i !== l; b.push(a[i++])) {}
    				return b;
    			},
    			_emptyFunc = function() {},
    			_isArray = (function() { //works around issues in iframe environments where the Array global isn't shared, thus if the object originates in a different window/iframe, "(obj instanceof Array)" will evaluate false. We added some speed optimizations to avoid Object.prototype.toString.call() unless it's absolutely necessary because it's VERY slow (like 20x slower)
    				var toString = Object.prototype.toString,
    					array = toString.call([]);
    				return function(obj) {
    					return obj != null && (obj instanceof Array || (typeof(obj) === "object" && !!obj.push && toString.call(obj) === array));
    				};
    			}()),
    			a, i, p, _ticker, _tickerActive,
    			_defLookup = {},

    			/**
    			 * @constructor
    			 * Defines a GreenSock class, optionally with an array of dependencies that must be instantiated first and passed into the definition.
    			 * This allows users to load GreenSock JS files in any order even if they have interdependencies (like CSSPlugin extends TweenPlugin which is
    			 * inside TweenLite.js, but if CSSPlugin is loaded first, it should wait to run its code until TweenLite.js loads and instantiates TweenPlugin
    			 * and then pass TweenPlugin to CSSPlugin's definition). This is all done automatically and internally.
    			 *
    			 * Every definition will be added to a "com.greensock" global object (typically window, but if a window.GreenSockGlobals object is found,
    			 * it will go there as of v1.7). For example, TweenLite will be found at window.com.greensock.TweenLite and since it's a global class that should be available anywhere,
    			 * it is ALSO referenced at window.TweenLite. However some classes aren't considered global, like the base com.greensock.core.Animation class, so
    			 * those will only be at the package like window.com.greensock.core.Animation. Again, if you define a GreenSockGlobals object on the window, everything
    			 * gets tucked neatly inside there instead of on the window directly. This allows you to do advanced things like load multiple versions of GreenSock
    			 * files and put them into distinct objects (imagine a banner ad uses a newer version but the main site uses an older one). In that case, you could
    			 * sandbox the banner one like:
    			 *
    			 * <script>
    			 *     var gs = window.GreenSockGlobals = {}; //the newer version we're about to load could now be referenced in a "gs" object, like gs.TweenLite.to(...). Use whatever alias you want as long as it's unique, "gs" or "banner" or whatever.
    			 * </script>
    			 * <script src="js/greensock/v1.7/TweenMax.js"></script>
    			 * <script>
    			 *     window.GreenSockGlobals = window._gsQueue = window._gsDefine = null; //reset it back to null (along with the special _gsQueue variable) so that the next load of TweenMax affects the window and we can reference things directly like TweenLite.to(...)
    			 * </script>
    			 * <script src="js/greensock/v1.6/TweenMax.js"></script>
    			 * <script>
    			 *     gs.TweenLite.to(...); //would use v1.7
    			 *     TweenLite.to(...); //would use v1.6
    			 * </script>
    			 *
    			 * @param {!string} ns The namespace of the class definition, leaving off "com.greensock." as that's assumed. For example, "TweenLite" or "plugins.CSSPlugin" or "easing.Back".
    			 * @param {!Array.<string>} dependencies An array of dependencies (described as their namespaces minus "com.greensock." prefix). For example ["TweenLite","plugins.TweenPlugin","core.Animation"]
    			 * @param {!function():Object} func The function that should be called and passed the resolved dependencies which will return the actual class for this definition.
    			 * @param {boolean=} global If true, the class will be added to the global scope (typically window unless you define a window.GreenSockGlobals object)
    			 */
    			Definition = function(ns, dependencies, func, global) {
    				this.sc = (_defLookup[ns]) ? _defLookup[ns].sc : []; //subclasses
    				_defLookup[ns] = this;
    				this.gsClass = null;
    				this.func = func;
    				var _classes = [];
    				this.check = function(init) {
    					var i = dependencies.length,
    						missing = i,
    						cur, a, n, cl;
    					while (--i > -1) {
    						if ((cur = _defLookup[dependencies[i]] || new Definition(dependencies[i], [])).gsClass) {
    							_classes[i] = cur.gsClass;
    							missing--;
    						} else if (init) {
    							cur.sc.push(this);
    						}
    					}
    					if (missing === 0 && func) {
    						a = ("com.greensock." + ns).split(".");
    						n = a.pop();
    						cl = _namespace(a.join("."))[n] = this.gsClass = func.apply(func, _classes);

    						//exports to multiple environments
    						if (global) {
    							_globals[n] = _exports[n] = cl; //provides a way to avoid global namespace pollution. By default, the main classes like TweenLite, Power1, Strong, etc. are added to window unless a GreenSockGlobals is defined. So if you want to have things added to a custom object instead, just do something like window.GreenSockGlobals = {} before loading any GreenSock files. You can even set up an alias like window.GreenSockGlobals = windows.gs = {} so that you can access everything like gs.TweenLite. Also remember that ALL classes are added to the window.com.greensock object (in their respective packages, like com.greensock.easing.Power1, com.greensock.TweenLite, etc.)
    							/*
    							if (typeof(module) !== "undefined" && module.exports) { //node
    								if (ns === moduleName) {
    									module.exports = _exports[moduleName] = cl;
    									for (i in _exports) {
    										cl[i] = _exports[i];
    									}
    								} else if (_exports[moduleName]) {
    									_exports[moduleName][n] = cl;
    								}
    							} else if (typeof(define) === "function" && define.amd){ //AMD
    								define((window.GreenSockAMDPath ? window.GreenSockAMDPath + "/" : "") + ns.split(".").pop(), [], function() { return cl; });
    							}
    							*/
    						}
    						for (i = 0; i < this.sc.length; i++) {
    							this.sc[i].check();
    						}
    					}
    				};
    				this.check(true);
    			},

    			//used to create Definition instances (which basically registers a class that has dependencies).
    			_gsDefine = window._gsDefine = function(ns, dependencies, func, global) {
    				return new Definition(ns, dependencies, func, global);
    			},

    			//a quick way to create a class that doesn't have any dependencies. Returns the class, but first registers it in the GreenSock namespace so that other classes can grab it (other classes might be dependent on the class).
    			_class = gs._class = function(ns, func, global) {
    				func = func || function() {};
    				_gsDefine(ns, [], function(){ return func; }, global);
    				return func;
    			};

    		_gsDefine.globals = _globals;



    /*
     * ----------------------------------------------------------------
     * Ease
     * ----------------------------------------------------------------
     */
    		var _baseParams = [0, 0, 1, 1],
    			Ease = _class("easing.Ease", function(func, extraParams, type, power) {
    				this._func = func;
    				this._type = type || 0;
    				this._power = power || 0;
    				this._params = extraParams ? _baseParams.concat(extraParams) : _baseParams;
    			}, true),
    			_easeMap = Ease.map = {},
    			_easeReg = Ease.register = function(ease, names, types, create) {
    				var na = names.split(","),
    					i = na.length,
    					ta = (types || "easeIn,easeOut,easeInOut").split(","),
    					e, name, j, type;
    				while (--i > -1) {
    					name = na[i];
    					e = create ? _class("easing."+name, null, true) : gs.easing[name] || {};
    					j = ta.length;
    					while (--j > -1) {
    						type = ta[j];
    						_easeMap[name + "." + type] = _easeMap[type + name] = e[type] = ease.getRatio ? ease : ease[type] || new ease();
    					}
    				}
    			};

    		p = Ease.prototype;
    		p._calcEnd = false;
    		p.getRatio = function(p) {
    			if (this._func) {
    				this._params[0] = p;
    				return this._func.apply(null, this._params);
    			}
    			var t = this._type,
    				pw = this._power,
    				r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;
    			if (pw === 1) {
    				r *= r;
    			} else if (pw === 2) {
    				r *= r * r;
    			} else if (pw === 3) {
    				r *= r * r * r;
    			} else if (pw === 4) {
    				r *= r * r * r * r;
    			}
    			return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
    		};

    		//create all the standard eases like Linear, Quad, Cubic, Quart, Quint, Strong, Power0, Power1, Power2, Power3, and Power4 (each with easeIn, easeOut, and easeInOut)
    		a = ["Linear","Quad","Cubic","Quart","Quint,Strong"];
    		i = a.length;
    		while (--i > -1) {
    			p = a[i]+",Power"+i;
    			_easeReg(new Ease(null,null,1,i), p, "easeOut", true);
    			_easeReg(new Ease(null,null,2,i), p, "easeIn" + ((i === 0) ? ",easeNone" : ""));
    			_easeReg(new Ease(null,null,3,i), p, "easeInOut");
    		}
    		_easeMap.linear = gs.easing.Linear.easeIn;
    		_easeMap.swing = gs.easing.Quad.easeInOut; //for jQuery folks


    /*
     * ----------------------------------------------------------------
     * EventDispatcher
     * ----------------------------------------------------------------
     */
    		var EventDispatcher = _class("events.EventDispatcher", function(target) {
    			this._listeners = {};
    			this._eventTarget = target || this;
    		});
    		p = EventDispatcher.prototype;

    		p.addEventListener = function(type, callback, scope, useParam, priority) {
    			priority = priority || 0;
    			var list = this._listeners[type],
    				index = 0,
    				listener, i;
    			if (this === _ticker && !_tickerActive) {
    				_ticker.wake();
    			}
    			if (list == null) {
    				this._listeners[type] = list = [];
    			}
    			i = list.length;
    			while (--i > -1) {
    				listener = list[i];
    				if (listener.c === callback && listener.s === scope) {
    					list.splice(i, 1);
    				} else if (index === 0 && listener.pr < priority) {
    					index = i + 1;
    				}
    			}
    			list.splice(index, 0, {c:callback, s:scope, up:useParam, pr:priority});
    		};

    		p.removeEventListener = function(type, callback) {
    			var list = this._listeners[type], i;
    			if (list) {
    				i = list.length;
    				while (--i > -1) {
    					if (list[i].c === callback) {
    						list.splice(i, 1);
    						return;
    					}
    				}
    			}
    		};

    		p.dispatchEvent = function(type) {
    			var list = this._listeners[type],
    				i, t, listener;
    			if (list) {
    				i = list.length;
    				if (i > 1) {
    					list = list.slice(0); //in case addEventListener() is called from within a listener/callback (otherwise the index could change, resulting in a skip)
    				}
    				t = this._eventTarget;
    				while (--i > -1) {
    					listener = list[i];
    					if (listener) {
    						if (listener.up) {
    							listener.c.call(listener.s || t, {type:type, target:t});
    						} else {
    							listener.c.call(listener.s || t);
    						}
    					}
    				}
    			}
    		};


    /*
     * ----------------------------------------------------------------
     * Ticker
     * ----------------------------------------------------------------
     */
     		var _reqAnimFrame = window.requestAnimationFrame,
    			_cancelAnimFrame = window.cancelAnimationFrame,
    			_getTime = Date.now || function() {return new Date().getTime();},
    			_lastUpdate = _getTime();

    		//now try to determine the requestAnimationFrame and cancelAnimationFrame functions and if none are found, we'll use a setTimeout()/clearTimeout() polyfill.
    		a = ["ms","moz","webkit","o"];
    		i = a.length;
    		while (--i > -1 && !_reqAnimFrame) {
    			_reqAnimFrame = window[a[i] + "RequestAnimationFrame"];
    			_cancelAnimFrame = window[a[i] + "CancelAnimationFrame"] || window[a[i] + "CancelRequestAnimationFrame"];
    		}

    		_class("Ticker", function(fps, useRAF) {
    			var _self = this,
    				_startTime = _getTime(),
    				_useRAF = (useRAF !== false && _reqAnimFrame) ? "auto" : false,
    				_lagThreshold = 500,
    				_adjustedLag = 33,
    				_tickWord = "tick", //helps reduce gc burden
    				_fps, _req, _id, _gap, _nextTime,
    				_tick = function(manual) {
    					var elapsed = _getTime() - _lastUpdate,
    						overlap, dispatch;
    					if (elapsed > _lagThreshold) {
    						_startTime += elapsed - _adjustedLag;
    					}
    					_lastUpdate += elapsed;
    					_self.time = (_lastUpdate - _startTime) / 1000;
    					overlap = _self.time - _nextTime;
    					if (!_fps || overlap > 0 || manual === true) {
    						_self.frame++;
    						_nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
    						dispatch = true;
    					}
    					if (manual !== true) { //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
    						_id = _req(_tick);
    					}
    					if (dispatch) {
    						_self.dispatchEvent(_tickWord);
    					}
    				};

    			EventDispatcher.call(_self);
    			_self.time = _self.frame = 0;
    			_self.tick = function() {
    				_tick(true);
    			};

    			_self.lagSmoothing = function(threshold, adjustedLag) {
    				if (!arguments.length) { //if lagSmoothing() is called with no arguments, treat it like a getter that returns a boolean indicating if it's enabled or not. This is purposely undocumented and is for internal use.
    					return (_lagThreshold < 1 / _tinyNum);
    				}
    				_lagThreshold = threshold || (1 / _tinyNum); //zero should be interpreted as basically unlimited
    				_adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
    			};

    			_self.sleep = function() {
    				if (_id == null) {
    					return;
    				}
    				if (!_useRAF || !_cancelAnimFrame) {
    					clearTimeout(_id);
    				} else {
    					_cancelAnimFrame(_id);
    				}
    				_req = _emptyFunc;
    				_id = null;
    				if (_self === _ticker) {
    					_tickerActive = false;
    				}
    			};

    			_self.wake = function(seamless) {
    				if (_id !== null) {
    					_self.sleep();
    				} else if (seamless) {
    					_startTime += -_lastUpdate + (_lastUpdate = _getTime());
    				} else if (_self.frame > 10) { //don't trigger lagSmoothing if we're just waking up, and make sure that at least 10 frames have elapsed because of the iOS bug that we work around below with the 1.5-second setTimout().
    					_lastUpdate = _getTime() - _lagThreshold + 5;
    				}
    				_req = (_fps === 0) ? _emptyFunc : (!_useRAF || !_reqAnimFrame) ? function(f) { return setTimeout(f, ((_nextTime - _self.time) * 1000 + 1) | 0); } : _reqAnimFrame;
    				if (_self === _ticker) {
    					_tickerActive = true;
    				}
    				_tick(2);
    			};

    			_self.fps = function(value) {
    				if (!arguments.length) {
    					return _fps;
    				}
    				_fps = value;
    				_gap = 1 / (_fps || 60);
    				_nextTime = this.time + _gap;
    				_self.wake();
    			};

    			_self.useRAF = function(value) {
    				if (!arguments.length) {
    					return _useRAF;
    				}
    				_self.sleep();
    				_useRAF = value;
    				_self.fps(_fps);
    			};
    			_self.fps(fps);

    			//a bug in iOS 6 Safari occasionally prevents the requestAnimationFrame from working initially, so we use a 1.5-second timeout that automatically falls back to setTimeout() if it senses this condition.
    			setTimeout(function() {
    				if (_useRAF === "auto" && _self.frame < 5 && (_doc || {}).visibilityState !== "hidden") {
    					_self.useRAF(false);
    				}
    			}, 1500);
    		});

    		p = gs.Ticker.prototype = new gs.events.EventDispatcher();
    		p.constructor = gs.Ticker;


    /*
     * ----------------------------------------------------------------
     * Animation
     * ----------------------------------------------------------------
     */
    		var Animation = _class("core.Animation", function(duration, vars) {
    				this.vars = vars = vars || {};
    				this._duration = this._totalDuration = duration || 0;
    				this._delay = Number(vars.delay) || 0;
    				this._timeScale = 1;
    				this._active = !!vars.immediateRender;
    				this.data = vars.data;
    				this._reversed = !!vars.reversed;

    				if (!_rootTimeline) {
    					return;
    				}
    				if (!_tickerActive) { //some browsers (like iOS 6 Safari) shut down JavaScript execution when the tab is disabled and they [occasionally] neglect to start up requestAnimationFrame again when returning - this code ensures that the engine starts up again properly.
    					_ticker.wake();
    				}

    				var tl = this.vars.useFrames ? _rootFramesTimeline : _rootTimeline;
    				tl.add(this, tl._time);

    				if (this.vars.paused) {
    					this.paused(true);
    				}
    			});

    		_ticker = Animation.ticker = new gs.Ticker();
    		p = Animation.prototype;
    		p._dirty = p._gc = p._initted = p._paused = false;
    		p._totalTime = p._time = 0;
    		p._rawPrevTime = -1;
    		p._next = p._last = p._onUpdate = p._timeline = p.timeline = null;
    		p._paused = false;


    		//some browsers (like iOS) occasionally drop the requestAnimationFrame event when the user switches to a different tab and then comes back again, so we use a 2-second setTimeout() to sense if/when that condition occurs and then wake() the ticker.
    		var _checkTimeout = function() {
    				if (_tickerActive && _getTime() - _lastUpdate > 2000 && ((_doc || {}).visibilityState !== "hidden" || !_ticker.lagSmoothing())) { //note: if the tab is hidden, we should still wake if lagSmoothing has been disabled.
    					_ticker.wake();
    				}
    				var t = setTimeout(_checkTimeout, 2000);
    				if (t.unref) {
    					// allows a node process to exit even if the timeout’s callback hasn't been invoked. Without it, the node process could hang as this function is called every two seconds.
    					t.unref();
    				}
    			};
    		_checkTimeout();


    		p.play = function(from, suppressEvents) {
    			if (from != null) {
    				this.seek(from, suppressEvents);
    			}
    			return this.reversed(false).paused(false);
    		};

    		p.pause = function(atTime, suppressEvents) {
    			if (atTime != null) {
    				this.seek(atTime, suppressEvents);
    			}
    			return this.paused(true);
    		};

    		p.resume = function(from, suppressEvents) {
    			if (from != null) {
    				this.seek(from, suppressEvents);
    			}
    			return this.paused(false);
    		};

    		p.seek = function(time, suppressEvents) {
    			return this.totalTime(Number(time), suppressEvents !== false);
    		};

    		p.restart = function(includeDelay, suppressEvents) {
    			return this.reversed(false).paused(false).totalTime(includeDelay ? -this._delay : 0, (suppressEvents !== false), true);
    		};

    		p.reverse = function(from, suppressEvents) {
    			if (from != null) {
    				this.seek((from || this.totalDuration()), suppressEvents);
    			}
    			return this.reversed(true).paused(false);
    		};

    		p.render = function(time, suppressEvents, force) {
    			//stub - we override this method in subclasses.
    		};

    		p.invalidate = function() {
    			this._time = this._totalTime = 0;
    			this._initted = this._gc = false;
    			this._rawPrevTime = -1;
    			if (this._gc || !this.timeline) {
    				this._enabled(true);
    			}
    			return this;
    		};

    		p.isActive = function() {
    			var tl = this._timeline, //the 2 root timelines won't have a _timeline; they're always active.
    				startTime = this._startTime,
    				rawTime;
    			return (!tl || (!this._gc && !this._paused && tl.isActive() && (rawTime = tl.rawTime(true)) >= startTime && rawTime < startTime + this.totalDuration() / this._timeScale - _tinyNum));
    		};

    		p._enabled = function (enabled, ignoreTimeline) {
    			if (!_tickerActive) {
    				_ticker.wake();
    			}
    			this._gc = !enabled;
    			this._active = this.isActive();
    			if (ignoreTimeline !== true) {
    				if (enabled && !this.timeline) {
    					this._timeline.add(this, this._startTime - this._delay);
    				} else if (!enabled && this.timeline) {
    					this._timeline._remove(this, true);
    				}
    			}
    			return false;
    		};


    		p._kill = function(vars, target) {
    			return this._enabled(false, false);
    		};

    		p.kill = function(vars, target) {
    			this._kill(vars, target);
    			return this;
    		};

    		p._uncache = function(includeSelf) {
    			var tween = includeSelf ? this : this.timeline;
    			while (tween) {
    				tween._dirty = true;
    				tween = tween.timeline;
    			}
    			return this;
    		};

    		p._swapSelfInParams = function(params) {
    			var i = params.length,
    				copy = params.concat();
    			while (--i > -1) {
    				if (params[i] === "{self}") {
    					copy[i] = this;
    				}
    			}
    			return copy;
    		};

    		p._callback = function(type) {
    			var v = this.vars,
    				callback = v[type],
    				params = v[type + "Params"],
    				scope = v[type + "Scope"] || v.callbackScope || this,
    				l = params ? params.length : 0;
    			switch (l) { //speed optimization; call() is faster than apply() so use it when there are only a few parameters (which is by far most common). Previously we simply did var v = this.vars; v[type].apply(v[type + "Scope"] || v.callbackScope || this, v[type + "Params"] || _blankArray);
    				case 0: callback.call(scope); break;
    				case 1: callback.call(scope, params[0]); break;
    				case 2: callback.call(scope, params[0], params[1]); break;
    				default: callback.apply(scope, params);
    			}
    		};

    //----Animation getters/setters --------------------------------------------------------

    		p.eventCallback = function(type, callback, params, scope) {
    			if ((type || "").substr(0,2) === "on") {
    				var v = this.vars;
    				if (arguments.length === 1) {
    					return v[type];
    				}
    				if (callback == null) {
    					delete v[type];
    				} else {
    					v[type] = callback;
    					v[type + "Params"] = (_isArray(params) && params.join("").indexOf("{self}") !== -1) ? this._swapSelfInParams(params) : params;
    					v[type + "Scope"] = scope;
    				}
    				if (type === "onUpdate") {
    					this._onUpdate = callback;
    				}
    			}
    			return this;
    		};

    		p.delay = function(value) {
    			if (!arguments.length) {
    				return this._delay;
    			}
    			if (this._timeline.smoothChildTiming) {
    				this.startTime( this._startTime + value - this._delay );
    			}
    			this._delay = value;
    			return this;
    		};

    		p.duration = function(value) {
    			if (!arguments.length) {
    				this._dirty = false;
    				return this._duration;
    			}
    			this._duration = this._totalDuration = value;
    			this._uncache(true); //true in case it's a TweenMax or TimelineMax that has a repeat - we'll need to refresh the totalDuration.
    			if (this._timeline.smoothChildTiming) { if (this._time > 0) { if (this._time < this._duration) { if (value !== 0) {
    				this.totalTime(this._totalTime * (value / this._duration), true);
    			} } } }
    			return this;
    		};

    		p.totalDuration = function(value) {
    			this._dirty = false;
    			return (!arguments.length) ? this._totalDuration : this.duration(value);
    		};

    		p.time = function(value, suppressEvents) {
    			if (!arguments.length) {
    				return this._time;
    			}
    			if (this._dirty) {
    				this.totalDuration();
    			}
    			return this.totalTime((value > this._duration) ? this._duration : value, suppressEvents);
    		};

    		p.totalTime = function(time, suppressEvents, uncapped) {
    			if (!_tickerActive) {
    				_ticker.wake();
    			}
    			if (!arguments.length) {
    				return this._totalTime;
    			}
    			if (this._timeline) {
    				if (time < 0 && !uncapped) {
    					time += this.totalDuration();
    				}
    				if (this._timeline.smoothChildTiming) {
    					if (this._dirty) {
    						this.totalDuration();
    					}
    					var totalDuration = this._totalDuration,
    						tl = this._timeline;
    					if (time > totalDuration && !uncapped) {
    						time = totalDuration;
    					}
    					this._startTime = (this._paused ? this._pauseTime : tl._time) - ((!this._reversed ? time : totalDuration - time) / this._timeScale);
    					if (!tl._dirty) { //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
    						this._uncache(false);
    					}
    					//in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The startTime of that child would get pushed out, but one of the ancestors may have completed.
    					if (tl._timeline) {
    						while (tl._timeline) {
    							if (tl._timeline._time !== (tl._startTime + tl._totalTime) / tl._timeScale) {
    								tl.totalTime(tl._totalTime, true);
    							}
    							tl = tl._timeline;
    						}
    					}
    				}
    				if (this._gc) {
    					this._enabled(true, false);
    				}
    				if (this._totalTime !== time || this._duration === 0) {
    					if (_lazyTweens.length) {
    						_lazyRender();
    					}
    					this.render(time, suppressEvents, false);
    					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
    						_lazyRender();
    					}
    				}
    			}
    			return this;
    		};

    		p.progress = p.totalProgress = function(value, suppressEvents) {
    			var duration = this.duration();
    			return (!arguments.length) ? (duration ? this._time / duration : this.ratio) : this.totalTime(duration * value, suppressEvents);
    		};

    		p.startTime = function(value) {
    			if (!arguments.length) {
    				return this._startTime;
    			}
    			if (value !== this._startTime) {
    				this._startTime = value;
    				if (this.timeline) { if (this.timeline._sortChildren) {
    					this.timeline.add(this, value - this._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
    				} }
    			}
    			return this;
    		};

    		p.endTime = function(includeRepeats) {
    			return this._startTime + ((includeRepeats != false) ? this.totalDuration() : this.duration()) / this._timeScale;
    		};

    		p.timeScale = function(value) {
    			if (!arguments.length) {
    				return this._timeScale;
    			}
    			var pauseTime, t;
    			value = value || _tinyNum; //can't allow zero because it'll throw the math off
    			if (this._timeline && this._timeline.smoothChildTiming) {
    				pauseTime = this._pauseTime;
    				t = (pauseTime || pauseTime === 0) ? pauseTime : this._timeline.totalTime();
    				this._startTime = t - ((t - this._startTime) * this._timeScale / value);
    			}
    			this._timeScale = value;
    			t = this.timeline;
    			while (t && t.timeline) { //must update the duration/totalDuration of all ancestor timelines immediately in case in the middle of a render loop, one tween alters another tween's timeScale which shoves its startTime before 0, forcing the parent timeline to shift around and shiftChildren() which could affect that next tween's render (startTime). Doesn't matter for the root timeline though.
    				t._dirty = true;
    				t.totalDuration();
    				t = t.timeline;
    			}
    			return this;
    		};

    		p.reversed = function(value) {
    			if (!arguments.length) {
    				return this._reversed;
    			}
    			if (value != this._reversed) {
    				this._reversed = value;
    				this.totalTime(((this._timeline && !this._timeline.smoothChildTiming) ? this.totalDuration() - this._totalTime : this._totalTime), true);
    			}
    			return this;
    		};

    		p.paused = function(value) {
    			if (!arguments.length) {
    				return this._paused;
    			}
    			var tl = this._timeline,
    				raw, elapsed;
    			if (value != this._paused) { if (tl) {
    				if (!_tickerActive && !value) {
    					_ticker.wake();
    				}
    				raw = tl.rawTime();
    				elapsed = raw - this._pauseTime;
    				if (!value && tl.smoothChildTiming) {
    					this._startTime += elapsed;
    					this._uncache(false);
    				}
    				this._pauseTime = value ? raw : null;
    				this._paused = value;
    				this._active = this.isActive();
    				if (!value && elapsed !== 0 && this._initted && this.duration()) {
    					raw = tl.smoothChildTiming ? this._totalTime : (raw - this._startTime) / this._timeScale;
    					this.render(raw, (raw === this._totalTime), true); //in case the target's properties changed via some other tween or manual update by the user, we should force a render.
    				}
    			} }
    			if (this._gc && !value) {
    				this._enabled(true, false);
    			}
    			return this;
    		};


    /*
     * ----------------------------------------------------------------
     * SimpleTimeline
     * ----------------------------------------------------------------
     */
    		var SimpleTimeline = _class("core.SimpleTimeline", function(vars) {
    			Animation.call(this, 0, vars);
    			this.autoRemoveChildren = this.smoothChildTiming = true;
    		});

    		p = SimpleTimeline.prototype = new Animation();
    		p.constructor = SimpleTimeline;
    		p.kill()._gc = false;
    		p._first = p._last = p._recent = null;
    		p._sortChildren = false;

    		p.add = p.insert = function(child, position, align, stagger) {
    			var prevTween, st;
    			child._startTime = Number(position || 0) + child._delay;
    			if (child._paused) { if (this !== child._timeline) { //we only adjust the _pauseTime if it wasn't in this timeline already. Remember, sometimes a tween will be inserted again into the same timeline when its startTime is changed so that the tweens in the TimelineLite/Max are re-ordered properly in the linked list (so everything renders in the proper order).
    				child._pauseTime = this.rawTime() - (child._timeline.rawTime() - child._pauseTime);
    			} }
    			if (child.timeline) {
    				child.timeline._remove(child, true); //removes from existing timeline so that it can be properly added to this one.
    			}
    			child.timeline = child._timeline = this;
    			if (child._gc) {
    				child._enabled(true, true);
    			}
    			prevTween = this._last;
    			if (this._sortChildren) {
    				st = child._startTime;
    				while (prevTween && prevTween._startTime > st) {
    					prevTween = prevTween._prev;
    				}
    			}
    			if (prevTween) {
    				child._next = prevTween._next;
    				prevTween._next = child;
    			} else {
    				child._next = this._first;
    				this._first = child;
    			}
    			if (child._next) {
    				child._next._prev = child;
    			} else {
    				this._last = child;
    			}
    			child._prev = prevTween;
    			this._recent = child;
    			if (this._timeline) {
    				this._uncache(true);
    			}
    			return this;
    		};

    		p._remove = function(tween, skipDisable) {
    			if (tween.timeline === this) {
    				if (!skipDisable) {
    					tween._enabled(false, true);
    				}

    				if (tween._prev) {
    					tween._prev._next = tween._next;
    				} else if (this._first === tween) {
    					this._first = tween._next;
    				}
    				if (tween._next) {
    					tween._next._prev = tween._prev;
    				} else if (this._last === tween) {
    					this._last = tween._prev;
    				}
    				tween._next = tween._prev = tween.timeline = null;
    				if (tween === this._recent) {
    					this._recent = this._last;
    				}

    				if (this._timeline) {
    					this._uncache(true);
    				}
    			}
    			return this;
    		};

    		p.render = function(time, suppressEvents, force) {
    			var tween = this._first,
    				next;
    			this._totalTime = this._time = this._rawPrevTime = time;
    			while (tween) {
    				next = tween._next; //record it here because the value could change after rendering...
    				if (tween._active || (time >= tween._startTime && !tween._paused && !tween._gc)) {
    					if (!tween._reversed) {
    						tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
    					} else {
    						tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
    					}
    				}
    				tween = next;
    			}
    		};

    		p.rawTime = function() {
    			if (!_tickerActive) {
    				_ticker.wake();
    			}
    			return this._totalTime;
    		};

    /*
     * ----------------------------------------------------------------
     * TweenLite
     * ----------------------------------------------------------------
     */
    		var TweenLite = _class("TweenLite", function(target, duration, vars) {
    				Animation.call(this, duration, vars);
    				this.render = TweenLite.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)

    				if (target == null) {
    					throw "Cannot tween a null target.";
    				}

    				this.target = target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;

    				var isSelector = (target.jquery || (target.length && target !== window && target[0] && (target[0] === window || (target[0].nodeType && target[0].style && !target.nodeType)))),
    					overwrite = this.vars.overwrite,
    					i, targ, targets;

    				this._overwrite = overwrite = (overwrite == null) ? _overwriteLookup[TweenLite.defaultOverwrite] : (typeof(overwrite) === "number") ? overwrite >> 0 : _overwriteLookup[overwrite];

    				if ((isSelector || target instanceof Array || (target.push && _isArray(target))) && typeof(target[0]) !== "number") {
    					this._targets = targets = _slice(target);  //don't use Array.prototype.slice.call(target, 0) because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
    					this._propLookup = [];
    					this._siblings = [];
    					for (i = 0; i < targets.length; i++) {
    						targ = targets[i];
    						if (!targ) {
    							targets.splice(i--, 1);
    							continue;
    						} else if (typeof(targ) === "string") {
    							targ = targets[i--] = TweenLite.selector(targ); //in case it's an array of strings
    							if (typeof(targ) === "string") {
    								targets.splice(i+1, 1); //to avoid an endless loop (can't imagine why the selector would return a string, but just in case)
    							}
    							continue;
    						} else if (targ.length && targ !== window && targ[0] && (targ[0] === window || (targ[0].nodeType && targ[0].style && !targ.nodeType))) { //in case the user is passing in an array of selector objects (like jQuery objects), we need to check one more level and pull things out if necessary. Also note that <select> elements pass all the criteria regarding length and the first child having style, so we must also check to ensure the target isn't an HTML node itself.
    							targets.splice(i--, 1);
    							this._targets = targets = targets.concat(_slice(targ));
    							continue;
    						}
    						this._siblings[i] = _register(targ, this, false);
    						if (overwrite === 1) { if (this._siblings[i].length > 1) {
    							_applyOverwrite(targ, this, null, 1, this._siblings[i]);
    						} }
    					}

    				} else {
    					this._propLookup = {};
    					this._siblings = _register(target, this, false);
    					if (overwrite === 1) { if (this._siblings.length > 1) {
    						_applyOverwrite(target, this, null, 1, this._siblings);
    					} }
    				}
    				if (this.vars.immediateRender || (duration === 0 && this._delay === 0 && this.vars.immediateRender !== false)) {
    					this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
    					this.render(Math.min(0, -this._delay)); //in case delay is negative
    				}
    			}, true),
    			_isSelector = function(v) {
    				return (v && v.length && v !== window && v[0] && (v[0] === window || (v[0].nodeType && v[0].style && !v.nodeType))); //we cannot check "nodeType" if the target is window from within an iframe, otherwise it will trigger a security error in some browsers like Firefox.
    			},
    			_autoCSS = function(vars, target) {
    				var css = {},
    					p;
    				for (p in vars) {
    					if (!_reservedProps[p] && (!(p in target) || p === "transform" || p === "x" || p === "y" || p === "width" || p === "height" || p === "className" || p === "border") && (!_plugins[p] || (_plugins[p] && _plugins[p]._autoCSS))) { //note: <img> elements contain read-only "x" and "y" properties. We should also prioritize editing css width/height rather than the element's properties.
    						css[p] = vars[p];
    						delete vars[p];
    					}
    				}
    				vars.css = css;
    			};

    		p = TweenLite.prototype = new Animation();
    		p.constructor = TweenLite;
    		p.kill()._gc = false;

    //----TweenLite defaults, overwrite management, and root updates ----------------------------------------------------

    		p.ratio = 0;
    		p._firstPT = p._targets = p._overwrittenProps = p._startAt = null;
    		p._notifyPluginsOfEnabled = p._lazy = false;

    		TweenLite.version = "2.1.3";
    		TweenLite.defaultEase = p._ease = new Ease(null, null, 1, 1);
    		TweenLite.defaultOverwrite = "auto";
    		TweenLite.ticker = _ticker;
    		TweenLite.autoSleep = 120;
    		TweenLite.lagSmoothing = function(threshold, adjustedLag) {
    			_ticker.lagSmoothing(threshold, adjustedLag);
    		};

    		TweenLite.selector = window.$ || window.jQuery || function(e) {
    			var selector = window.$ || window.jQuery;
    			if (selector) {
    				TweenLite.selector = selector;
    				return selector(e);
    			}
    			if (!_doc) { //in some dev environments (like Angular 6), GSAP gets loaded before the document is defined! So re-query it here if/when necessary.
    				_doc = window.document;
    			}
    			return (!_doc) ? e : (_doc.querySelectorAll ? _doc.querySelectorAll(e) : _doc.getElementById((e.charAt(0) === "#") ? e.substr(1) : e));
    		};

    		var _lazyTweens = [],
    			_lazyLookup = {},
    			_numbersExp = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig,
    			_relExp = /[\+-]=-?[\.\d]/,
    			//_nonNumbersExp = /(?:([\-+](?!(\d|=)))|[^\d\-+=e]|(e(?![\-+][\d])))+/ig,
    			_setRatio = function(v) {
    				var pt = this._firstPT,
    					min = 0.000001,
    					val;
    				while (pt) {
    					val = !pt.blob ? pt.c * v + pt.s : (v === 1 && this.end != null) ? this.end : v ? this.join("") : this.start;
    					if (pt.m) {
    						val = pt.m.call(this._tween, val, this._target || pt.t, this._tween);
    					} else if (val < min) { if (val > -min && !pt.blob) { //prevents issues with converting very small numbers to strings in the browser
    						val = 0;
    					} }
    					if (!pt.f) {
    						pt.t[pt.p] = val;
    					} else if (pt.fp) {
    						pt.t[pt.p](pt.fp, val);
    					} else {
    						pt.t[pt.p](val);
    					}
    					pt = pt._next;
    				}
    			},
    			_blobRound = function(v) {
    				return (((v * 1000) | 0) / 1000) + "";
    			},
    			//compares two strings (start/end), finds the numbers that are different and spits back an array representing the whole value but with the changing values isolated as elements. For example, "rgb(0,0,0)" and "rgb(100,50,0)" would become ["rgb(", 0, ",", 50, ",0)"]. Notice it merges the parts that are identical (performance optimization). The array also has a linked list of PropTweens attached starting with _firstPT that contain the tweening data (t, p, s, c, f, etc.). It also stores the starting value as a "start" property so that we can revert to it if/when necessary, like when a tween rewinds fully. If the quantity of numbers differs between the start and end, it will always prioritize the end value(s). The pt parameter is optional - it's for a PropTween that will be appended to the end of the linked list and is typically for actually setting the value after all of the elements have been updated (with array.join("")).
    			_blobDif = function(start, end, filter, pt) {
    				var a = [],
    					charIndex = 0,
    					s = "",
    					color = 0,
    					startNums, endNums, num, i, l, nonNumbers, currentNum;
    				a.start = start;
    				a.end = end;
    				start = a[0] = start + ""; //ensure values are strings
    				end = a[1] = end + "";
    				if (filter) {
    					filter(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.
    					start = a[0];
    					end = a[1];
    				}
    				a.length = 0;
    				startNums = start.match(_numbersExp) || [];
    				endNums = end.match(_numbersExp) || [];
    				if (pt) {
    					pt._next = null;
    					pt.blob = 1;
    					a._firstPT = a._applyPT = pt; //apply last in the linked list (which means inserting it first)
    				}
    				l = endNums.length;
    				for (i = 0; i < l; i++) {
    					currentNum = endNums[i];
    					nonNumbers = end.substr(charIndex, end.indexOf(currentNum, charIndex)-charIndex);
    					s += (nonNumbers || !i) ? nonNumbers : ","; //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
    					charIndex += nonNumbers.length;
    					if (color) { //sense rgba() values and round them.
    						color = (color + 1) % 5;
    					} else if (nonNumbers.substr(-5) === "rgba(") {
    						color = 1;
    					}
    					if (currentNum === startNums[i] || startNums.length <= i) {
    						s += currentNum;
    					} else {
    						if (s) {
    							a.push(s);
    							s = "";
    						}
    						num = parseFloat(startNums[i]);
    						a.push(num);
    						a._firstPT = {_next: a._firstPT, t:a, p: a.length-1, s:num, c:((currentNum.charAt(1) === "=") ? parseInt(currentNum.charAt(0) + "1", 10) * parseFloat(currentNum.substr(2)) : (parseFloat(currentNum) - num)) || 0, f:0, m:(color && color < 4) ? Math.round : _blobRound}; //limiting to 3 decimal places and casting as a string can really help performance when array.join() is called!
    						//note: we don't set _prev because we'll never need to remove individual PropTweens from this list.
    					}
    					charIndex += currentNum.length;
    				}
    				s += end.substr(charIndex);
    				if (s) {
    					a.push(s);
    				}
    				a.setRatio = _setRatio;
    				if (_relExp.test(end)) { //if the end string contains relative values, delete it so that on the final render (in _setRatio()), we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
    					a.end = null;
    				}
    				return a;
    			},
    			//note: "funcParam" is only necessary for function-based getters/setters that require an extra parameter like getAttribute("width") and setAttribute("width", value). In this example, funcParam would be "width". Used by AttrPlugin for example.
    			_addPropTween = function(target, prop, start, end, overwriteProp, mod, funcParam, stringFilter, index) {
    				if (typeof(end) === "function") {
    					end = end(index || 0, target);
    				}
    				var type = typeof(target[prop]),
    					getterName = (type !== "function") ? "" : ((prop.indexOf("set") || typeof(target["get" + prop.substr(3)]) !== "function") ? prop : "get" + prop.substr(3)),
    					s = (start !== "get") ? start : !getterName ? target[prop] : funcParam ? target[getterName](funcParam) : target[getterName](),
    					isRelative = (typeof(end) === "string" && end.charAt(1) === "="),
    					pt = {t:target, p:prop, s:s, f:(type === "function"), pg:0, n:overwriteProp || prop, m:(!mod ? 0 : (typeof(mod) === "function") ? mod : Math.round), pr:0, c:isRelative ? parseInt(end.charAt(0) + "1", 10) * parseFloat(end.substr(2)) : (parseFloat(end) - s) || 0},
    					blob;

    				if (typeof(s) !== "number" || (typeof(end) !== "number" && !isRelative)) {
    					if (funcParam || isNaN(s) || (!isRelative && isNaN(end)) || typeof(s) === "boolean" || typeof(end) === "boolean") {
    						//a blob (string that has multiple numbers in it)
    						pt.fp = funcParam;
    						blob = _blobDif(s, (isRelative ? (parseFloat(pt.s) + pt.c) + (pt.s + "").replace(/[0-9\-\.]/g, "") : end), stringFilter || TweenLite.defaultStringFilter, pt);
    						pt = {t: blob, p: "setRatio", s: 0, c: 1, f: 2, pg: 0, n: overwriteProp || prop, pr: 0, m: 0}; //"2" indicates it's a Blob property tween. Needed for RoundPropsPlugin for example.
    					} else {
    						pt.s = parseFloat(s);
    						if (!isRelative) {
    							pt.c = (parseFloat(end) - pt.s) || 0;
    						}
    					}
    				}
    				if (pt.c) { //only add it to the linked list if there's a change.
    					if ((pt._next = this._firstPT)) {
    						pt._next._prev = pt;
    					}
    					this._firstPT = pt;
    					return pt;
    				}
    			},
    			_internals = TweenLite._internals = {isArray:_isArray, isSelector:_isSelector, lazyTweens:_lazyTweens, blobDif:_blobDif}, //gives us a way to expose certain private values to other GreenSock classes without contaminating tha main TweenLite object.
    			_plugins = TweenLite._plugins = {},
    			_tweenLookup = _internals.tweenLookup = {},
    			_tweenLookupNum = 0,
    			_reservedProps = _internals.reservedProps = {ease:1, delay:1, overwrite:1, onComplete:1, onCompleteParams:1, onCompleteScope:1, useFrames:1, runBackwards:1, startAt:1, onUpdate:1, onUpdateParams:1, onUpdateScope:1, onStart:1, onStartParams:1, onStartScope:1, onReverseComplete:1, onReverseCompleteParams:1, onReverseCompleteScope:1, onRepeat:1, onRepeatParams:1, onRepeatScope:1, easeParams:1, yoyo:1, immediateRender:1, repeat:1, repeatDelay:1, data:1, paused:1, reversed:1, autoCSS:1, lazy:1, onOverwrite:1, callbackScope:1, stringFilter:1, id:1, yoyoEase:1, stagger:1},
    			_overwriteLookup = {none:0, all:1, auto:2, concurrent:3, allOnStart:4, preexisting:5, "true":1, "false":0},
    			_rootFramesTimeline = Animation._rootFramesTimeline = new SimpleTimeline(),
    			_rootTimeline = Animation._rootTimeline = new SimpleTimeline(),
    			_nextGCFrame = 30,
    			_lazyRender = _internals.lazyRender = function() {
    				var l = _lazyTweens.length,
    					i, tween;
    				_lazyLookup = {};
    				for (i = 0; i < l; i++) {
    					tween = _lazyTweens[i];
    					if (tween && tween._lazy !== false) {
    						tween.render(tween._lazy[0], tween._lazy[1], true);
    						tween._lazy = false;
    					}
    				}
    				_lazyTweens.length = 0;
    			};

    		_rootTimeline._startTime = _ticker.time;
    		_rootFramesTimeline._startTime = _ticker.frame;
    		_rootTimeline._active = _rootFramesTimeline._active = true;
    		setTimeout(_lazyRender, 1); //on some mobile devices, there isn't a "tick" before code runs which means any lazy renders wouldn't run before the next official "tick".

    		Animation._updateRoot = TweenLite.render = function() {
    				var i, a, p;
    				if (_lazyTweens.length) { //if code is run outside of the requestAnimationFrame loop, there may be tweens queued AFTER the engine refreshed, so we need to ensure any pending renders occur before we refresh again.
    					_lazyRender();
    				}
    				_rootTimeline.render((_ticker.time - _rootTimeline._startTime) * _rootTimeline._timeScale, false, false);
    				_rootFramesTimeline.render((_ticker.frame - _rootFramesTimeline._startTime) * _rootFramesTimeline._timeScale, false, false);
    				if (_lazyTweens.length) {
    					_lazyRender();
    				}
    				if (_ticker.frame >= _nextGCFrame) { //dump garbage every 120 frames or whatever the user sets TweenLite.autoSleep to
    					_nextGCFrame = _ticker.frame + (parseInt(TweenLite.autoSleep, 10) || 120);
    					for (p in _tweenLookup) {
    						a = _tweenLookup[p].tweens;
    						i = a.length;
    						while (--i > -1) {
    							if (a[i]._gc) {
    								a.splice(i, 1);
    							}
    						}
    						if (a.length === 0) {
    							delete _tweenLookup[p];
    						}
    					}
    					//if there are no more tweens in the root timelines, or if they're all paused, make the _timer sleep to reduce load on the CPU slightly
    					p = _rootTimeline._first;
    					if (!p || p._paused) { if (TweenLite.autoSleep && !_rootFramesTimeline._first && _ticker._listeners.tick.length === 1) {
    						while (p && p._paused) {
    							p = p._next;
    						}
    						if (!p) {
    							_ticker.sleep();
    						}
    					} }
    				}
    			};

    		_ticker.addEventListener("tick", Animation._updateRoot);

    		var _register = function(target, tween, scrub) {
    				var id = target._gsTweenID, a, i;
    				if (!_tweenLookup[id || (target._gsTweenID = id = "t" + (_tweenLookupNum++))]) {
    					_tweenLookup[id] = {target:target, tweens:[]};
    				}
    				if (tween) {
    					a = _tweenLookup[id].tweens;
    					a[(i = a.length)] = tween;
    					if (scrub) {
    						while (--i > -1) {
    							if (a[i] === tween) {
    								a.splice(i, 1);
    							}
    						}
    					}
    				}
    				return _tweenLookup[id].tweens;
    			},
    			_onOverwrite = function(overwrittenTween, overwritingTween, target, killedProps) {
    				var func = overwrittenTween.vars.onOverwrite, r1, r2;
    				if (func) {
    					r1 = func(overwrittenTween, overwritingTween, target, killedProps);
    				}
    				func = TweenLite.onOverwrite;
    				if (func) {
    					r2 = func(overwrittenTween, overwritingTween, target, killedProps);
    				}
    				return (r1 !== false && r2 !== false);
    			},
    			_applyOverwrite = function(target, tween, props, mode, siblings) {
    				var i, changed, curTween, l;
    				if (mode === 1 || mode >= 4) {
    					l = siblings.length;
    					for (i = 0; i < l; i++) {
    						if ((curTween = siblings[i]) !== tween) {
    							if (!curTween._gc) {
    								if (curTween._kill(null, target, tween)) {
    									changed = true;
    								}
    							}
    						} else if (mode === 5) {
    							break;
    						}
    					}
    					return changed;
    				}
    				//NOTE: Add tiny amount to overcome floating point errors that can cause the startTime to be VERY slightly off (when a tween's time() is set for example)
    				var startTime = tween._startTime + _tinyNum,
    					overlaps = [],
    					oCount = 0,
    					zeroDur = (tween._duration === 0),
    					globalStart;
    				i = siblings.length;
    				while (--i > -1) {
    					if ((curTween = siblings[i]) === tween || curTween._gc || curTween._paused) ; else if (curTween._timeline !== tween._timeline) {
    						globalStart = globalStart || _checkOverlap(tween, 0, zeroDur);
    						if (_checkOverlap(curTween, globalStart, zeroDur) === 0) {
    							overlaps[oCount++] = curTween;
    						}
    					} else if (curTween._startTime <= startTime) { if (curTween._startTime + curTween.totalDuration() / curTween._timeScale > startTime) { if (!((zeroDur || !curTween._initted) && startTime - curTween._startTime <= _tinyNum * 2)) {
    						overlaps[oCount++] = curTween;
    					} } }
    				}

    				i = oCount;
    				while (--i > -1) {
    					curTween = overlaps[i];
    					l = curTween._firstPT; //we need to discern if there were property tweens originally; if they all get removed in the next line's _kill() call, the tween should be killed. See https://github.com/greensock/GreenSock-JS/issues/278
    					if (mode === 2) { if (curTween._kill(props, target, tween)) {
    						changed = true;
    					} }
    					if (mode !== 2 || (!curTween._firstPT && curTween._initted && l)) {
    						if (mode !== 2 && !_onOverwrite(curTween, tween)) {
    							continue;
    						}
    						if (curTween._enabled(false, false)) { //if all property tweens have been overwritten, kill the tween.
    							changed = true;
    						}
    					}
    				}
    				return changed;
    			},
    			_checkOverlap = function(tween, reference, zeroDur) {
    				var tl = tween._timeline,
    					ts = tl._timeScale,
    					t = tween._startTime;
    				while (tl._timeline) {
    					t += tl._startTime;
    					ts *= tl._timeScale;
    					if (tl._paused) {
    						return -100;
    					}
    					tl = tl._timeline;
    				}
    				t /= ts;
    				return (t > reference) ? t - reference : ((zeroDur && t === reference) || (!tween._initted && t - reference < 2 * _tinyNum)) ? _tinyNum : ((t += tween.totalDuration() / tween._timeScale / ts) > reference + _tinyNum) ? 0 : t - reference - _tinyNum;
    			};


    //---- TweenLite instance methods -----------------------------------------------------------------------------

    		p._init = function() {
    			var v = this.vars,
    				op = this._overwrittenProps,
    				dur = this._duration,
    				immediate = !!v.immediateRender,
    				ease = v.ease,
    				startAt = this._startAt,
    				i, initPlugins, pt, p, startVars, l;
    			if (v.startAt) {
    				if (startAt) {
    					startAt.render(-1, true); //if we've run a startAt previously (when the tween instantiated), we should revert it so that the values re-instantiate correctly particularly for relative tweens. Without this, a TweenLite.fromTo(obj, 1, {x:"+=100"}, {x:"-=100"}), for example, would actually jump to +=200 because the startAt would run twice, doubling the relative change.
    					startAt.kill();
    				}
    				startVars = {};
    				for (p in v.startAt) { //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, 1, from, to).fromTo(e, 1, to, from);
    					startVars[p] = v.startAt[p];
    				}
    				startVars.data = "isStart";
    				startVars.overwrite = false;
    				startVars.immediateRender = true;
    				startVars.lazy = (immediate && v.lazy !== false);
    				startVars.startAt = startVars.delay = null; //no nesting of startAt objects allowed (otherwise it could cause an infinite loop).
    				startVars.onUpdate = v.onUpdate;
    				startVars.onUpdateParams = v.onUpdateParams;
    				startVars.onUpdateScope = v.onUpdateScope || v.callbackScope || this;
    				this._startAt = TweenLite.to(this.target || {}, 0, startVars);
    				if (immediate) {
    					if (this._time > 0) {
    						this._startAt = null; //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in TimelineLite/Max instances where immediateRender was false (which is the default in the convenience methods like from()).
    					} else if (dur !== 0) {
    						return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a TimelineLite or TimelineMax, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
    					}
    				}
    			} else if (v.runBackwards && dur !== 0) {
    				//from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
    				if (startAt) {
    					startAt.render(-1, true);
    					startAt.kill();
    					this._startAt = null;
    				} else {
    					if (this._time !== 0) { //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0
    						immediate = false;
    					}
    					pt = {};
    					for (p in v) { //copy props into a new object and skip any reserved props, otherwise onComplete or onUpdate or onStart could fire. We should, however, permit autoCSS to go through.
    						if (!_reservedProps[p] || p === "autoCSS") {
    							pt[p] = v[p];
    						}
    					}
    					pt.overwrite = 0;
    					pt.data = "isFromStart"; //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
    					pt.lazy = (immediate && v.lazy !== false);
    					pt.immediateRender = immediate; //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
    					this._startAt = TweenLite.to(this.target, 0, pt);
    					if (!immediate) {
    						this._startAt._init(); //ensures that the initial values are recorded
    						this._startAt._enabled(false); //no need to have the tween render on the next cycle. Disable it because we'll always manually control the renders of the _startAt tween.
    						if (this.vars.immediateRender) {
    							this._startAt = null;
    						}
    					} else if (this._time === 0) {
    						return;
    					}
    				}
    			}
    			this._ease = ease = (!ease) ? TweenLite.defaultEase : (ease instanceof Ease) ? ease : (typeof(ease) === "function") ? new Ease(ease, v.easeParams) : _easeMap[ease] || TweenLite.defaultEase;
    			if (v.easeParams instanceof Array && ease.config) {
    				this._ease = ease.config.apply(ease, v.easeParams);
    			}
    			this._easeType = this._ease._type;
    			this._easePower = this._ease._power;
    			this._firstPT = null;

    			if (this._targets) {
    				l = this._targets.length;
    				for (i = 0; i < l; i++) {
    					if ( this._initProps( this._targets[i], (this._propLookup[i] = {}), this._siblings[i], (op ? op[i] : null), i) ) {
    						initPlugins = true;
    					}
    				}
    			} else {
    				initPlugins = this._initProps(this.target, this._propLookup, this._siblings, op, 0);
    			}

    			if (initPlugins) {
    				TweenLite._onPluginEvent("_onInitAllProps", this); //reorders the array in order of priority. Uses a static TweenPlugin method in order to minimize file size in TweenLite
    			}
    			if (op) { if (!this._firstPT) { if (typeof(this.target) !== "function") { //if all tweening properties have been overwritten, kill the tween. If the target is a function, it's probably a delayedCall so let it live.
    				this._enabled(false, false);
    			} } }
    			if (v.runBackwards) {
    				pt = this._firstPT;
    				while (pt) {
    					pt.s += pt.c;
    					pt.c = -pt.c;
    					pt = pt._next;
    				}
    			}
    			this._onUpdate = v.onUpdate;
    			this._initted = true;
    		};

    		p._initProps = function(target, propLookup, siblings, overwrittenProps, index) {
    			var p, i, initPlugins, plugin, pt, v;
    			if (target == null) {
    				return false;
    			}
    			if (_lazyLookup[target._gsTweenID]) {
    				_lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)
    			}

    			if (!this.vars.css) { if (target.style) { if (target !== window && target.nodeType) { if (_plugins.css) { if (this.vars.autoCSS !== false) { //it's so common to use TweenLite/Max to animate the css of DOM elements, we assume that if the target is a DOM element, that's what is intended (a convenience so that users don't have to wrap things in css:{}, although we still recommend it for a slight performance boost and better specificity). Note: we cannot check "nodeType" on the window inside an iframe.
    				_autoCSS(this.vars, target);
    			} } } } }
    			for (p in this.vars) {
    				v = this.vars[p];
    				if (_reservedProps[p]) {
    					if (v) { if ((v instanceof Array) || (v.push && _isArray(v))) { if (v.join("").indexOf("{self}") !== -1) {
    						this.vars[p] = v = this._swapSelfInParams(v, this);
    					} } }

    				} else if (_plugins[p] && (plugin = new _plugins[p]())._onInitTween(target, this.vars[p], this, index)) {

    					//t - target 		[object]
    					//p - property 		[string]
    					//s - start			[number]
    					//c - change		[number]
    					//f - isFunction	[boolean]
    					//n - name			[string]
    					//pg - isPlugin 	[boolean]
    					//pr - priority		[number]
    					//m - mod           [function | 0]
    					this._firstPT = pt = {_next:this._firstPT, t:plugin, p:"setRatio", s:0, c:1, f:1, n:p, pg:1, pr:plugin._priority, m:0};
    					i = plugin._overwriteProps.length;
    					while (--i > -1) {
    						propLookup[plugin._overwriteProps[i]] = this._firstPT;
    					}
    					if (plugin._priority || plugin._onInitAllProps) {
    						initPlugins = true;
    					}
    					if (plugin._onDisable || plugin._onEnable) {
    						this._notifyPluginsOfEnabled = true;
    					}
    					if (pt._next) {
    						pt._next._prev = pt;
    					}

    				} else {
    					propLookup[p] = _addPropTween.call(this, target, p, "get", v, p, 0, null, this.vars.stringFilter, index);
    				}
    			}

    			if (overwrittenProps) { if (this._kill(overwrittenProps, target)) { //another tween may have tried to overwrite properties of this tween before init() was called (like if two tweens start at the same time, the one created second will run first)
    				return this._initProps(target, propLookup, siblings, overwrittenProps, index);
    			} }
    			if (this._overwrite > 1) { if (this._firstPT) { if (siblings.length > 1) { if (_applyOverwrite(target, this, propLookup, this._overwrite, siblings)) {
    				this._kill(propLookup, target);
    				return this._initProps(target, propLookup, siblings, overwrittenProps, index);
    			} } } }
    			if (this._firstPT) { if ((this.vars.lazy !== false && this._duration) || (this.vars.lazy && !this._duration)) { //zero duration tweens don't lazy render by default; everything else does.
    				_lazyLookup[target._gsTweenID] = true;
    			} }
    			return initPlugins;
    		};

    		p.render = function(time, suppressEvents, force) {
    			var self = this,
    				prevTime = self._time,
    				duration = self._duration,
    				prevRawPrevTime = self._rawPrevTime,
    				isComplete, callback, pt, rawPrevTime;
    			if (time >= duration - _tinyNum && time >= 0) { //to work around occasional floating point math artifacts.
    				self._totalTime = self._time = duration;
    				self.ratio = self._ease._calcEnd ? self._ease.getRatio(1) : 1;
    				if (!self._reversed ) {
    					isComplete = true;
    					callback = "onComplete";
    					force = (force || self._timeline.autoRemoveChildren); //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
    				}
    				if (duration === 0) { if (self._initted || !self.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
    					if (self._startTime === self._timeline._duration) { //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
    						time = 0;
    					}
    					if (prevRawPrevTime < 0 || (time <= 0 && time >= -_tinyNum) || (prevRawPrevTime === _tinyNum && self.data !== "isPause")) { if (prevRawPrevTime !== time) { //note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
    						force = true;
    						if (prevRawPrevTime > _tinyNum) {
    							callback = "onReverseComplete";
    						}
    					} }
    					self._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
    				} }

    			} else if (time < _tinyNum) { //to work around occasional floating point math artifacts, round super small values to 0.
    				self._totalTime = self._time = 0;
    				self.ratio = self._ease._calcEnd ? self._ease.getRatio(0) : 0;
    				if (prevTime !== 0 || (duration === 0 && prevRawPrevTime > 0)) {
    					callback = "onReverseComplete";
    					isComplete = self._reversed;
    				}
    				if (time > -_tinyNum) {
    					time = 0;
    				} else if (time < 0) {
    					self._active = false;
    					if (duration === 0) { if (self._initted || !self.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
    						if (prevRawPrevTime >= 0 && !(prevRawPrevTime === _tinyNum && self.data === "isPause")) {
    							force = true;
    						}
    						self._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
    					} }
    				}
    				if (!self._initted || (self._startAt && self._startAt.progress())) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately. Also, we check progress() because if startAt has already rendered at its end, we should force a render at its beginning. Otherwise, if you put the playhead directly on top of where a fromTo({immediateRender:false}) starts, and then move it backwards, the from() won't revert its values.
    					force = true;
    				}
    			} else {
    				self._totalTime = self._time = time;

    				if (self._easeType) {
    					var r = time / duration, type = self._easeType, pow = self._easePower;
    					if (type === 1 || (type === 3 && r >= 0.5)) {
    						r = 1 - r;
    					}
    					if (type === 3) {
    						r *= 2;
    					}
    					if (pow === 1) {
    						r *= r;
    					} else if (pow === 2) {
    						r *= r * r;
    					} else if (pow === 3) {
    						r *= r * r * r;
    					} else if (pow === 4) {
    						r *= r * r * r * r;
    					}
    					self.ratio = (type === 1) ? 1 - r : (type === 2) ? r : (time / duration < 0.5) ? r / 2 : 1 - (r / 2);
    				} else {
    					self.ratio = self._ease.getRatio(time / duration);
    				}
    			}

    			if (self._time === prevTime && !force) {
    				return;
    			} else if (!self._initted) {
    				self._init();
    				if (!self._initted || self._gc) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
    					return;
    				} else if (!force && self._firstPT && ((self.vars.lazy !== false && self._duration) || (self.vars.lazy && !self._duration))) {
    					self._time = self._totalTime = prevTime;
    					self._rawPrevTime = prevRawPrevTime;
    					_lazyTweens.push(self);
    					self._lazy = [time, suppressEvents];
    					return;
    				}
    				//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
    				if (self._time && !isComplete) {
    					self.ratio = self._ease.getRatio(self._time / duration);
    				} else if (isComplete && self._ease._calcEnd) {
    					self.ratio = self._ease.getRatio((self._time === 0) ? 0 : 1);
    				}
    			}
    			if (self._lazy !== false) { //in case a lazy render is pending, we should flush it because the new render is occurring now (imagine a lazy tween instantiating and then immediately the user calls tween.seek(tween.duration()), skipping to the end - the end render would be forced, and then if we didn't flush the lazy render, it'd fire AFTER the seek(), rendering it at the wrong time.
    				self._lazy = false;
    			}
    			if (!self._active) { if (!self._paused && self._time !== prevTime && time >= 0) {
    				self._active = true;  //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
    			} }
    			if (prevTime === 0) {
    				if (self._startAt) {
    					if (time >= 0) {
    						self._startAt.render(time, true, force);
    					} else if (!callback) {
    						callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
    					}
    				}
    				if (self.vars.onStart) { if (self._time !== 0 || duration === 0) { if (!suppressEvents) {
    					self._callback("onStart");
    				} } }
    			}
    			pt = self._firstPT;
    			while (pt) {
    				if (pt.f) {
    					pt.t[pt.p](pt.c * self.ratio + pt.s);
    				} else {
    					pt.t[pt.p] = pt.c * self.ratio + pt.s;
    				}
    				pt = pt._next;
    			}

    			if (self._onUpdate) {
    				if (time < 0) { if (self._startAt && time !== -0.0001) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
    					self._startAt.render(time, true, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
    				} }
    				if (!suppressEvents) { if (self._time !== prevTime || isComplete || force) {
    					self._callback("onUpdate");
    				} }
    			}
    			if (callback) { if (!self._gc || force) { //check _gc because there's a chance that kill() could be called in an onUpdate
    				if (time < 0 && self._startAt && !self._onUpdate && time !== -0.0001) { //-0.0001 is a special value that we use when looping back to the beginning of a repeated TimelineMax, in which case we shouldn't render the _startAt values.
    					self._startAt.render(time, true, force);
    				}
    				if (isComplete) {
    					if (self._timeline.autoRemoveChildren) {
    						self._enabled(false, false);
    					}
    					self._active = false;
    				}
    				if (!suppressEvents && self.vars[callback]) {
    					self._callback(callback);
    				}
    				if (duration === 0 && self._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) { //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
    					self._rawPrevTime = 0;
    				}
    			} }
    		};

    		p._kill = function(vars, target, overwritingTween) {
    			if (vars === "all") {
    				vars = null;
    			}
    			if (vars == null) { if (target == null || target === this.target) {
    				this._lazy = false;
    				return this._enabled(false, false);
    			} }
    			target = (typeof(target) !== "string") ? (target || this._targets || this.target) : TweenLite.selector(target) || target;
    			var simultaneousOverwrite = (overwritingTween && this._time && overwritingTween._startTime === this._startTime && this._timeline === overwritingTween._timeline),
    				firstPT = this._firstPT,
    				i, overwrittenProps, p, pt, propLookup, changed, killProps, record, killed;
    			if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
    				i = target.length;
    				while (--i > -1) {
    					if (this._kill(vars, target[i], overwritingTween)) {
    						changed = true;
    					}
    				}
    			} else {
    				if (this._targets) {
    					i = this._targets.length;
    					while (--i > -1) {
    						if (target === this._targets[i]) {
    							propLookup = this._propLookup[i] || {};
    							this._overwrittenProps = this._overwrittenProps || [];
    							overwrittenProps = this._overwrittenProps[i] = vars ? this._overwrittenProps[i] || {} : "all";
    							break;
    						}
    					}
    				} else if (target !== this.target) {
    					return false;
    				} else {
    					propLookup = this._propLookup;
    					overwrittenProps = this._overwrittenProps = vars ? this._overwrittenProps || {} : "all";
    				}

    				if (propLookup) {
    					killProps = vars || propLookup;
    					record = (vars !== overwrittenProps && overwrittenProps !== "all" && vars !== propLookup && (typeof(vars) !== "object" || !vars._tempKill)); //_tempKill is a super-secret way to delete a particular tweening property but NOT have it remembered as an official overwritten property (like in BezierPlugin)
    					if (overwritingTween && (TweenLite.onOverwrite || this.vars.onOverwrite)) {
    						for (p in killProps) {
    							if (propLookup[p]) {
    								if (!killed) {
    									killed = [];
    								}
    								killed.push(p);
    							}
    						}
    						if ((killed || !vars) && !_onOverwrite(this, overwritingTween, target, killed)) { //if the onOverwrite returned false, that means the user wants to override the overwriting (cancel it).
    							return false;
    						}
    					}

    					for (p in killProps) {
    						if ((pt = propLookup[p])) {
    							if (simultaneousOverwrite) { //if another tween overwrites this one and they both start at exactly the same time, yet this tween has already rendered once (for example, at 0.001) because it's first in the queue, we should revert the values to where they were at 0 so that the starting values aren't contaminated on the overwriting tween.
    								if (pt.f) {
    									pt.t[pt.p](pt.s);
    								} else {
    									pt.t[pt.p] = pt.s;
    								}
    								changed = true;
    							}
    							if (pt.pg && pt.t._kill(killProps)) {
    								changed = true; //some plugins need to be notified so they can perform cleanup tasks first
    							}
    							if (!pt.pg || pt.t._overwriteProps.length === 0) {
    								if (pt._prev) {
    									pt._prev._next = pt._next;
    								} else if (pt === this._firstPT) {
    									this._firstPT = pt._next;
    								}
    								if (pt._next) {
    									pt._next._prev = pt._prev;
    								}
    								pt._next = pt._prev = null;
    							}
    							delete propLookup[p];
    						}
    						if (record) {
    							overwrittenProps[p] = 1;
    						}
    					}
    					if (!this._firstPT && this._initted && firstPT) { //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
    						this._enabled(false, false);
    					}
    				}
    			}
    			return changed;
    		};

    		p.invalidate = function() {
    			if (this._notifyPluginsOfEnabled) {
    				TweenLite._onPluginEvent("_onDisable", this);
    			}
    			var t = this._time;
    			this._firstPT = this._overwrittenProps = this._startAt = this._onUpdate = null;
    			this._notifyPluginsOfEnabled = this._active = this._lazy = false;
    			this._propLookup = (this._targets) ? {} : [];
    			Animation.prototype.invalidate.call(this);
    			if (this.vars.immediateRender) {
    				this._time = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)
    				this.render(t, false, this.vars.lazy !== false);
    			}
    			return this;
    		};

    		p._enabled = function(enabled, ignoreTimeline) {
    			if (!_tickerActive) {
    				_ticker.wake();
    			}
    			if (enabled && this._gc) {
    				var targets = this._targets,
    					i;
    				if (targets) {
    					i = targets.length;
    					while (--i > -1) {
    						this._siblings[i] = _register(targets[i], this, true);
    					}
    				} else {
    					this._siblings = _register(this.target, this, true);
    				}
    			}
    			Animation.prototype._enabled.call(this, enabled, ignoreTimeline);
    			if (this._notifyPluginsOfEnabled) { if (this._firstPT) {
    				return TweenLite._onPluginEvent((enabled ? "_onEnable" : "_onDisable"), this);
    			} }
    			return false;
    		};


    //----TweenLite static methods -----------------------------------------------------

    		TweenLite.to = function(target, duration, vars) {
    			return new TweenLite(target, duration, vars);
    		};

    		TweenLite.from = function(target, duration, vars) {
    			vars.runBackwards = true;
    			vars.immediateRender = (vars.immediateRender != false);
    			return new TweenLite(target, duration, vars);
    		};

    		TweenLite.fromTo = function(target, duration, fromVars, toVars) {
    			toVars.startAt = fromVars;
    			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
    			return new TweenLite(target, duration, toVars);
    		};

    		TweenLite.delayedCall = function(delay, callback, params, scope, useFrames) {
    			return new TweenLite(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, callbackScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, immediateRender:false, lazy:false, useFrames:useFrames, overwrite:0});
    		};

    		TweenLite.set = function(target, vars) {
    			return new TweenLite(target, 0, vars);
    		};

    		TweenLite.getTweensOf = function(target, onlyActive) {
    			if (target == null) { return []; }
    			target = (typeof(target) !== "string") ? target : TweenLite.selector(target) || target;
    			var i, a, j, t;
    			if ((_isArray(target) || _isSelector(target)) && typeof(target[0]) !== "number") {
    				i = target.length;
    				a = [];
    				while (--i > -1) {
    					a = a.concat(TweenLite.getTweensOf(target[i], onlyActive));
    				}
    				i = a.length;
    				//now get rid of any duplicates (tweens of arrays of objects could cause duplicates)
    				while (--i > -1) {
    					t = a[i];
    					j = i;
    					while (--j > -1) {
    						if (t === a[j]) {
    							a.splice(i, 1);
    						}
    					}
    				}
    			} else if (target._gsTweenID) {
    				a = _register(target).concat();
    				i = a.length;
    				while (--i > -1) {
    					if (a[i]._gc || (onlyActive && !a[i].isActive())) {
    						a.splice(i, 1);
    					}
    				}
    			}
    			return a || [];
    		};

    		TweenLite.killTweensOf = TweenLite.killDelayedCallsTo = function(target, onlyActive, vars) {
    			if (typeof(onlyActive) === "object") {
    				vars = onlyActive; //for backwards compatibility (before "onlyActive" parameter was inserted)
    				onlyActive = false;
    			}
    			var a = TweenLite.getTweensOf(target, onlyActive),
    				i = a.length;
    			while (--i > -1) {
    				a[i]._kill(vars, target);
    			}
    		};



    /*
     * ----------------------------------------------------------------
     * TweenPlugin   (could easily be split out as a separate file/class, but included for ease of use (so that people don't need to include another script call before loading plugins which is easy to forget)
     * ----------------------------------------------------------------
     */
    		var TweenPlugin = _class("plugins.TweenPlugin", function(props, priority) {
    					this._overwriteProps = (props || "").split(",");
    					this._propName = this._overwriteProps[0];
    					this._priority = priority || 0;
    					this._super = TweenPlugin.prototype;
    				}, true);

    		p = TweenPlugin.prototype;
    		TweenPlugin.version = "1.19.0";
    		TweenPlugin.API = 2;
    		p._firstPT = null;
    		p._addTween = _addPropTween;
    		p.setRatio = _setRatio;

    		p._kill = function(lookup) {
    			var a = this._overwriteProps,
    				pt = this._firstPT,
    				i;
    			if (lookup[this._propName] != null) {
    				this._overwriteProps = [];
    			} else {
    				i = a.length;
    				while (--i > -1) {
    					if (lookup[a[i]] != null) {
    						a.splice(i, 1);
    					}
    				}
    			}
    			while (pt) {
    				if (lookup[pt.n] != null) {
    					if (pt._next) {
    						pt._next._prev = pt._prev;
    					}
    					if (pt._prev) {
    						pt._prev._next = pt._next;
    						pt._prev = null;
    					} else if (this._firstPT === pt) {
    						this._firstPT = pt._next;
    					}
    				}
    				pt = pt._next;
    			}
    			return false;
    		};

    		p._mod = p._roundProps = function(lookup) {
    			var pt = this._firstPT,
    				val;
    			while (pt) {
    				val = lookup[this._propName] || (pt.n != null && lookup[ pt.n.split(this._propName + "_").join("") ]);
    				if (val && typeof(val) === "function") { //some properties that are very plugin-specific add a prefix named after the _propName plus an underscore, so we need to ignore that extra stuff here.
    					if (pt.f === 2) {
    						pt.t._applyPT.m = val;
    					} else {
    						pt.m = val;
    					}
    				}
    				pt = pt._next;
    			}
    		};

    		TweenLite._onPluginEvent = function(type, tween) {
    			var pt = tween._firstPT,
    				changed, pt2, first, last, next;
    			if (type === "_onInitAllProps") {
    				//sorts the PropTween linked list in order of priority because some plugins need to render earlier/later than others, like MotionBlurPlugin applies its effects after all x/y/alpha tweens have rendered on each frame.
    				while (pt) {
    					next = pt._next;
    					pt2 = first;
    					while (pt2 && pt2.pr > pt.pr) {
    						pt2 = pt2._next;
    					}
    					if ((pt._prev = pt2 ? pt2._prev : last)) {
    						pt._prev._next = pt;
    					} else {
    						first = pt;
    					}
    					if ((pt._next = pt2)) {
    						pt2._prev = pt;
    					} else {
    						last = pt;
    					}
    					pt = next;
    				}
    				pt = tween._firstPT = first;
    			}
    			while (pt) {
    				if (pt.pg) { if (typeof(pt.t[type]) === "function") { if (pt.t[type]()) {
    					changed = true;
    				} } }
    				pt = pt._next;
    			}
    			return changed;
    		};

    		TweenPlugin.activate = function(plugins) {
    			var i = plugins.length;
    			while (--i > -1) {
    				if (plugins[i].API === TweenPlugin.API) {
    					_plugins[(new plugins[i]())._propName] = plugins[i];
    				}
    			}
    			return true;
    		};

    		//provides a more concise way to define plugins that have no dependencies besides TweenPlugin and TweenLite, wrapping common boilerplate stuff into one function (added in 1.9.0). You don't NEED to use this to define a plugin - the old way still works and can be useful in certain (rare) situations.
    		_gsDefine.plugin = function(config) {
    			if (!config || !config.propName || !config.init || !config.API) { throw "illegal plugin definition."; }
    			var propName = config.propName,
    				priority = config.priority || 0,
    				overwriteProps = config.overwriteProps,
    				map = {init:"_onInitTween", set:"setRatio", kill:"_kill", round:"_mod", mod:"_mod", initAll:"_onInitAllProps"},
    				Plugin = _class("plugins." + propName.charAt(0).toUpperCase() + propName.substr(1) + "Plugin",
    					function() {
    						TweenPlugin.call(this, propName, priority);
    						this._overwriteProps = overwriteProps || [];
    					}, (config.global === true)),
    				p = Plugin.prototype = new TweenPlugin(propName),
    				prop;
    			p.constructor = Plugin;
    			Plugin.API = config.API;
    			for (prop in map) {
    				if (typeof(config[prop]) === "function") {
    					p[map[prop]] = config[prop];
    				}
    			}
    			Plugin.version = config.version;
    			TweenPlugin.activate([Plugin]);
    			return Plugin;
    		};


    		//now run through all the dependencies discovered and if any are missing, log that to the console as a warning. This is why it's best to have TweenLite load last - it can check all the dependencies for you.
    		a = window._gsQueue;
    		if (a) {
    			for (i = 0; i < a.length; i++) {
    				a[i]();
    			}
    			for (p in _defLookup) {
    				if (!_defLookup[p].func) {
    					window.console.log("GSAP encountered missing dependency: " + p);
    				}
    			}
    		}

    		_tickerActive = false; //ensures that the first official animation forces a ticker.tick() to update the time when it is instantiated

    		return TweenLite;

    })(_gsScope);

    var globals = _gsScope.GreenSockGlobals;
    var nonGlobals = globals.com.greensock;
    var SimpleTimeline = nonGlobals.core.SimpleTimeline;
    var Animation = nonGlobals.core.Animation;
    var Ease = globals.Ease;
    var Linear = globals.Linear;
    var Power1 = globals.Power1;
    var Power2 = globals.Power2;
    var Power3 = globals.Power3;
    var Power4 = globals.Power4;
    var TweenPlugin = globals.TweenPlugin;
    var EventDispatcher = nonGlobals.events.EventDispatcher;

    /*!
     * VERSION: 2.1.3
     * DATE: 2019-05-17
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
     * This work is subject to the terms at http://greensock.com/standard-license or for
     * Club GreenSock members, the software agreement that was issued with your membership.
     * 
     * @author: Jack Doyle, jack@greensock.com
     **/


    _gsScope._gsDefine("TweenMax", ["core.Animation","core.SimpleTimeline","TweenLite"], function() {

    		var _slice = function(a) { //don't use [].slice because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
    				var b = [],
    					l = a.length,
    					i;
    				for (i = 0; i !== l; b.push(a[i++])){ }
    				return b;
    			},
    			_applyCycle = function(vars, targets, i) {
    				var alt = vars.cycle,
    					p, val;
    				for (p in alt) {
    					val = alt[p];
    					vars[p] = (typeof(val) === "function") ? val(i, targets[i], targets) : val[i % val.length];
    				}
    				delete vars.cycle;
    			},
    			//for distributing values across an array. Can accept a number, a function or (most commonly) a function which can contain the following properties: {base, amount, from, ease, grid, axis, length, each}. Returns a function that expects the following parameters: index, target, array. Recognizes the following
    			_distribute = function(v) {
    				if (typeof(v) === "function") {
    					return v;
    				}
    				var vars = (typeof(v) === "object") ? v : {each:v}, //n:1 is just to indicate v was a number; we leverage that later to set v according to the length we get. If a number is passed in, we treat it like the old stagger value where 0.1, for example, would mean that things would be distributed with 0.1 between each element in the array rather than a total "amount" that's chunked out among them all.
    					ease = vars.ease,
    					from = vars.from || 0,
    					base = vars.base || 0,
    					cache = {},
    					isFromKeyword = isNaN(from),
    					axis = vars.axis,
    					ratio = {center:0.5, end:1}[from] || 0;
    				return function(i, target, a) {
    					var l = (a || vars).length,
    						distances = cache[l],
    						originX, originY, x, y, d, j, max, min, wrap;
    					if (!distances) {
    						wrap = (vars.grid === "auto") ? 0 : (vars.grid || [Infinity])[0];
    						if (!wrap) {
    							max = -Infinity;
    							while (max < (max = a[wrap++].getBoundingClientRect().left) && wrap < l) { }
    							wrap--;
    						}
    						distances = cache[l] = [];
    						originX = isFromKeyword ? (Math.min(wrap, l) * ratio) - 0.5 : from % wrap;
    						originY = isFromKeyword ? l * ratio / wrap - 0.5 : (from / wrap) | 0;
    						max = 0;
    						min = Infinity;
    						for (j = 0; j < l; j++) {
    							x = (j % wrap) - originX;
    							y = originY - ((j / wrap) | 0);
    							distances[j] = d = !axis ? Math.sqrt(x * x + y * y) : Math.abs((axis === "y") ? y : x);
    							if (d > max) {
    								max = d;
    							}
    							if (d < min) {
    								min = d;
    							}
    						}
    						distances.max = max - min;
    						distances.min = min;
    						distances.v = l = vars.amount || (vars.each * (wrap > l ? l - 1 : !axis ? Math.max(wrap, l / wrap) : axis === "y" ? l / wrap : wrap)) || 0;
    						distances.b = (l < 0) ? base - l : base;
    					}
    					l = (distances[i] - distances.min) / distances.max;
    					return distances.b + (ease ? ease.getRatio(l) : l) * distances.v;
    				};
    			},
    			TweenMax = function(target, duration, vars) {
    				TweenLite.call(this, target, duration, vars);
    				this._cycle = 0;
    				this._yoyo = (this.vars.yoyo === true || !!this.vars.yoyoEase);
    				this._repeat = this.vars.repeat || 0;
    				this._repeatDelay = this.vars.repeatDelay || 0;
    				if (this._repeat) {
    					this._uncache(true); //ensures that if there is any repeat, the totalDuration will get recalculated to accurately report it.
    				}
    				this.render = TweenMax.prototype.render; //speed optimization (avoid prototype lookup on this "hot" method)
    			},
    			_tinyNum = 0.00000001,
    			TweenLiteInternals = TweenLite._internals,
    			_isSelector = TweenLiteInternals.isSelector,
    			_isArray = TweenLiteInternals.isArray,
    			p = TweenMax.prototype = TweenLite.to({}, 0.1, {}),
    			_blankArray = [];

    		TweenMax.version = "2.1.3";
    		p.constructor = TweenMax;
    		p.kill()._gc = false;
    		TweenMax.killTweensOf = TweenMax.killDelayedCallsTo = TweenLite.killTweensOf;
    		TweenMax.getTweensOf = TweenLite.getTweensOf;
    		TweenMax.lagSmoothing = TweenLite.lagSmoothing;
    		TweenMax.ticker = TweenLite.ticker;
    		TweenMax.render = TweenLite.render;
    		TweenMax.distribute = _distribute;

    		p.invalidate = function() {
    			this._yoyo = (this.vars.yoyo === true || !!this.vars.yoyoEase);
    			this._repeat = this.vars.repeat || 0;
    			this._repeatDelay = this.vars.repeatDelay || 0;
    			this._yoyoEase = null;
    			this._uncache(true);
    			return TweenLite.prototype.invalidate.call(this);
    		};

    		p.updateTo = function(vars, resetDuration) {
    			var self = this,
    				curRatio = self.ratio,
    				immediate = self.vars.immediateRender || vars.immediateRender,
    				p;
    			if (resetDuration && self._startTime < self._timeline._time) {
    				self._startTime = self._timeline._time;
    				self._uncache(false);
    				if (self._gc) {
    					self._enabled(true, false);
    				} else {
    					self._timeline.insert(self, self._startTime - self._delay); //ensures that any necessary re-sequencing of Animations in the timeline occurs to make sure the rendering order is correct.
    				}
    			}
    			for (p in vars) {
    				self.vars[p] = vars[p];
    			}
    			if (self._initted || immediate) {
    				if (resetDuration) {
    					self._initted = false;
    					if (immediate) {
    						self.render(0, true, true);
    					}
    				} else {
    					if (self._gc) {
    						self._enabled(true, false);
    					}
    					if (self._notifyPluginsOfEnabled && self._firstPT) {
    						TweenLite._onPluginEvent("_onDisable", self); //in case a plugin like MotionBlur must perform some cleanup tasks
    					}
    					if (self._time / self._duration > 0.998) { //if the tween has finished (or come extremely close to finishing), we just need to rewind it to 0 and then render it again at the end which forces it to re-initialize (parsing the new vars). We allow tweens that are close to finishing (but haven't quite finished) to work this way too because otherwise, the values are so small when determining where to project the starting values that binary math issues creep in and can make the tween appear to render incorrectly when run backwards.
    						var prevTime = self._totalTime;
    						self.render(0, true, false);
    						self._initted = false;
    						self.render(prevTime, true, false);
    					} else {
    						self._initted = false;
    						self._init();
    						if (self._time > 0 || immediate) {
    							var inv = 1 / (1 - curRatio),
    								pt = self._firstPT, endValue;
    							while (pt) {
    								endValue = pt.s + pt.c;
    								pt.c *= inv;
    								pt.s = endValue - pt.c;
    								pt = pt._next;
    							}
    						}
    					}
    				}
    			}
    			return self;
    		};

    		p.render = function(time, suppressEvents, force) {
    			if (!this._initted) { if (this._duration === 0 && this.vars.repeat) { //zero duration tweens that render immediately have render() called from TweenLite's constructor, before TweenMax's constructor has finished setting _repeat, _repeatDelay, and _yoyo which are critical in determining totalDuration() so we need to call invalidate() which is a low-kb way to get those set properly.
    				this.invalidate();
    			} }
    			var self = this,
    				totalDur = (!self._dirty) ? self._totalDuration : self.totalDuration(),
    				prevTime = self._time,
    				prevTotalTime = self._totalTime,
    				prevCycle = self._cycle,
    				duration = self._duration,
    				prevRawPrevTime = self._rawPrevTime,
    				isComplete, callback, pt, cycleDuration, r, type, pow, rawPrevTime, yoyoEase;
    			if (time >= totalDur - _tinyNum && time >= 0) { //to work around occasional floating point math artifacts.
    				self._totalTime = totalDur;
    				self._cycle = self._repeat;
    				if (self._yoyo && (self._cycle & 1) !== 0) {
    					self._time = 0;
    					self.ratio = self._ease._calcEnd ? self._ease.getRatio(0) : 0;
    				} else {
    					self._time = duration;
    					self.ratio = self._ease._calcEnd ? self._ease.getRatio(1) : 1;
    				}
    				if (!self._reversed) {
    					isComplete = true;
    					callback = "onComplete";
    					force = (force || self._timeline.autoRemoveChildren); //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
    				}
    				if (duration === 0) { if (self._initted || !self.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
    					if (self._startTime === self._timeline._duration) { //if a zero-duration tween is at the VERY end of a timeline and that timeline renders at its end, it will typically add a tiny bit of cushion to the render time to prevent rounding errors from getting in the way of tweens rendering their VERY end. If we then reverse() that timeline, the zero-duration tween will trigger its onReverseComplete even though technically the playhead didn't pass over it again. It's a very specific edge case we must accommodate.
    						time = 0;
    					}
    					if (prevRawPrevTime < 0 || (time <= 0 && time >= -_tinyNum) || (prevRawPrevTime === _tinyNum && self.data !== "isPause")) { if (prevRawPrevTime !== time) { //note: when this.data is "isPause", it's a callback added by addPause() on a timeline that we should not be triggered when LEAVING its exact start time. In other words, tl.addPause(1).play(1) shouldn't pause.
    						force = true;
    						if (prevRawPrevTime > _tinyNum) {
    							callback = "onReverseComplete";
    						}
    					} }
    					self._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
    				} }

    			} else if (time < _tinyNum) { //to work around occasional floating point math artifacts, round super small values to 0.
    				self._totalTime = self._time = self._cycle = 0;
    				self.ratio = self._ease._calcEnd ? self._ease.getRatio(0) : 0;
    				if (prevTotalTime !== 0 || (duration === 0 && prevRawPrevTime > 0)) {
    					callback = "onReverseComplete";
    					isComplete = self._reversed;
    				}
    				if (time > -_tinyNum) {
    					time = 0;
    				} else if (time < 0) {
    					self._active = false;
    					if (duration === 0) { if (self._initted || !self.vars.lazy || force) { //zero-duration tweens are tricky because we must discern the momentum/direction of time in order to determine whether the starting values should be rendered or the ending values. If the "playhead" of its timeline goes past the zero-duration tween in the forward direction or lands directly on it, the end values should be rendered, but if the timeline's "playhead" moves past it in the backward direction (from a postitive time to a negative time), the starting values must be rendered.
    						if (prevRawPrevTime >= 0) {
    							force = true;
    						}
    						self._rawPrevTime = rawPrevTime = (!suppressEvents || time || prevRawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
    					} }
    				}
    				if (!self._initted) { //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
    					force = true;
    				}
    			} else {
    				self._totalTime = self._time = time;
    				if (self._repeat !== 0) {
    					cycleDuration = duration + self._repeatDelay;
    					self._cycle = (self._totalTime / cycleDuration) >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)
    					if (self._cycle !== 0) { if (self._cycle === self._totalTime / cycleDuration && prevTotalTime <= time) {
    						self._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
    					} }
    					self._time = self._totalTime - (self._cycle * cycleDuration);
    					if (self._yoyo) { if ((self._cycle & 1) !== 0) {
    						self._time = duration - self._time;
    						yoyoEase = self._yoyoEase || self.vars.yoyoEase; //note: we don't set this._yoyoEase in _init() like we do other properties because it's TweenMax-specific and doing it here allows us to optimize performance (most tweens don't have a yoyoEase). Note that we also must skip the this.ratio calculation further down right after we _init() in this function, because we're doing it here.
    						if (yoyoEase) {
    							if (!self._yoyoEase) {
    								if (yoyoEase === true && !self._initted) { //if it's not initted and yoyoEase is true, this._ease won't have been populated yet so we must discern it here.
    									yoyoEase = self.vars.ease;
    									self._yoyoEase = yoyoEase = !yoyoEase ? TweenLite.defaultEase : (yoyoEase instanceof Ease) ? yoyoEase : (typeof(yoyoEase) === "function") ? new Ease(yoyoEase, self.vars.easeParams) : Ease.map[yoyoEase] || TweenLite.defaultEase;
    								} else {
    									self._yoyoEase = yoyoEase = (yoyoEase === true) ? self._ease : (yoyoEase instanceof Ease) ? yoyoEase : Ease.map[yoyoEase];
    								}
    							}
    							self.ratio = yoyoEase ? 1 - yoyoEase.getRatio((duration - self._time) / duration) : 0;
    						}
    					} }
    					if (self._time > duration) {
    						self._time = duration;
    					} else if (self._time < 0) {
    						self._time = 0;
    					}
    				}
    				if (self._easeType && !yoyoEase) {
    					r = self._time / duration;
    					type = self._easeType;
    					pow = self._easePower;
    					if (type === 1 || (type === 3 && r >= 0.5)) {
    						r = 1 - r;
    					}
    					if (type === 3) {
    						r *= 2;
    					}
    					if (pow === 1) {
    						r *= r;
    					} else if (pow === 2) {
    						r *= r * r;
    					} else if (pow === 3) {
    						r *= r * r * r;
    					} else if (pow === 4) {
    						r *= r * r * r * r;
    					}
    					self.ratio = (type === 1) ? 1 - r : (type === 2) ? r : (self._time / duration < 0.5) ? r / 2 : 1 - (r / 2);

    				} else if (!yoyoEase) {
    					self.ratio = self._ease.getRatio(self._time / duration);
    				}

    			}

    			if (prevTime === self._time && !force && prevCycle === self._cycle) {
    				if (prevTotalTime !== self._totalTime) { if (self._onUpdate) { if (!suppressEvents) { //so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
    					self._callback("onUpdate");
    				} } }
    				return;
    			} else if (!self._initted) {
    				self._init();
    				if (!self._initted || self._gc) { //immediateRender tweens typically won't initialize until the playhead advances (_time is greater than 0) in order to ensure that overwriting occurs properly. Also, if all of the tweening properties have been overwritten (which would cause _gc to be true, as set in _init()), we shouldn't continue otherwise an onStart callback could be called for example.
    					return;
    				} else if (!force && self._firstPT && ((self.vars.lazy !== false && self._duration) || (self.vars.lazy && !self._duration))) { //we stick it in the queue for rendering at the very end of the tick - this is a performance optimization because browsers invalidate styles and force a recalculation if you read, write, and then read style data (so it's better to read/read/read/write/write/write than read/write/read/write/read/write). The down side, of course, is that usually you WANT things to render immediately because you may have code running right after that which depends on the change. Like imagine running TweenLite.set(...) and then immediately after that, creating a nother tween that animates the same property to another value; the starting values of that 2nd tween wouldn't be accurate if lazy is true.
    					self._time = prevTime;
    					self._totalTime = prevTotalTime;
    					self._rawPrevTime = prevRawPrevTime;
    					self._cycle = prevCycle;
    					TweenLiteInternals.lazyTweens.push(self);
    					self._lazy = [time, suppressEvents];
    					return;
    				}
    				//_ease is initially set to defaultEase, so now that init() has run, _ease is set properly and we need to recalculate the ratio. Overall this is faster than using conditional logic earlier in the method to avoid having to set ratio twice because we only init() once but renderTime() gets called VERY frequently.
    				if (self._time && !isComplete && !yoyoEase) {
    					self.ratio = self._ease.getRatio(self._time / duration);
    				} else if (isComplete && this._ease._calcEnd && !yoyoEase) {
    					self.ratio = self._ease.getRatio((self._time === 0) ? 0 : 1);
    				}
    			}
    			if (self._lazy !== false) {
    				self._lazy = false;
    			}

    			if (!self._active) { if (!self._paused && self._time !== prevTime && time >= 0) {
    				self._active = true; //so that if the user renders a tween (as opposed to the timeline rendering it), the timeline is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the tween already finished but the user manually re-renders it as halfway done.
    			} }
    			if (prevTotalTime === 0) {
    				if (self._initted === 2 && time > 0) {
    					self._init(); //will just apply overwriting since _initted of (2) means it was a from() tween that had immediateRender:true
    				}
    				if (self._startAt) {
    					if (time >= 0) {
    						self._startAt.render(time, true, force);
    					} else if (!callback) {
    						callback = "_dummyGS"; //if no callback is defined, use a dummy value just so that the condition at the end evaluates as true because _startAt should render AFTER the normal render loop when the time is negative. We could handle this in a more intuitive way, of course, but the render loop is the MOST important thing to optimize, so this technique allows us to avoid adding extra conditional logic in a high-frequency area.
    					}
    				}
    				if (self.vars.onStart) { if (self._totalTime !== 0 || duration === 0) { if (!suppressEvents) {
    					self._callback("onStart");
    				} } }
    			}

    			pt = self._firstPT;
    			while (pt) {
    				if (pt.f) {
    					pt.t[pt.p](pt.c * self.ratio + pt.s);
    				} else {
    					pt.t[pt.p] = pt.c * self.ratio + pt.s;
    				}
    				pt = pt._next;
    			}

    			if (self._onUpdate) {
    				if (time < 0) { if (self._startAt && self._startTime) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
    					self._startAt.render(time, true, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.
    				} }
    				if (!suppressEvents) { if (self._totalTime !== prevTotalTime || callback) {
    					self._callback("onUpdate");
    				} }
    			}
    			if (self._cycle !== prevCycle) { if (!suppressEvents) { if (!self._gc) { if (self.vars.onRepeat) {
    				self._callback("onRepeat");
    			} } } }
    			if (callback) { if (!self._gc || force) { //check gc because there's a chance that kill() could be called in an onUpdate
    				if (time < 0 && self._startAt && !self._onUpdate && self._startTime) { //if the tween is positioned at the VERY beginning (_startTime 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
    					self._startAt.render(time, true, force);
    				}
    				if (isComplete) {
    					if (self._timeline.autoRemoveChildren) {
    						self._enabled(false, false);
    					}
    					self._active = false;
    				}
    				if (!suppressEvents && self.vars[callback]) {
    					self._callback(callback);
    				}
    				if (duration === 0 && self._rawPrevTime === _tinyNum && rawPrevTime !== _tinyNum) { //the onComplete or onReverseComplete could trigger movement of the playhead and for zero-duration tweens (which must discern direction) that land directly back on their start time, we don't want to fire again on the next render. Think of several addPause()'s in a timeline that forces the playhead to a certain spot, but what if it's already paused and another tween is tweening the "time" of the timeline? Each time it moves [forward] past that spot, it would move back, and since suppressEvents is true, it'd reset _rawPrevTime to _tinyNum so that when it begins again, the callback would fire (so ultimately it could bounce back and forth during that tween). Again, this is a very uncommon scenario, but possible nonetheless.
    					self._rawPrevTime = 0;
    				}
    			} }
    		};

    //---- STATIC FUNCTIONS -----------------------------------------------------------------------------------------------------------

    		TweenMax.to = function(target, duration, vars) {
    			return new TweenMax(target, duration, vars);
    		};

    		TweenMax.from = function(target, duration, vars) {
    			vars.runBackwards = true;
    			vars.immediateRender = (vars.immediateRender != false);
    			return new TweenMax(target, duration, vars);
    		};

    		TweenMax.fromTo = function(target, duration, fromVars, toVars) {
    			toVars.startAt = fromVars;
    			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
    			return new TweenMax(target, duration, toVars);
    		};

    		TweenMax.staggerTo = TweenMax.allTo = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
    			var a = [],
    				staggerFunc = _distribute(vars.stagger || stagger),
    				cycle = vars.cycle,
    				fromCycle = (vars.startAt || _blankArray).cycle,
    				l, copy, i, p;
    			if (!_isArray(targets)) {
    				if (typeof(targets) === "string") {
    					targets = TweenLite.selector(targets) || targets;
    				}
    				if (_isSelector(targets)) {
    					targets = _slice(targets);
    				}
    			}
    			targets = targets || [];
    			l = targets.length - 1;
    			for (i = 0; i <= l; i++) {
    				copy = {};
    				for (p in vars) {
    					copy[p] = vars[p];
    				}
    				if (cycle) {
    					_applyCycle(copy, targets, i);
    					if (copy.duration != null) {
    						duration = copy.duration;
    						delete copy.duration;
    					}
    				}
    				if (fromCycle) {
    					fromCycle = copy.startAt = {};
    					for (p in vars.startAt) {
    						fromCycle[p] = vars.startAt[p];
    					}
    					_applyCycle(copy.startAt, targets, i);
    				}
    				copy.delay = staggerFunc(i, targets[i], targets) + (copy.delay || 0);
    				if (i === l && onCompleteAll) {
    					copy.onComplete = function() {
    						if (vars.onComplete) {
    							vars.onComplete.apply(vars.onCompleteScope || this, arguments);
    						}
    						onCompleteAll.apply(onCompleteAllScope || vars.callbackScope || this, onCompleteAllParams || _blankArray);
    					};
    				}
    				a[i] = new TweenMax(targets[i], duration, copy);
    			}
    			return a;
    		};

    		TweenMax.staggerFrom = TweenMax.allFrom = function(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
    			vars.runBackwards = true;
    			vars.immediateRender = (vars.immediateRender != false);
    			return TweenMax.staggerTo(targets, duration, vars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
    		};

    		TweenMax.staggerFromTo = TweenMax.allFromTo = function(targets, duration, fromVars, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
    			toVars.startAt = fromVars;
    			toVars.immediateRender = (toVars.immediateRender != false && fromVars.immediateRender != false);
    			return TweenMax.staggerTo(targets, duration, toVars, stagger, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
    		};

    		TweenMax.delayedCall = function(delay, callback, params, scope, useFrames) {
    			return new TweenMax(callback, 0, {delay:delay, onComplete:callback, onCompleteParams:params, callbackScope:scope, onReverseComplete:callback, onReverseCompleteParams:params, immediateRender:false, useFrames:useFrames, overwrite:0});
    		};

    		TweenMax.set = function(target, vars) {
    			return new TweenMax(target, 0, vars);
    		};

    		TweenMax.isTweening = function(target) {
    			return (TweenLite.getTweensOf(target, true).length > 0);
    		};

    		var _getChildrenOf = function(timeline, includeTimelines) {
    				var a = [],
    					cnt = 0,
    					tween = timeline._first;
    				while (tween) {
    					if (tween instanceof TweenLite) {
    						a[cnt++] = tween;
    					} else {
    						if (includeTimelines) {
    							a[cnt++] = tween;
    						}
    						a = a.concat(_getChildrenOf(tween, includeTimelines));
    						cnt = a.length;
    					}
    					tween = tween._next;
    				}
    				return a;
    			},
    			getAllTweens = TweenMax.getAllTweens = function(includeTimelines) {
    				return _getChildrenOf(Animation._rootTimeline, includeTimelines).concat( _getChildrenOf(Animation._rootFramesTimeline, includeTimelines) );
    			};

    		TweenMax.killAll = function(complete, tweens, delayedCalls, timelines) {
    			if (tweens == null) {
    				tweens = true;
    			}
    			if (delayedCalls == null) {
    				delayedCalls = true;
    			}
    			var a = getAllTweens((timelines != false)),
    				l = a.length,
    				allTrue = (tweens && delayedCalls && timelines),
    				isDC, tween, i;
    			for (i = 0; i < l; i++) {
    				tween = a[i];
    				if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
    					if (complete) {
    						tween.totalTime(tween._reversed ? 0 : tween.totalDuration());
    					} else {
    						tween._enabled(false, false);
    					}
    				}
    			}
    		};

    		TweenMax.killChildTweensOf = function(parent, complete) {
    			if (parent == null) {
    				return;
    			}
    			var tl = TweenLiteInternals.tweenLookup,
    				a, curParent, p, i, l;
    			if (typeof(parent) === "string") {
    				parent = TweenLite.selector(parent) || parent;
    			}
    			if (_isSelector(parent)) {
    				parent = _slice(parent);
    			}
    			if (_isArray(parent)) {
    				i = parent.length;
    				while (--i > -1) {
    					TweenMax.killChildTweensOf(parent[i], complete);
    				}
    				return;
    			}
    			a = [];
    			for (p in tl) {
    				curParent = tl[p].target.parentNode;
    				while (curParent) {
    					if (curParent === parent) {
    						a = a.concat(tl[p].tweens);
    					}
    					curParent = curParent.parentNode;
    				}
    			}
    			l = a.length;
    			for (i = 0; i < l; i++) {
    				if (complete) {
    					a[i].totalTime(a[i].totalDuration());
    				}
    				a[i]._enabled(false, false);
    			}
    		};

    		var _changePause = function(pause, tweens, delayedCalls, timelines) {
    			tweens = (tweens !== false);
    			delayedCalls = (delayedCalls !== false);
    			timelines = (timelines !== false);
    			var a = getAllTweens(timelines),
    				allTrue = (tweens && delayedCalls && timelines),
    				i = a.length,
    				isDC, tween;
    			while (--i > -1) {
    				tween = a[i];
    				if (allTrue || (tween instanceof SimpleTimeline) || ((isDC = (tween.target === tween.vars.onComplete)) && delayedCalls) || (tweens && !isDC)) {
    					tween.paused(pause);
    				}
    			}
    		};

    		TweenMax.pauseAll = function(tweens, delayedCalls, timelines) {
    			_changePause(true, tweens, delayedCalls, timelines);
    		};

    		TweenMax.resumeAll = function(tweens, delayedCalls, timelines) {
    			_changePause(false, tweens, delayedCalls, timelines);
    		};

    		TweenMax.globalTimeScale = function(value) {
    			var tl = Animation._rootTimeline,
    				t = TweenLite.ticker.time;
    			if (!arguments.length) {
    				return tl._timeScale;
    			}
    			value = value || _tinyNum; //can't allow zero because it'll throw the math off
    			tl._startTime = t - ((t - tl._startTime) * tl._timeScale / value);
    			tl = Animation._rootFramesTimeline;
    			t = TweenLite.ticker.frame;
    			tl._startTime = t - ((t - tl._startTime) * tl._timeScale / value);
    			tl._timeScale = Animation._rootTimeline._timeScale = value;
    			return value;
    		};


    //---- GETTERS / SETTERS ----------------------------------------------------------------------------------------------------------

    		p.progress = function(value, suppressEvents) {
    			return (!arguments.length) ? (this.duration() ? this._time / this._duration : this.ratio) : this.totalTime( this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), suppressEvents);
    		};

    		p.totalProgress = function(value, suppressEvents) {
    			return (!arguments.length) ? this._totalTime / this.totalDuration() : this.totalTime( this.totalDuration() * value, suppressEvents);
    		};

    		p.time = function(value, suppressEvents) {
    			if (!arguments.length) {
    				return this._time;
    			}
    			if (this._dirty) {
    				this.totalDuration();
    			}
    			var duration = this._duration,
    				cycle = this._cycle,
    				cycleDur = cycle * (duration + this._repeatDelay);
    			if (value > duration) {
    				value = duration;
    			}
    			return this.totalTime((this._yoyo && (cycle & 1)) ? duration - value + cycleDur : this._repeat ? value + cycleDur : value, suppressEvents);
    		};

    		p.duration = function(value) {
    			if (!arguments.length) {
    				return this._duration; //don't set _dirty = false because there could be repeats that haven't been factored into the _totalDuration yet. Otherwise, if you create a repeated TweenMax and then immediately check its duration(), it would cache the value and the totalDuration would not be correct, thus repeats wouldn't take effect.
    			}
    			return Animation.prototype.duration.call(this, value);
    		};

    		p.totalDuration = function(value) {
    			if (!arguments.length) {
    				if (this._dirty) {
    					//instead of Infinity, we use 999999999999 so that we can accommodate reverses
    					this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
    					this._dirty = false;
    				}
    				return this._totalDuration;
    			}
    			return (this._repeat === -1) ? this : this.duration( (value - (this._repeat * this._repeatDelay)) / (this._repeat + 1) );
    		};

    		p.repeat = function(value) {
    			if (!arguments.length) {
    				return this._repeat;
    			}
    			this._repeat = value;
    			return this._uncache(true);
    		};

    		p.repeatDelay = function(value) {
    			if (!arguments.length) {
    				return this._repeatDelay;
    			}
    			this._repeatDelay = value;
    			return this._uncache(true);
    		};

    		p.yoyo = function(value) {
    			if (!arguments.length) {
    				return this._yoyo;
    			}
    			this._yoyo = value;
    			return this;
    		};


    		return TweenMax;

    	}, true);

    var TweenMax = globals.TweenMax;

    /*!
     * VERSION: 2.1.3
     * DATE: 2019-05-17
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
     * This work is subject to the terms at http://greensock.com/standard-license or for
     * Club GreenSock members, the software agreement that was issued with your membership.
     * 
     * @author: Jack Doyle, jack@greensock.com
     */

    	_gsScope._gsDefine("plugins.CSSPlugin", ["plugins.TweenPlugin","TweenLite"], function() {

    		/** @constructor **/
    		var CSSPlugin = function() {
    				TweenPlugin.call(this, "css");
    				this._overwriteProps.length = 0;
    				this.setRatio = CSSPlugin.prototype.setRatio; //speed optimization (avoid prototype lookup on this "hot" method)
    			},
    			_globals = _gsScope._gsDefine.globals,
    			_hasPriority, //turns true whenever a CSSPropTween instance is created that has a priority other than 0. This helps us discern whether or not we should spend the time organizing the linked list or not after a CSSPlugin's _onInitTween() method is called.
    			_suffixMap, //we set this in _onInitTween() each time as a way to have a persistent variable we can use in other methods like _parse() without having to pass it around as a parameter and we keep _parse() decoupled from a particular CSSPlugin instance
    			_cs, //computed style (we store this in a shared variable to conserve memory and make minification tighter
    			_overwriteProps, //alias to the currently instantiating CSSPlugin's _overwriteProps array. We use this closure in order to avoid having to pass a reference around from method to method and aid in minification.
    			_specialProps = {},
    			p = CSSPlugin.prototype = new TweenPlugin("css");

    		p.constructor = CSSPlugin;
    		CSSPlugin.version = "2.1.3";
    		CSSPlugin.API = 2;
    		CSSPlugin.defaultTransformPerspective = 0;
    		CSSPlugin.defaultSkewType = "compensated";
    		CSSPlugin.defaultSmoothOrigin = true;
    		p = "px"; //we'll reuse the "p" variable to keep file size down
    		CSSPlugin.suffixMap = {top:p, right:p, bottom:p, left:p, width:p, height:p, fontSize:p, padding:p, margin:p, perspective:p, lineHeight:""};


    		var _numExp = /(?:\-|\.|\b)(\d|\.|e\-)+/g,
    			_relNumExp = /(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,
    			_valuesExp = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi, //finds all the values that begin with numbers or += or -= and then a number. Includes suffixes. We use this to split complex values apart like "1px 5px 20px rgb(255,102,51)"
    			_valuesExpWithCommas = /(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b),?/gi, //finds all the values that begin with numbers or += or -= and then a number. Includes suffixes. We use this to split complex values apart like "1px 5px 20px rgb(255,102,51)"
    			_NaNExp = /(?![+-]?\d*\.?\d+|[+-]|e[+-]\d+)[^0-9]/g, //also allows scientific notation and doesn't kill the leading -/+ in -= and +=
    			_suffixExp = /(?:\d|\-|\+|=|#|\.)*/g,
    			_opacityExp = /opacity *= *([^)]*)/i,
    			_opacityValExp = /opacity:([^;]*)/i,
    			_alphaFilterExp = /alpha\(opacity *=.+?\)/i,
    			_rgbhslExp = /^(rgb|hsl)/,
    			_capsExp = /([A-Z])/g,
    			_camelExp = /-([a-z])/gi,
    			_urlExp = /(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi, //for pulling out urls from url(...) or url("...") strings (some browsers wrap urls in quotes, some don't when reporting things like backgroundImage)
    			_camelFunc = function(s, g) { return g.toUpperCase(); },
    			_horizExp = /(?:Left|Right|Width)/i,
    			_ieGetMatrixExp = /(M11|M12|M21|M22)=[\d\-\.e]+/gi,
    			_ieSetMatrixExp = /progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,
    			_commasOutsideParenExp = /,(?=[^\)]*(?:\(|$))/gi, //finds any commas that are not within parenthesis
    			_complexExp = /[\s,\(]/i, //for testing a string to find if it has a space, comma, or open parenthesis (clues that it's a complex value)
    			_DEG2RAD = Math.PI / 180,
    			_RAD2DEG = 180 / Math.PI,
    			_forcePT = {},
    			_dummyElement = {style:{}},
    			_doc = _gsScope.document || {createElement: function() {return _dummyElement;}},
    			_createElement = function(type, ns) {
    				var e = _doc.createElementNS ? _doc.createElementNS(ns || "http://www.w3.org/1999/xhtml", type) : _doc.createElement(type);
    				return e.style ? e : _doc.createElement(type); //some environments won't allow access to the element's style when created with a namespace in which case we default to the standard createElement() to work around the issue. Also note that when GSAP is embedded directly inside an SVG file, createElement() won't allow access to the style object in Firefox (see https://greensock.com/forums/topic/20215-problem-using-tweenmax-in-standalone-self-containing-svg-file-err-cannot-set-property-csstext-of-undefined/).
    			},
    			_tempDiv = _createElement("div"),
    			_tempImg = _createElement("img"),
    			_internals = CSSPlugin._internals = {_specialProps:_specialProps}, //provides a hook to a few internal methods that we need to access from inside other plugins
    			_agent = (_gsScope.navigator || {}).userAgent || "",
    			_autoRound,
    			_reqSafariFix, //we won't apply the Safari transform fix until we actually come across a tween that affects a transform property (to maintain best performance).

    			_isSafari,
    			_isFirefox, //Firefox has a bug that causes 3D transformed elements to randomly disappear unless a repaint is forced after each update on each element.
    			_isSafariLT6, //Safari (and Android 4 which uses a flavor of Safari) has a bug that prevents changes to "top" and "left" properties from rendering properly if changed on the same frame as a transform UNLESS we set the element's WebkitBackfaceVisibility to hidden (weird, I know). Doing this for Android 3 and earlier seems to actually cause other problems, though (fun!)
    			_ieVers,
    			_supportsOpacity = (function() { //we set _isSafari, _ieVers, _isFirefox, and _supportsOpacity all in one function here to reduce file size slightly, especially in the minified version.
    				var i = _agent.indexOf("Android"),
    					a = _createElement("a");
    				_isSafari = (_agent.indexOf("Safari") !== -1 && _agent.indexOf("Chrome") === -1 && (i === -1 || parseFloat(_agent.substr(i+8, 2)) > 3));
    				_isSafariLT6 = (_isSafari && (parseFloat(_agent.substr(_agent.indexOf("Version/")+8, 2)) < 6));
    				_isFirefox = (_agent.indexOf("Firefox") !== -1);
    				if ((/MSIE ([0-9]{1,}[\.0-9]{0,})/).exec(_agent) || (/Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/).exec(_agent)) {
    					_ieVers = parseFloat( RegExp.$1 );
    				}
    				if (!a) {
    					return false;
    				}
    				a.style.cssText = "top:1px;opacity:.55;";
    				return /^0.55/.test(a.style.opacity);
    			}()),
    			_getIEOpacity = function(v) {
    				return (_opacityExp.test( ((typeof(v) === "string") ? v : (v.currentStyle ? v.currentStyle.filter : v.style.filter) || "") ) ? ( parseFloat( RegExp.$1 ) / 100 ) : 1);
    			},
    			_log = function(s) {//for logging messages, but in a way that won't throw errors in old versions of IE.
    				if (_gsScope.console) {
    					console.log(s);
    				}
    			},
    			_target, //when initting a CSSPlugin, we set this variable so that we can access it from within many other functions without having to pass it around as params
    			_index, //when initting a CSSPlugin, we set this variable so that we can access it from within many other functions without having to pass it around as params

    			_prefixCSS = "", //the non-camelCase vendor prefix like "-o-", "-moz-", "-ms-", or "-webkit-"
    			_prefix = "", //camelCase vendor prefix like "O", "ms", "Webkit", or "Moz".

    			// @private feed in a camelCase property name like "transform" and it will check to see if it is valid as-is or if it needs a vendor prefix. It returns the corrected camelCase property name (i.e. "WebkitTransform" or "MozTransform" or "transform" or null if no such property is found, like if the browser is IE8 or before, "transform" won't be found at all)
    			_checkPropPrefix = function(p, e) {
    				e = e || _tempDiv;
    				var s = e.style,
    					a, i;
    				if (s[p] !== undefined) {
    					return p;
    				}
    				p = p.charAt(0).toUpperCase() + p.substr(1);
    				a = ["O","Moz","ms","Ms","Webkit"];
    				i = 5;
    				while (--i > -1 && s[a[i]+p] === undefined) { }
    				if (i >= 0) {
    					_prefix = (i === 3) ? "ms" : a[i];
    					_prefixCSS = "-" + _prefix.toLowerCase() + "-";
    					return _prefix + p;
    				}
    				return null;
    			},

    			_computedStyleScope = (typeof(window) !== "undefined" ? window : _doc.defaultView || {getComputedStyle:function() {}}),
    			_getComputedStyle = function(e) {
    				return _computedStyleScope.getComputedStyle(e); //to avoid errors in Microsoft Edge, we need to call getComputedStyle() from a specific scope, typically window.
    			},

    			/**
    			 * @private Returns the css style for a particular property of an element. For example, to get whatever the current "left" css value for an element with an ID of "myElement", you could do:
    			 * var currentLeft = CSSPlugin.getStyle( document.getElementById("myElement"), "left");
    			 *
    			 * @param {!Object} t Target element whose style property you want to query
    			 * @param {!string} p Property name (like "left" or "top" or "marginTop", etc.)
    			 * @param {Object=} cs Computed style object. This just provides a way to speed processing if you're going to get several properties on the same element in quick succession - you can reuse the result of the getComputedStyle() call.
    			 * @param {boolean=} calc If true, the value will not be read directly from the element's "style" property (if it exists there), but instead the getComputedStyle() result will be used. This can be useful when you want to ensure that the browser itself is interpreting the value.
    			 * @param {string=} dflt Default value that should be returned in the place of null, "none", "auto" or "auto auto".
    			 * @return {?string} The current property value
    			 */
    			_getStyle = CSSPlugin.getStyle = function(t, p, cs, calc, dflt) {
    				var rv;
    				if (!_supportsOpacity) { if (p === "opacity") { //several versions of IE don't use the standard "opacity" property - they use things like filter:alpha(opacity=50), so we parse that here.
    					return _getIEOpacity(t);
    				} }
    				if (!calc && t.style[p]) {
    					rv = t.style[p];
    				} else if ((cs = cs || _getComputedStyle(t))) {
    					rv = cs[p] || cs.getPropertyValue(p) || cs.getPropertyValue(p.replace(_capsExp, "-$1").toLowerCase());
    				} else if (t.currentStyle) {
    					rv = t.currentStyle[p];
    				}
    				return (dflt != null && (!rv || rv === "none" || rv === "auto" || rv === "auto auto")) ? dflt : rv;
    			},

    			/**
    			 * @private Pass the target element, the property name, the numeric value, and the suffix (like "%", "em", "px", etc.) and it will spit back the equivalent pixel number.
    			 * @param {!Object} t Target element
    			 * @param {!string} p Property name (like "left", "top", "marginLeft", etc.)
    			 * @param {!number} v Value
    			 * @param {string=} sfx Suffix (like "px" or "%" or "em")
    			 * @param {boolean=} recurse If true, the call is a recursive one. In some browsers (like IE7/8), occasionally the value isn't accurately reported initially, but if we run the function again it will take effect.
    			 * @return {number} value in pixels
    			 */
    			_convertToPixels = _internals.convertToPixels = function(t, p, v, sfx, recurse) {
    				if (sfx === "px" || (!sfx && p !== "lineHeight")) { return v; }
    				if (sfx === "auto" || !v) { return 0; }
    				var horiz = _horizExp.test(p),
    					node = t,
    					style = _tempDiv.style,
    					neg = (v < 0),
    					precise = (v === 1),
    					pix, cache, time;
    				if (neg) {
    					v = -v;
    				}
    				if (precise) {
    					v *= 100;
    				}
    				if (p === "lineHeight" && !sfx) { //special case of when a simple lineHeight (without a unit) is used. Set it to the value, read back the computed value, and then revert.
    					cache = _getComputedStyle(t).lineHeight;
    					t.style.lineHeight = v;
    					pix = parseFloat(_getComputedStyle(t).lineHeight);
    					t.style.lineHeight = cache;
    				} else if (sfx === "%" && p.indexOf("border") !== -1) {
    					pix = (v / 100) * (horiz ? t.clientWidth : t.clientHeight);
    				} else {
    					style.cssText = "border:0 solid red;position:" + _getStyle(t, "position") + ";line-height:0;";
    					if (sfx === "%" || !node.appendChild || sfx.charAt(0) === "v" || sfx === "rem") {
    						node = t.parentNode || _doc.body;
    						if (_getStyle(node, "display").indexOf("flex") !== -1) { //Edge and IE11 have a bug that causes offsetWidth to report as 0 if the container has display:flex and the child is position:relative. Switching to position: absolute solves it.
    							style.position = "absolute";
    						}
    						cache = node._gsCache;
    						time = TweenLite.ticker.frame;
    						if (cache && horiz && cache.time === time) { //performance optimization: we record the width of elements along with the ticker frame so that we can quickly get it again on the same tick (seems relatively safe to assume it wouldn't change on the same tick)
    							return cache.width * v / 100;
    						}
    						style[(horiz ? "width" : "height")] = v + sfx;
    					} else {
    						style[(horiz ? "borderLeftWidth" : "borderTopWidth")] = v + sfx;
    					}
    					node.appendChild(_tempDiv);
    					pix = parseFloat(_tempDiv[(horiz ? "offsetWidth" : "offsetHeight")]);
    					node.removeChild(_tempDiv);
    					if (horiz && sfx === "%" && CSSPlugin.cacheWidths !== false) {
    						cache = node._gsCache = node._gsCache || {};
    						cache.time = time;
    						cache.width = pix / v * 100;
    					}
    					if (pix === 0 && !recurse) {
    						pix = _convertToPixels(t, p, v, sfx, true);
    					}
    				}
    				if (precise) {
    					pix /= 100;
    				}
    				return neg ? -pix : pix;
    			},
    			_calculateOffset = _internals.calculateOffset = function(t, p, cs) { //for figuring out "top" or "left" in px when it's "auto". We need to factor in margin with the offsetLeft/offsetTop
    				if (_getStyle(t, "position", cs) !== "absolute") { return 0; }
    				var dim = ((p === "left") ? "Left" : "Top"),
    					v = _getStyle(t, "margin" + dim, cs);
    				return t["offset" + dim] - (_convertToPixels(t, p, parseFloat(v), v.replace(_suffixExp, "")) || 0);
    			},

    			// @private returns at object containing ALL of the style properties in camelCase and their associated values.
    			_getAllStyles = function(t, cs) {
    				var s = {},
    					i, tr, p;
    				if ((cs = cs || _getComputedStyle(t))) {
    					if ((i = cs.length)) {
    						while (--i > -1) {
    							p = cs[i];
    							if (p.indexOf("-transform") === -1 || _transformPropCSS === p) { //Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
    								s[p.replace(_camelExp, _camelFunc)] = cs.getPropertyValue(p);
    							}
    						}
    					} else { //some browsers behave differently - cs.length is always 0, so we must do a for...in loop.
    						for (i in cs) {
    							if (i.indexOf("Transform") === -1 || _transformProp === i) { //Some webkit browsers duplicate transform values, one non-prefixed and one prefixed ("transform" and "WebkitTransform"), so we must weed out the extra one here.
    								s[i] = cs[i];
    							}
    						}
    					}
    				} else if ((cs = t.currentStyle || t.style)) {
    					for (i in cs) {
    						if (typeof(i) === "string" && s[i] === undefined) {
    							s[i.replace(_camelExp, _camelFunc)] = cs[i];
    						}
    					}
    				}
    				if (!_supportsOpacity) {
    					s.opacity = _getIEOpacity(t);
    				}
    				tr = _getTransform(t, cs, false);
    				s.rotation = tr.rotation;
    				s.skewX = tr.skewX;
    				s.scaleX = tr.scaleX;
    				s.scaleY = tr.scaleY;
    				s.x = tr.x;
    				s.y = tr.y;
    				if (_supports3D) {
    					s.z = tr.z;
    					s.rotationX = tr.rotationX;
    					s.rotationY = tr.rotationY;
    					s.scaleZ = tr.scaleZ;
    				}
    				if (s.filters) {
    					delete s.filters;
    				}
    				return s;
    			},

    			// @private analyzes two style objects (as returned by _getAllStyles()) and only looks for differences between them that contain tweenable values (like a number or color). It returns an object with a "difs" property which refers to an object containing only those isolated properties and values for tweening, and a "firstMPT" property which refers to the first MiniPropTween instance in a linked list that recorded all the starting values of the different properties so that we can revert to them at the end or beginning of the tween - we don't want the cascading to get messed up. The forceLookup parameter is an optional generic object with properties that should be forced into the results - this is necessary for className tweens that are overwriting others because imagine a scenario where a rollover/rollout adds/removes a class and the user swipes the mouse over the target SUPER fast, thus nothing actually changed yet and the subsequent comparison of the properties would indicate they match (especially when px rounding is taken into consideration), thus no tweening is necessary even though it SHOULD tween and remove those properties after the tween (otherwise the inline styles will contaminate things). See the className SpecialProp code for details.
    			_cssDif = function(t, s1, s2, vars, forceLookup) {
    				var difs = {},
    					style = t.style,
    					val, p, mpt;
    				for (p in s2) {
    					if (p !== "cssText") { if (p !== "length") { if (isNaN(p)) { if (s1[p] !== (val = s2[p]) || (forceLookup && forceLookup[p])) { if (p.indexOf("Origin") === -1) { if (typeof(val) === "number" || typeof(val) === "string") {
    						difs[p] = (val === "auto" && (p === "left" || p === "top")) ? _calculateOffset(t, p) : ((val === "" || val === "auto" || val === "none") && typeof(s1[p]) === "string" && s1[p].replace(_NaNExp, "") !== "") ? 0 : val; //if the ending value is defaulting ("" or "auto"), we check the starting value and if it can be parsed into a number (a string which could have a suffix too, like 700px), then we swap in 0 for "" or "auto" so that things actually tween.
    						if (style[p] !== undefined) { //for className tweens, we must remember which properties already existed inline - the ones that didn't should be removed when the tween isn't in progress because they were only introduced to facilitate the transition between classes.
    							mpt = new MiniPropTween(style, p, style[p], mpt);
    						}
    					} } } } } }
    				}
    				if (vars) {
    					for (p in vars) { //copy properties (except className)
    						if (p !== "className") {
    							difs[p] = vars[p];
    						}
    					}
    				}
    				return {difs:difs, firstMPT:mpt};
    			},
    			_dimensions = {width:["Left","Right"], height:["Top","Bottom"]},
    			_margins = ["marginLeft","marginRight","marginTop","marginBottom"],

    			/**
    			 * @private Gets the width or height of an element
    			 * @param {!Object} t Target element
    			 * @param {!string} p Property name ("width" or "height")
    			 * @param {Object=} cs Computed style object (if one exists). Just a speed optimization.
    			 * @return {number} Dimension (in pixels)
    			 */
    			_getDimension = function(t, p, cs) {
    				if ((t.nodeName + "").toLowerCase() === "svg") { //Chrome no longer supports offsetWidth/offsetHeight on SVG elements.
    					return (cs || _getComputedStyle(t))[p] || 0;
    				} else if (t.getCTM && _isSVG(t)) {
    					return t.getBBox()[p] || 0;
    				}
    				var v = parseFloat((p === "width") ? t.offsetWidth : t.offsetHeight),
    					a = _dimensions[p],
    					i = a.length;
    				cs = cs || _getComputedStyle(t);
    				while (--i > -1) {
    					v -= parseFloat( _getStyle(t, "padding" + a[i], cs, true) ) || 0;
    					v -= parseFloat( _getStyle(t, "border" + a[i] + "Width", cs, true) ) || 0;
    				}
    				return v;
    			},

    			// @private Parses position-related complex strings like "top left" or "50px 10px" or "70% 20%", etc. which are used for things like transformOrigin or backgroundPosition. Optionally decorates a supplied object (recObj) with the following properties: "ox" (offsetX), "oy" (offsetY), "oxp" (if true, "ox" is a percentage not a pixel value), and "oxy" (if true, "oy" is a percentage not a pixel value)
    			_parsePosition = function(v, recObj) {
    				if (v === "contain" || v === "auto" || v === "auto auto") { //note: Firefox uses "auto auto" as default whereas Chrome uses "auto".
    					return v + " ";
    				}
    				if (v == null || v === "") {
    					v = "0 0";
    				}
    				var a = v.split(" "),
    					x = (v.indexOf("left") !== -1) ? "0%" : (v.indexOf("right") !== -1) ? "100%" : a[0],
    					y = (v.indexOf("top") !== -1) ? "0%" : (v.indexOf("bottom") !== -1) ? "100%" : a[1],
    					i;
    				if (a.length > 3 && !recObj) { //multiple positions
    					a = v.split(", ").join(",").split(",");
    					v = [];
    					for (i = 0; i < a.length; i++) {
    						v.push(_parsePosition(a[i]));
    					}
    					return v.join(",");
    				}
    				if (y == null) {
    					y = (x === "center") ? "50%" : "0";
    				} else if (y === "center") {
    					y = "50%";
    				}
    				if (x === "center" || (isNaN(parseFloat(x)) && (x + "").indexOf("=") === -1)) { //remember, the user could flip-flop the values and say "bottom center" or "center bottom", etc. "center" is ambiguous because it could be used to describe horizontal or vertical, hence the isNaN(). If there's an "=" sign in the value, it's relative.
    					x = "50%";
    				}
    				v = x + " " + y + ((a.length > 2) ? " " + a[2] : "");
    				if (recObj) {
    					recObj.oxp = (x.indexOf("%") !== -1);
    					recObj.oyp = (y.indexOf("%") !== -1);
    					recObj.oxr = (x.charAt(1) === "=");
    					recObj.oyr = (y.charAt(1) === "=");
    					recObj.ox = parseFloat(x.replace(_NaNExp, ""));
    					recObj.oy = parseFloat(y.replace(_NaNExp, ""));
    					recObj.v = v;
    				}
    				return recObj || v;
    			},

    			/**
    			 * @private Takes an ending value (typically a string, but can be a number) and a starting value and returns the change between the two, looking for relative value indicators like += and -= and it also ignores suffixes (but make sure the ending value starts with a number or +=/-= and that the starting value is a NUMBER!)
    			 * @param {(number|string)} e End value which is typically a string, but could be a number
    			 * @param {(number|string)} b Beginning value which is typically a string but could be a number
    			 * @return {number} Amount of change between the beginning and ending values (relative values that have a "+=" or "-=" are recognized)
    			 */
    			_parseChange = function(e, b) {
    				if (typeof(e) === "function") {
    					e = e(_index, _target);
    				}
    				return (typeof(e) === "string" && e.charAt(1) === "=") ? parseInt(e.charAt(0) + "1", 10) * parseFloat(e.substr(2)) : (parseFloat(e) - parseFloat(b)) || 0;
    			},

    			/**
    			 * @private Takes a value and a default number, checks if the value is relative, null, or numeric and spits back a normalized number accordingly. Primarily used in the _parseTransform() function.
    			 * @param {Object} v Value to be parsed
    			 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
    			 * @return {number} Parsed value
    			 */
    			_parseVal = function(v, d) {
    				if (typeof(v) === "function") {
    					v = v(_index, _target);
    				}
    				var isRelative = (typeof(v) === "string" && v.charAt(1) === "=");
    				if (typeof(v) === "string" && v.charAt(v.length - 2) === "v") { //convert vw and vh into px-equivalents.
    					v = (isRelative ? v.substr(0, 2) : 0) + (window["inner" + ((v.substr(-2) === "vh") ? "Height" : "Width")] * (parseFloat(isRelative ? v.substr(2) : v) / 100));
    				}
    				return (v == null) ? d : isRelative ? parseInt(v.charAt(0) + "1", 10) * parseFloat(v.substr(2)) + d : parseFloat(v) || 0;
    			},

    			/**
    			 * @private Translates strings like "40deg" or "40" or 40rad" or "+=40deg" or "270_short" or "-90_cw" or "+=45_ccw" to a numeric radian angle. Of course a starting/default value must be fed in too so that relative values can be calculated properly.
    			 * @param {Object} v Value to be parsed
    			 * @param {!number} d Default value (which is also used for relative calculations if "+=" or "-=" is found in the first parameter)
    			 * @param {string=} p property name for directionalEnd (optional - only used when the parsed value is directional ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation). Property name would be "rotation", "rotationX", or "rotationY"
    			 * @param {Object=} directionalEnd An object that will store the raw end values for directional angles ("_short", "_cw", or "_ccw" suffix). We need a way to store the uncompensated value so that at the end of the tween, we set it to exactly what was requested with no directional compensation.
    			 * @return {number} parsed angle in radians
    			 */
    			_parseAngle = function(v, d, p, directionalEnd) {
    				var min = 0.000001,
    					cap, split, dif, result, isRelative;
    				if (typeof(v) === "function") {
    					v = v(_index, _target);
    				}
    				if (v == null) {
    					result = d;
    				} else if (typeof(v) === "number") {
    					result = v;
    				} else {
    					cap = 360;
    					split = v.split("_");
    					isRelative = (v.charAt(1) === "=");
    					dif = (isRelative ? parseInt(v.charAt(0) + "1", 10) * parseFloat(split[0].substr(2)) : parseFloat(split[0])) * ((v.indexOf("rad") === -1) ? 1 : _RAD2DEG) - (isRelative ? 0 : d);
    					if (split.length) {
    						if (directionalEnd) {
    							directionalEnd[p] = d + dif;
    						}
    						if (v.indexOf("short") !== -1) {
    							dif = dif % cap;
    							if (dif !== dif % (cap / 2)) {
    								dif = (dif < 0) ? dif + cap : dif - cap;
    							}
    						}
    						if (v.indexOf("_cw") !== -1 && dif < 0) {
    							dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
    						} else if (v.indexOf("ccw") !== -1 && dif > 0) {
    							dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
    						}
    					}
    					result = d + dif;
    				}
    				if (result < min && result > -min) {
    					result = 0;
    				}
    				return result;
    			},

    			_colorLookup = {aqua:[0,255,255],
    				lime:[0,255,0],
    				silver:[192,192,192],
    				black:[0,0,0],
    				maroon:[128,0,0],
    				teal:[0,128,128],
    				blue:[0,0,255],
    				navy:[0,0,128],
    				white:[255,255,255],
    				fuchsia:[255,0,255],
    				olive:[128,128,0],
    				yellow:[255,255,0],
    				orange:[255,165,0],
    				gray:[128,128,128],
    				purple:[128,0,128],
    				green:[0,128,0],
    				red:[255,0,0],
    				pink:[255,192,203],
    				cyan:[0,255,255],
    				transparent:[255,255,255,0]},

    			_hue = function(h, m1, m2) {
    				h = (h < 0) ? h + 1 : (h > 1) ? h - 1 : h;
    				return ((((h * 6 < 1) ? m1 + (m2 - m1) * h * 6 : (h < 0.5) ? m2 : (h * 3 < 2) ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * 255) + 0.5) | 0;
    			},

    			/**
    			 * @private Parses a color (like #9F0, #FF9900, rgb(255,51,153) or hsl(108, 50%, 10%)) into an array with 3 elements for red, green, and blue or if toHSL parameter is true, it will populate the array with hue, saturation, and lightness values. If a relative value is found in an hsl() or hsla() string, it will preserve those relative prefixes and all the values in the array will be strings instead of numbers (in all other cases it will be populated with numbers).
    			 * @param {(string|number)} v The value the should be parsed which could be a string like #9F0 or rgb(255,102,51) or rgba(255,0,0,0.5) or it could be a number like 0xFF00CC or even a named color like red, blue, purple, etc.
    			 * @param {(boolean)} toHSL If true, an hsl() or hsla() value will be returned instead of rgb() or rgba()
    			 * @return {Array.<number>} An array containing red, green, and blue (and optionally alpha) in that order, or if the toHSL parameter was true, the array will contain hue, saturation and lightness (and optionally alpha) in that order. Always numbers unless there's a relative prefix found in an hsl() or hsla() string and toHSL is true.
    			 */
    			_parseColor = CSSPlugin.parseColor = function(v, toHSL) {
    				var a, r, g, b, h, s, l, max, min, d, wasHSL;
    				if (!v) {
    					a = _colorLookup.black;
    				} else if (typeof(v) === "number") {
    					a = [v >> 16, (v >> 8) & 255, v & 255];
    				} else {
    					if (v.charAt(v.length - 1) === ",") { //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
    						v = v.substr(0, v.length - 1);
    					}
    					if (_colorLookup[v]) {
    						a = _colorLookup[v];
    					} else if (v.charAt(0) === "#") {
    						if (v.length === 4) { //for shorthand like #9F0
    							r = v.charAt(1);
    							g = v.charAt(2);
    							b = v.charAt(3);
    							v = "#" + r + r + g + g + b + b;
    						}
    						v = parseInt(v.substr(1), 16);
    						a = [v >> 16, (v >> 8) & 255, v & 255];
    					} else if (v.substr(0, 3) === "hsl") {
    						a = wasHSL = v.match(_numExp);
    						if (!toHSL) {
    							h = (Number(a[0]) % 360) / 360;
    							s = Number(a[1]) / 100;
    							l = Number(a[2]) / 100;
    							g = (l <= 0.5) ? l * (s + 1) : l + s - l * s;
    							r = l * 2 - g;
    							if (a.length > 3) {
    								a[3] = Number(a[3]);
    							}
    							a[0] = _hue(h + 1 / 3, r, g);
    							a[1] = _hue(h, r, g);
    							a[2] = _hue(h - 1 / 3, r, g);
    						} else if (v.indexOf("=") !== -1) { //if relative values are found, just return the raw strings with the relative prefixes in place.
    							return v.match(_relNumExp);
    						}
    					} else {
    						a = v.match(_numExp) || _colorLookup.transparent;
    					}
    					a[0] = Number(a[0]);
    					a[1] = Number(a[1]);
    					a[2] = Number(a[2]);
    					if (a.length > 3) {
    						a[3] = Number(a[3]);
    					}
    				}
    				if (toHSL && !wasHSL) {
    					r = a[0] / 255;
    					g = a[1] / 255;
    					b = a[2] / 255;
    					max = Math.max(r, g, b);
    					min = Math.min(r, g, b);
    					l = (max + min) / 2;
    					if (max === min) {
    						h = s = 0;
    					} else {
    						d = max - min;
    						s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    						h = (max === r) ? (g - b) / d + (g < b ? 6 : 0) : (max === g) ? (b - r) / d + 2 : (r - g) / d + 4;
    						h *= 60;
    					}
    					a[0] = (h + 0.5) | 0;
    					a[1] = (s * 100 + 0.5) | 0;
    					a[2] = (l * 100 + 0.5) | 0;
    				}
    				return a;
    			},
    			_formatColors = function(s, toHSL) {
    				var colors = s.match(_colorExp) || [],
    					charIndex = 0,
    					parsed = "",
    					i, color, temp;
    				if (!colors.length) {
    					return s;
    				}
    				for (i = 0; i < colors.length; i++) {
    					color = colors[i];
    					temp = s.substr(charIndex, s.indexOf(color, charIndex)-charIndex);
    					charIndex += temp.length + color.length;
    					color = _parseColor(color, toHSL);
    					if (color.length === 3) {
    						color.push(1);
    					}
    					parsed += temp + (toHSL ? "hsla(" + color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : "rgba(" + color.join(",")) + ")";
    				}
    				return parsed + s.substr(charIndex);
    			},
    			_colorExp = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b"; //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.

    		for (p in _colorLookup) {
    			_colorExp += "|" + p + "\\b";
    		}
    		_colorExp = new RegExp(_colorExp+")", "gi");

    		CSSPlugin.colorStringFilter = function(a) {
    			var combined = a[0] + " " + a[1],
    				toHSL;
    			if (_colorExp.test(combined)) {
    				toHSL = (combined.indexOf("hsl(") !== -1 || combined.indexOf("hsla(") !== -1);
    				a[0] = _formatColors(a[0], toHSL);
    				a[1] = _formatColors(a[1], toHSL);
    			}
    			_colorExp.lastIndex = 0;
    		};

    		if (!TweenLite.defaultStringFilter) {
    			TweenLite.defaultStringFilter = CSSPlugin.colorStringFilter;
    		}

    		/**
    		 * @private Returns a formatter function that handles taking a string (or number in some cases) and returning a consistently formatted one in terms of delimiters, quantity of values, etc. For example, we may get boxShadow values defined as "0px red" or "0px 0px 10px rgb(255,0,0)" or "0px 0px 20px 20px #F00" and we need to ensure that what we get back is described with 4 numbers and a color. This allows us to feed it into the _parseComplex() method and split the values up appropriately. The neat thing about this _getFormatter() function is that the dflt defines a pattern as well as a default, so for example, _getFormatter("0px 0px 0px 0px #777", true) not only sets the default as 0px for all distances and #777 for the color, but also sets the pattern such that 4 numbers and a color will always get returned.
    		 * @param {!string} dflt The default value and pattern to follow. So "0px 0px 0px 0px #777" will ensure that 4 numbers and a color will always get returned.
    		 * @param {boolean=} clr If true, the values should be searched for color-related data. For example, boxShadow values typically contain a color whereas borderRadius don't.
    		 * @param {boolean=} collapsible If true, the value is a top/left/right/bottom style one that acts like margin or padding, where if only one value is received, it's used for all 4; if 2 are received, the first is duplicated for 3rd (bottom) and the 2nd is duplicated for the 4th spot (left), etc.
    		 * @return {Function} formatter function
    		 */
    		var _getFormatter = function(dflt, clr, collapsible, multi) {
    				if (dflt == null) {
    					return function(v) {return v;};
    				}
    				var dColor = clr ? (dflt.match(_colorExp) || [""])[0] : "",
    					dVals = dflt.split(dColor).join("").match(_valuesExp) || [],
    					pfx = dflt.substr(0, dflt.indexOf(dVals[0])),
    					sfx = (dflt.charAt(dflt.length - 1) === ")") ? ")" : "",
    					delim = (dflt.indexOf(" ") !== -1) ? " " : ",",
    					numVals = dVals.length,
    					dSfx = (numVals > 0) ? dVals[0].replace(_numExp, "") : "",
    					formatter;
    				if (!numVals) {
    					return function(v) {return v;};
    				}
    				if (clr) {
    					formatter = function(v) {
    						var color, vals, i, a;
    						if (typeof(v) === "number") {
    							v += dSfx;
    						} else if (multi && _commasOutsideParenExp.test(v)) {
    							a = v.replace(_commasOutsideParenExp, "|").split("|");
    							for (i = 0; i < a.length; i++) {
    								a[i] = formatter(a[i]);
    							}
    							return a.join(",");
    						}
    						color = (v.match(_colorExp) || [dColor])[0];
    						vals = v.split(color).join("").match(_valuesExp) || [];
    						i = vals.length;
    						if (numVals > i--) {
    							while (++i < numVals) {
    								vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
    							}
    						}
    						return pfx + vals.join(delim) + delim + color + sfx + (v.indexOf("inset") !== -1 ? " inset" : "");
    					};
    					return formatter;

    				}
    				formatter = function(v) {
    					var vals, a, i;
    					if (typeof(v) === "number") {
    						v += dSfx;
    					} else if (multi && _commasOutsideParenExp.test(v)) {
    						a = v.replace(_commasOutsideParenExp, "|").split("|");
    						for (i = 0; i < a.length; i++) {
    							a[i] = formatter(a[i]);
    						}
    						return a.join(",");
    					}
    					vals = v.match(delim === "," ? _valuesExp : _valuesExpWithCommas) || [];
    					i = vals.length;
    					if (numVals > i--) {
    						while (++i < numVals) {
    							vals[i] = collapsible ? vals[(((i - 1) / 2) | 0)] : dVals[i];
    						}
    					}
    					return ((pfx && v !== "none") ? v.substr(0, v.indexOf(vals[0])) || pfx : pfx) + vals.join(delim) + sfx; //note: prefix might be different, like for clipPath it could start with inset( or polygon(
    				};
    				return formatter;
    			},

    			/**
    			 * @private returns a formatter function that's used for edge-related values like marginTop, marginLeft, paddingBottom, paddingRight, etc. Just pass a comma-delimited list of property names related to the edges.
    			 * @param {!string} props a comma-delimited list of property names in order from top to left, like "marginTop,marginRight,marginBottom,marginLeft"
    			 * @return {Function} a formatter function
    			 */
    			_getEdgeParser = function(props) {
    				props = props.split(",");
    				return function(t, e, p, cssp, pt, plugin, vars) {
    					var a = (e + "").split(" "),
    						i;
    					vars = {};
    					for (i = 0; i < 4; i++) {
    						vars[props[i]] = a[i] = a[i] || a[(((i - 1) / 2) >> 0)];
    					}
    					return cssp.parse(t, vars, pt, plugin);
    				};
    			},

    			// @private used when other plugins must tween values first, like BezierPlugin or ThrowPropsPlugin, etc. That plugin's setRatio() gets called first so that the values are updated, and then we loop through the MiniPropTweens which handle copying the values into their appropriate slots so that they can then be applied correctly in the main CSSPlugin setRatio() method. Remember, we typically create a proxy object that has a bunch of uniquely-named properties that we feed to the sub-plugin and it does its magic normally, and then we must interpret those values and apply them to the css because often numbers must get combined/concatenated, suffixes added, etc. to work with css, like boxShadow could have 4 values plus a color.
    			_setPluginRatio = _internals._setPluginRatio = function(v) {
    				this.plugin.setRatio(v);
    				var d = this.data,
    					proxy = d.proxy,
    					mpt = d.firstMPT,
    					min = 0.000001,
    					val, pt, i, str, p;
    				while (mpt) {
    					val = proxy[mpt.v];
    					if (mpt.r) {
    						val = mpt.r(val);
    					} else if (val < min && val > -min) {
    						val = 0;
    					}
    					mpt.t[mpt.p] = val;
    					mpt = mpt._next;
    				}
    				if (d.autoRotate) {
    					d.autoRotate.rotation = d.mod ? d.mod.call(this._tween, proxy.rotation, this.t, this._tween) : proxy.rotation; //special case for ModifyPlugin to hook into an auto-rotating bezier
    				}
    				//at the end, we must set the CSSPropTween's "e" (end) value dynamically here because that's what is used in the final setRatio() method. Same for "b" at the beginning.
    				if (v === 1 || v === 0) {
    					mpt = d.firstMPT;
    					p = (v === 1) ? "e" : "b";
    					while (mpt) {
    						pt = mpt.t;
    						if (!pt.type) {
    							pt[p] = pt.s + pt.xs0;
    						} else if (pt.type === 1) {
    							str = pt.xs0 + pt.s + pt.xs1;
    							for (i = 1; i < pt.l; i++) {
    								str += pt["xn"+i] + pt["xs"+(i+1)];
    							}
    							pt[p] = str;
    						}
    						mpt = mpt._next;
    					}
    				}
    			},

    			/**
    			 * @private @constructor Used by a few SpecialProps to hold important values for proxies. For example, _parseToProxy() creates a MiniPropTween instance for each property that must get tweened on the proxy, and we record the original property name as well as the unique one we create for the proxy, plus whether or not the value needs to be rounded plus the original value.
    			 * @param {!Object} t target object whose property we're tweening (often a CSSPropTween)
    			 * @param {!string} p property name
    			 * @param {(number|string|object)} v value
    			 * @param {MiniPropTween=} next next MiniPropTween in the linked list
    			 * @param {boolean=} r if true, the tweened value should be rounded to the nearest integer
    			 */
    			MiniPropTween = function(t, p, v, next, r) {
    				this.t = t;
    				this.p = p;
    				this.v = v;
    				this.r = r;
    				if (next) {
    					next._prev = this;
    					this._next = next;
    				}
    			},

    			/**
    			 * @private Most other plugins (like BezierPlugin and ThrowPropsPlugin and others) can only tween numeric values, but CSSPlugin must accommodate special values that have a bunch of extra data (like a suffix or strings between numeric values, etc.). For example, boxShadow has values like "10px 10px 20px 30px rgb(255,0,0)" which would utterly confuse other plugins. This method allows us to split that data apart and grab only the numeric data and attach it to uniquely-named properties of a generic proxy object ({}) so that we can feed that to virtually any plugin to have the numbers tweened. However, we must also keep track of which properties from the proxy go with which CSSPropTween values and instances. So we create a linked list of MiniPropTweens. Each one records a target (the original CSSPropTween), property (like "s" or "xn1" or "xn2") that we're tweening and the unique property name that was used for the proxy (like "boxShadow_xn1" and "boxShadow_xn2") and whether or not they need to be rounded. That way, in the _setPluginRatio() method we can simply copy the values over from the proxy to the CSSPropTween instance(s). Then, when the main CSSPlugin setRatio() method runs and applies the CSSPropTween values accordingly, they're updated nicely. So the external plugin tweens the numbers, _setPluginRatio() copies them over, and setRatio() acts normally, applying css-specific values to the element.
    			 * This method returns an object that has the following properties:
    			 *  - proxy: a generic object containing the starting values for all the properties that will be tweened by the external plugin.  This is what we feed to the external _onInitTween() as the target
    			 *  - end: a generic object containing the ending values for all the properties that will be tweened by the external plugin. This is what we feed to the external plugin's _onInitTween() as the destination values
    			 *  - firstMPT: the first MiniPropTween in the linked list
    			 *  - pt: the first CSSPropTween in the linked list that was created when parsing. If shallow is true, this linked list will NOT attach to the one passed into the _parseToProxy() as the "pt" (4th) parameter.
    			 * @param {!Object} t target object to be tweened
    			 * @param {!(Object|string)} vars the object containing the information about the tweening values (typically the end/destination values) that should be parsed
    			 * @param {!CSSPlugin} cssp The CSSPlugin instance
    			 * @param {CSSPropTween=} pt the next CSSPropTween in the linked list
    			 * @param {TweenPlugin=} plugin the external TweenPlugin instance that will be handling tweening the numeric values
    			 * @param {boolean=} shallow if true, the resulting linked list from the parse will NOT be attached to the CSSPropTween that was passed in as the "pt" (4th) parameter.
    			 * @return An object containing the following properties: proxy, end, firstMPT, and pt (see above for descriptions)
    			 */
    			_parseToProxy = _internals._parseToProxy = function(t, vars, cssp, pt, plugin, shallow) {
    				var bpt = pt,
    					start = {},
    					end = {},
    					transform = cssp._transform,
    					oldForce = _forcePT,
    					i, p, xp, mpt, firstPT;
    				cssp._transform = null;
    				_forcePT = vars;
    				pt = firstPT = cssp.parse(t, vars, pt, plugin);
    				_forcePT = oldForce;
    				//break off from the linked list so the new ones are isolated.
    				if (shallow) {
    					cssp._transform = transform;
    					if (bpt) {
    						bpt._prev = null;
    						if (bpt._prev) {
    							bpt._prev._next = null;
    						}
    					}
    				}
    				while (pt && pt !== bpt) {
    					if (pt.type <= 1) {
    						p = pt.p;
    						end[p] = pt.s + pt.c;
    						start[p] = pt.s;
    						if (!shallow) {
    							mpt = new MiniPropTween(pt, "s", p, mpt, pt.r);
    							pt.c = 0;
    						}
    						if (pt.type === 1) {
    							i = pt.l;
    							while (--i > 0) {
    								xp = "xn" + i;
    								p = pt.p + "_" + xp;
    								end[p] = pt.data[xp];
    								start[p] = pt[xp];
    								if (!shallow) {
    									mpt = new MiniPropTween(pt, xp, p, mpt, pt.rxp[xp]);
    								}
    							}
    						}
    					}
    					pt = pt._next;
    				}
    				return {proxy:start, end:end, firstMPT:mpt, pt:firstPT};
    			},



    			/**
    			 * @constructor Each property that is tweened has at least one CSSPropTween associated with it. These instances store important information like the target, property, starting value, amount of change, etc. They can also optionally have a number of "extra" strings and numeric values named xs1, xn1, xs2, xn2, xs3, xn3, etc. where "s" indicates string and "n" indicates number. These can be pieced together in a complex-value tween (type:1) that has alternating types of data like a string, number, string, number, etc. For example, boxShadow could be "5px 5px 8px rgb(102, 102, 51)". In that value, there are 6 numbers that may need to tween and then pieced back together into a string again with spaces, suffixes, etc. xs0 is special in that it stores the suffix for standard (type:0) tweens, -OR- the first string (prefix) in a complex-value (type:1) CSSPropTween -OR- it can be the non-tweening value in a type:-1 CSSPropTween. We do this to conserve memory.
    			 * CSSPropTweens have the following optional properties as well (not defined through the constructor):
    			 *  - l: Length in terms of the number of extra properties that the CSSPropTween has (default: 0). For example, for a boxShadow we may need to tween 5 numbers in which case l would be 5; Keep in mind that the start/end values for the first number that's tweened are always stored in the s and c properties to conserve memory. All additional values thereafter are stored in xn1, xn2, etc.
    			 *  - xfirst: The first instance of any sub-CSSPropTweens that are tweening properties of this instance. For example, we may split up a boxShadow tween so that there's a main CSSPropTween of type:1 that has various xs* and xn* values associated with the h-shadow, v-shadow, blur, color, etc. Then we spawn a CSSPropTween for each of those that has a higher priority and runs BEFORE the main CSSPropTween so that the values are all set by the time it needs to re-assemble them. The xfirst gives us an easy way to identify the first one in that chain which typically ends at the main one (because they're all prepende to the linked list)
    			 *  - plugin: The TweenPlugin instance that will handle the tweening of any complex values. For example, sometimes we don't want to use normal subtweens (like xfirst refers to) to tween the values - we might want ThrowPropsPlugin or BezierPlugin some other plugin to do the actual tweening, so we create a plugin instance and store a reference here. We need this reference so that if we get a request to round values or disable a tween, we can pass along that request.
    			 *  - data: Arbitrary data that needs to be stored with the CSSPropTween. Typically if we're going to have a plugin handle the tweening of a complex-value tween, we create a generic object that stores the END values that we're tweening to and the CSSPropTween's xs1, xs2, etc. have the starting values. We store that object as data. That way, we can simply pass that object to the plugin and use the CSSPropTween as the target.
    			 *  - setRatio: Only used for type:2 tweens that require custom functionality. In this case, we call the CSSPropTween's setRatio() method and pass the ratio each time the tween updates. This isn't quite as efficient as doing things directly in the CSSPlugin's setRatio() method, but it's very convenient and flexible.
    			 * @param {!Object} t Target object whose property will be tweened. Often a DOM element, but not always. It could be anything.
    			 * @param {string} p Property to tween (name). For example, to tween element.width, p would be "width".
    			 * @param {number} s Starting numeric value
    			 * @param {number} c Change in numeric value over the course of the entire tween. For example, if element.width starts at 5 and should end at 100, c would be 95.
    			 * @param {CSSPropTween=} next The next CSSPropTween in the linked list. If one is defined, we will define its _prev as the new instance, and the new instance's _next will be pointed at it.
    			 * @param {number=} type The type of CSSPropTween where -1 = a non-tweening value, 0 = a standard simple tween, 1 = a complex value (like one that has multiple numbers in a comma- or space-delimited string like border:"1px solid red"), and 2 = one that uses a custom setRatio function that does all of the work of applying the values on each update.
    			 * @param {string=} n Name of the property that should be used for overwriting purposes which is typically the same as p but not always. For example, we may need to create a subtween for the 2nd part of a "clip:rect(...)" tween in which case "p" might be xs1 but "n" is still "clip"
    			 * @param {boolean=} r If true, the value(s) should be rounded
    			 * @param {number=} pr Priority in the linked list order. Higher priority CSSPropTweens will be updated before lower priority ones. The default priority is 0.
    			 * @param {string=} b Beginning value. We store this to ensure that it is EXACTLY what it was when the tween began without any risk of interpretation issues.
    			 * @param {string=} e Ending value. We store this to ensure that it is EXACTLY what the user defined at the end of the tween without any risk of interpretation issues.
    			 */
    			CSSPropTween = _internals.CSSPropTween = function(t, p, s, c, next, type, n, r, pr, b, e) {
    				this.t = t; //target
    				this.p = p; //property
    				this.s = s; //starting value
    				this.c = c; //change value
    				this.n = n || p; //name that this CSSPropTween should be associated to (usually the same as p, but not always - n is what overwriting looks at)
    				if (!(t instanceof CSSPropTween)) {
    					_overwriteProps.push(this.n);
    				}
    				this.r = !r ? r : (typeof(r) === "function") ? r : Math.round; //round (boolean)
    				this.type = type || 0; //0 = normal tween, -1 = non-tweening (in which case xs0 will be applied to the target's property, like tp.t[tp.p] = tp.xs0), 1 = complex-value SpecialProp, 2 = custom setRatio() that does all the work
    				if (pr) {
    					this.pr = pr;
    					_hasPriority = true;
    				}
    				this.b = (b === undefined) ? s : b;
    				this.e = (e === undefined) ? s + c : e;
    				if (next) {
    					this._next = next;
    					next._prev = this;
    				}
    			},

    			_addNonTweeningNumericPT = function(target, prop, start, end, next, overwriteProp) { //cleans up some code redundancies and helps minification. Just a fast way to add a NUMERIC non-tweening CSSPropTween
    				var pt = new CSSPropTween(target, prop, start, end - start, next, -1, overwriteProp);
    				pt.b = start;
    				pt.e = pt.xs0 = end;
    				return pt;
    			},

    			/**
    			 * Takes a target, the beginning value and ending value (as strings) and parses them into a CSSPropTween (possibly with child CSSPropTweens) that accommodates multiple numbers, colors, comma-delimited values, etc. For example:
    			 * sp.parseComplex(element, "boxShadow", "5px 10px 20px rgb(255,102,51)", "0px 0px 0px red", true, "0px 0px 0px rgb(0,0,0,0)", pt);
    			 * It will walk through the beginning and ending values (which should be in the same format with the same number and type of values) and figure out which parts are numbers, what strings separate the numeric/tweenable values, and then create the CSSPropTweens accordingly. If a plugin is defined, no child CSSPropTweens will be created. Instead, the ending values will be stored in the "data" property of the returned CSSPropTween like: {s:-5, xn1:-10, xn2:-20, xn3:255, xn4:0, xn5:0} so that it can be fed to any other plugin and it'll be plain numeric tweens but the recomposition of the complex value will be handled inside CSSPlugin's setRatio().
    			 * If a setRatio is defined, the type of the CSSPropTween will be set to 2 and recomposition of the values will be the responsibility of that method.
    			 *
    			 * @param {!Object} t Target whose property will be tweened
    			 * @param {!string} p Property that will be tweened (its name, like "left" or "backgroundColor" or "boxShadow")
    			 * @param {string} b Beginning value
    			 * @param {string} e Ending value
    			 * @param {boolean} clrs If true, the value could contain a color value like "rgb(255,0,0)" or "#F00" or "red". The default is false, so no colors will be recognized (a performance optimization)
    			 * @param {(string|number|Object)} dflt The default beginning value that should be used if no valid beginning value is defined or if the number of values inside the complex beginning and ending values don't match
    			 * @param {?CSSPropTween} pt CSSPropTween instance that is the current head of the linked list (we'll prepend to this).
    			 * @param {number=} pr Priority in the linked list order. Higher priority properties will be updated before lower priority ones. The default priority is 0.
    			 * @param {TweenPlugin=} plugin If a plugin should handle the tweening of extra properties, pass the plugin instance here. If one is defined, then NO subtweens will be created for any extra properties (the properties will be created - just not additional CSSPropTween instances to tween them) because the plugin is expected to do so. However, the end values WILL be populated in the "data" property, like {s:100, xn1:50, xn2:300}
    			 * @param {function(number)=} setRatio If values should be set in a custom function instead of being pieced together in a type:1 (complex-value) CSSPropTween, define that custom function here.
    			 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parseComplex() call.
    			 */
    			_parseComplex = CSSPlugin.parseComplex = function(t, p, b, e, clrs, dflt, pt, pr, plugin, setRatio) {
    				//DEBUG: _log("parseComplex: "+p+", b: "+b+", e: "+e);
    				b = b || dflt || "";
    				if (typeof(e) === "function") {
    					e = e(_index, _target);
    				}
    				pt = new CSSPropTween(t, p, 0, 0, pt, (setRatio ? 2 : 1), null, false, pr, b, e);
    				e += ""; //ensures it's a string
    				if (clrs && _colorExp.test(e + b)) { //if colors are found, normalize the formatting to rgba() or hsla().
    					e = [b, e];
    					CSSPlugin.colorStringFilter(e);
    					b = e[0];
    					e = e[1];
    				}
    				var ba = b.split(", ").join(",").split(" "), //beginning array
    					ea = e.split(", ").join(",").split(" "), //ending array
    					l = ba.length,
    					autoRound = (_autoRound !== false),
    					i, xi, ni, bv, ev, bnums, enums, bn, hasAlpha, temp, cv, str, useHSL;
    				if (e.indexOf(",") !== -1 || b.indexOf(",") !== -1) {
    					if ((e + b).indexOf("rgb") !== -1 || (e + b).indexOf("hsl") !== -1) { //keep rgb(), rgba(), hsl(), and hsla() values together! (remember, we're splitting on spaces)
    						ba = ba.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
    						ea = ea.join(" ").replace(_commasOutsideParenExp, ", ").split(" ");
    					} else {
    						ba = ba.join(" ").split(",").join(", ").split(" ");
    						ea = ea.join(" ").split(",").join(", ").split(" ");
    					}
    					l = ba.length;
    				}
    				if (l !== ea.length) {
    					//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
    					ba = (dflt || "").split(" ");
    					l = ba.length;
    				}
    				pt.plugin = plugin;
    				pt.setRatio = setRatio;
    				_colorExp.lastIndex = 0;
    				for (i = 0; i < l; i++) {
    					bv = ba[i];
    					ev = ea[i] + "";
    					bn = parseFloat(bv);
    					//if the value begins with a number (most common). It's fine if it has a suffix like px
    					if (bn || bn === 0) {
    						pt.appendXtra("", bn, _parseChange(ev, bn), ev.replace(_relNumExp, ""), (autoRound && ev.indexOf("px") !== -1) ? Math.round : false, true);

    					//if the value is a color
    					} else if (clrs && _colorExp.test(bv)) {
    						str = ev.indexOf(")") + 1;
    						str = ")" + (str ? ev.substr(str) : ""); //if there's a comma or ) at the end, retain it.
    						useHSL = (ev.indexOf("hsl") !== -1 && _supportsOpacity);
    						temp = ev; //original string value so we can look for any prefix later.
    						bv = _parseColor(bv, useHSL);
    						ev = _parseColor(ev, useHSL);
    						hasAlpha = (bv.length + ev.length > 6);
    						if (hasAlpha && !_supportsOpacity && ev[3] === 0) { //older versions of IE don't support rgba(), so if the destination alpha is 0, just use "transparent" for the end color
    							pt["xs" + pt.l] += pt.l ? " transparent" : "transparent";
    							pt.e = pt.e.split(ea[i]).join("transparent");
    						} else {
    							if (!_supportsOpacity) { //old versions of IE don't support rgba().
    								hasAlpha = false;
    							}
    							if (useHSL) {
    								pt.appendXtra(temp.substr(0, temp.indexOf("hsl")) + (hasAlpha ? "hsla(" : "hsl("), bv[0], _parseChange(ev[0], bv[0]), ",", false, true)
    									.appendXtra("", bv[1], _parseChange(ev[1], bv[1]), "%,", false)
    									.appendXtra("", bv[2], _parseChange(ev[2], bv[2]), (hasAlpha ? "%," : "%" + str), false);
    							} else {
    								pt.appendXtra(temp.substr(0, temp.indexOf("rgb")) + (hasAlpha ? "rgba(" : "rgb("), bv[0], ev[0] - bv[0], ",", Math.round, true)
    									.appendXtra("", bv[1], ev[1] - bv[1], ",", Math.round)
    									.appendXtra("", bv[2], ev[2] - bv[2], (hasAlpha ? "," : str), Math.round);
    							}

    							if (hasAlpha) {
    								bv = (bv.length < 4) ? 1 : bv[3];
    								pt.appendXtra("", bv, ((ev.length < 4) ? 1 : ev[3]) - bv, str, false);
    							}
    						}
    						_colorExp.lastIndex = 0; //otherwise the test() on the RegExp could move the lastIndex and taint future results.

    					} else {
    						bnums = bv.match(_numExp); //gets each group of numbers in the beginning value string and drops them into an array

    						//if no number is found, treat it as a non-tweening value and just append the string to the current xs.
    						if (!bnums) {
    							pt["xs" + pt.l] += (pt.l || pt["xs" + pt.l]) ? " " + ev : ev;

    						//loop through all the numbers that are found and construct the extra values on the pt.
    						} else {
    							enums = ev.match(_relNumExp); //get each group of numbers in the end value string and drop them into an array. We allow relative values too, like +=50 or -=.5
    							if (!enums || enums.length !== bnums.length) {
    								//DEBUG: _log("mismatched formatting detected on " + p + " (" + b + " vs " + e + ")");
    								return pt;
    							}
    							ni = 0;
    							for (xi = 0; xi < bnums.length; xi++) {
    								cv = bnums[xi];
    								temp = bv.indexOf(cv, ni);
    								pt.appendXtra(bv.substr(ni, temp - ni), Number(cv), _parseChange(enums[xi], cv), "", (autoRound && bv.substr(temp + cv.length, 2) === "px") ? Math.round : false, (xi === 0));
    								ni = temp + cv.length;
    							}
    							pt["xs" + pt.l] += bv.substr(ni);
    						}
    					}
    				}
    				//if there are relative values ("+=" or "-=" prefix), we need to adjust the ending value to eliminate the prefixes and combine the values properly.
    				if (e.indexOf("=") !== -1) { if (pt.data) {
    					str = pt.xs0 + pt.data.s;
    					for (i = 1; i < pt.l; i++) {
    						str += pt["xs" + i] + pt.data["xn" + i];
    					}
    					pt.e = str + pt["xs" + i];
    				} }
    				if (!pt.l) {
    					pt.type = -1;
    					pt.xs0 = pt.e;
    				}
    				return pt.xfirst || pt;
    			},
    			i = 9;


    		p = CSSPropTween.prototype;
    		p.l = p.pr = 0; //length (number of extra properties like xn1, xn2, xn3, etc.
    		while (--i > 0) {
    			p["xn" + i] = 0;
    			p["xs" + i] = "";
    		}
    		p.xs0 = "";
    		p._next = p._prev = p.xfirst = p.data = p.plugin = p.setRatio = p.rxp = null;


    		/**
    		 * Appends and extra tweening value to a CSSPropTween and automatically manages any prefix and suffix strings. The first extra value is stored in the s and c of the main CSSPropTween instance, but thereafter any extras are stored in the xn1, xn2, xn3, etc. The prefixes and suffixes are stored in the xs0, xs1, xs2, etc. properties. For example, if I walk through a clip value like "rect(10px, 5px, 0px, 20px)", the values would be stored like this:
    		 * xs0:"rect(", s:10, xs1:"px, ", xn1:5, xs2:"px, ", xn2:0, xs3:"px, ", xn3:20, xn4:"px)"
    		 * And they'd all get joined together when the CSSPlugin renders (in the setRatio() method).
    		 * @param {string=} pfx Prefix (if any)
    		 * @param {!number} s Starting value
    		 * @param {!number} c Change in numeric value over the course of the entire tween. For example, if the start is 5 and the end is 100, the change would be 95.
    		 * @param {string=} sfx Suffix (if any)
    		 * @param {boolean=} r Round (if true).
    		 * @param {boolean=} pad If true, this extra value should be separated by the previous one by a space. If there is no previous extra and pad is true, it will automatically drop the space.
    		 * @return {CSSPropTween} returns itself so that multiple methods can be chained together.
    		 */
    		p.appendXtra = function(pfx, s, c, sfx, r, pad) {
    			var pt = this,
    				l = pt.l;
    			pt["xs" + l] += (pad && (l || pt["xs" + l])) ? " " + pfx : pfx || "";
    			if (!c) { if (l !== 0 && !pt.plugin) { //typically we'll combine non-changing values right into the xs to optimize performance, but we don't combine them when there's a plugin that will be tweening the values because it may depend on the values being split apart, like for a bezier, if a value doesn't change between the first and second iteration but then it does on the 3rd, we'll run into trouble because there's no xn slot for that value!
    				pt["xs" + l] += s + (sfx || "");
    				return pt;
    			} }
    			pt.l++;
    			pt.type = pt.setRatio ? 2 : 1;
    			pt["xs" + pt.l] = sfx || "";
    			if (l > 0) {
    				pt.data["xn" + l] = s + c;
    				pt.rxp["xn" + l] = r; //round extra property (we need to tap into this in the _parseToProxy() method)
    				pt["xn" + l] = s;
    				if (!pt.plugin) {
    					pt.xfirst = new CSSPropTween(pt, "xn" + l, s, c, pt.xfirst || pt, 0, pt.n, r, pt.pr);
    					pt.xfirst.xs0 = 0; //just to ensure that the property stays numeric which helps modern browsers speed up processing. Remember, in the setRatio() method, we do pt.t[pt.p] = val + pt.xs0 so if pt.xs0 is "" (the default), it'll cast the end value as a string. When a property is a number sometimes and a string sometimes, it prevents the compiler from locking in the data type, slowing things down slightly.
    				}
    				return pt;
    			}
    			pt.data = {s:s + c};
    			pt.rxp = {};
    			pt.s = s;
    			pt.c = c;
    			pt.r = r;
    			return pt;
    		};

    		/**
    		 * @constructor A SpecialProp is basically a css property that needs to be treated in a non-standard way, like if it may contain a complex value like boxShadow:"5px 10px 15px rgb(255, 102, 51)" or if it is associated with another plugin like ThrowPropsPlugin or BezierPlugin. Every SpecialProp is associated with a particular property name like "boxShadow" or "throwProps" or "bezier" and it will intercept those values in the vars object that's passed to the CSSPlugin and handle them accordingly.
    		 * @param {!string} p Property name (like "boxShadow" or "throwProps")
    		 * @param {Object=} options An object containing any of the following configuration options:
    		 *                      - defaultValue: the default value
    		 *                      - parser: A function that should be called when the associated property name is found in the vars. This function should return a CSSPropTween instance and it should ensure that it is properly inserted into the linked list. It will receive 4 paramters: 1) The target, 2) The value defined in the vars, 3) The CSSPlugin instance (whose _firstPT should be used for the linked list), and 4) A computed style object if one was calculated (this is a speed optimization that allows retrieval of starting values quicker)
    		 *                      - formatter: a function that formats any value received for this special property (for example, boxShadow could take "5px 5px red" and format it to "5px 5px 0px 0px red" so that both the beginning and ending values have a common order and quantity of values.)
    		 *                      - prefix: if true, we'll determine whether or not this property requires a vendor prefix (like Webkit or Moz or ms or O)
    		 *                      - color: set this to true if the value for this SpecialProp may contain color-related values like rgb(), rgba(), etc.
    		 *                      - priority: priority in the linked list order. Higher priority SpecialProps will be updated before lower priority ones. The default priority is 0.
    		 *                      - multi: if true, the formatter should accommodate a comma-delimited list of values, like boxShadow could have multiple boxShadows listed out.
    		 *                      - collapsible: if true, the formatter should treat the value like it's a top/right/bottom/left value that could be collapsed, like "5px" would apply to all, "5px, 10px" would use 5px for top/bottom and 10px for right/left, etc.
    		 *                      - keyword: a special keyword that can [optionally] be found inside the value (like "inset" for boxShadow). This allows us to validate beginning/ending values to make sure they match (if the keyword is found in one, it'll be added to the other for consistency by default).
    		 */
    		var SpecialProp = function(p, options) {
    				options = options || {};
    				this.p = options.prefix ? _checkPropPrefix(p) || p : p;
    				_specialProps[p] = _specialProps[this.p] = this;
    				this.format = options.formatter || _getFormatter(options.defaultValue, options.color, options.collapsible, options.multi);
    				if (options.parser) {
    					this.parse = options.parser;
    				}
    				this.clrs = options.color;
    				this.multi = options.multi;
    				this.keyword = options.keyword;
    				this.dflt = options.defaultValue;
    				this.allowFunc = options.allowFunc;
    				this.pr = options.priority || 0;
    			},

    			//shortcut for creating a new SpecialProp that can accept multiple properties as a comma-delimited list (helps minification). dflt can be an array for multiple values (we don't do a comma-delimited list because the default value may contain commas, like rect(0px,0px,0px,0px)). We attach this method to the SpecialProp class/object instead of using a private _createSpecialProp() method so that we can tap into it externally if necessary, like from another plugin.
    			_registerComplexSpecialProp = _internals._registerComplexSpecialProp = function(p, options, defaults) {
    				if (typeof(options) !== "object") {
    					options = {parser:defaults}; //to make backwards compatible with older versions of BezierPlugin and ThrowPropsPlugin
    				}
    				var a = p.split(","),
    					d = options.defaultValue,
    					i, temp;
    				defaults = defaults || [d];
    				for (i = 0; i < a.length; i++) {
    					options.prefix = (i === 0 && options.prefix);
    					options.defaultValue = defaults[i] || d;
    					temp = new SpecialProp(a[i], options);
    				}
    			},

    			//creates a placeholder special prop for a plugin so that the property gets caught the first time a tween of it is attempted, and at that time it makes the plugin register itself, thus taking over for all future tweens of that property. This allows us to not mandate that things load in a particular order and it also allows us to log() an error that informs the user when they attempt to tween an external plugin-related property without loading its .js file.
    			_registerPluginProp = _internals._registerPluginProp = function(p) {
    				if (!_specialProps[p]) {
    					var pluginName = p.charAt(0).toUpperCase() + p.substr(1) + "Plugin";
    					_registerComplexSpecialProp(p, {parser:function(t, e, p, cssp, pt, plugin, vars) {
    						var pluginClass = _globals.com.greensock.plugins[pluginName];
    						if (!pluginClass) {
    							_log("Error: " + pluginName + " js file not loaded.");
    							return pt;
    						}
    						pluginClass._cssRegister();
    						return _specialProps[p].parse(t, e, p, cssp, pt, plugin, vars);
    					}});
    				}
    			};


    		p = SpecialProp.prototype;

    		/**
    		 * Alias for _parseComplex() that automatically plugs in certain values for this SpecialProp, like its property name, whether or not colors should be sensed, the default value, and priority. It also looks for any keyword that the SpecialProp defines (like "inset" for boxShadow) and ensures that the beginning and ending values have the same number of values for SpecialProps where multi is true (like boxShadow and textShadow can have a comma-delimited list)
    		 * @param {!Object} t target element
    		 * @param {(string|number|object)} b beginning value
    		 * @param {(string|number|object)} e ending (destination) value
    		 * @param {CSSPropTween=} pt next CSSPropTween in the linked list
    		 * @param {TweenPlugin=} plugin If another plugin will be tweening the complex value, that TweenPlugin instance goes here.
    		 * @param {function=} setRatio If a custom setRatio() method should be used to handle this complex value, that goes here.
    		 * @return {CSSPropTween=} First CSSPropTween in the linked list
    		 */
    		p.parseComplex = function(t, b, e, pt, plugin, setRatio) {
    			var kwd = this.keyword,
    				i, ba, ea, l, bi, ei;
    			//if this SpecialProp's value can contain a comma-delimited list of values (like boxShadow or textShadow), we must parse them in a special way, and look for a keyword (like "inset" for boxShadow) and ensure that the beginning and ending BOTH have it if the end defines it as such. We also must ensure that there are an equal number of values specified (we can't tween 1 boxShadow to 3 for example)
    			if (this.multi) { if (_commasOutsideParenExp.test(e) || _commasOutsideParenExp.test(b)) {
    				ba = b.replace(_commasOutsideParenExp, "|").split("|");
    				ea = e.replace(_commasOutsideParenExp, "|").split("|");
    			} else if (kwd) {
    				ba = [b];
    				ea = [e];
    			} }
    			if (ea) {
    				l = (ea.length > ba.length) ? ea.length : ba.length;
    				for (i = 0; i < l; i++) {
    					b = ba[i] = ba[i] || this.dflt;
    					e = ea[i] = ea[i] || this.dflt;
    					if (kwd) {
    						bi = b.indexOf(kwd);
    						ei = e.indexOf(kwd);
    						if (bi !== ei) {
    							if (ei === -1) { //if the keyword isn't in the end value, remove it from the beginning one.
    								ba[i] = ba[i].split(kwd).join("");
    							} else if (bi === -1) { //if the keyword isn't in the beginning, add it.
    								ba[i] += " " + kwd;
    							}
    						}
    					}
    				}
    				b = ba.join(", ");
    				e = ea.join(", ");
    			}
    			return _parseComplex(t, this.p, b, e, this.clrs, this.dflt, pt, this.pr, plugin, setRatio);
    		};

    		/**
    		 * Accepts a target and end value and spits back a CSSPropTween that has been inserted into the CSSPlugin's linked list and conforms with all the conventions we use internally, like type:-1, 0, 1, or 2, setting up any extra property tweens, priority, etc. For example, if we have a boxShadow SpecialProp and call:
    		 * this._firstPT = sp.parse(element, "5px 10px 20px rgb(2550,102,51)", "boxShadow", this);
    		 * It should figure out the starting value of the element's boxShadow, compare it to the provided end value and create all the necessary CSSPropTweens of the appropriate types to tween the boxShadow. The CSSPropTween that gets spit back should already be inserted into the linked list (the 4th parameter is the current head, so prepend to that).
    		 * @param {!Object} t Target object whose property is being tweened
    		 * @param {Object} e End value as provided in the vars object (typically a string, but not always - like a throwProps would be an object).
    		 * @param {!string} p Property name
    		 * @param {!CSSPlugin} cssp The CSSPlugin instance that should be associated with this tween.
    		 * @param {?CSSPropTween} pt The CSSPropTween that is the current head of the linked list (we'll prepend to it)
    		 * @param {TweenPlugin=} plugin If a plugin will be used to tween the parsed value, this is the plugin instance.
    		 * @param {Object=} vars Original vars object that contains the data for parsing.
    		 * @return {CSSPropTween} The first CSSPropTween in the linked list which includes the new one(s) added by the parse() call.
    		 */
    		p.parse = function(t, e, p, cssp, pt, plugin, vars) {
    			return this.parseComplex(t.style, this.format(_getStyle(t, this.p, _cs, false, this.dflt)), this.format(e), pt, plugin);
    		};

    		/**
    		 * Registers a special property that should be intercepted from any "css" objects defined in tweens. This allows you to handle them however you want without CSSPlugin doing it for you. The 2nd parameter should be a function that accepts 3 parameters:
    		 *  1) Target object whose property should be tweened (typically a DOM element)
    		 *  2) The end/destination value (could be a string, number, object, or whatever you want)
    		 *  3) The tween instance (you probably don't need to worry about this, but it can be useful for looking up information like the duration)
    		 *
    		 * Then, your function should return a function which will be called each time the tween gets rendered, passing a numeric "ratio" parameter to your function that indicates the change factor (usually between 0 and 1). For example:
    		 *
    		 * CSSPlugin.registerSpecialProp("myCustomProp", function(target, value, tween) {
    		 *      var start = target.style.width;
    		 *      return function(ratio) {
    		 *              target.style.width = (start + value * ratio) + "px";
    		 *              console.log("set width to " + target.style.width);
    		 *          }
    		 * }, 0);
    		 *
    		 * Then, when I do this tween, it will trigger my special property:
    		 *
    		 * TweenLite.to(element, 1, {css:{myCustomProp:100}});
    		 *
    		 * In the example, of course, we're just changing the width, but you can do anything you want.
    		 *
    		 * @param {!string} name Property name (or comma-delimited list of property names) that should be intercepted and handled by your function. For example, if I define "myCustomProp", then it would handle that portion of the following tween: TweenLite.to(element, 1, {css:{myCustomProp:100}})
    		 * @param {!function(Object, Object, Object, string):function(number)} onInitTween The function that will be called when a tween of this special property is performed. The function will receive 4 parameters: 1) Target object that should be tweened, 2) Value that was passed to the tween, 3) The tween instance itself (rarely used), and 4) The property name that's being tweened. Your function should return a function that should be called on every update of the tween. That function will receive a single parameter that is a "change factor" value (typically between 0 and 1) indicating the amount of change as a ratio. You can use this to determine how to set the values appropriately in your function.
    		 * @param {number=} priority Priority that helps the engine determine the order in which to set the properties (default: 0). Higher priority properties will be updated before lower priority ones.
    		 */
    		CSSPlugin.registerSpecialProp = function(name, onInitTween, priority) {
    			_registerComplexSpecialProp(name, {parser:function(t, e, p, cssp, pt, plugin, vars) {
    				var rv = new CSSPropTween(t, p, 0, 0, pt, 2, p, false, priority);
    				rv.plugin = plugin;
    				rv.setRatio = onInitTween(t, e, cssp._tween, p);
    				return rv;
    			}, priority:priority});
    		};






    		//transform-related methods and properties
    		CSSPlugin.useSVGTransformAttr = true; //Safari and Firefox both have some rendering bugs when applying CSS transforms to SVG elements, so default to using the "transform" attribute instead (users can override this).
    		var _transformProps = ("scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective,xPercent,yPercent").split(","),
    			_transformProp = _checkPropPrefix("transform"), //the Javascript (camelCase) transform property, like msTransform, WebkitTransform, MozTransform, or OTransform.
    			_transformPropCSS = _prefixCSS + "transform",
    			_transformOriginProp = _checkPropPrefix("transformOrigin"),
    			_supports3D = (_checkPropPrefix("perspective") !== null),
    			Transform = _internals.Transform = function() {
    				this.perspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0;
    				this.force3D = (CSSPlugin.defaultForce3D === false || !_supports3D) ? false : CSSPlugin.defaultForce3D || "auto";
    			},
    			_SVGElement = _gsScope.SVGElement,
    			_useSVGTransformAttr,
    			//Some browsers (like Firefox and IE) don't honor transform-origin properly in SVG elements, so we need to manually adjust the matrix accordingly. We feature detect here rather than always doing the conversion for certain browsers because they may fix the problem at some point in the future.

    			_createSVG = function(type, container, attributes) {
    				var element = _doc.createElementNS("http://www.w3.org/2000/svg", type),
    					reg = /([a-z])([A-Z])/g,
    					p;
    				for (p in attributes) {
    					element.setAttributeNS(null, p.replace(reg, "$1-$2").toLowerCase(), attributes[p]);
    				}
    				container.appendChild(element);
    				return element;
    			},
    			_docElement = _doc.documentElement || {},
    			_forceSVGTransformAttr = (function() {
    				//IE and Android stock don't support CSS transforms on SVG elements, so we must write them to the "transform" attribute. We populate this variable in the _parseTransform() method, and only if/when we come across an SVG element
    				var force = _ieVers || (/Android/i.test(_agent) && !_gsScope.chrome),
    					svg, rect, width;
    				if (_doc.createElementNS && _docElement.appendChild && !force) { //IE8 and earlier doesn't support SVG anyway
    					svg = _createSVG("svg", _docElement);
    					rect = _createSVG("rect", svg, {width:100, height:50, x:100});
    					width = rect.getBoundingClientRect().width;
    					rect.style[_transformOriginProp] = "50% 50%";
    					rect.style[_transformProp] = "scaleX(0.5)";
    					force = (width === rect.getBoundingClientRect().width && !(_isFirefox && _supports3D)); //note: Firefox fails the test even though it does support CSS transforms in 3D. Since we can't push 3D stuff into the transform attribute, we force Firefox to pass the test here (as long as it does truly support 3D).
    					_docElement.removeChild(svg);
    				}
    				return force;
    			})(),
    			_parseSVGOrigin = function(e, local, decoratee, absolute, smoothOrigin, skipRecord) {
    				var tm = e._gsTransform,
    					m = _getMatrix(e, true),
    					v, x, y, xOrigin, yOrigin, a, b, c, d, tx, ty, determinant, xOriginOld, yOriginOld;
    				if (tm) {
    					xOriginOld = tm.xOrigin; //record the original values before we alter them.
    					yOriginOld = tm.yOrigin;
    				}
    				if (!absolute || (v = absolute.split(" ")).length < 2) {
    					b = e.getBBox();
    					if (b.x === 0 && b.y === 0 && b.width + b.height === 0) { //some browsers (like Firefox) misreport the bounds if the element has zero width and height (it just assumes it's at x:0, y:0), thus we need to manually grab the position in that case.
    						b = {x: parseFloat(e.hasAttribute("x") ? e.getAttribute("x") : e.hasAttribute("cx") ? e.getAttribute("cx") : 0) || 0, y: parseFloat(e.hasAttribute("y") ? e.getAttribute("y") : e.hasAttribute("cy") ? e.getAttribute("cy") : 0) || 0, width:0, height:0};
    					}
    					local = _parsePosition(local).split(" ");
    					v = [(local[0].indexOf("%") !== -1 ? parseFloat(local[0]) / 100 * b.width : parseFloat(local[0])) + b.x,
    						 (local[1].indexOf("%") !== -1 ? parseFloat(local[1]) / 100 * b.height : parseFloat(local[1])) + b.y];
    				}
    				decoratee.xOrigin = xOrigin = parseFloat(v[0]);
    				decoratee.yOrigin = yOrigin = parseFloat(v[1]);
    				if (absolute && m !== _identity2DMatrix) { //if svgOrigin is being set, we must invert the matrix and determine where the absolute point is, factoring in the current transforms. Otherwise, the svgOrigin would be based on the element's non-transformed position on the canvas.
    					a = m[0];
    					b = m[1];
    					c = m[2];
    					d = m[3];
    					tx = m[4];
    					ty = m[5];
    					determinant = (a * d - b * c);
    					if (determinant) { //if it's zero (like if scaleX and scaleY are zero), skip it to avoid errors with dividing by zero.
    						x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + ((c * ty - d * tx) / determinant);
    						y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - ((a * ty - b * tx) / determinant);
    						xOrigin = decoratee.xOrigin = v[0] = x;
    						yOrigin = decoratee.yOrigin = v[1] = y;
    					}
    				}
    				if (tm) { //avoid jump when transformOrigin is changed - adjust the x/y values accordingly
    					if (skipRecord) {
    						decoratee.xOffset = tm.xOffset;
    						decoratee.yOffset = tm.yOffset;
    						tm = decoratee;
    					}
    					if (smoothOrigin || (smoothOrigin !== false && CSSPlugin.defaultSmoothOrigin !== false)) {
    						x = xOrigin - xOriginOld;
    						y = yOrigin - yOriginOld;
    						//originally, we simply adjusted the x and y values, but that would cause problems if, for example, you created a rotational tween part-way through an x/y tween. Managing the offset in a separate variable gives us ultimate flexibility.
    						//tm.x -= x - (x * m[0] + y * m[2]);
    						//tm.y -= y - (x * m[1] + y * m[3]);
    						tm.xOffset += (x * m[0] + y * m[2]) - x;
    						tm.yOffset += (x * m[1] + y * m[3]) - y;
    					} else {
    						tm.xOffset = tm.yOffset = 0;
    					}
    				}
    				if (!skipRecord) {
    					e.setAttribute("data-svg-origin", v.join(" "));
    				}
    			},
    			_getBBoxHack = function(swapIfPossible) { //works around issues in some browsers (like Firefox) that don't correctly report getBBox() on SVG elements inside a <defs> element and/or <mask>. We try creating an SVG, adding it to the documentElement and toss the element in there so that it's definitely part of the rendering tree, then grab the bbox and if it works, we actually swap out the original getBBox() method for our own that does these extra steps whenever getBBox is needed. This helps ensure that performance is optimal (only do all these extra steps when absolutely necessary...most elements don't need it).
    				var svg = _createElement("svg", (this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns")) || "http://www.w3.org/2000/svg"),
    					oldParent = this.parentNode,
    					oldSibling = this.nextSibling,
    					oldCSS = this.style.cssText,
    					bbox;
    				_docElement.appendChild(svg);
    				svg.appendChild(this);
    				this.style.display = "block";
    				if (swapIfPossible) {
    					try {
    						bbox = this.getBBox();
    						this._originalGetBBox = this.getBBox;
    						this.getBBox = _getBBoxHack;
    					} catch (e) { }
    				} else if (this._originalGetBBox) {
    					bbox = this._originalGetBBox();
    				}
    				if (oldSibling) {
    					oldParent.insertBefore(this, oldSibling);
    				} else {
    					oldParent.appendChild(this);
    				}
    				_docElement.removeChild(svg);
    				this.style.cssText = oldCSS;
    				return bbox;
    			},
    			_getBBox = function(e) {
    				try {
    					return e.getBBox(); //Firefox throws errors if you try calling getBBox() on an SVG element that's not rendered (like in a <symbol> or <defs>). https://bugzilla.mozilla.org/show_bug.cgi?id=612118
    				} catch (error) {
    					return _getBBoxHack.call(e, true);
    				}
    			},
    			_isSVG = function(e) { //reports if the element is an SVG on which getBBox() actually works
    				return !!(_SVGElement && e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
    			},
    			_identity2DMatrix = [1,0,0,1,0,0],
    			_getMatrix = function(e, force2D) {
    				var tm = e._gsTransform || new Transform(),
    					rnd = 100000,
    					style = e.style,
    					isDefault, s, m, n, dec, nextSibling, parent;
    				if (_transformProp) {
    					s = _getStyle(e, _transformPropCSS, null, true);
    				} else if (e.currentStyle) {
    					//for older versions of IE, we need to interpret the filter portion that is in the format: progid:DXImageTransform.Microsoft.Matrix(M11=6.123233995736766e-17, M12=-1, M21=1, M22=6.123233995736766e-17, sizingMethod='auto expand') Notice that we need to swap b and c compared to a normal matrix.
    					s = e.currentStyle.filter.match(_ieGetMatrixExp);
    					s = (s && s.length === 4) ? [s[0].substr(4), Number(s[2].substr(4)), Number(s[1].substr(4)), s[3].substr(4), (tm.x || 0), (tm.y || 0)].join(",") : "";
    				}
    				isDefault = (!s || s === "none" || s === "matrix(1, 0, 0, 1, 0, 0)");
    				if (_transformProp && isDefault && !e.offsetParent && e !== _docElement) { //note: if offsetParent is null, that means the element isn't in the normal document flow, like if it has display:none or one of its ancestors has display:none). Firefox returns null for getComputedStyle() if the element is in an iframe that has display:none. https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    					//browsers don't report transforms accurately unless the element is in the DOM and has a display value that's not "none". Firefox and Microsoft browsers have a partial bug where they'll report transforms even if display:none BUT not any percentage-based values like translate(-50%, 8px) will be reported as if it's translate(0, 8px).
    					n = style.display;
    					style.display = "block";
    					parent = e.parentNode;
    					if (!parent || !e.offsetParent) {
    						dec = 1; //flag
    						nextSibling = e.nextSibling;
    						_docElement.appendChild(e); //we must add it to the DOM in order to get values properly
    					}
    					s = _getStyle(e, _transformPropCSS, null, true);
    					isDefault = (!s || s === "none" || s === "matrix(1, 0, 0, 1, 0, 0)");
    					if (n) {
    						style.display = n;
    					} else {
    						_removeProp(style, "display");
    					}
    					if (dec) {
    						if (nextSibling) {
    							parent.insertBefore(e, nextSibling);
    						} else if (parent) {
    							parent.appendChild(e);
    						} else {
    							_docElement.removeChild(e);
    						}
    					}
    				}
    				if (tm.svg || (e.getCTM && _isSVG(e))) {
    					if (isDefault && (style[_transformProp] + "").indexOf("matrix") !== -1) { //some browsers (like Chrome 40) don't correctly report transforms that are applied inline on an SVG element (they don't get included in the computed style), so we double-check here and accept matrix values
    						s = style[_transformProp];
    						isDefault = 0;
    					}
    					m = e.getAttribute("transform");
    					if (isDefault && m) {
    						m = e.transform.baseVal.consolidate().matrix; //ensures that even complex values like "translate(50,60) rotate(135,0,0)" are parsed because it mashes it into a matrix.
    						s = "matrix(" + m.a + "," + m.b + "," + m.c + "," + m.d + "," + m.e + "," + m.f + ")";
    						isDefault = 0;
    					}
    				}
    				if (isDefault) {
    					return _identity2DMatrix;
    				}
    				//split the matrix values out into an array (m for matrix)
    				m = (s || "").match(_numExp) || [];
    				i = m.length;
    				while (--i > -1) {
    					n = Number(m[i]);
    					m[i] = (dec = n - (n |= 0)) ? ((dec * rnd + (dec < 0 ? -0.5 : 0.5)) | 0) / rnd + n : n; //convert strings to Numbers and round to 5 decimal places to avoid issues with tiny numbers. Roughly 20x faster than Number.toFixed(). We also must make sure to round before dividing so that values like 0.9999999999 become 1 to avoid glitches in browser rendering and interpretation of flipped/rotated 3D matrices. And don't just multiply the number by rnd, floor it, and then divide by rnd because the bitwise operations max out at a 32-bit signed integer, thus it could get clipped at a relatively low value (like 22,000.00000 for example).
    				}
    				return (force2D && m.length > 6) ? [m[0], m[1], m[4], m[5], m[12], m[13]] : m;
    			},

    			/**
    			 * Parses the transform values for an element, returning an object with x, y, z, scaleX, scaleY, scaleZ, rotation, rotationX, rotationY, skewX, and skewY properties. Note: by default (for performance reasons), all skewing is combined into skewX and rotation but skewY still has a place in the transform object so that we can record how much of the skew is attributed to skewX vs skewY. Remember, a skewY of 10 looks the same as a rotation of 10 and skewX of -10.
    			 * @param {!Object} t target element
    			 * @param {Object=} cs computed style object (optional)
    			 * @param {boolean=} rec if true, the transform values will be recorded to the target element's _gsTransform object, like target._gsTransform = {x:0, y:0, z:0, scaleX:1...}
    			 * @param {boolean=} parse if true, we'll ignore any _gsTransform values that already exist on the element, and force a reparsing of the css (calculated style)
    			 * @return {object} object containing all of the transform properties/values like {x:0, y:0, z:0, scaleX:1...}
    			 */
    			_getTransform = _internals.getTransform = function(t, cs, rec, parse) {
    				if (t._gsTransform && rec && !parse) {
    					return t._gsTransform; //if the element already has a _gsTransform, use that. Note: some browsers don't accurately return the calculated style for the transform (particularly for SVG), so it's almost always safest to just use the values we've already applied rather than re-parsing things.
    				}
    				var tm = rec ? t._gsTransform || new Transform() : new Transform(),
    					invX = (tm.scaleX < 0), //in order to interpret things properly, we need to know if the user applied a negative scaleX previously so that we can adjust the rotation and skewX accordingly. Otherwise, if we always interpret a flipped matrix as affecting scaleY and the user only wants to tween the scaleX on multiple sequential tweens, it would keep the negative scaleY without that being the user's intent.
    					min = 0.00002,
    					rnd = 100000,
    					zOrigin = _supports3D ? parseFloat(_getStyle(t, _transformOriginProp, cs, false, "0 0 0").split(" ")[2]) || tm.zOrigin  || 0 : 0,
    					defaultTransformPerspective = parseFloat(CSSPlugin.defaultTransformPerspective) || 0,
    					m, i, scaleX, scaleY, rotation, skewX;

    				tm.svg = !!(t.getCTM && _isSVG(t));
    				if (tm.svg) {
    					_parseSVGOrigin(t, _getStyle(t, _transformOriginProp, cs, false, "50% 50%") + "", tm, t.getAttribute("data-svg-origin"));
    					_useSVGTransformAttr = CSSPlugin.useSVGTransformAttr || _forceSVGTransformAttr;
    				}
    				m = _getMatrix(t);
    				if (m !== _identity2DMatrix) {

    					if (m.length === 16) {
    						//we'll only look at these position-related 6 variables first because if x/y/z all match, it's relatively safe to assume we don't need to re-parse everything which risks losing important rotational information (like rotationX:180 plus rotationY:180 would look the same as rotation:180 - there's no way to know for sure which direction was taken based solely on the matrix3d() values)
    						var a11 = m[0], a21 = m[1], a31 = m[2], a41 = m[3],
    							a12 = m[4], a22 = m[5], a32 = m[6], a42 = m[7],
    							a13 = m[8], a23 = m[9], a33 = m[10],
    							a14 = m[12], a24 = m[13], a34 = m[14],
    							a43 = m[11],
    							angle = Math.atan2(a32, a33),
    							t1, t2, t3, cos, sin;
    						//we manually compensate for non-zero z component of transformOrigin to work around bugs in Safari
    						if (tm.zOrigin) {
    							a34 = -tm.zOrigin;
    							a14 = a13*a34-m[12];
    							a24 = a23*a34-m[13];
    							a34 = a33*a34+tm.zOrigin-m[14];
    						}
    						//note for possible future consolidation: rotationX: Math.atan2(a32, a33), rotationY: Math.atan2(-a31, Math.sqrt(a33 * a33 + a32 * a32)), rotation: Math.atan2(a21, a11), skew: Math.atan2(a12, a22). However, it doesn't seem to be quite as reliable as the full-on backwards rotation procedure.
    						tm.rotationX = angle * _RAD2DEG;
    						//rotationX
    						if (angle) {
    							cos = Math.cos(-angle);
    							sin = Math.sin(-angle);
    							t1 = a12*cos+a13*sin;
    							t2 = a22*cos+a23*sin;
    							t3 = a32*cos+a33*sin;
    							a13 = a12*-sin+a13*cos;
    							a23 = a22*-sin+a23*cos;
    							a33 = a32*-sin+a33*cos;
    							a43 = a42*-sin+a43*cos;
    							a12 = t1;
    							a22 = t2;
    							a32 = t3;
    						}
    						//rotationY
    						angle = Math.atan2(-a31, a33);
    						tm.rotationY = angle * _RAD2DEG;
    						if (angle) {
    							cos = Math.cos(-angle);
    							sin = Math.sin(-angle);
    							t1 = a11*cos-a13*sin;
    							t2 = a21*cos-a23*sin;
    							t3 = a31*cos-a33*sin;
    							a23 = a21*sin+a23*cos;
    							a33 = a31*sin+a33*cos;
    							a43 = a41*sin+a43*cos;
    							a11 = t1;
    							a21 = t2;
    							a31 = t3;
    						}
    						//rotationZ
    						angle = Math.atan2(a21, a11);
    						tm.rotation = angle * _RAD2DEG;
    						if (angle) {
    							cos = Math.cos(angle);
    							sin = Math.sin(angle);
    							t1 = a11*cos+a21*sin;
    							t2 = a12*cos+a22*sin;
    							t3 = a13*cos+a23*sin;
    							a21 = a21*cos-a11*sin;
    							a22 = a22*cos-a12*sin;
    							a23 = a23*cos-a13*sin;
    							a11 = t1;
    							a12 = t2;
    							a13 = t3;
    						}

    						if (tm.rotationX && Math.abs(tm.rotationX) + Math.abs(tm.rotation) > 359.9) { //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
    							tm.rotationX = tm.rotation = 0;
    							tm.rotationY = 180 - tm.rotationY;
    						}

    						//skewX
    						angle = Math.atan2(a12, a22);

    						//scales
    						tm.scaleX = ((Math.sqrt(a11 * a11 + a21 * a21 + a31 * a31) * rnd + 0.5) | 0) / rnd;
    						tm.scaleY = ((Math.sqrt(a22 * a22 + a32 * a32) * rnd + 0.5) | 0) / rnd;
    						tm.scaleZ = ((Math.sqrt(a13 * a13 + a23 * a23 + a33 * a33) * rnd + 0.5) | 0) / rnd;
    						a11 /= tm.scaleX;
    						a12 /= tm.scaleY;
    						a21 /= tm.scaleX;
    						a22 /= tm.scaleY;
    						if (Math.abs(angle) > min) {
    							tm.skewX = angle * _RAD2DEG;
    							a12 = 0; //unskews
    							if (tm.skewType !== "simple") {
    								tm.scaleY *= 1 / Math.cos(angle); //by default, we compensate the scale based on the skew so that the element maintains a similar proportion when skewed, so we have to alter the scaleY here accordingly to match the default (non-adjusted) skewing that CSS does (stretching more and more as it skews).
    							}

    						} else {
    							tm.skewX = 0;
    						}

    						/* //for testing purposes
    						var transform = "matrix3d(",
    							comma = ",",
    							zero = "0";
    						a13 /= tm.scaleZ;
    						a23 /= tm.scaleZ;
    						a31 /= tm.scaleX;
    						a32 /= tm.scaleY;
    						a33 /= tm.scaleZ;
    						transform += ((a11 < min && a11 > -min) ? zero : a11) + comma + ((a21 < min && a21 > -min) ? zero : a21) + comma + ((a31 < min && a31 > -min) ? zero : a31);
    						transform += comma + ((a41 < min && a41 > -min) ? zero : a41) + comma + ((a12 < min && a12 > -min) ? zero : a12) + comma + ((a22 < min && a22 > -min) ? zero : a22);
    						transform += comma + ((a32 < min && a32 > -min) ? zero : a32) + comma + ((a42 < min && a42 > -min) ? zero : a42) + comma + ((a13 < min && a13 > -min) ? zero : a13);
    						transform += comma + ((a23 < min && a23 > -min) ? zero : a23) + comma + ((a33 < min && a33 > -min) ? zero : a33) + comma + ((a43 < min && a43 > -min) ? zero : a43) + comma;
    						transform += a14 + comma + a24 + comma + a34 + comma + (tm.perspective ? (1 + (-a34 / tm.perspective)) : 1) + ")";
    						console.log(transform);
    						document.querySelector(".test").style[_transformProp] = transform;
    						*/

    						tm.perspective = a43 ? 1 / ((a43 < 0) ? -a43 : a43) : 0;
    						tm.x = a14;
    						tm.y = a24;
    						tm.z = a34;
    						if (tm.svg) {
    							tm.x -= tm.xOrigin - (tm.xOrigin * a11 - tm.yOrigin * a12);
    							tm.y -= tm.yOrigin - (tm.yOrigin * a21 - tm.xOrigin * a22);
    						}

    					} else if ((!_supports3D || parse || !m.length || tm.x !== m[4] || tm.y !== m[5] || (!tm.rotationX && !tm.rotationY))) { //sometimes a 6-element matrix is returned even when we performed 3D transforms, like if rotationX and rotationY are 180. In cases like this, we still need to honor the 3D transforms. If we just rely on the 2D info, it could affect how the data is interpreted, like scaleY might get set to -1 or rotation could get offset by 180 degrees. For example, do a TweenLite.to(element, 1, {css:{rotationX:180, rotationY:180}}) and then later, TweenLite.to(element, 1, {css:{rotationX:0}}) and without this conditional logic in place, it'd jump to a state of being unrotated when the 2nd tween starts. Then again, we need to honor the fact that the user COULD alter the transforms outside of CSSPlugin, like by manually applying new css, so we try to sense that by looking at x and y because if those changed, we know the changes were made outside CSSPlugin and we force a reinterpretation of the matrix values. Also, in Webkit browsers, if the element's "display" is "none", its calculated style value will always return empty, so if we've already recorded the values in the _gsTransform object, we'll just rely on those.
    						var k = (m.length >= 6),
    							a = k ? m[0] : 1,
    							b = m[1] || 0,
    							c = m[2] || 0,
    							d = k ? m[3] : 1;
    						tm.x = m[4] || 0;
    						tm.y = m[5] || 0;
    						scaleX = Math.sqrt(a * a + b * b);
    						scaleY = Math.sqrt(d * d + c * c);
    						rotation = (a || b) ? Math.atan2(b, a) * _RAD2DEG : tm.rotation || 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).
    						skewX = (c || d) ? Math.atan2(c, d) * _RAD2DEG + rotation : tm.skewX || 0;
    						tm.scaleX = scaleX;
    						tm.scaleY = scaleY;
    						tm.rotation = rotation;
    						tm.skewX = skewX;
    						if (_supports3D) {
    							tm.rotationX = tm.rotationY = tm.z = 0;
    							tm.perspective = defaultTransformPerspective;
    							tm.scaleZ = 1;
    						}
    						if (tm.svg) {
    							tm.x -= tm.xOrigin - (tm.xOrigin * a + tm.yOrigin * c);
    							tm.y -= tm.yOrigin - (tm.xOrigin * b + tm.yOrigin * d);
    						}
    					}
    					if (Math.abs(tm.skewX) > 90 && Math.abs(tm.skewX) < 270) {
    						if (invX) {
    							tm.scaleX *= -1;
    							tm.skewX += (tm.rotation <= 0) ? 180 : -180;
    							tm.rotation += (tm.rotation <= 0) ? 180 : -180;
    						} else {
    							tm.scaleY *= -1;
    							tm.skewX += (tm.skewX <= 0) ? 180 : -180;
    						}
    					}
    					tm.zOrigin = zOrigin;
    					//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 0 in these cases. The conditional logic here is faster than calling Math.abs(). Also, browsers tend to render a SLIGHTLY rotated object in a fuzzy way, so we need to snap to exactly 0 when appropriate.
    					for (i in tm) {
    						if (tm[i] < min) { if (tm[i] > -min) {
    							tm[i] = 0;
    						} }
    					}
    				}
    				//DEBUG: _log("parsed rotation of " + t.getAttribute("id")+": "+(tm.rotationX)+", "+(tm.rotationY)+", "+(tm.rotation)+", scale: "+tm.scaleX+", "+tm.scaleY+", "+tm.scaleZ+", position: "+tm.x+", "+tm.y+", "+tm.z+", perspective: "+tm.perspective+ ", origin: "+ tm.xOrigin+ ","+ tm.yOrigin);
    				if (rec) {
    					t._gsTransform = tm; //record to the object's _gsTransform which we use so that tweens can control individual properties independently (we need all the properties to accurately recompose the matrix in the setRatio() method)
    					if (tm.svg) { //if we're supposed to apply transforms to the SVG element's "transform" attribute, make sure there aren't any CSS transforms applied or they'll override the attribute ones. Also clear the transform attribute if we're using CSS, just to be clean.
    						if (_useSVGTransformAttr && t.style[_transformProp]) {
    							TweenLite.delayedCall(0.001, function(){ //if we apply this right away (before anything has rendered), we risk there being no transforms for a brief moment and it also interferes with adjusting the transformOrigin in a tween with immediateRender:true (it'd try reading the matrix and it wouldn't have the appropriate data in place because we just removed it).
    								_removeProp(t.style, _transformProp);
    							});
    						} else if (!_useSVGTransformAttr && t.getAttribute("transform")) {
    							TweenLite.delayedCall(0.001, function(){
    								t.removeAttribute("transform");
    							});
    						}
    					}
    				}
    				return tm;
    			},

    			//for setting 2D transforms in IE6, IE7, and IE8 (must use a "filter" to emulate the behavior of modern day browser transforms)
    			_setIETransformRatio = function(v) {
    				var t = this.data, //refers to the element's _gsTransform object
    					ang = -t.rotation * _DEG2RAD,
    					skew = ang + t.skewX * _DEG2RAD,
    					rnd = 100000,
    					a = ((Math.cos(ang) * t.scaleX * rnd) | 0) / rnd,
    					b = ((Math.sin(ang) * t.scaleX * rnd) | 0) / rnd,
    					c = ((Math.sin(skew) * -t.scaleY * rnd) | 0) / rnd,
    					d = ((Math.cos(skew) * t.scaleY * rnd) | 0) / rnd,
    					style = this.t.style,
    					cs = this.t.currentStyle,
    					filters, val;
    				if (!cs) {
    					return;
    				}
    				val = b; //just for swapping the variables an inverting them (reused "val" to avoid creating another variable in memory). IE's filter matrix uses a non-standard matrix configuration (angle goes the opposite way, and b and c are reversed and inverted)
    				b = -c;
    				c = -val;
    				filters = cs.filter;
    				style.filter = ""; //remove filters so that we can accurately measure offsetWidth/offsetHeight
    				var w = this.t.offsetWidth,
    					h = this.t.offsetHeight,
    					clip = (cs.position !== "absolute"),
    					m = "progid:DXImageTransform.Microsoft.Matrix(M11=" + a + ", M12=" + b + ", M21=" + c + ", M22=" + d,
    					ox = t.x + (w * t.xPercent / 100),
    					oy = t.y + (h * t.yPercent / 100),
    					dx, dy;

    				//if transformOrigin is being used, adjust the offset x and y
    				if (t.ox != null) {
    					dx = ((t.oxp) ? w * t.ox * 0.01 : t.ox) - w / 2;
    					dy = ((t.oyp) ? h * t.oy * 0.01 : t.oy) - h / 2;
    					ox += dx - (dx * a + dy * b);
    					oy += dy - (dx * c + dy * d);
    				}

    				if (!clip) {
    					m += ", sizingMethod='auto expand')";
    				} else {
    					dx = (w / 2);
    					dy = (h / 2);
    					//translate to ensure that transformations occur around the correct origin (default is center).
    					m += ", Dx=" + (dx - (dx * a + dy * b) + ox) + ", Dy=" + (dy - (dx * c + dy * d) + oy) + ")";
    				}
    				if (filters.indexOf("DXImageTransform.Microsoft.Matrix(") !== -1) {
    					style.filter = filters.replace(_ieSetMatrixExp, m);
    				} else {
    					style.filter = m + " " + filters; //we must always put the transform/matrix FIRST (before alpha(opacity=xx)) to avoid an IE bug that slices part of the object when rotation is applied with alpha.
    				}

    				//at the end or beginning of the tween, if the matrix is normal (1, 0, 0, 1) and opacity is 100 (or doesn't exist), remove the filter to improve browser performance.
    				if (v === 0 || v === 1) { if (a === 1) { if (b === 0) { if (c === 0) { if (d === 1) { if (!clip || m.indexOf("Dx=0, Dy=0") !== -1) { if (!_opacityExp.test(filters) || parseFloat(RegExp.$1) === 100) { if (filters.indexOf( filters.indexOf("Alpha")) === -1) {
    					style.removeAttribute("filter");
    				} } } } } } } }

    				//we must set the margins AFTER applying the filter in order to avoid some bugs in IE8 that could (in rare scenarios) cause them to be ignored intermittently (vibration).
    				if (!clip) {
    					var mult = (_ieVers < 8) ? 1 : -1, //in Internet Explorer 7 and before, the box model is broken, causing the browser to treat the width/height of the actual rotated filtered image as the width/height of the box itself, but Microsoft corrected that in IE8. We must use a negative offset in IE8 on the right/bottom
    						marg, prop, dif;
    					dx = t.ieOffsetX || 0;
    					dy = t.ieOffsetY || 0;
    					t.ieOffsetX = Math.round((w - ((a < 0 ? -a : a) * w + (b < 0 ? -b : b) * h)) / 2 + ox);
    					t.ieOffsetY = Math.round((h - ((d < 0 ? -d : d) * h + (c < 0 ? -c : c) * w)) / 2 + oy);
    					for (i = 0; i < 4; i++) {
    						prop = _margins[i];
    						marg = cs[prop];
    						//we need to get the current margin in case it is being tweened separately (we want to respect that tween's changes)
    						val = (marg.indexOf("px") !== -1) ? parseFloat(marg) : _convertToPixels(this.t, prop, parseFloat(marg), marg.replace(_suffixExp, "")) || 0;
    						if (val !== t[prop]) {
    							dif = (i < 2) ? -t.ieOffsetX : -t.ieOffsetY; //if another tween is controlling a margin, we cannot only apply the difference in the ieOffsets, so we essentially zero-out the dx and dy here in that case. We record the margin(s) later so that we can keep comparing them, making this code very flexible.
    						} else {
    							dif = (i < 2) ? dx - t.ieOffsetX : dy - t.ieOffsetY;
    						}
    						style[prop] = (t[prop] = Math.round( val - dif * ((i === 0 || i === 2) ? 1 : mult) )) + "px";
    					}
    				}
    			},

    			/* translates a super small decimal to a string WITHOUT scientific notation
    			_safeDecimal = function(n) {
    				var s = (n < 0 ? -n : n) + "",
    					a = s.split("e-");
    				return (n < 0 ? "-0." : "0.") + new Array(parseInt(a[1], 10) || 0).join("0") + a[0].split(".").join("");
    			},
    			*/

    			_setTransformRatio = _internals.set3DTransformRatio = _internals.setTransformRatio = function(v) {
    				var t = this.data, //refers to the element's _gsTransform object
    					style = this.t.style,
    					angle = t.rotation,
    					rotationX = t.rotationX,
    					rotationY = t.rotationY,
    					sx = t.scaleX,
    					sy = t.scaleY,
    					sz = t.scaleZ,
    					x = t.x,
    					y = t.y,
    					z = t.z,
    					isSVG = t.svg,
    					perspective = t.perspective,
    					force3D = t.force3D,
    					skewY = t.skewY,
    					skewX = t.skewX,
    					t1,	a11, a12, a13, a21, a22, a23, a31, a32, a33, a41, a42, a43,
    					zOrigin, min, cos, sin, t2, transform, comma, zero, skew, rnd;
    				if (skewY) { //for performance reasons, we combine all skewing into the skewX and rotation values. Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of 10 degrees.
    					skewX += skewY;
    					angle += skewY;
    				}

    				//check to see if we should render as 2D (and SVGs must use 2D when _useSVGTransformAttr is true)
    				if (((((v === 1 || v === 0) && force3D === "auto" && (this.tween._totalTime === this.tween._totalDuration || !this.tween._totalTime)) || !force3D) && !z && !perspective && !rotationY && !rotationX && sz === 1) || (_useSVGTransformAttr && isSVG) || !_supports3D) { //on the final render (which could be 0 for a from tween), if there are no 3D aspects, render in 2D to free up memory and improve performance especially on mobile devices. Check the tween's totalTime/totalDuration too in order to make sure it doesn't happen between repeats if it's a repeating tween.

    					//2D
    					if (angle || skewX || isSVG) {
    						angle *= _DEG2RAD;
    						skew = skewX * _DEG2RAD;
    						rnd = 100000;
    						a11 = Math.cos(angle) * sx;
    						a21 = Math.sin(angle) * sx;
    						a12 = Math.sin(angle - skew) * -sy;
    						a22 = Math.cos(angle - skew) * sy;
    						if (skew && t.skewType === "simple") { //by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
    							t1 = Math.tan(skew - skewY * _DEG2RAD);
    							t1 = Math.sqrt(1 + t1 * t1);
    							a12 *= t1;
    							a22 *= t1;
    							if (skewY) {
    								t1 = Math.tan(skewY * _DEG2RAD);
    								t1 = Math.sqrt(1 + t1 * t1);
    								a11 *= t1;
    								a21 *= t1;
    							}
    						}
    						if (isSVG) {
    							x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
    							y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
    							if (_useSVGTransformAttr && (t.xPercent || t.yPercent)) { //The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the matrix to simulate it.
    								min = this.t.getBBox();
    								x += t.xPercent * 0.01 * min.width;
    								y += t.yPercent * 0.01 * min.height;
    							}
    							min = 0.000001;
    							if (x < min) { if (x > -min) {
    								x = 0;
    							} }
    							if (y < min) { if (y > -min) {
    								y = 0;
    							} }
    						}
    						transform = (((a11 * rnd) | 0) / rnd) + "," + (((a21 * rnd) | 0) / rnd) + "," + (((a12 * rnd) | 0) / rnd) + "," + (((a22 * rnd) | 0) / rnd) + "," + x + "," + y + ")";
    						if (isSVG && _useSVGTransformAttr) {
    							this.t.setAttribute("transform", "matrix(" + transform);
    						} else {
    							//some browsers have a hard time with very small values like 2.4492935982947064e-16 (notice the "e-" towards the end) and would render the object slightly off. So we round to 5 decimal places.
    							style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + transform;
    						}
    					} else {
    						style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix(" : "matrix(") + sx + ",0,0," + sy + "," + x + "," + y + ")";
    					}
    					return;

    				}
    				if (_isFirefox) { //Firefox has a bug (at least in v25) that causes it to render the transparent part of 32-bit PNG images as black when displayed inside an iframe and the 3D scale is very small and doesn't change sufficiently enough between renders (like if you use a Power4.easeInOut to scale from 0 to 1 where the beginning values only change a tiny amount to begin the tween before accelerating). In this case, we force the scale to be 0.00002 instead which is visually the same but works around the Firefox issue.
    					min = 0.0001;
    					if (sx < min && sx > -min) {
    						sx = sz = 0.00002;
    					}
    					if (sy < min && sy > -min) {
    						sy = sz = 0.00002;
    					}
    					if (perspective && !t.z && !t.rotationX && !t.rotationY) { //Firefox has a bug that causes elements to have an odd super-thin, broken/dotted black border on elements that have a perspective set but aren't utilizing 3D space (no rotationX, rotationY, or z).
    						perspective = 0;
    					}
    				}
    				if (angle || skewX) {
    					angle *= _DEG2RAD;
    					cos = a11 = Math.cos(angle);
    					sin = a21 = Math.sin(angle);
    					if (skewX) {
    						angle -= skewX * _DEG2RAD;
    						cos = Math.cos(angle);
    						sin = Math.sin(angle);
    						if (t.skewType === "simple") { //by default, we compensate skewing on the other axis to make it look more natural, but you can set the skewType to "simple" to use the uncompensated skewing that CSS does
    							t1 = Math.tan((skewX - skewY) * _DEG2RAD);
    							t1 = Math.sqrt(1 + t1 * t1);
    							cos *= t1;
    							sin *= t1;
    							if (t.skewY) {
    								t1 = Math.tan(skewY * _DEG2RAD);
    								t1 = Math.sqrt(1 + t1 * t1);
    								a11 *= t1;
    								a21 *= t1;
    							}
    						}
    					}
    					a12 = -sin;
    					a22 = cos;

    				} else if (!rotationY && !rotationX && sz === 1 && !perspective && !isSVG) { //if we're only translating and/or 2D scaling, this is faster...
    					style[_transformProp] = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) translate3d(" : "translate3d(") + x + "px," + y + "px," + z +"px)" + ((sx !== 1 || sy !== 1) ? " scale(" + sx + "," + sy + ")" : "");
    					return;
    				} else {
    					a11 = a22 = 1;
    					a12 = a21 = 0;
    				}
    				// KEY  INDEX   AFFECTS a[row][column]
    				// a11  0       rotation, rotationY, scaleX
    				// a21  1       rotation, rotationY, scaleX
    				// a31  2       rotationY, scaleX
    				// a41  3       rotationY, scaleX
    				// a12  4       rotation, skewX, rotationX, scaleY
    				// a22  5       rotation, skewX, rotationX, scaleY
    				// a32  6       rotationX, scaleY
    				// a42  7       rotationX, scaleY
    				// a13  8       rotationY, rotationX, scaleZ
    				// a23  9       rotationY, rotationX, scaleZ
    				// a33  10      rotationY, rotationX, scaleZ
    				// a43  11      rotationY, rotationX, perspective, scaleZ
    				// a14  12      x, zOrigin, svgOrigin
    				// a24  13      y, zOrigin, svgOrigin
    				// a34  14      z, zOrigin
    				// a44  15
    				// rotation: Math.atan2(a21, a11)
    				// rotationY: Math.atan2(a13, a33) (or Math.atan2(a13, a11))
    				// rotationX: Math.atan2(a32, a33)
    				a33 = 1;
    				a13 = a23 = a31 = a32 = a41 = a42 = 0;
    				a43 = (perspective) ? -1 / perspective : 0;
    				zOrigin = t.zOrigin;
    				min = 0.000001; //threshold below which browsers use scientific notation which won't work.
    				comma = ",";
    				zero = "0";
    				angle = rotationY * _DEG2RAD;
    				if (angle) {
    					cos = Math.cos(angle);
    					sin = Math.sin(angle);
    					a31 = -sin;
    					a41 = a43*-sin;
    					a13 = a11*sin;
    					a23 = a21*sin;
    					a33 = cos;
    					a43 *= cos;
    					a11 *= cos;
    					a21 *= cos;
    				}
    				angle = rotationX * _DEG2RAD;
    				if (angle) {
    					cos = Math.cos(angle);
    					sin = Math.sin(angle);
    					t1 = a12*cos+a13*sin;
    					t2 = a22*cos+a23*sin;
    					a32 = a33*sin;
    					a42 = a43*sin;
    					a13 = a12*-sin+a13*cos;
    					a23 = a22*-sin+a23*cos;
    					a33 = a33*cos;
    					a43 = a43*cos;
    					a12 = t1;
    					a22 = t2;
    				}
    				if (sz !== 1) {
    					a13*=sz;
    					a23*=sz;
    					a33*=sz;
    					a43*=sz;
    				}
    				if (sy !== 1) {
    					a12*=sy;
    					a22*=sy;
    					a32*=sy;
    					a42*=sy;
    				}
    				if (sx !== 1) {
    					a11*=sx;
    					a21*=sx;
    					a31*=sx;
    					a41*=sx;
    				}

    				if (zOrigin || isSVG) {
    					if (zOrigin) {
    						x += a13*-zOrigin;
    						y += a23*-zOrigin;
    						z += a33*-zOrigin+zOrigin;
    					}
    					if (isSVG) { //due to bugs in some browsers, we need to manage the transform-origin of SVG manually
    						x += t.xOrigin - (t.xOrigin * a11 + t.yOrigin * a12) + t.xOffset;
    						y += t.yOrigin - (t.xOrigin * a21 + t.yOrigin * a22) + t.yOffset;
    					}
    					if (x < min && x > -min) {
    						x = zero;
    					}
    					if (y < min && y > -min) {
    						y = zero;
    					}
    					if (z < min && z > -min) {
    						z = 0; //don't use string because we calculate perspective later and need the number.
    					}
    				}

    				//optimized way of concatenating all the values into a string. If we do it all in one shot, it's slower because of the way browsers have to create temp strings and the way it affects memory. If we do it piece-by-piece with +=, it's a bit slower too. We found that doing it in these sized chunks works best overall:
    				transform = ((t.xPercent || t.yPercent) ? "translate(" + t.xPercent + "%," + t.yPercent + "%) matrix3d(" : "matrix3d(");
    				transform += ((a11 < min && a11 > -min) ? zero : a11) + comma + ((a21 < min && a21 > -min) ? zero : a21) + comma + ((a31 < min && a31 > -min) ? zero : a31);
    				transform += comma + ((a41 < min && a41 > -min) ? zero : a41) + comma + ((a12 < min && a12 > -min) ? zero : a12) + comma + ((a22 < min && a22 > -min) ? zero : a22);
    				if (rotationX || rotationY || sz !== 1) { //performance optimization (often there's no rotationX or rotationY, so we can skip these calculations)
    					transform += comma + ((a32 < min && a32 > -min) ? zero : a32) + comma + ((a42 < min && a42 > -min) ? zero : a42) + comma + ((a13 < min && a13 > -min) ? zero : a13);
    					transform += comma + ((a23 < min && a23 > -min) ? zero : a23) + comma + ((a33 < min && a33 > -min) ? zero : a33) + comma + ((a43 < min && a43 > -min) ? zero : a43) + comma;
    				} else {
    					transform += ",0,0,0,0,1,0,";
    				}
    				transform += x + comma + y + comma + z + comma + (perspective ? (1 + (-z / perspective)) : 1) + ")";

    				style[_transformProp] = transform;
    			};

    		p = Transform.prototype;
    		p.x = p.y = p.z = p.skewX = p.skewY = p.rotation = p.rotationX = p.rotationY = p.zOrigin = p.xPercent = p.yPercent = p.xOffset = p.yOffset = 0;
    		p.scaleX = p.scaleY = p.scaleZ = 1;

    		_registerComplexSpecialProp("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,svgOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType,xPercent,yPercent,smoothOrigin", {parser:function(t, e, parsingProp, cssp, pt, plugin, vars) {
    			if (cssp._lastParsedTransform === vars) { return pt; } //only need to parse the transform once, and only if the browser supports it.
    			cssp._lastParsedTransform = vars;
    			var scaleFunc = (vars.scale && typeof(vars.scale) === "function") ? vars.scale : 0; //if there's a function-based "scale" value, swap in the resulting numeric value temporarily. Otherwise, if it's called for both scaleX and scaleY independently, they may not match (like if the function uses Math.random()).
    			if (scaleFunc) {
    				vars.scale = scaleFunc(_index, t);
    			}
    			var originalGSTransform = t._gsTransform,
    				style = t.style,
    				min = 0.000001,
    				i = _transformProps.length,
    				v = vars,
    				endRotations = {},
    				transformOriginString = "transformOrigin",
    				m1 = _getTransform(t, _cs, true, v.parseTransform),
    				orig = v.transform && ((typeof(v.transform) === "function") ? v.transform(_index, _target) : v.transform),
    				m2, copy, has3D, hasChange, dr, x, y, matrix, p;
    			m1.skewType = v.skewType || m1.skewType || CSSPlugin.defaultSkewType;
    			cssp._transform = m1;
    			if ("rotationZ" in v) {
    				v.rotation = v.rotationZ;
    			}
    			if (orig && typeof(orig) === "string" && _transformProp) { //for values like transform:"rotate(60deg) scale(0.5, 0.8)"
    				copy = _tempDiv.style; //don't use the original target because it might be SVG in which case some browsers don't report computed style correctly.
    				copy[_transformProp] = orig;
    				copy.display = "block"; //if display is "none", the browser often refuses to report the transform properties correctly.
    				copy.position = "absolute";
    				if (orig.indexOf("%") !== -1) { //%-based translations will fail unless we set the width/height to match the original target...
    					copy.width = _getStyle(t, "width");
    					copy.height = _getStyle(t, "height");
    				}
    				_doc.body.appendChild(_tempDiv);
    				m2 = _getTransform(_tempDiv, null, false);
    				if (m1.skewType === "simple") { //the default _getTransform() reports the skewX/scaleY as if skewType is "compensated", thus we need to adjust that here if skewType is "simple".
    					m2.scaleY *= Math.cos(m2.skewX * _DEG2RAD);
    				}
    				if (m1.svg) { //if it's an SVG element, x/y part of the matrix will be affected by whatever we use as the origin and the offsets, so compensate here...
    					x = m1.xOrigin;
    					y = m1.yOrigin;
    					m2.x -= m1.xOffset;
    					m2.y -= m1.yOffset;
    					if (v.transformOrigin || v.svgOrigin) { //if this tween is altering the origin, we must factor that in here. The actual work of recording the transformOrigin values and setting up the PropTween is done later (still inside this function) so we cannot leave the changes intact here - we only want to update the x/y accordingly.
    						orig = {};
    						_parseSVGOrigin(t, _parsePosition(v.transformOrigin), orig, v.svgOrigin, v.smoothOrigin, true);
    						x = orig.xOrigin;
    						y = orig.yOrigin;
    						m2.x -= orig.xOffset - m1.xOffset;
    						m2.y -= orig.yOffset - m1.yOffset;
    					}
    					if (x || y) {
    						matrix = _getMatrix(_tempDiv, true);
    						m2.x -= x - (x * matrix[0] + y * matrix[2]);
    						m2.y -= y - (x * matrix[1] + y * matrix[3]);
    					}
    				}
    				_doc.body.removeChild(_tempDiv);
    				if (!m2.perspective) {
    					m2.perspective = m1.perspective; //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
    				}
    				if (v.xPercent != null) {
    					m2.xPercent = _parseVal(v.xPercent, m1.xPercent);
    				}
    				if (v.yPercent != null) {
    					m2.yPercent = _parseVal(v.yPercent, m1.yPercent);
    				}
    			} else if (typeof(v) === "object") { //for values like scaleX, scaleY, rotation, x, y, skewX, and skewY or transform:{...} (object)
    				m2 = {scaleX:_parseVal((v.scaleX != null) ? v.scaleX : v.scale, m1.scaleX),
    					scaleY:_parseVal((v.scaleY != null) ? v.scaleY : v.scale, m1.scaleY),
    					scaleZ:_parseVal(v.scaleZ, m1.scaleZ),
    					x:_parseVal(v.x, m1.x),
    					y:_parseVal(v.y, m1.y),
    					z:_parseVal(v.z, m1.z),
    					xPercent:_parseVal(v.xPercent, m1.xPercent),
    					yPercent:_parseVal(v.yPercent, m1.yPercent),
    					perspective:_parseVal(v.transformPerspective, m1.perspective)};
    				dr = v.directionalRotation;
    				if (dr != null) {
    					if (typeof(dr) === "object") {
    						for (copy in dr) {
    							v[copy] = dr[copy];
    						}
    					} else {
    						v.rotation = dr;
    					}
    				}
    				if (typeof(v.x) === "string" && v.x.indexOf("%") !== -1) {
    					m2.x = 0;
    					m2.xPercent = _parseVal(v.x, m1.xPercent);
    				}
    				if (typeof(v.y) === "string" && v.y.indexOf("%") !== -1) {
    					m2.y = 0;
    					m2.yPercent = _parseVal(v.y, m1.yPercent);
    				}

    				m2.rotation = _parseAngle(("rotation" in v) ? v.rotation : ("shortRotation" in v) ? v.shortRotation + "_short" : m1.rotation, m1.rotation, "rotation", endRotations);
    				if (_supports3D) {
    					m2.rotationX = _parseAngle(("rotationX" in v) ? v.rotationX : ("shortRotationX" in v) ? v.shortRotationX + "_short" : m1.rotationX || 0, m1.rotationX, "rotationX", endRotations);
    					m2.rotationY = _parseAngle(("rotationY" in v) ? v.rotationY : ("shortRotationY" in v) ? v.shortRotationY + "_short" : m1.rotationY || 0, m1.rotationY, "rotationY", endRotations);
    				}
    				m2.skewX = _parseAngle(v.skewX, m1.skewX);
    				m2.skewY = _parseAngle(v.skewY, m1.skewY);
    			}
    			if (_supports3D && v.force3D != null) {
    				m1.force3D = v.force3D;
    				hasChange = true;
    			}

    			has3D = (m1.force3D || m1.z || m1.rotationX || m1.rotationY || m2.z || m2.rotationX || m2.rotationY || m2.perspective);
    			if (!has3D && v.scale != null) {
    				m2.scaleZ = 1; //no need to tween scaleZ.
    			}

    			while (--i > -1) {
    				p = _transformProps[i];
    				orig = m2[p] - m1[p];
    				if (orig > min || orig < -min || v[p] != null || _forcePT[p] != null) {
    					hasChange = true;
    					pt = new CSSPropTween(m1, p, m1[p], orig, pt);
    					if (p in endRotations) {
    						pt.e = endRotations[p]; //directional rotations typically have compensated values during the tween, but we need to make sure they end at exactly what the user requested
    					}
    					pt.xs0 = 0; //ensures the value stays numeric in setRatio()
    					pt.plugin = plugin;
    					cssp._overwriteProps.push(pt.n);
    				}
    			}

    			orig = (typeof(v.transformOrigin) === "function") ? v.transformOrigin(_index, _target) : v.transformOrigin;
    			if (m1.svg && (orig || v.svgOrigin)) {
    				x = m1.xOffset; //when we change the origin, in order to prevent things from jumping we adjust the x/y so we must record those here so that we can create PropTweens for them and flip them at the same time as the origin
    				y = m1.yOffset;
    				_parseSVGOrigin(t, _parsePosition(orig), m2, v.svgOrigin, v.smoothOrigin);
    				pt = _addNonTweeningNumericPT(m1, "xOrigin", (originalGSTransform ? m1 : m2).xOrigin, m2.xOrigin, pt, transformOriginString); //note: if there wasn't a transformOrigin defined yet, just start with the destination one; it's wasteful otherwise, and it causes problems with fromTo() tweens. For example, TweenLite.to("#wheel", 3, {rotation:180, transformOrigin:"50% 50%", delay:1}); TweenLite.fromTo("#wheel", 3, {scale:0.5, transformOrigin:"50% 50%"}, {scale:1, delay:2}); would cause a jump when the from values revert at the beginning of the 2nd tween.
    				pt = _addNonTweeningNumericPT(m1, "yOrigin", (originalGSTransform ? m1 : m2).yOrigin, m2.yOrigin, pt, transformOriginString);
    				if (x !== m1.xOffset || y !== m1.yOffset) {
    					pt = _addNonTweeningNumericPT(m1, "xOffset", (originalGSTransform ? x : m1.xOffset), m1.xOffset, pt, transformOriginString);
    					pt = _addNonTweeningNumericPT(m1, "yOffset", (originalGSTransform ? y : m1.yOffset), m1.yOffset, pt, transformOriginString);
    				}
    				orig = "0px 0px"; //certain browsers (like firefox) completely botch transform-origin, so we must remove it to prevent it from contaminating transforms. We manage it ourselves with xOrigin and yOrigin
    			}
    			if (orig || (_supports3D && has3D && m1.zOrigin)) { //if anything 3D is happening and there's a transformOrigin with a z component that's non-zero, we must ensure that the transformOrigin's z-component is set to 0 so that we can manually do those calculations to get around Safari bugs. Even if the user didn't specifically define a "transformOrigin" in this particular tween (maybe they did it via css directly).
    				if (_transformProp) {
    					hasChange = true;
    					p = _transformOriginProp;
    					if (!orig) {
    						orig = (_getStyle(t, p, _cs, false, "50% 50%") + "").split(" ");
    						orig = orig[0] + " " + orig[1] + " " + m1.zOrigin + "px";
    					}
    					orig += "";
    					pt = new CSSPropTween(style, p, 0, 0, pt, -1, transformOriginString);
    					pt.b = style[p];
    					pt.plugin = plugin;
    					if (_supports3D) {
    						copy = m1.zOrigin;
    						orig = orig.split(" ");
    						m1.zOrigin = ((orig.length > 2) ? parseFloat(orig[2]) : copy) || 0; //Safari doesn't handle the z part of transformOrigin correctly, so we'll manually handle it in the _set3DTransformRatio() method.
    						pt.xs0 = pt.e = orig[0] + " " + (orig[1] || "50%") + " 0px"; //we must define a z value of 0px specifically otherwise iOS 5 Safari will stick with the old one (if one was defined)!
    						pt = new CSSPropTween(m1, "zOrigin", 0, 0, pt, -1, pt.n); //we must create a CSSPropTween for the _gsTransform.zOrigin so that it gets reset properly at the beginning if the tween runs backward (as opposed to just setting m1.zOrigin here)
    						pt.b = copy;
    						pt.xs0 = pt.e = m1.zOrigin;
    					} else {
    						pt.xs0 = pt.e = orig;
    					}

    					//for older versions of IE (6-8), we need to manually calculate things inside the setRatio() function. We record origin x and y (ox and oy) and whether or not the values are percentages (oxp and oyp).
    				} else {
    					_parsePosition(orig + "", m1);
    				}
    			}
    			if (hasChange) {
    				cssp._transformType = (!(m1.svg && _useSVGTransformAttr) && (has3D || this._transformType === 3)) ? 3 : 2; //quicker than calling cssp._enableTransforms();
    			}
    			if (scaleFunc) {
    				vars.scale = scaleFunc;
    			}
    			return pt;
    		}, allowFunc:true, prefix:true});

    		_registerComplexSpecialProp("boxShadow", {defaultValue:"0px 0px 0px 0px #999", prefix:true, color:true, multi:true, keyword:"inset"});
    		_registerComplexSpecialProp("clipPath", {defaultValue:"inset(0%)", prefix:true, multi:true, formatter:_getFormatter("inset(0% 0% 0% 0%)", false, true)});

    		_registerComplexSpecialProp("borderRadius", {defaultValue:"0px", parser:function(t, e, p, cssp, pt, plugin) {
    			e = this.format(e);
    			var props = ["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],
    				style = t.style,
    				ea1, i, es2, bs2, bs, es, bn, en, w, h, esfx, bsfx, rel, hn, vn, em;
    			w = parseFloat(t.offsetWidth);
    			h = parseFloat(t.offsetHeight);
    			ea1 = e.split(" ");
    			for (i = 0; i < props.length; i++) { //if we're dealing with percentages, we must convert things separately for the horizontal and vertical axis!
    				if (this.p.indexOf("border")) { //older browsers used a prefix
    					props[i] = _checkPropPrefix(props[i]);
    				}
    				bs = bs2 = _getStyle(t, props[i], _cs, false, "0px");
    				if (bs.indexOf(" ") !== -1) {
    					bs2 = bs.split(" ");
    					bs = bs2[0];
    					bs2 = bs2[1];
    				}
    				es = es2 = ea1[i];
    				bn = parseFloat(bs);
    				bsfx = bs.substr((bn + "").length);
    				rel = (es.charAt(1) === "=");
    				if (rel) {
    					en = parseInt(es.charAt(0)+"1", 10);
    					es = es.substr(2);
    					en *= parseFloat(es);
    					esfx = es.substr((en + "").length - (en < 0 ? 1 : 0)) || "";
    				} else {
    					en = parseFloat(es);
    					esfx = es.substr((en + "").length);
    				}
    				if (esfx === "") {
    					esfx = _suffixMap[p] || bsfx;
    				}
    				if (esfx !== bsfx) {
    					hn = _convertToPixels(t, "borderLeft", bn, bsfx); //horizontal number (we use a bogus "borderLeft" property just because the _convertToPixels() method searches for the keywords "Left", "Right", "Top", and "Bottom" to determine of it's a horizontal or vertical property, and we need "border" in the name so that it knows it should measure relative to the element itself, not its parent.
    					vn = _convertToPixels(t, "borderTop", bn, bsfx); //vertical number
    					if (esfx === "%") {
    						bs = (hn / w * 100) + "%";
    						bs2 = (vn / h * 100) + "%";
    					} else if (esfx === "em") {
    						em = _convertToPixels(t, "borderLeft", 1, "em");
    						bs = (hn / em) + "em";
    						bs2 = (vn / em) + "em";
    					} else {
    						bs = hn + "px";
    						bs2 = vn + "px";
    					}
    					if (rel) {
    						es = (parseFloat(bs) + en) + esfx;
    						es2 = (parseFloat(bs2) + en) + esfx;
    					}
    				}
    				pt = _parseComplex(style, props[i], bs + " " + bs2, es + " " + es2, false, "0px", pt);
    			}
    			return pt;
    		}, prefix:true, formatter:_getFormatter("0px 0px 0px 0px", false, true)});
    		_registerComplexSpecialProp("borderBottomLeftRadius,borderBottomRightRadius,borderTopLeftRadius,borderTopRightRadius", {defaultValue:"0px", parser:function(t, e, p, cssp, pt, plugin) {
    			return _parseComplex(t.style, p, this.format(_getStyle(t, p, _cs, false, "0px 0px")), this.format(e), false, "0px", pt);
    		}, prefix:true, formatter:_getFormatter("0px 0px", false, true)});
    		_registerComplexSpecialProp("backgroundPosition", {defaultValue:"0 0", parser:function(t, e, p, cssp, pt, plugin) {
    			var bp = "background-position",
    				cs = (_cs || _getComputedStyle(t)),
    				bs = this.format( ((cs) ? _ieVers ? cs.getPropertyValue(bp + "-x") + " " + cs.getPropertyValue(bp + "-y") : cs.getPropertyValue(bp) : t.currentStyle.backgroundPositionX + " " + t.currentStyle.backgroundPositionY) || "0 0"), //Internet Explorer doesn't report background-position correctly - we must query background-position-x and background-position-y and combine them (even in IE10). Before IE9, we must do the same with the currentStyle object and use camelCase
    				es = this.format(e),
    				ba, ea, i, pct, overlap, src;
    			if ((bs.indexOf("%") !== -1) !== (es.indexOf("%") !== -1) && es.split(",").length < 2) {
    				src = _getStyle(t, "backgroundImage").replace(_urlExp, "");
    				if (src && src !== "none") {
    					ba = bs.split(" ");
    					ea = es.split(" ");
    					_tempImg.setAttribute("src", src); //set the temp IMG's src to the background-image so that we can measure its width/height
    					i = 2;
    					while (--i > -1) {
    						bs = ba[i];
    						pct = (bs.indexOf("%") !== -1);
    						if (pct !== (ea[i].indexOf("%") !== -1)) {
    							overlap = (i === 0) ? t.offsetWidth - _tempImg.width : t.offsetHeight - _tempImg.height;
    							ba[i] = pct ? (parseFloat(bs) / 100 * overlap) + "px" : (parseFloat(bs) / overlap * 100) + "%";
    						}
    					}
    					bs = ba.join(" ");
    				}
    			}
    			return this.parseComplex(t.style, bs, es, pt, plugin);
    		}, formatter:_parsePosition});
    		_registerComplexSpecialProp("backgroundSize", {defaultValue:"0 0", formatter:function(v) {
    			v += ""; //ensure it's a string
    			return (v.substr(0,2) === "co") ? v : _parsePosition(v.indexOf(" ") === -1 ? v + " " + v : v); //if set to something like "100% 100%", Safari typically reports the computed style as just "100%" (no 2nd value), but we should ensure that there are two values, so copy the first one. Otherwise, it'd be interpreted as "100% 0" (wrong). Also remember that it could be "cover" or "contain" which we can't tween but should be able to set.
    		}});
    		_registerComplexSpecialProp("perspective", {defaultValue:"0px", prefix:true});
    		_registerComplexSpecialProp("perspectiveOrigin", {defaultValue:"50% 50%", prefix:true});
    		_registerComplexSpecialProp("transformStyle", {prefix:true});
    		_registerComplexSpecialProp("backfaceVisibility", {prefix:true});
    		_registerComplexSpecialProp("userSelect", {prefix:true});
    		_registerComplexSpecialProp("margin", {parser:_getEdgeParser("marginTop,marginRight,marginBottom,marginLeft")});
    		_registerComplexSpecialProp("padding", {parser:_getEdgeParser("paddingTop,paddingRight,paddingBottom,paddingLeft")});
    		_registerComplexSpecialProp("clip", {defaultValue:"rect(0px,0px,0px,0px)", parser:function(t, e, p, cssp, pt, plugin){
    			var b, cs, delim;
    			if (_ieVers < 9) { //IE8 and earlier don't report a "clip" value in the currentStyle - instead, the values are split apart into clipTop, clipRight, clipBottom, and clipLeft. Also, in IE7 and earlier, the values inside rect() are space-delimited, not comma-delimited.
    				cs = t.currentStyle;
    				delim = _ieVers < 8 ? " " : ",";
    				b = "rect(" + cs.clipTop + delim + cs.clipRight + delim + cs.clipBottom + delim + cs.clipLeft + ")";
    				e = this.format(e).split(",").join(delim);
    			} else {
    				b = this.format(_getStyle(t, this.p, _cs, false, this.dflt));
    				e = this.format(e);
    			}
    			return this.parseComplex(t.style, b, e, pt, plugin);
    		}});
    		_registerComplexSpecialProp("textShadow", {defaultValue:"0px 0px 0px #999", color:true, multi:true});
    		_registerComplexSpecialProp("autoRound,strictUnits", {parser:function(t, e, p, cssp, pt) {return pt;}}); //just so that we can ignore these properties (not tween them)
    		_registerComplexSpecialProp("border", {defaultValue:"0px solid #000", parser:function(t, e, p, cssp, pt, plugin) {
    			var bw = _getStyle(t, "borderTopWidth", _cs, false, "0px"),
    				end = this.format(e).split(" "),
    				esfx = end[0].replace(_suffixExp, "");
    			if (esfx !== "px") { //if we're animating to a non-px value, we need to convert the beginning width to that unit.
    				bw = (parseFloat(bw) / _convertToPixels(t, "borderTopWidth", 1, esfx)) + esfx;
    			}
    			return this.parseComplex(t.style, this.format(bw + " " + _getStyle(t, "borderTopStyle", _cs, false, "solid") + " " + _getStyle(t, "borderTopColor", _cs, false, "#000")), end.join(" "), pt, plugin);
    			}, color:true, formatter:function(v) {
    				var a = v.split(" ");
    				return a[0] + " " + (a[1] || "solid") + " " + (v.match(_colorExp) || ["#000"])[0];
    			}});
    		_registerComplexSpecialProp("borderWidth", {parser:_getEdgeParser("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}); //Firefox doesn't pick up on borderWidth set in style sheets (only inline).
    		_registerComplexSpecialProp("float,cssFloat,styleFloat", {parser:function(t, e, p, cssp, pt, plugin) {
    			var s = t.style,
    				prop = ("cssFloat" in s) ? "cssFloat" : "styleFloat";
    			return new CSSPropTween(s, prop, 0, 0, pt, -1, p, false, 0, s[prop], e);
    		}});

    		//opacity-related
    		var _setIEOpacityRatio = function(v) {
    				var t = this.t, //refers to the element's style property
    					filters = t.filter || _getStyle(this.data, "filter") || "",
    					val = (this.s + this.c * v) | 0,
    					skip;
    				if (val === 100) { //for older versions of IE that need to use a filter to apply opacity, we should remove the filter if opacity hits 1 in order to improve performance, but make sure there isn't a transform (matrix) or gradient in the filters.
    					if (filters.indexOf("atrix(") === -1 && filters.indexOf("radient(") === -1 && filters.indexOf("oader(") === -1) {
    						t.removeAttribute("filter");
    						skip = (!_getStyle(this.data, "filter")); //if a class is applied that has an alpha filter, it will take effect (we don't want that), so re-apply our alpha filter in that case. We must first remove it and then check.
    					} else {
    						t.filter = filters.replace(_alphaFilterExp, "");
    						skip = true;
    					}
    				}
    				if (!skip) {
    					if (this.xn1) {
    						t.filter = filters = filters || ("alpha(opacity=" + val + ")"); //works around bug in IE7/8 that prevents changes to "visibility" from being applied properly if the filter is changed to a different alpha on the same frame.
    					}
    					if (filters.indexOf("pacity") === -1) { //only used if browser doesn't support the standard opacity style property (IE 7 and 8). We omit the "O" to avoid case-sensitivity issues
    						if (val !== 0 || !this.xn1) { //bugs in IE7/8 won't render the filter properly if opacity is ADDED on the same frame/render as "visibility" changes (this.xn1 is 1 if this tween is an "autoAlpha" tween)
    							t.filter = filters + " alpha(opacity=" + val + ")"; //we round the value because otherwise, bugs in IE7/8 can prevent "visibility" changes from being applied properly.
    						}
    					} else {
    						t.filter = filters.replace(_opacityExp, "opacity=" + val);
    					}
    				}
    			};
    		_registerComplexSpecialProp("opacity,alpha,autoAlpha", {defaultValue:"1", parser:function(t, e, p, cssp, pt, plugin) {
    			var b = parseFloat(_getStyle(t, "opacity", _cs, false, "1")),
    				style = t.style,
    				isAutoAlpha = (p === "autoAlpha");
    			if (typeof(e) === "string" && e.charAt(1) === "=") {
    				e = ((e.charAt(0) === "-") ? -1 : 1) * parseFloat(e.substr(2)) + b;
    			}
    			if (isAutoAlpha && b === 1 && _getStyle(t, "visibility", _cs) === "hidden" && e !== 0) { //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
    				b = 0;
    			}
    			if (_supportsOpacity) {
    				pt = new CSSPropTween(style, "opacity", b, e - b, pt);
    			} else {
    				pt = new CSSPropTween(style, "opacity", b * 100, (e - b) * 100, pt);
    				pt.xn1 = isAutoAlpha ? 1 : 0; //we need to record whether or not this is an autoAlpha so that in the setRatio(), we know to duplicate the setting of the alpha in order to work around a bug in IE7 and IE8 that prevents changes to "visibility" from taking effect if the filter is changed to a different alpha(opacity) at the same time. Setting it to the SAME value first, then the new value works around the IE7/8 bug.
    				style.zoom = 1; //helps correct an IE issue.
    				pt.type = 2;
    				pt.b = "alpha(opacity=" + pt.s + ")";
    				pt.e = "alpha(opacity=" + (pt.s + pt.c) + ")";
    				pt.data = t;
    				pt.plugin = plugin;
    				pt.setRatio = _setIEOpacityRatio;
    			}
    			if (isAutoAlpha) { //we have to create the "visibility" PropTween after the opacity one in the linked list so that they run in the order that works properly in IE8 and earlier
    				pt = new CSSPropTween(style, "visibility", 0, 0, pt, -1, null, false, 0, ((b !== 0) ? "inherit" : "hidden"), ((e === 0) ? "hidden" : "inherit"));
    				pt.xs0 = "inherit";
    				cssp._overwriteProps.push(pt.n);
    				cssp._overwriteProps.push(p);
    			}
    			return pt;
    		}});


    		var _removeProp = function(s, p) {
    				if (p) {
    					if (s.removeProperty) {
    						if (p.substr(0,2) === "ms" || p.substr(0,6) === "webkit") { //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
    							p = "-" + p;
    						}
    						s.removeProperty(p.replace(_capsExp, "-$1").toLowerCase());
    					} else { //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
    						s.removeAttribute(p);
    					}
    				}
    			},
    			_setClassNameRatio = function(v) {
    				this.t._gsClassPT = this;
    				if (v === 1 || v === 0) {
    					this.t.setAttribute("class", (v === 0) ? this.b : this.e);
    					var mpt = this.data, //first MiniPropTween
    						s = this.t.style;
    					while (mpt) {
    						if (!mpt.v) {
    							_removeProp(s, mpt.p);
    						} else {
    							s[mpt.p] = mpt.v;
    						}
    						mpt = mpt._next;
    					}
    					if (v === 1 && this.t._gsClassPT === this) {
    						this.t._gsClassPT = null;
    					}
    				} else if (this.t.getAttribute("class") !== this.e) {
    					this.t.setAttribute("class", this.e);
    				}
    			};
    		_registerComplexSpecialProp("className", {parser:function(t, e, p, cssp, pt, plugin, vars) {
    			var b = t.getAttribute("class") || "", //don't use t.className because it doesn't work consistently on SVG elements; getAttribute("class") and setAttribute("class", value") is more reliable.
    				cssText = t.style.cssText,
    				difData, bs, cnpt, cnptLookup, mpt;
    			pt = cssp._classNamePT = new CSSPropTween(t, p, 0, 0, pt, 2);
    			pt.setRatio = _setClassNameRatio;
    			pt.pr = -11;
    			_hasPriority = true;
    			pt.b = b;
    			bs = _getAllStyles(t, _cs);
    			//if there's a className tween already operating on the target, force it to its end so that the necessary inline styles are removed and the class name is applied before we determine the end state (we don't want inline styles interfering that were there just for class-specific values)
    			cnpt = t._gsClassPT;
    			if (cnpt) {
    				cnptLookup = {};
    				mpt = cnpt.data; //first MiniPropTween which stores the inline styles - we need to force these so that the inline styles don't contaminate things. Otherwise, there's a small chance that a tween could start and the inline values match the destination values and they never get cleaned.
    				while (mpt) {
    					cnptLookup[mpt.p] = 1;
    					mpt = mpt._next;
    				}
    				cnpt.setRatio(1);
    			}
    			t._gsClassPT = pt;
    			pt.e = (e.charAt(1) !== "=") ? e : b.replace(new RegExp("(?:\\s|^)" + e.substr(2) + "(?![\\w-])"), "") + ((e.charAt(0) === "+") ? " " + e.substr(2) : "");
    			t.setAttribute("class", pt.e);
    			difData = _cssDif(t, bs, _getAllStyles(t), vars, cnptLookup);
    			t.setAttribute("class", b);
    			pt.data = difData.firstMPT;
    			if (t.style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://greensock.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
    				t.style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
    			}
    			pt = pt.xfirst = cssp.parse(t, difData.difs, pt, plugin); //we record the CSSPropTween as the xfirst so that we can handle overwriting propertly (if "className" gets overwritten, we must kill all the properties associated with the className part of the tween, so we can loop through from xfirst to the pt itself)
    			return pt;
    		}});


    		var _setClearPropsRatio = function(v) {
    			if (v === 1 || v === 0) { if (this.data._totalTime === this.data._totalDuration && this.data.data !== "isFromStart") { //this.data refers to the tween. Only clear at the END of the tween (remember, from() tweens make the ratio go from 1 to 0, so we can't just check that and if the tween is the zero-duration one that's created internally to render the starting values in a from() tween, ignore that because otherwise, for example, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in).
    				var s = this.t.style,
    					transformParse = _specialProps.transform.parse,
    					a, p, i, clearTransform, transform;
    				if (this.e === "all") {
    					s.cssText = "";
    					clearTransform = true;
    				} else {
    					a = this.e.split(" ").join("").split(",");
    					i = a.length;
    					while (--i > -1) {
    						p = a[i];
    						if (_specialProps[p]) {
    							if (_specialProps[p].parse === transformParse) {
    								clearTransform = true;
    							} else {
    								p = (p === "transformOrigin") ? _transformOriginProp : _specialProps[p].p; //ensures that special properties use the proper browser-specific property name, like "scaleX" might be "-webkit-transform" or "boxShadow" might be "-moz-box-shadow"
    							}
    						}
    						_removeProp(s, p);
    					}
    				}
    				if (clearTransform) {
    					_removeProp(s, _transformProp);
    					transform = this.t._gsTransform;
    					if (transform) {
    						if (transform.svg) {
    							this.t.removeAttribute("data-svg-origin");
    							this.t.removeAttribute("transform");
    						}
    						delete this.t._gsTransform;
    					}
    				}

    			} }
    		};
    		_registerComplexSpecialProp("clearProps", {parser:function(t, e, p, cssp, pt) {
    			pt = new CSSPropTween(t, p, 0, 0, pt, 2);
    			pt.setRatio = _setClearPropsRatio;
    			pt.e = e;
    			pt.pr = -10;
    			pt.data = cssp._tween;
    			_hasPriority = true;
    			return pt;
    		}});

    		p = "bezier,throwProps,physicsProps,physics2D".split(",");
    		i = p.length;
    		while (i--) {
    			_registerPluginProp(p[i]);
    		}








    		p = CSSPlugin.prototype;
    		p._firstPT = p._lastParsedTransform = p._transform = null;

    		//gets called when the tween renders for the first time. This kicks everything off, recording start/end values, etc.
    		p._onInitTween = function(target, vars, tween, index) {
    			if (!target.nodeType) { //css is only for dom elements
    				return false;
    			}
    			this._target = _target = target;
    			this._tween = tween;
    			this._vars = vars;
    			_index = index;
    			_autoRound = vars.autoRound;
    			_hasPriority = false;
    			_suffixMap = vars.suffixMap || CSSPlugin.suffixMap;
    			_cs = _getComputedStyle(target);
    			_overwriteProps = this._overwriteProps;
    			var style = target.style,
    				v, pt, pt2, first, last, next, zIndex, tpt, threeD;
    			if (_reqSafariFix) { if (style.zIndex === "") {
    				v = _getStyle(target, "zIndex", _cs);
    				if (v === "auto" || v === "") {
    					//corrects a bug in [non-Android] Safari that prevents it from repainting elements in their new positions if they don't have a zIndex set. We also can't just apply this inside _parseTransform() because anything that's moved in any way (like using "left" or "top" instead of transforms like "x" and "y") can be affected, so it is best to ensure that anything that's tweening has a z-index. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly. Plus zIndex is less memory-intensive.
    					this._addLazySet(style, "zIndex", 0);
    				}
    			} }

    			if (typeof(vars) === "string") {
    				first = style.cssText;
    				v = _getAllStyles(target, _cs);
    				style.cssText = first + ";" + vars;
    				v = _cssDif(target, v, _getAllStyles(target)).difs;
    				if (!_supportsOpacity && _opacityValExp.test(vars)) {
    					v.opacity = parseFloat( RegExp.$1 );
    				}
    				vars = v;
    				style.cssText = first;
    			}

    			if (vars.className) { //className tweens will combine any differences they find in the css with the vars that are passed in, so {className:"myClass", scale:0.5, left:20} would work.
    				this._firstPT = pt = _specialProps.className.parse(target, vars.className, "className", this, null, null, vars);
    			} else {
    				this._firstPT = pt = this.parse(target, vars, null);
    			}

    			if (this._transformType) {
    				threeD = (this._transformType === 3);
    				if (!_transformProp) {
    					style.zoom = 1; //helps correct an IE issue.
    				} else if (_isSafari) {
    					_reqSafariFix = true;
    					//if zIndex isn't set, iOS Safari doesn't repaint things correctly sometimes (seemingly at random).
    					if (style.zIndex === "") {
    						zIndex = _getStyle(target, "zIndex", _cs);
    						if (zIndex === "auto" || zIndex === "") {
    							this._addLazySet(style, "zIndex", 0);
    						}
    					}
    					//Setting WebkitBackfaceVisibility corrects 3 bugs:
    					// 1) [non-Android] Safari skips rendering changes to "top" and "left" that are made on the same frame/render as a transform update.
    					// 2) iOS Safari sometimes neglects to repaint elements in their new positions. Setting "WebkitPerspective" to a non-zero value worked too except that on iOS Safari things would flicker randomly.
    					// 3) Safari sometimes displayed odd artifacts when tweening the transform (or WebkitTransform) property, like ghosts of the edges of the element remained. Definitely a browser bug.
    					//Note: we allow the user to override the auto-setting by defining WebkitBackfaceVisibility in the vars of the tween.
    					if (_isSafariLT6) {
    						this._addLazySet(style, "WebkitBackfaceVisibility", this._vars.WebkitBackfaceVisibility || (threeD ? "visible" : "hidden"));
    					}
    				}
    				pt2 = pt;
    				while (pt2 && pt2._next) {
    					pt2 = pt2._next;
    				}
    				tpt = new CSSPropTween(target, "transform", 0, 0, null, 2);
    				this._linkCSSP(tpt, null, pt2);
    				tpt.setRatio = _transformProp ? _setTransformRatio : _setIETransformRatio;
    				tpt.data = this._transform || _getTransform(target, _cs, true);
    				tpt.tween = tween;
    				tpt.pr = -1; //ensures that the transforms get applied after the components are updated.
    				_overwriteProps.pop(); //we don't want to force the overwrite of all "transform" tweens of the target - we only care about individual transform properties like scaleX, rotation, etc. The CSSPropTween constructor automatically adds the property to _overwriteProps which is why we need to pop() here.
    			}

    			if (_hasPriority) {
    				//reorders the linked list in order of pr (priority)
    				while (pt) {
    					next = pt._next;
    					pt2 = first;
    					while (pt2 && pt2.pr > pt.pr) {
    						pt2 = pt2._next;
    					}
    					if ((pt._prev = pt2 ? pt2._prev : last)) {
    						pt._prev._next = pt;
    					} else {
    						first = pt;
    					}
    					if ((pt._next = pt2)) {
    						pt2._prev = pt;
    					} else {
    						last = pt;
    					}
    					pt = next;
    				}
    				this._firstPT = first;
    			}
    			return true;
    		};


    		p.parse = function(target, vars, pt, plugin) {
    			var style = target.style,
    				p, sp, bn, en, bs, es, bsfx, esfx, isStr, rel;
    			for (p in vars) {
    				es = vars[p]; //ending value string
    				sp = _specialProps[p]; //SpecialProp lookup.
    				if (typeof(es) === "function" && !(sp && sp.allowFunc)) {
    					es = es(_index, _target);
    				}
    				if (sp) {
    					pt = sp.parse(target, es, p, this, pt, plugin, vars);
    				} else if (p.substr(0,2) === "--") { //for tweening CSS variables (which always start with "--"). To maximize performance and simplicity, we bypass CSSPlugin altogether and just add a normal property tween to the tween instance itself.
    					this._tween._propLookup[p] = this._addTween.call(this._tween, target.style, "setProperty", _getComputedStyle(target).getPropertyValue(p) + "", es + "", p, false, p);
    					continue;
    				} else {
    					bs = _getStyle(target, p, _cs) + "";
    					isStr = (typeof(es) === "string");
    					if (p === "color" || p === "fill" || p === "stroke" || p.indexOf("Color") !== -1 || (isStr && _rgbhslExp.test(es))) { //Opera uses background: to define color sometimes in addition to backgroundColor:
    						if (!isStr) {
    							es = _parseColor(es);
    							es = ((es.length > 3) ? "rgba(" : "rgb(") + es.join(",") + ")";
    						}
    						pt = _parseComplex(style, p, bs, es, true, "transparent", pt, 0, plugin);

    					} else if (isStr && _complexExp.test(es)) {
    						pt = _parseComplex(style, p, bs, es, true, null, pt, 0, plugin);

    					} else {
    						bn = parseFloat(bs);
    						bsfx = (bn || bn === 0) ? bs.substr((bn + "").length) : ""; //remember, bs could be non-numeric like "normal" for fontWeight, so we should default to a blank suffix in that case.

    						if (bs === "" || bs === "auto") {
    							if (p === "width" || p === "height") {
    								bn = _getDimension(target, p, _cs);
    								bsfx = "px";
    							} else if (p === "left" || p === "top") {
    								bn = _calculateOffset(target, p, _cs);
    								bsfx = "px";
    							} else {
    								bn = (p !== "opacity") ? 0 : 1;
    								bsfx = "";
    							}
    						}

    						rel = (isStr && es.charAt(1) === "=");
    						if (rel) {
    							en = parseInt(es.charAt(0) + "1", 10);
    							es = es.substr(2);
    							en *= parseFloat(es);
    							esfx = es.replace(_suffixExp, "");
    						} else {
    							en = parseFloat(es);
    							esfx = isStr ? es.replace(_suffixExp, "") : "";
    						}

    						if (esfx === "") {
    							esfx = (p in _suffixMap) ? _suffixMap[p] : bsfx; //populate the end suffix, prioritizing the map, then if none is found, use the beginning suffix.
    						}

    						es = (en || en === 0) ? (rel ? en + bn : en) + esfx : vars[p]; //ensures that any += or -= prefixes are taken care of. Record the end value before normalizing the suffix because we always want to end the tween on exactly what they intended even if it doesn't match the beginning value's suffix.
    						//if the beginning/ending suffixes don't match, normalize them...
    						if (bsfx !== esfx) { if (esfx !== "" || p === "lineHeight") { if (en || en === 0) { if (bn) { //note: if the beginning value (bn) is 0, we don't need to convert units!
    							bn = _convertToPixels(target, p, bn, bsfx);
    							if (esfx === "%") {
    								bn /= _convertToPixels(target, p, 100, "%") / 100;
    								if (vars.strictUnits !== true) { //some browsers report only "px" values instead of allowing "%" with getComputedStyle(), so we assume that if we're tweening to a %, we should start there too unless strictUnits:true is defined. This approach is particularly useful for responsive designs that use from() tweens.
    									bs = bn + "%";
    								}

    							} else if (esfx === "em" || esfx === "rem" || esfx === "vw" || esfx === "vh") {
    								bn /= _convertToPixels(target, p, 1, esfx);

    							//otherwise convert to pixels.
    							} else if (esfx !== "px") {
    								en = _convertToPixels(target, p, en, esfx);
    								esfx = "px"; //we don't use bsfx after this, so we don't need to set it to px too.
    							}
    							if (rel) { if (en || en === 0) {
    								es = (en + bn) + esfx; //the changes we made affect relative calculations, so adjust the end value here.
    							} }
    						} } } }

    						if (rel) {
    							en += bn;
    						}

    						if ((bn || bn === 0) && (en || en === 0)) { //faster than isNaN(). Also, previously we required en !== bn but that doesn't really gain much performance and it prevents _parseToProxy() from working properly if beginning and ending values match but need to get tweened by an external plugin anyway. For example, a bezier tween where the target starts at left:0 and has these points: [{left:50},{left:0}] wouldn't work properly because when parsing the last point, it'd match the first (current) one and a non-tweening CSSPropTween would be recorded when we actually need a normal tween (type:0) so that things get updated during the tween properly.
    							pt = new CSSPropTween(style, p, bn, en - bn, pt, 0, p, (_autoRound !== false && (esfx === "px" || p === "zIndex")), 0, bs, es);
    							pt.xs0 = esfx;
    							//DEBUG: _log("tween "+p+" from "+pt.b+" ("+bn+esfx+") to "+pt.e+" with suffix: "+pt.xs0);
    						} else if (style[p] === undefined || !es && (es + "" === "NaN" || es == null)) {
    							_log("invalid " + p + " tween value: " + vars[p]);
    						} else {
    							pt = new CSSPropTween(style, p, en || bn || 0, 0, pt, -1, p, false, 0, bs, es);
    							pt.xs0 = (es === "none" && (p === "display" || p.indexOf("Style") !== -1)) ? bs : es; //intermediate value should typically be set immediately (end value) except for "display" or things like borderTopStyle, borderBottomStyle, etc. which should use the beginning value during the tween.
    							//DEBUG: _log("non-tweening value "+p+": "+pt.xs0);
    						}
    					}
    				}
    				if (plugin) { if (pt && !pt.plugin) {
    					pt.plugin = plugin;
    				} }
    			}
    			return pt;
    		};


    		//gets called every time the tween updates, passing the new ratio (typically a value between 0 and 1, but not always (for example, if an Elastic.easeOut is used, the value can jump above 1 mid-tween). It will always start and 0 and end at 1.
    		p.setRatio = function(v) {
    			var pt = this._firstPT,
    				min = 0.000001,
    				val, str, i;
    			//at the end of the tween, we set the values to exactly what we received in order to make sure non-tweening values (like "position" or "float" or whatever) are set and so that if the beginning/ending suffixes (units) didn't match and we normalized to px, the value that the user passed in is used here. We check to see if the tween is at its beginning in case it's a from() tween in which case the ratio will actually go from 1 to 0 over the course of the tween (backwards).
    			if (v === 1 && (this._tween._time === this._tween._duration || this._tween._time === 0)) {
    				while (pt) {
    					if (pt.type !== 2) {
    						if (pt.r && pt.type !== -1) {
    							val = pt.r(pt.s + pt.c);
    							if (!pt.type) {
    								pt.t[pt.p] = val + pt.xs0;
    							} else if (pt.type === 1) { //complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
    								i = pt.l;
    								str = pt.xs0 + val + pt.xs1;
    								for (i = 1; i < pt.l; i++) {
    									str += pt["xn"+i] + pt["xs"+(i+1)];
    								}
    								pt.t[pt.p] = str;
    							}
    						} else {
    							pt.t[pt.p] = pt.e;
    						}
    					} else {
    						pt.setRatio(v);
    					}
    					pt = pt._next;
    				}

    			} else if (v || !(this._tween._time === this._tween._duration || this._tween._time === 0) || this._tween._rawPrevTime === -0.000001) {
    				while (pt) {
    					val = pt.c * v + pt.s;
    					if (pt.r) {
    						val = pt.r(val);
    					} else if (val < min) { if (val > -min) {
    						val = 0;
    					} }
    					if (!pt.type) {
    						pt.t[pt.p] = val + pt.xs0;
    					} else if (pt.type === 1) { //complex value (one that typically has multiple numbers inside a string, like "rect(5px,10px,20px,25px)"
    						i = pt.l;
    						if (i === 2) {
    							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2;
    						} else if (i === 3) {
    							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3;
    						} else if (i === 4) {
    							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4;
    						} else if (i === 5) {
    							pt.t[pt.p] = pt.xs0 + val + pt.xs1 + pt.xn1 + pt.xs2 + pt.xn2 + pt.xs3 + pt.xn3 + pt.xs4 + pt.xn4 + pt.xs5;
    						} else {
    							str = pt.xs0 + val + pt.xs1;
    							for (i = 1; i < pt.l; i++) {
    								str += pt["xn"+i] + pt["xs"+(i+1)];
    							}
    							pt.t[pt.p] = str;
    						}

    					} else if (pt.type === -1) { //non-tweening value
    						pt.t[pt.p] = pt.xs0;

    					} else if (pt.setRatio) { //custom setRatio() for things like SpecialProps, external plugins, etc.
    						pt.setRatio(v);
    					}
    					pt = pt._next;
    				}

    			//if the tween is reversed all the way back to the beginning, we need to restore the original values which may have different units (like % instead of px or em or whatever).
    			} else {
    				while (pt) {
    					if (pt.type !== 2) {
    						pt.t[pt.p] = pt.b;
    					} else {
    						pt.setRatio(v);
    					}
    					pt = pt._next;
    				}
    			}
    		};

    		/**
    		 * @private
    		 * Forces rendering of the target's transforms (rotation, scale, etc.) whenever the CSSPlugin's setRatio() is called.
    		 * Basically, this tells the CSSPlugin to create a CSSPropTween (type 2) after instantiation that runs last in the linked
    		 * list and calls the appropriate (3D or 2D) rendering function. We separate this into its own method so that we can call
    		 * it from other plugins like BezierPlugin if, for example, it needs to apply an autoRotation and this CSSPlugin
    		 * doesn't have any transform-related properties of its own. You can call this method as many times as you
    		 * want and it won't create duplicate CSSPropTweens.
    		 *
    		 * @param {boolean} threeD if true, it should apply 3D tweens (otherwise, just 2D ones are fine and typically faster)
    		 */
    		p._enableTransforms = function(threeD) {
    			this._transform = this._transform || _getTransform(this._target, _cs, true); //ensures that the element has a _gsTransform property with the appropriate values.
    			this._transformType = (!(this._transform.svg && _useSVGTransformAttr) && (threeD || this._transformType === 3)) ? 3 : 2;
    		};

    		var lazySet = function(v) {
    			this.t[this.p] = this.e;
    			this.data._linkCSSP(this, this._next, null, true); //we purposefully keep this._next even though it'd make sense to null it, but this is a performance optimization, as this happens during the while (pt) {} loop in setRatio() at the bottom of which it sets pt = pt._next, so if we null it, the linked list will be broken in that loop.
    		};
    		/** @private Gives us a way to set a value on the first render (and only the first render). **/
    		p._addLazySet = function(t, p, v) {
    			var pt = this._firstPT = new CSSPropTween(t, p, 0, 0, this._firstPT, 2);
    			pt.e = v;
    			pt.setRatio = lazySet;
    			pt.data = this;
    		};

    		/** @private **/
    		p._linkCSSP = function(pt, next, prev, remove) {
    			if (pt) {
    				if (next) {
    					next._prev = pt;
    				}
    				if (pt._next) {
    					pt._next._prev = pt._prev;
    				}
    				if (pt._prev) {
    					pt._prev._next = pt._next;
    				} else if (this._firstPT === pt) {
    					this._firstPT = pt._next;
    					remove = true; //just to prevent resetting this._firstPT 5 lines down in case pt._next is null. (optimized for speed)
    				}
    				if (prev) {
    					prev._next = pt;
    				} else if (!remove && this._firstPT === null) {
    					this._firstPT = pt;
    				}
    				pt._next = next;
    				pt._prev = prev;
    			}
    			return pt;
    		};

    		p._mod = function(lookup) {
    			var pt = this._firstPT;
    			while (pt) {
    				if (typeof(lookup[pt.p]) === "function") { //only gets called by RoundPropsPlugin (ModifyPlugin manages all the rendering internally for CSSPlugin properties that need modification). Remember, we handle rounding a bit differently in this plugin for performance reasons, leveraging "r" as an indicator that the value should be rounded internally.
    					pt.r = lookup[pt.p];
    				}
    				pt = pt._next;
    			}
    		};

    		//we need to make sure that if alpha or autoAlpha is killed, opacity is too. And autoAlpha affects the "visibility" property.
    		p._kill = function(lookup) {
    			var copy = lookup,
    				pt, p, xfirst;
    			if (lookup.autoAlpha || lookup.alpha) {
    				copy = {};
    				for (p in lookup) { //copy the lookup so that we're not changing the original which may be passed elsewhere.
    					copy[p] = lookup[p];
    				}
    				copy.opacity = 1;
    				if (copy.autoAlpha) {
    					copy.visibility = 1;
    				}
    			}
    			if (lookup.className && (pt = this._classNamePT)) { //for className tweens, we need to kill any associated CSSPropTweens too; a linked list starts at the className's "xfirst".
    				xfirst = pt.xfirst;
    				if (xfirst && xfirst._prev) {
    					this._linkCSSP(xfirst._prev, pt._next, xfirst._prev._prev); //break off the prev
    				} else if (xfirst === this._firstPT) {
    					this._firstPT = pt._next;
    				}
    				if (pt._next) {
    					this._linkCSSP(pt._next, pt._next._next, xfirst._prev);
    				}
    				this._classNamePT = null;
    			}
    			pt = this._firstPT;
    			while (pt) {
    				if (pt.plugin && pt.plugin !== p && pt.plugin._kill) { //for plugins that are registered with CSSPlugin, we should notify them of the kill.
    					pt.plugin._kill(lookup);
    					p = pt.plugin;
    				}
    				pt = pt._next;
    			}
    			return TweenPlugin.prototype._kill.call(this, copy);
    		};



    		//used by cascadeTo() for gathering all the style properties of each child element into an array for comparison.
    		var _getChildStyles = function(e, props, targets) {
    				var children, i, child, type;
    				if (e.slice) {
    					i = e.length;
    					while (--i > -1) {
    						_getChildStyles(e[i], props, targets);
    					}
    					return;
    				}
    				children = e.childNodes;
    				i = children.length;
    				while (--i > -1) {
    					child = children[i];
    					type = child.type;
    					if (child.style) {
    						props.push(_getAllStyles(child));
    						if (targets) {
    							targets.push(child);
    						}
    					}
    					if ((type === 1 || type === 9 || type === 11) && child.childNodes.length) {
    						_getChildStyles(child, props, targets);
    					}
    				}
    			};

    		/**
    		 * Typically only useful for className tweens that may affect child elements, this method creates a TweenLite
    		 * and then compares the style properties of all the target's child elements at the tween's start and end, and
    		 * if any are different, it also creates tweens for those and returns an array containing ALL of the resulting
    		 * tweens (so that you can easily add() them to a TimelineLite, for example). The reason this functionality is
    		 * wrapped into a separate static method of CSSPlugin instead of being integrated into all regular className tweens
    		 * is because it creates entirely new tweens that may have completely different targets than the original tween,
    		 * so if they were all lumped into the original tween instance, it would be inconsistent with the rest of the API
    		 * and it would create other problems. For example:
    		 *  - If I create a tween of elementA, that tween instance may suddenly change its target to include 50 other elements (unintuitive if I specifically defined the target I wanted)
    		 *  - We can't just create new independent tweens because otherwise, what happens if the original/parent tween is reversed or pause or dropped into a TimelineLite for tight control? You'd expect that tween's behavior to affect all the others.
    		 *  - Analyzing every style property of every child before and after the tween is an expensive operation when there are many children, so this behavior shouldn't be imposed on all className tweens by default, especially since it's probably rare that this extra functionality is needed.
    		 *
    		 * @param {Object} target object to be tweened
    		 * @param {number} Duration in seconds (or frames for frames-based tweens)
    		 * @param {Object} Object containing the end values, like {className:"newClass", ease:Linear.easeNone}
    		 * @return {Array} An array of TweenLite instances
    		 */
    		CSSPlugin.cascadeTo = function(target, duration, vars) {
    			var tween = TweenLite.to(target, duration, vars),
    				results = [tween],
    				b = [],
    				e = [],
    				targets = [],
    				_reservedProps = TweenLite._internals.reservedProps,
    				i, difs, p, from;
    			target = tween._targets || tween.target;
    			_getChildStyles(target, b, targets);
    			tween.render(duration, true, true);
    			_getChildStyles(target, e);
    			tween.render(0, true, true);
    			tween._enabled(true);
    			i = targets.length;
    			while (--i > -1) {
    				difs = _cssDif(targets[i], b[i], e[i]);
    				if (difs.firstMPT) {
    					difs = difs.difs;
    					for (p in vars) {
    						if (_reservedProps[p]) {
    							difs[p] = vars[p];
    						}
    					}
    					from = {};
    					for (p in difs) {
    						from[p] = b[i][p];
    					}
    					results.push(TweenLite.fromTo(targets[i], duration, from, difs));
    				}
    			}
    			return results;
    		};

    		TweenPlugin.activate([CSSPlugin]);
    		return CSSPlugin;

    	}, true);

    var CSSPlugin = globals.CSSPlugin;

    /*!
     * VERSION: 0.6.1
     * DATE: 2018-08-27
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
     * This work is subject to the terms at http://greensock.com/standard-license or for
     * Club GreenSock members, the software agreement that was issued with your membership.
     * 
     * @author: Jack Doyle, jack@greensock.com
     */

    var AttrPlugin = _gsScope._gsDefine.plugin({
    	propName: "attr",
    	API: 2,
    	version: "0.6.1",

    	//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
    	init: function(target, value, tween, index) {
    		var p, end;
    		if (typeof(target.setAttribute) !== "function") {
    			return false;
    		}
    		for (p in value) {
    			end = value[p];
    			if (typeof(end) === "function") {
    				end = end(index, target);
    			}
    			this._addTween(target, "setAttribute", target.getAttribute(p) + "", end + "", p, false, p);
    			this._overwriteProps.push(p);
    		}
    		return true;
    	}

    });

    /*!
     * VERSION: 1.6.0
     * DATE: 2018-08-27
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
     * This work is subject to the terms at http://greensock.com/standard-license or for
     * Club GreenSock members, the software agreement that was issued with your membership.
     * 
     * @author: Jack Doyle, jack@greensock.com
     **/

    var RoundPropsPlugin = _gsScope._gsDefine.plugin({
    				propName: "roundProps",
    				version: "1.7.0",
    				priority: -1,
    				API: 2,

    				//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
    				init: function(target, value, tween) {
    					this._tween = tween;
    					return true;
    				}

    			}),
    			_getRoundFunc = function(v) { //pass in 0.1 get a function that'll round to the nearest tenth, or 5 to round to the closest 5, or 0.001 to the closest 1000th, etc.
    				var p = v < 1 ? Math.pow(10, (v + "").length - 2) : 1; //to avoid floating point math errors (like 24 * 0.1 == 2.4000000000000004), we chop off at a specific number of decimal places (much faster than toFixed()
    				return function(n) {
    					return ((Math.round(n / v) * v * p) | 0) / p;
    				};
    			},
    			_roundLinkedList = function(node, mod) {
    				while (node) {
    					if (!node.f && !node.blob) {
    						node.m = mod || Math.round;
    					}
    					node = node._next;
    				}
    			},
    			p = RoundPropsPlugin.prototype;

    		p._onInitAllProps = function() {
    			var tween = this._tween,
    				rp = tween.vars.roundProps,
    				lookup = {},
    				rpt = tween._propLookup.roundProps,
    				pt, next, i, p;
    			if (typeof(rp) === "object" && !rp.push) {
    				for (p in rp) {
    					lookup[p] = _getRoundFunc(rp[p]);
    				}
    			} else {
    				if (typeof(rp) === "string") {
    					rp = rp.split(",");
    				}
    				i = rp.length;
    				while (--i > -1) {
    					lookup[rp[i]] = Math.round;
    				}
    			}

    			for (p in lookup) {
    				pt = tween._firstPT;
    				while (pt) {
    					next = pt._next; //record here, because it may get removed
    					if (pt.pg) {
    						pt.t._mod(lookup);
    					} else if (pt.n === p) {
    						if (pt.f === 2 && pt.t) { //a blob (text containing multiple numeric values)
    							_roundLinkedList(pt.t._firstPT, lookup[p]);
    						} else {
    							this._add(pt.t, p, pt.s, pt.c, lookup[p]);
    							//remove from linked list
    							if (next) {
    								next._prev = pt._prev;
    							}
    							if (pt._prev) {
    								pt._prev._next = next;
    							} else if (tween._firstPT === pt) {
    								tween._firstPT = next;
    							}
    							pt._next = pt._prev = null;
    							tween._propLookup[p] = rpt;
    						}
    					}
    					pt = next;
    				}
    			}
    			return false;
    		};

    		p._add = function(target, p, s, c, mod) {
    			this._addTween(target, p, s, s + c, p, mod || Math.round);
    			this._overwriteProps.push(p);
    		};

    /*!
     * VERSION: 0.3.1
     * DATE: 2018-08-27
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
     * This work is subject to the terms at http://greensock.com/standard-license or for
     * Club GreenSock members, the software agreement that was issued with your membership.
     * 
     * @author: Jack Doyle, jack@greensock.com
     **/

    var DirectionalRotationPlugin = _gsScope._gsDefine.plugin({
    		propName: "directionalRotation",
    		version: "0.3.1",
    		API: 2,

    		//called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
    		init: function(target, value, tween, index) {
    			if (typeof(value) !== "object") {
    				value = {rotation:value};
    			}
    			this.finals = {};
    			var cap = (value.useRadians === true) ? Math.PI * 2 : 360,
    				min = 0.000001,
    				p, v, start, end, dif, split;
    			for (p in value) {
    				if (p !== "useRadians") {
    					end = value[p];
    					if (typeof(end) === "function") {
    						end = end(index, target);
    					}
    					split = (end + "").split("_");
    					v = split[0];
    					start = parseFloat( (typeof(target[p]) !== "function") ? target[p] : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]() );
    					end = this.finals[p] = (typeof(v) === "string" && v.charAt(1) === "=") ? start + parseInt(v.charAt(0) + "1", 10) * Number(v.substr(2)) : Number(v) || 0;
    					dif = end - start;
    					if (split.length) {
    						v = split.join("_");
    						if (v.indexOf("short") !== -1) {
    							dif = dif % cap;
    							if (dif !== dif % (cap / 2)) {
    								dif = (dif < 0) ? dif + cap : dif - cap;
    							}
    						}
    						if (v.indexOf("_cw") !== -1 && dif < 0) {
    							dif = ((dif + cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
    						} else if (v.indexOf("ccw") !== -1 && dif > 0) {
    							dif = ((dif - cap * 9999999999) % cap) - ((dif / cap) | 0) * cap;
    						}
    					}
    					if (dif > min || dif < -min) {
    						this._addTween(target, p, start, start + dif, p);
    						this._overwriteProps.push(p);
    					}
    				}
    			}
    			return true;
    		},

    		//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
    		set: function(ratio) {
    			var pt;
    			if (ratio !== 1) {
    				this._super.setRatio.call(this, ratio);
    			} else {
    				pt = this._firstPT;
    				while (pt) {
    					if (pt.f) {
    						pt.t[pt.p](this.finals[pt.p]);
    					} else {
    						pt.t[pt.p] = this.finals[pt.p];
    					}
    					pt = pt._next;
    				}
    			}
    		}

    	});

    DirectionalRotationPlugin._autoCSS = true;

    /*!
     * VERSION: 2.1.3
     * DATE: 2019-05-17
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
     * This work is subject to the terms at http://greensock.com/standard-license or for
     * Club GreenSock members, the software agreement that was issued with your membership.
     * 
     * @author: Jack Doyle, jack@greensock.com
     */

    _gsScope._gsDefine("TimelineLite", ["core.Animation","core.SimpleTimeline","TweenLite"], function() {

    		var TimelineLite = function(vars) {
    				SimpleTimeline.call(this, vars);
    				var self = this,
    					v = self.vars,
    					val, p;
    				self._labels = {};
    				self.autoRemoveChildren = !!v.autoRemoveChildren;
    				self.smoothChildTiming = !!v.smoothChildTiming;
    				self._sortChildren = true;
    				self._onUpdate = v.onUpdate;
    				for (p in v) {
    					val = v[p];
    					if (_isArray(val)) { if (val.join("").indexOf("{self}") !== -1) {
    						v[p] = self._swapSelfInParams(val);
    					} }
    				}
    				if (_isArray(v.tweens)) {
    					self.add(v.tweens, 0, v.align, v.stagger);
    				}
    			},
    			_tinyNum = 0.00000001,
    			TweenLiteInternals = TweenLite._internals,
    			_internals = TimelineLite._internals = {},
    			_isSelector = TweenLiteInternals.isSelector,
    			_isArray = TweenLiteInternals.isArray,
    			_lazyTweens = TweenLiteInternals.lazyTweens,
    			_lazyRender = TweenLiteInternals.lazyRender,
    			_globals = _gsScope._gsDefine.globals,
    			_copy = function(vars) {
    				var copy = {}, p;
    				for (p in vars) {
    					copy[p] = vars[p];
    				}
    				return copy;
    			},
    			_applyCycle = function(vars, targets, i) {
    				var alt = vars.cycle,
    					p, val;
    				for (p in alt) {
    					val = alt[p];
    					vars[p] = (typeof(val) === "function") ? val(i, targets[i], targets) : val[i % val.length];
    				}
    				delete vars.cycle;
    			},
    			_pauseCallback = _internals.pauseCallback = function() {},
    			_slice = function(a) { //don't use [].slice because that doesn't work in IE8 with a NodeList that's returned by querySelectorAll()
    				var b = [],
    					l = a.length,
    					i;
    				for (i = 0; i !== l; b.push(a[i++])){ }
    				return b;
    			},
    			_defaultImmediateRender = function(tl, toVars, fromVars, defaultFalse) { //default to immediateRender:true unless otherwise set in toVars, fromVars or if defaultFalse is passed in as true
    				var ir = "immediateRender";
    				if (!(ir in toVars)) {
    					toVars[ir] = !((fromVars && fromVars[ir] === false) || defaultFalse);
    				}
    				return toVars;
    			},
    			//for distributing values across an array. Can accept a number, a function or (most commonly) a function which can contain the following properties: {base, amount, from, ease, grid, axis, length, each}. Returns a function that expects the following parameters: index, target, array. Recognizes the following
    			_distribute = function(v) {
    				if (typeof(v) === "function") {
    					return v;
    				}
    				var vars = (typeof(v) === "object") ? v : {each:v}, //n:1 is just to indicate v was a number; we leverage that later to set v according to the length we get. If a number is passed in, we treat it like the old stagger value where 0.1, for example, would mean that things would be distributed with 0.1 between each element in the array rather than a total "amount" that's chunked out among them all.
    					ease = vars.ease,
    					from = vars.from || 0,
    					base = vars.base || 0,
    					cache = {},
    					isFromKeyword = isNaN(from),
    					axis = vars.axis,
    					ratio = {center:0.5, end:1}[from] || 0;
    				return function(i, target, a) {
    					var l = (a || vars).length,
    						distances = cache[l],
    						originX, originY, x, y, d, j, max, min, wrap;
    					if (!distances) {
    						wrap = (vars.grid === "auto") ? 0 : (vars.grid || [Infinity])[0];
    						if (!wrap) {
    							max = -Infinity;
    							while (max < (max = a[wrap++].getBoundingClientRect().left) && wrap < l) { }
    							wrap--;
    						}
    						distances = cache[l] = [];
    						originX = isFromKeyword ? (Math.min(wrap, l) * ratio) - 0.5 : from % wrap;
    						originY = isFromKeyword ? l * ratio / wrap - 0.5 : (from / wrap) | 0;
    						max = 0;
    						min = Infinity;
    						for (j = 0; j < l; j++) {
    							x = (j % wrap) - originX;
    							y = originY - ((j / wrap) | 0);
    							distances[j] = d = !axis ? Math.sqrt(x * x + y * y) : Math.abs((axis === "y") ? y : x);
    							if (d > max) {
    								max = d;
    							}
    							if (d < min) {
    								min = d;
    							}
    						}
    						distances.max = max - min;
    						distances.min = min;
    						distances.v = l = vars.amount || (vars.each * (wrap > l ? l - 1 : !axis ? Math.max(wrap, l / wrap) : axis === "y" ? l / wrap : wrap)) || 0;
    						distances.b = (l < 0) ? base - l : base;
    					}
    					l = (distances[i] - distances.min) / distances.max;
    					return distances.b + (ease ? ease.getRatio(l) : l) * distances.v;
    				};
    			},
    			p = TimelineLite.prototype = new SimpleTimeline();

    		TimelineLite.version = "2.1.3";
    		TimelineLite.distribute = _distribute;
    		p.constructor = TimelineLite;
    		p.kill()._gc = p._forcingPlayhead = p._hasPause = false;

    		/* might use later...
    		//translates a local time inside an animation to the corresponding time on the root/global timeline, factoring in all nesting and timeScales.
    		function localToGlobal(time, animation) {
    			while (animation) {
    				time = (time / animation._timeScale) + animation._startTime;
    				animation = animation.timeline;
    			}
    			return time;
    		}

    		//translates the supplied time on the root/global timeline into the corresponding local time inside a particular animation, factoring in all nesting and timeScales
    		function globalToLocal(time, animation) {
    			var scale = 1;
    			time -= localToGlobal(0, animation);
    			while (animation) {
    				scale *= animation._timeScale;
    				animation = animation.timeline;
    			}
    			return time * scale;
    		}
    		*/

    		p.to = function(target, duration, vars, position) {
    			var Engine = (vars.repeat && _globals.TweenMax) || TweenLite;
    			return duration ? this.add( new Engine(target, duration, vars), position) : this.set(target, vars, position);
    		};

    		p.from = function(target, duration, vars, position) {
    			return this.add( ((vars.repeat && _globals.TweenMax) || TweenLite).from(target, duration, _defaultImmediateRender(this, vars)), position);
    		};

    		p.fromTo = function(target, duration, fromVars, toVars, position) {
    			var Engine = (toVars.repeat && _globals.TweenMax) || TweenLite;
    			toVars = _defaultImmediateRender(this, toVars, fromVars);
    			return duration ? this.add( Engine.fromTo(target, duration, fromVars, toVars), position) : this.set(target, toVars, position);
    		};

    		p.staggerTo = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
    			var tl = new TimelineLite({onComplete:onCompleteAll, onCompleteParams:onCompleteAllParams, callbackScope:onCompleteAllScope, smoothChildTiming:this.smoothChildTiming}),
    				staggerFunc = _distribute(vars.stagger || stagger),
    				startAt = vars.startAt,
    				cycle = vars.cycle,
    				copy, i;
    			if (typeof(targets) === "string") {
    				targets = TweenLite.selector(targets) || targets;
    			}
    			targets = targets || [];
    			if (_isSelector(targets)) { //if the targets object is a selector, translate it into an array.
    				targets = _slice(targets);
    			}
    			for (i = 0; i < targets.length; i++) {
    				copy = _copy(vars);
    				if (startAt) {
    					copy.startAt = _copy(startAt);
    					if (startAt.cycle) {
    						_applyCycle(copy.startAt, targets, i);
    					}
    				}
    				if (cycle) {
    					_applyCycle(copy, targets, i);
    					if (copy.duration != null) {
    						duration = copy.duration;
    						delete copy.duration;
    					}
    				}
    				tl.to(targets[i], duration, copy, staggerFunc(i, targets[i], targets));
    			}
    			return this.add(tl, position);
    		};

    		p.staggerFrom = function(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
    			vars.runBackwards = true;
    			return this.staggerTo(targets, duration, _defaultImmediateRender(this, vars), stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
    		};

    		p.staggerFromTo = function(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope) {
    			toVars.startAt = fromVars;
    			return this.staggerTo(targets, duration, _defaultImmediateRender(this, toVars, fromVars), stagger, position, onCompleteAll, onCompleteAllParams, onCompleteAllScope);
    		};

    		p.call = function(callback, params, scope, position) {
    			return this.add( TweenLite.delayedCall(0, callback, params, scope), position);
    		};

    		p.set = function(target, vars, position) {
    			return this.add( new TweenLite(target, 0, _defaultImmediateRender(this, vars, null, true)), position);
    		};

    		TimelineLite.exportRoot = function(vars, ignoreDelayedCalls) {
    			vars = vars || {};
    			if (vars.smoothChildTiming == null) {
    				vars.smoothChildTiming = true;
    			}
    			var tl = new TimelineLite(vars),
    				root = tl._timeline,
    				hasNegativeStart, time,	tween, next;
    			if (ignoreDelayedCalls == null) {
    				ignoreDelayedCalls = true;
    			}
    			root._remove(tl, true);
    			tl._startTime = 0;
    			tl._rawPrevTime = tl._time = tl._totalTime = root._time;
    			tween = root._first;
    			while (tween) {
    				next = tween._next;
    				if (!ignoreDelayedCalls || !(tween instanceof TweenLite && tween.target === tween.vars.onComplete)) {
    					time = tween._startTime - tween._delay;
    					if (time < 0) {
    						hasNegativeStart = 1;
    					}
    					tl.add(tween, time);
    				}
    				tween = next;
    			}
    			root.add(tl, 0);
    			if (hasNegativeStart) { //calling totalDuration() will force the adjustment necessary to shift the children forward so none of them start before zero, and moves the timeline backwards the same amount, so the playhead is still aligned where it should be globally, but the timeline doesn't have illegal children that start before zero.
    				tl.totalDuration();
    			}
    			return tl;
    		};

    		p.add = function(value, position, align, stagger) {
    			var self = this,
    				curTime, l, i, child, tl, beforeRawTime;
    			if (typeof(position) !== "number") {
    				position = self._parseTimeOrLabel(position, 0, true, value);
    			}
    			if (!(value instanceof Animation)) {
    				if ((value instanceof Array) || (value && value.push && _isArray(value))) {
    					align = align || "normal";
    					stagger = stagger || 0;
    					curTime = position;
    					l = value.length;
    					for (i = 0; i < l; i++) {
    						if (_isArray(child = value[i])) {
    							child = new TimelineLite({tweens:child});
    						}
    						self.add(child, curTime);
    						if (typeof(child) !== "string" && typeof(child) !== "function") {
    							if (align === "sequence") {
    								curTime = child._startTime + (child.totalDuration() / child._timeScale);
    							} else if (align === "start") {
    								child._startTime -= child.delay();
    							}
    						}
    						curTime += stagger;
    					}
    					return self._uncache(true);
    				} else if (typeof(value) === "string") {
    					return self.addLabel(value, position);
    				} else if (typeof(value) === "function") {
    					value = TweenLite.delayedCall(0, value);
    				} else {
    					throw("Cannot add " + value + " into the timeline; it is not a tween, timeline, function, or string.");
    				}
    			}

    			SimpleTimeline.prototype.add.call(self, value, position);

    			if (value._time || (!value._duration && value._initted)) { //in case, for example, the _startTime is moved on a tween that has already rendered. Imagine it's at its end state, then the startTime is moved WAY later (after the end of this timeline), it should render at its beginning.
    				curTime = (self.rawTime() - value._startTime) * value._timeScale;
    				if (!value._duration || Math.abs(Math.max(0, Math.min(value.totalDuration(), curTime))) - value._totalTime > 0.00001) {
    					value.render(curTime, false, false);
    				}
    			}

    			//if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.
    			if (self._gc || self._time === self._duration) { if (!self._paused) { if (self._duration < self.duration()) {
    				//in case any of the ancestors had completed but should now be enabled...
    				tl = self;
    				beforeRawTime = (tl.rawTime() > value._startTime); //if the tween is placed on the timeline so that it starts BEFORE the current rawTime, we should align the playhead (move the timeline). This is because sometimes users will create a timeline, let it finish, and much later append a tween and expect it to run instead of jumping to its end state. While technically one could argue that it should jump to its end state, that's not what users intuitively expect.
    				while (tl._timeline) {
    					if (beforeRawTime && tl._timeline.smoothChildTiming) {
    						tl.totalTime(tl._totalTime, true); //moves the timeline (shifts its startTime) if necessary, and also enables it.
    					} else if (tl._gc) {
    						tl._enabled(true, false);
    					}
    					tl = tl._timeline;
    				}
    			} } }

    			return self;
    		};

    		p.remove = function(value) {
    			if (value instanceof Animation) {
    				this._remove(value, false);
    				var tl = value._timeline = value.vars.useFrames ? Animation._rootFramesTimeline : Animation._rootTimeline; //now that it's removed, default it to the root timeline so that if it gets played again, it doesn't jump back into this timeline.
    				value._startTime = (value._paused ? value._pauseTime : tl._time) - ((!value._reversed ? value._totalTime : value.totalDuration() - value._totalTime) / value._timeScale); //ensure that if it gets played again, the timing is correct.
    				return this;
    			} else if (value instanceof Array || (value && value.push && _isArray(value))) {
    				var i = value.length;
    				while (--i > -1) {
    					this.remove(value[i]);
    				}
    				return this;
    			} else if (typeof(value) === "string") {
    				return this.removeLabel(value);
    			}
    			return this.kill(null, value);
    		};

    		p._remove = function(tween, skipDisable) {
    			SimpleTimeline.prototype._remove.call(this, tween, skipDisable);
    			var last = this._last;
    			if (!last) {
    				this._time = this._totalTime = this._duration = this._totalDuration = 0;
    			} else if (this._time > this.duration()) {
    				this._time = this._duration;
    				this._totalTime = this._totalDuration;
    			}
    			return this;
    		};

    		p.append = function(value, offsetOrLabel) {
    			return this.add(value, this._parseTimeOrLabel(null, offsetOrLabel, true, value));
    		};

    		p.insert = p.insertMultiple = function(value, position, align, stagger) {
    			return this.add(value, position || 0, align, stagger);
    		};

    		p.appendMultiple = function(tweens, offsetOrLabel, align, stagger) {
    			return this.add(tweens, this._parseTimeOrLabel(null, offsetOrLabel, true, tweens), align, stagger);
    		};

    		p.addLabel = function(label, position) {
    			this._labels[label] = this._parseTimeOrLabel(position);
    			return this;
    		};

    		p.addPause = function(position, callback, params, scope) {
    			var t = TweenLite.delayedCall(0, _pauseCallback, params, scope || this);
    			t.vars.onComplete = t.vars.onReverseComplete = callback;
    			t.data = "isPause";
    			this._hasPause = true;
    			return this.add(t, position);
    		};

    		p.removeLabel = function(label) {
    			delete this._labels[label];
    			return this;
    		};

    		p.getLabelTime = function(label) {
    			return (this._labels[label] != null) ? this._labels[label] : -1;
    		};

    		p._parseTimeOrLabel = function(timeOrLabel, offsetOrLabel, appendIfAbsent, ignore) {
    			var clippedDuration, i;
    			//if we're about to add a tween/timeline (or an array of them) that's already a child of this timeline, we should remove it first so that it doesn't contaminate the duration().
    			if (ignore instanceof Animation && ignore.timeline === this) {
    				this.remove(ignore);
    			} else if (ignore && ((ignore instanceof Array) || (ignore.push && _isArray(ignore)))) {
    				i = ignore.length;
    				while (--i > -1) {
    					if (ignore[i] instanceof Animation && ignore[i].timeline === this) {
    						this.remove(ignore[i]);
    					}
    				}
    			}
    			clippedDuration = (typeof(timeOrLabel) === "number" && !offsetOrLabel) ? 0 : (this.duration() > 99999999999) ? this.recent().endTime(false) : this._duration; //in case there's a child that infinitely repeats, users almost never intend for the insertion point of a new child to be based on a SUPER long value like that so we clip it and assume the most recently-added child's endTime should be used instead.
    			if (typeof(offsetOrLabel) === "string") {
    				return this._parseTimeOrLabel(offsetOrLabel, (appendIfAbsent && typeof(timeOrLabel) === "number" && this._labels[offsetOrLabel] == null) ? timeOrLabel - clippedDuration : 0, appendIfAbsent);
    			}
    			offsetOrLabel = offsetOrLabel || 0;
    			if (typeof(timeOrLabel) === "string" && (isNaN(timeOrLabel) || this._labels[timeOrLabel] != null)) { //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
    				i = timeOrLabel.indexOf("=");
    				if (i === -1) {
    					if (this._labels[timeOrLabel] == null) {
    						return appendIfAbsent ? (this._labels[timeOrLabel] = clippedDuration + offsetOrLabel) : offsetOrLabel;
    					}
    					return this._labels[timeOrLabel] + offsetOrLabel;
    				}
    				offsetOrLabel = parseInt(timeOrLabel.charAt(i-1) + "1", 10) * Number(timeOrLabel.substr(i+1));
    				timeOrLabel = (i > 1) ? this._parseTimeOrLabel(timeOrLabel.substr(0, i-1), 0, appendIfAbsent) : clippedDuration;
    			} else if (timeOrLabel == null) {
    				timeOrLabel = clippedDuration;
    			}
    			return Number(timeOrLabel) + offsetOrLabel;
    		};

    		p.seek = function(position, suppressEvents) {
    			return this.totalTime((typeof(position) === "number") ? position : this._parseTimeOrLabel(position), (suppressEvents !== false));
    		};

    		p.stop = function() {
    			return this.paused(true);
    		};

    		p.gotoAndPlay = function(position, suppressEvents) {
    			return this.play(position, suppressEvents);
    		};

    		p.gotoAndStop = function(position, suppressEvents) {
    			return this.pause(position, suppressEvents);
    		};

    		p.render = function(time, suppressEvents, force) {
    			if (this._gc) {
    				this._enabled(true, false);
    			}
    			var self = this,
    				prevTime = self._time,
    				totalDur = (!self._dirty) ? self._totalDuration : self.totalDuration(),
    				prevStart = self._startTime,
    				prevTimeScale = self._timeScale,
    				prevPaused = self._paused,
    				tween, isComplete, next, callback, internalForce, pauseTween, curTime, pauseTime;
    			if (prevTime !== self._time) { //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
    				time += self._time - prevTime;
    			}
    			if (self._hasPause && !self._forcingPlayhead && !suppressEvents) {
    				if (time > prevTime) {
    					tween = self._first;
    					while (tween && tween._startTime <= time && !pauseTween) {
    						if (!tween._duration) { if (tween.data === "isPause" && !tween.ratio && !(tween._startTime === 0 && self._rawPrevTime === 0)) {
    							pauseTween = tween;
    						} }
    						tween = tween._next;
    					}
    				} else {
    					tween = self._last;
    					while (tween && tween._startTime >= time && !pauseTween) {
    						if (!tween._duration) { if (tween.data === "isPause" && tween._rawPrevTime > 0) {
    							pauseTween = tween;
    						} }
    						tween = tween._prev;
    					}
    				}
    				if (pauseTween) {
    					self._time = self._totalTime = time = pauseTween._startTime;
    					pauseTime = self._startTime + (self._reversed ? self._duration - time : time) / self._timeScale;
    				}
    			}
    			if (time >= totalDur - _tinyNum && time >= 0) { //to work around occasional floating point math artifacts.
    				self._totalTime = self._time = totalDur;
    				if (!self._reversed) { if (!self._hasPausedChild()) {
    					isComplete = true;
    					callback = "onComplete";
    					internalForce = !!self._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
    					if (self._duration === 0) { if ((time <= 0 && time >= -_tinyNum) || self._rawPrevTime < 0 || self._rawPrevTime === _tinyNum) { if (self._rawPrevTime !== time && self._first) {
    						internalForce = true;
    						if (self._rawPrevTime > _tinyNum) {
    							callback = "onReverseComplete";
    						}
    					} } }
    				} }
    				self._rawPrevTime = (self._duration || !suppressEvents || time || self._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
    				time = totalDur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7.

    			} else if (time < _tinyNum) { //to work around occasional floating point math artifacts, round super small values to 0.
    				self._totalTime = self._time = 0;
    				if (time > -_tinyNum) {
    					time = 0;
    				}
    				if (prevTime !== 0 || (self._duration === 0 && self._rawPrevTime !== _tinyNum && (self._rawPrevTime > 0 || (time < 0 && self._rawPrevTime >= 0)))) {
    					callback = "onReverseComplete";
    					isComplete = self._reversed;
    				}
    				if (time < 0) {
    					self._active = false;
    					if (self._timeline.autoRemoveChildren && self._reversed) { //ensures proper GC if a timeline is resumed after it's finished reversing.
    						internalForce = isComplete = true;
    						callback = "onReverseComplete";
    					} else if (self._rawPrevTime >= 0 && self._first) { //when going back beyond the start, force a render so that zero-duration tweens that sit at the very beginning render their start values properly. Otherwise, if the parent timeline's playhead lands exactly at this timeline's startTime, and then moves backwards, the zero-duration tweens at the beginning would still be at their end state.
    						internalForce = true;
    					}
    					self._rawPrevTime = time;
    				} else {
    					self._rawPrevTime = (self._duration || !suppressEvents || time || self._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
    					if (time === 0 && isComplete) { //if there's a zero-duration tween at the very beginning of a timeline and the playhead lands EXACTLY at time 0, that tween will correctly render its end values, but we need to keep the timeline alive for one more render so that the beginning values render properly as the parent's playhead keeps moving beyond the begining. Imagine obj.x starts at 0 and then we do tl.set(obj, {x:100}).to(obj, 1, {x:200}) and then later we tl.reverse()...the goal is to have obj.x revert to 0. If the playhead happens to land on exactly 0, without this chunk of code, it'd complete the timeline and remove it from the rendering queue (not good).
    						tween = self._first;
    						while (tween && tween._startTime === 0) {
    							if (!tween._duration) {
    								isComplete = false;
    							}
    							tween = tween._next;
    						}
    					}
    					time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
    					if (!self._initted) {
    						internalForce = true;
    					}
    				}

    			} else {
    				self._totalTime = self._time = self._rawPrevTime = time;
    			}
    			if ((self._time === prevTime || !self._first) && !force && !internalForce && !pauseTween) {
    				return;
    			} else if (!self._initted) {
    				self._initted = true;
    			}

    			if (!self._active) { if (!self._paused && self._time !== prevTime && time > 0) {
    				self._active = true;  //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
    			} }

    			if (prevTime === 0) { if (self.vars.onStart) { if (self._time !== 0 || !self._duration) { if (!suppressEvents) {
    				self._callback("onStart");
    			} } } }

    			curTime = self._time;
    			if (curTime >= prevTime) {
    				tween = self._first;
    				while (tween) {
    					next = tween._next; //record it here because the value could change after rendering...
    					if (curTime !== self._time || (self._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
    						break;
    					} else if (tween._active || (tween._startTime <= curTime && !tween._paused && !tween._gc)) {
    						if (pauseTween === tween) {
    							self.pause();
    							self._pauseTime = pauseTime; //so that when we resume(), it's starting from exactly the right spot (the pause() method uses the rawTime for the parent, but that may be a bit too far ahead)
    						}
    						if (!tween._reversed) {
    							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
    						} else {
    							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
    						}
    					}
    					tween = next;
    				}
    			} else {
    				tween = self._last;
    				while (tween) {
    					next = tween._prev; //record it here because the value could change after rendering...
    					if (curTime !== self._time || (self._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
    						break;
    					} else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
    						if (pauseTween === tween) {
    							pauseTween = tween._prev; //the linked list is organized by _startTime, thus it's possible that a tween could start BEFORE the pause and end after it, in which case it would be positioned before the pause tween in the linked list, but we should render it before we pause() the timeline and cease rendering. This is only a concern when going in reverse.
    							while (pauseTween && pauseTween.endTime() > self._time) {
    								pauseTween.render( (pauseTween._reversed ? pauseTween.totalDuration() - ((time - pauseTween._startTime) * pauseTween._timeScale) : (time - pauseTween._startTime) * pauseTween._timeScale), suppressEvents, force);
    								pauseTween = pauseTween._prev;
    							}
    							pauseTween = null;
    							self.pause();
    							self._pauseTime = pauseTime; //so that when we resume(), it's starting from exactly the right spot (the pause() method uses the rawTime for the parent, but that may be a bit too far ahead)
    						}
    						if (!tween._reversed) {
    							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
    						} else {
    							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
    						}
    					}
    					tween = next;
    				}
    			}

    			if (self._onUpdate) { if (!suppressEvents) {
    				if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
    					_lazyRender();
    				}
    				self._callback("onUpdate");
    			} }

    			if (callback) { if (!self._gc) { if (prevStart === self._startTime || prevTimeScale !== self._timeScale) { if (self._time === 0 || totalDur >= self.totalDuration()) { //if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
    				if (isComplete) {
    					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onComplete on a timeline that reports/checks tweened values.
    						_lazyRender();
    					}
    					if (self._timeline.autoRemoveChildren) {
    						self._enabled(false, false);
    					}
    					self._active = false;
    				}
    				if (!suppressEvents && self.vars[callback]) {
    					self._callback(callback);
    				}
    			} } } }
    		};

    		p._hasPausedChild = function() {
    			var tween = this._first;
    			while (tween) {
    				if (tween._paused || ((tween instanceof TimelineLite) && tween._hasPausedChild())) {
    					return true;
    				}
    				tween = tween._next;
    			}
    			return false;
    		};

    		p.getChildren = function(nested, tweens, timelines, ignoreBeforeTime) {
    			ignoreBeforeTime = ignoreBeforeTime || -9999999999;
    			var a = [],
    				tween = this._first,
    				cnt = 0;
    			while (tween) {
    				if (tween._startTime < ignoreBeforeTime) ; else if (tween instanceof TweenLite) {
    					if (tweens !== false) {
    						a[cnt++] = tween;
    					}
    				} else {
    					if (timelines !== false) {
    						a[cnt++] = tween;
    					}
    					if (nested !== false) {
    						a = a.concat(tween.getChildren(true, tweens, timelines));
    						cnt = a.length;
    					}
    				}
    				tween = tween._next;
    			}
    			return a;
    		};

    		p.getTweensOf = function(target, nested) {
    			var disabled = this._gc,
    				a = [],
    				cnt = 0,
    				tweens, i;
    			if (disabled) {
    				this._enabled(true, true); //getTweensOf() filters out disabled tweens, and we have to mark them as _gc = true when the timeline completes in order to allow clean garbage collection, so temporarily re-enable the timeline here.
    			}
    			tweens = TweenLite.getTweensOf(target);
    			i = tweens.length;
    			while (--i > -1) {
    				if (tweens[i].timeline === this || (nested && this._contains(tweens[i]))) {
    					a[cnt++] = tweens[i];
    				}
    			}
    			if (disabled) {
    				this._enabled(false, true);
    			}
    			return a;
    		};

    		p.recent = function() {
    			return this._recent;
    		};

    		p._contains = function(tween) {
    			var tl = tween.timeline;
    			while (tl) {
    				if (tl === this) {
    					return true;
    				}
    				tl = tl.timeline;
    			}
    			return false;
    		};

    		p.shiftChildren = function(amount, adjustLabels, ignoreBeforeTime) {
    			ignoreBeforeTime = ignoreBeforeTime || 0;
    			var tween = this._first,
    				labels = this._labels,
    				p;
    			while (tween) {
    				if (tween._startTime >= ignoreBeforeTime) {
    					tween._startTime += amount;
    				}
    				tween = tween._next;
    			}
    			if (adjustLabels) {
    				for (p in labels) {
    					if (labels[p] >= ignoreBeforeTime) {
    						labels[p] += amount;
    					}
    				}
    			}
    			return this._uncache(true);
    		};

    		p._kill = function(vars, target) {
    			if (!vars && !target) {
    				return this._enabled(false, false);
    			}
    			var tweens = (!target) ? this.getChildren(true, true, false) : this.getTweensOf(target),
    				i = tweens.length,
    				changed = false;
    			while (--i > -1) {
    				if (tweens[i]._kill(vars, target)) {
    					changed = true;
    				}
    			}
    			return changed;
    		};

    		p.clear = function(labels) {
    			var tweens = this.getChildren(false, true, true),
    				i = tweens.length;
    			this._time = this._totalTime = 0;
    			while (--i > -1) {
    				tweens[i]._enabled(false, false);
    			}
    			if (labels !== false) {
    				this._labels = {};
    			}
    			return this._uncache(true);
    		};

    		p.invalidate = function() {
    			var tween = this._first;
    			while (tween) {
    				tween.invalidate();
    				tween = tween._next;
    			}
    			return Animation.prototype.invalidate.call(this);		};

    		p._enabled = function(enabled, ignoreTimeline) {
    			if (enabled === this._gc) {
    				var tween = this._first;
    				while (tween) {
    					tween._enabled(enabled, true);
    					tween = tween._next;
    				}
    			}
    			return SimpleTimeline.prototype._enabled.call(this, enabled, ignoreTimeline);
    		};

    		p.totalTime = function(time, suppressEvents, uncapped) {
    			this._forcingPlayhead = true;
    			var val = Animation.prototype.totalTime.apply(this, arguments);
    			this._forcingPlayhead = false;
    			return val;
    		};

    		p.duration = function(value) {
    			if (!arguments.length) {
    				if (this._dirty) {
    					this.totalDuration(); //just triggers recalculation
    				}
    				return this._duration;
    			}
    			if (this.duration() !== 0 && value !== 0) {
    				this.timeScale(this._duration / value);
    			}
    			return this;
    		};

    		p.totalDuration = function(value) {
    			if (!arguments.length) {
    				if (this._dirty) {
    					var max = 0,
    						self = this,
    						tween = self._last,
    						prevStart = 999999999999,
    						prev, end;
    					while (tween) {
    						prev = tween._prev; //record it here in case the tween changes position in the sequence...
    						if (tween._dirty) {
    							tween.totalDuration(); //could change the tween._startTime, so make sure the tween's cache is clean before analyzing it.
    						}
    						if (tween._startTime > prevStart && self._sortChildren && !tween._paused && !self._calculatingDuration) { //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
    							self._calculatingDuration = 1; //prevent endless recursive calls - there are methods that get triggered that check duration/totalDuration when we add(), like _parseTimeOrLabel().
    							self.add(tween, tween._startTime - tween._delay);
    							self._calculatingDuration = 0;
    						} else {
    							prevStart = tween._startTime;
    						}
    						if (tween._startTime < 0 && !tween._paused) { //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
    							max -= tween._startTime;
    							if (self._timeline.smoothChildTiming) {
    								self._startTime += tween._startTime / self._timeScale;
    								self._time -= tween._startTime;
    								self._totalTime -= tween._startTime;
    								self._rawPrevTime -= tween._startTime;
    							}
    							self.shiftChildren(-tween._startTime, false, -9999999999);
    							prevStart = 0;
    						}
    						end = tween._startTime + (tween._totalDuration / tween._timeScale);
    						if (end > max) {
    							max = end;
    						}
    						tween = prev;
    					}
    					self._duration = self._totalDuration = max;
    					self._dirty = false;
    				}
    				return this._totalDuration;
    			}
    			return (value && this.totalDuration()) ? this.timeScale(this._totalDuration / value) : this;
    		};

    		p.paused = function(value) {
    			if (value === false && this._paused) { //if there's a pause directly at the spot from where we're unpausing, skip it.
    				var tween = this._first;
    				while (tween) {
    					if (tween._startTime === this._time && tween.data === "isPause") {
    						tween._rawPrevTime = 0; //remember, _rawPrevTime is how zero-duration tweens/callbacks sense directionality and determine whether or not to fire. If _rawPrevTime is the same as _startTime on the next render, it won't fire.
    					}
    					tween = tween._next;
    				}
    			}
    			return Animation.prototype.paused.apply(this, arguments);
    		};

    		p.usesFrames = function() {
    			var tl = this._timeline;
    			while (tl._timeline) {
    				tl = tl._timeline;
    			}
    			return (tl === Animation._rootFramesTimeline);
    		};

    		p.rawTime = function(wrapRepeats) {
    			return (wrapRepeats && (this._paused || (this._repeat && this.time() > 0 && this.totalProgress() < 1))) ? this._totalTime % (this._duration + this._repeatDelay) : this._paused ? this._totalTime : (this._timeline.rawTime(wrapRepeats) - this._startTime) * this._timeScale;
    		};

    		return TimelineLite;

    	}, true);

    var TimelineLite = globals.TimelineLite;

    /*!
     * VERSION: 2.1.3
     * DATE: 2019-05-17
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
     * This work is subject to the terms at http://greensock.com/standard-license or for
     * Club GreenSock members, the software agreement that was issued with your membership.
     * 
     * @author: Jack Doyle, jack@greensock.com
     */

    _gsScope._gsDefine("TimelineMax", ["TimelineLite","TweenLite","easing.Ease"], function() {
    		
    		var TimelineMax = function(vars) {
    				TimelineLite.call(this, vars);
    				this._repeat = this.vars.repeat || 0;
    				this._repeatDelay = this.vars.repeatDelay || 0;
    				this._cycle = 0;
    				this._yoyo = !!this.vars.yoyo;
    				this._dirty = true;
    			},
    			_tinyNum = 0.00000001,
    			TweenLiteInternals = TweenLite._internals,
    			_lazyTweens = TweenLiteInternals.lazyTweens,
    			_lazyRender = TweenLiteInternals.lazyRender,
    			_globals = _gsScope._gsDefine.globals,
    			_easeNone = new Ease(null, null, 1, 0),
    			p = TimelineMax.prototype = new TimelineLite();

    		p.constructor = TimelineMax;
    		p.kill()._gc = false;
    		TimelineMax.version = "2.1.3";

    		p.invalidate = function() {
    			this._yoyo = !!this.vars.yoyo;
    			this._repeat = this.vars.repeat || 0;
    			this._repeatDelay = this.vars.repeatDelay || 0;
    			this._uncache(true);
    			return TimelineLite.prototype.invalidate.call(this);
    		};

    		p.addCallback = function(callback, position, params, scope) {
    			return this.add( TweenLite.delayedCall(0, callback, params, scope), position);
    		};

    		p.removeCallback = function(callback, position) {
    			if (callback) {
    				if (position == null) {
    					this._kill(null, callback);
    				} else {
    					var a = this.getTweensOf(callback, false),
    						i = a.length,
    						time = this._parseTimeOrLabel(position);
    					while (--i > -1) {
    						if (a[i]._startTime === time) {
    							a[i]._enabled(false, false);
    						}
    					}
    				}
    			}
    			return this;
    		};

    		p.removePause = function(position) {
    			return this.removeCallback(TimelineLite._internals.pauseCallback, position);
    		};

    		p.tweenTo = function(position, vars) {
    			vars = vars || {};
    			var copy = {ease:_easeNone, useFrames:this.usesFrames(), immediateRender:false, lazy:false},
    				Engine = (vars.repeat && _globals.TweenMax) || TweenLite,
    				duration, p, t;
    			for (p in vars) {
    				copy[p] = vars[p];
    			}
    			copy.time = this._parseTimeOrLabel(position);
    			duration = (Math.abs(Number(copy.time) - this._time) / this._timeScale) || 0.001;
    			t = new Engine(this, duration, copy);
    			copy.onStart = function() {
    				t.target.paused(true);
    				if (t.vars.time !== t.target.time() && duration === t.duration() && !t.isFromTo) { //don't make the duration zero - if it's supposed to be zero, don't worry because it's already initting the tween and will complete immediately, effectively making the duration zero anyway. If we make duration zero, the tween won't run at all.
    					t.duration( Math.abs( t.vars.time - t.target.time()) / t.target._timeScale ).render(t.time(), true, true); //render() right away to ensure that things look right, especially in the case of .tweenTo(0).
    				}
    				if (vars.onStart) { //in case the user had an onStart in the vars - we don't want to overwrite it.
    					vars.onStart.apply(vars.onStartScope || vars.callbackScope || t, vars.onStartParams || []); //don't use t._callback("onStart") or it'll point to the copy.onStart and we'll get a recursion error.
    				}
    			};
    			return t;
    		};

    		p.tweenFromTo = function(fromPosition, toPosition, vars) {
    			vars = vars || {};
    			fromPosition = this._parseTimeOrLabel(fromPosition);
    			vars.startAt = {onComplete:this.seek, onCompleteParams:[fromPosition], callbackScope:this};
    			vars.immediateRender = (vars.immediateRender !== false);
    			var t = this.tweenTo(toPosition, vars);
    			t.isFromTo = 1; //to ensure we don't mess with the duration in the onStart (we've got the start and end values here, so lock it in)
    			return t.duration((Math.abs( t.vars.time - fromPosition) / this._timeScale) || 0.001);
    		};

    		p.render = function(time, suppressEvents, force) {
    			if (this._gc) {
    				this._enabled(true, false);
    			}
    			var self = this,
    				prevTime = self._time,
    				totalDur = (!self._dirty) ? self._totalDuration : self.totalDuration(),
    				dur = self._duration,
    				prevTotalTime = self._totalTime,
    				prevStart = self._startTime,
    				prevTimeScale = self._timeScale,
    				prevRawPrevTime = self._rawPrevTime,
    				prevPaused = self._paused,
    				prevCycle = self._cycle,
    				tween, isComplete, next, callback, internalForce, cycleDuration, pauseTween, curTime, pauseTime;
    			if (prevTime !== self._time) { //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
    				time += self._time - prevTime;
    			}
    			if (time >= totalDur - _tinyNum && time >= 0) { //to work around occasional floating point math artifacts.
    				if (!self._locked) {
    					self._totalTime = totalDur;
    					self._cycle = self._repeat;
    				}
    				if (!self._reversed) { if (!self._hasPausedChild()) {
    					isComplete = true;
    					callback = "onComplete";
    					internalForce = !!self._timeline.autoRemoveChildren; //otherwise, if the animation is unpaused/activated after it's already finished, it doesn't get removed from the parent timeline.
    					if (self._duration === 0) { if ((time <= 0 && time >= -_tinyNum) || prevRawPrevTime < 0 || prevRawPrevTime === _tinyNum) { if (prevRawPrevTime !== time && self._first) {
    						internalForce = true;
    						if (prevRawPrevTime > _tinyNum) {
    							callback = "onReverseComplete";
    						}
    					} } }
    				} }
    				self._rawPrevTime = (self._duration || !suppressEvents || time || self._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
    				if (self._yoyo && (self._cycle & 1)) {
    					self._time = time = 0;
    				} else {
    					self._time = dur;
    					time = dur + 0.0001; //to avoid occasional floating point rounding errors - sometimes child tweens/timelines were not being fully completed (their progress might be 0.999999999999998 instead of 1 because when _time - tween._startTime is performed, floating point errors would return a value that was SLIGHTLY off). Try (999999999999.7 - 999999999999) * 1 = 0.699951171875 instead of 0.7. We cannot do less then 0.0001 because the same issue can occur when the duration is extremely large like 999999999999 in which case adding 0.00000001, for example, causes it to act like nothing was added.
    				}

    			} else if (time < _tinyNum) { //to work around occasional floating point math artifacts, round super small values to 0.
    				if (!self._locked) {
    					self._totalTime = self._cycle = 0;
    				}
    				self._time = 0;
    				if (time > -_tinyNum) {
    					time = 0;
    				}
    				if (prevTime !== 0 || (dur === 0 && prevRawPrevTime !== _tinyNum && (prevRawPrevTime > 0 || (time < 0 && prevRawPrevTime >= 0)) && !self._locked)) { //edge case for checking time < 0 && prevRawPrevTime >= 0: a zero-duration fromTo() tween inside a zero-duration timeline (yeah, very rare)
    					callback = "onReverseComplete";
    					isComplete = self._reversed;
    				}
    				if (time < 0) {
    					self._active = false;
    					if (self._timeline.autoRemoveChildren && self._reversed) {
    						internalForce = isComplete = true;
    						callback = "onReverseComplete";
    					} else if (prevRawPrevTime >= 0 && self._first) { //when going back beyond the start, force a render so that zero-duration tweens that sit at the very beginning render their start values properly. Otherwise, if the parent timeline's playhead lands exactly at this timeline's startTime, and then moves backwards, the zero-duration tweens at the beginning would still be at their end state.
    						internalForce = true;
    					}
    					self._rawPrevTime = time;
    				} else {
    					self._rawPrevTime = (dur || !suppressEvents || time || self._rawPrevTime === time) ? time : _tinyNum; //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline or tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect. We set the _rawPrevTime to be a precise tiny number to indicate this scenario rather than using another property/variable which would increase memory usage. This technique is less readable, but more efficient.
    					if (time === 0 && isComplete) { //if there's a zero-duration tween at the very beginning of a timeline and the playhead lands EXACTLY at time 0, that tween will correctly render its end values, but we need to keep the timeline alive for one more render so that the beginning values render properly as the parent's playhead keeps moving beyond the begining. Imagine obj.x starts at 0 and then we do tl.set(obj, {x:100}).to(obj, 1, {x:200}) and then later we tl.reverse()...the goal is to have obj.x revert to 0. If the playhead happens to land on exactly 0, without this chunk of code, it'd complete the timeline and remove it from the rendering queue (not good).
    						tween = self._first;
    						while (tween && tween._startTime === 0) {
    							if (!tween._duration) {
    								isComplete = false;
    							}
    							tween = tween._next;
    						}
    					}
    					time = 0; //to avoid occasional floating point rounding errors (could cause problems especially with zero-duration tweens at the very beginning of the timeline)
    					if (!self._initted) {
    						internalForce = true;
    					}
    				}

    			} else {
    				if (dur === 0 && prevRawPrevTime < 0) { //without this, zero-duration repeating timelines (like with a simple callback nested at the very beginning and a repeatDelay) wouldn't render the first time through.
    					internalForce = true;
    				}
    				self._time = self._rawPrevTime = time;
    				if (!self._locked) {
    					self._totalTime = time;
    					if (self._repeat !== 0) {
    						cycleDuration = dur + self._repeatDelay;
    						self._cycle = (self._totalTime / cycleDuration) >> 0; //originally _totalTime % cycleDuration but floating point errors caused problems, so I normalized it. (4 % 0.8 should be 0 but it gets reported as 0.79999999!)
    						if (self._cycle) { if (self._cycle === self._totalTime / cycleDuration && prevTotalTime <= time) {
    							self._cycle--; //otherwise when rendered exactly at the end time, it will act as though it is repeating (at the beginning)
    						} }
    						self._time = self._totalTime - (self._cycle * cycleDuration);
    						if (self._yoyo) { if (self._cycle & 1) {
    							self._time = dur - self._time;
    						} }
    						if (self._time > dur) {
    							self._time = dur;
    							time = dur + 0.0001; //to avoid occasional floating point rounding error
    						} else if (self._time < 0) {
    							self._time = time = 0;
    						} else {
    							time = self._time;
    						}
    					}
    				}
    			}

    			if (self._hasPause && !self._forcingPlayhead && !suppressEvents) {
    				time = self._time;
    				if (time > prevTime || (self._repeat && prevCycle !== self._cycle)) {
    					tween = self._first;
    					while (tween && tween._startTime <= time && !pauseTween) {
    						if (!tween._duration) { if (tween.data === "isPause" && !tween.ratio && !(tween._startTime === 0 && self._rawPrevTime === 0)) {
    							pauseTween = tween;
    						} }
    						tween = tween._next;
    					}
    				} else {
    					tween = self._last;
    					while (tween && tween._startTime >= time && !pauseTween) {
    						if (!tween._duration) { if (tween.data === "isPause" && tween._rawPrevTime > 0) {
    							pauseTween = tween;
    						} }
    						tween = tween._prev;
    					}
    				}
    				if (pauseTween) {
    					pauseTime = self._startTime + (self._reversed ? self._duration - pauseTween._startTime : pauseTween._startTime) / self._timeScale;
    					if (pauseTween._startTime < dur) {
    						self._time = self._rawPrevTime = time = pauseTween._startTime;
    						self._totalTime = time + (self._cycle * (self._totalDuration + self._repeatDelay));
    					}
    				}
    			}

    			if (self._cycle !== prevCycle) { if (!self._locked) {
    				/*
    				make sure children at the end/beginning of the timeline are rendered properly. If, for example,
    				a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
    				would get translated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
    				could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
    				we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
    				ensure that zero-duration tweens at the very beginning or end of the TimelineMax work.
    				*/
    				var backwards = (self._yoyo && (prevCycle & 1) !== 0),
    					wrap = (backwards === (self._yoyo && (self._cycle & 1) !== 0)),
    					recTotalTime = self._totalTime,
    					recCycle = self._cycle,
    					recRawPrevTime = self._rawPrevTime,
    					recTime = self._time;

    				self._totalTime = prevCycle * dur;
    				if (self._cycle < prevCycle) {
    					backwards = !backwards;
    				} else {
    					self._totalTime += dur;
    				}
    				self._time = prevTime; //temporarily revert _time so that render() renders the children in the correct order. Without this, tweens won't rewind correctly. We could arhictect things in a "cleaner" way by splitting out the rendering queue into a separate method but for performance reasons, we kept it all inside this method.

    				self._rawPrevTime = (dur === 0) ? prevRawPrevTime - 0.0001 : prevRawPrevTime;
    				self._cycle = prevCycle;
    				self._locked = true; //prevents changes to totalTime and skips repeat/yoyo behavior when we recursively call render()
    				prevTime = (backwards) ? 0 : dur;
    				self.render(prevTime, suppressEvents, (dur === 0));
    				if (!suppressEvents) { if (!self._gc) {
    					if (self.vars.onRepeat) {
    						self._cycle = recCycle; //in case the onRepeat alters the playhead or invalidates(), we shouldn't stay locked or use the previous cycle.
    						self._locked = false;
    						self._callback("onRepeat");
    					}
    				} }
    				if (prevTime !== self._time) { //in case there's a callback like onComplete in a nested tween/timeline that changes the playhead position, like via seek(), we should just abort.
    					return;
    				}
    				if (wrap) {
    					self._cycle = prevCycle; //if there's an onRepeat, we reverted this above, so make sure it's set properly again. We also unlocked in that scenario, so reset that too.
    					self._locked = true;
    					prevTime = (backwards) ? dur + 0.0001 : -0.0001;
    					self.render(prevTime, true, false);
    				}
    				self._locked = false;
    				if (self._paused && !prevPaused) { //if the render() triggered callback that paused this timeline, we should abort (very rare, but possible)
    					return;
    				}
    				self._time = recTime;
    				self._totalTime = recTotalTime;
    				self._cycle = recCycle;
    				self._rawPrevTime = recRawPrevTime;
    			} }

    			if ((self._time === prevTime || !self._first) && !force && !internalForce && !pauseTween) {
    				if (prevTotalTime !== self._totalTime) { if (self._onUpdate) { if (!suppressEvents) { //so that onUpdate fires even during the repeatDelay - as long as the totalTime changed, we should trigger onUpdate.
    					self._callback("onUpdate");
    				} } }
    				return;
    			} else if (!self._initted) {
    				self._initted = true;
    			}

    			if (!self._active) { if (!self._paused && self._totalTime !== prevTotalTime && time > 0) {
    				self._active = true;  //so that if the user renders the timeline (as opposed to the parent timeline rendering it), it is forced to re-render and align it with the proper time/frame on the next rendering cycle. Maybe the timeline already finished but the user manually re-renders it as halfway done, for example.
    			} }

    			if (prevTotalTime === 0) { if (self.vars.onStart) { if (self._totalTime !== 0 || !self._totalDuration) { if (!suppressEvents) {
    				self._callback("onStart");
    			} } } }

    			curTime = self._time;
    			if (curTime >= prevTime) {
    				tween = self._first;
    				while (tween) {
    					next = tween._next; //record it here because the value could change after rendering...
    					if (curTime !== self._time || (self._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
    						break;
    					} else if (tween._active || (tween._startTime <= self._time && !tween._paused && !tween._gc)) {
    						if (pauseTween === tween) {
    							self.pause();
    							self._pauseTime = pauseTime; //so that when we resume(), it's starting from exactly the right spot (the pause() method uses the rawTime for the parent, but that may be a bit too far ahead)
    						}
    						if (!tween._reversed) {
    							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
    						} else {
    							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
    						}
    					}
    					tween = next;
    				}
    			} else {
    				tween = self._last;
    				while (tween) {
    					next = tween._prev; //record it here because the value could change after rendering...
    					if (curTime !== self._time || (self._paused && !prevPaused)) { //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
    						break;
    					} else if (tween._active || (tween._startTime <= prevTime && !tween._paused && !tween._gc)) {
    						if (pauseTween === tween) {
    							pauseTween = tween._prev; //the linked list is organized by _startTime, thus it's possible that a tween could start BEFORE the pause and end after it, in which case it would be positioned before the pause tween in the linked list, but we should render it before we pause() the timeline and cease rendering. This is only a concern when going in reverse.
    							while (pauseTween && pauseTween.endTime() > self._time) {
    								pauseTween.render( (pauseTween._reversed ? pauseTween.totalDuration() - ((time - pauseTween._startTime) * pauseTween._timeScale) : (time - pauseTween._startTime) * pauseTween._timeScale), suppressEvents, force);
    								pauseTween = pauseTween._prev;
    							}
    							pauseTween = null;
    							self.pause();
    							self._pauseTime = pauseTime; //so that when we resume(), it's starting from exactly the right spot (the pause() method uses the rawTime for the parent, but that may be a bit too far ahead)
    						}
    						if (!tween._reversed) {
    							tween.render((time - tween._startTime) * tween._timeScale, suppressEvents, force);
    						} else {
    							tween.render(((!tween._dirty) ? tween._totalDuration : tween.totalDuration()) - ((time - tween._startTime) * tween._timeScale), suppressEvents, force);
    						}
    					}
    					tween = next;
    				}
    			}

    			if (self._onUpdate) { if (!suppressEvents) {
    				if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.
    					_lazyRender();
    				}
    				self._callback("onUpdate");
    			} }
    			if (callback) { if (!self._locked) { if (!self._gc) { if (prevStart === self._startTime || prevTimeScale !== self._timeScale) { if (self._time === 0 || totalDur >= self.totalDuration()) { //if one of the tweens that was rendered altered this timeline's startTime (like if an onComplete reversed the timeline), it probably isn't complete. If it is, don't worry, because whatever call altered the startTime would complete if it was necessary at the new time. The only exception is the timeScale property. Also check _gc because there's a chance that kill() could be called in an onUpdate
    				if (isComplete) {
    					if (_lazyTweens.length) { //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onComplete on a timeline that reports/checks tweened values.
    						_lazyRender();
    					}
    					if (self._timeline.autoRemoveChildren) {
    						self._enabled(false, false);
    					}
    					self._active = false;
    				}
    				if (!suppressEvents && self.vars[callback]) {
    					self._callback(callback);
    				}
    			} } } } }
    		};

    		p.getActive = function(nested, tweens, timelines) {
    			var a = [],
    				all = this.getChildren(nested || (nested == null), tweens || (nested == null), !!timelines),
    				cnt = 0,
    				l = all.length,
    				i, tween;
    			for (i = 0; i < l; i++) {
    				tween = all[i];
    				if (tween.isActive()) {
    					a[cnt++] = tween;
    				}
    			}
    			return a;
    		};


    		p.getLabelAfter = function(time) {
    			if (!time) { if (time !== 0) { //faster than isNan()
    				time = this._time;
    			} }
    			var labels = this.getLabelsArray(),
    				l = labels.length,
    				i;
    			for (i = 0; i < l; i++) {
    				if (labels[i].time > time) {
    					return labels[i].name;
    				}
    			}
    			return null;
    		};

    		p.getLabelBefore = function(time) {
    			if (time == null) {
    				time = this._time;
    			}
    			var labels = this.getLabelsArray(),
    				i = labels.length;
    			while (--i > -1) {
    				if (labels[i].time < time) {
    					return labels[i].name;
    				}
    			}
    			return null;
    		};

    		p.getLabelsArray = function() {
    			var a = [],
    				cnt = 0,
    				p;
    			for (p in this._labels) {
    				a[cnt++] = {time:this._labels[p], name:p};
    			}
    			a.sort(function(a,b) {
    				return a.time - b.time;
    			});
    			return a;
    		};

    		p.invalidate = function() {
    			this._locked = false; //unlock and set cycle in case invalidate() is called from inside an onRepeat
    			return TimelineLite.prototype.invalidate.call(this);
    		};


    //---- GETTERS / SETTERS -------------------------------------------------------------------------------------------------------

    		p.progress = function(value, suppressEvents) {
    			return (!arguments.length) ? (this._time / this.duration()) || 0 : this.totalTime( this.duration() * ((this._yoyo && (this._cycle & 1) !== 0) ? 1 - value : value) + (this._cycle * (this._duration + this._repeatDelay)), suppressEvents);
    		};

    		p.totalProgress = function(value, suppressEvents) {
    			return (!arguments.length) ? (this._totalTime / this.totalDuration()) || 0 : this.totalTime( this.totalDuration() * value, suppressEvents);
    		};

    		p.totalDuration = function(value) {
    			if (!arguments.length) {
    				if (this._dirty) {
    					TimelineLite.prototype.totalDuration.call(this); //just forces refresh
    					//Instead of Infinity, we use 999999999999 so that we can accommodate reverses.
    					this._totalDuration = (this._repeat === -1) ? 999999999999 : this._duration * (this._repeat + 1) + (this._repeatDelay * this._repeat);
    				}
    				return this._totalDuration;
    			}
    			return (this._repeat === -1 || !value) ? this : this.timeScale( this.totalDuration() / value );
    		};

    		p.time = function(value, suppressEvents) {
    			if (!arguments.length) {
    				return this._time;
    			}
    			if (this._dirty) {
    				this.totalDuration();
    			}
    			var duration = this._duration,
    				cycle = this._cycle,
    				cycleDur = cycle * (duration + this._repeatDelay);
    			if (value > duration) {
    				value = duration;
    			}
    			return this.totalTime((this._yoyo && (cycle & 1)) ? duration - value + cycleDur : this._repeat ? value + cycleDur : value, suppressEvents);
    		};

    		p.repeat = function(value) {
    			if (!arguments.length) {
    				return this._repeat;
    			}
    			this._repeat = value;
    			return this._uncache(true);
    		};

    		p.repeatDelay = function(value) {
    			if (!arguments.length) {
    				return this._repeatDelay;
    			}
    			this._repeatDelay = value;
    			return this._uncache(true);
    		};

    		p.yoyo = function(value) {
    			if (!arguments.length) {
    				return this._yoyo;
    			}
    			this._yoyo = value;
    			return this;
    		};

    		p.currentLabel = function(value) {
    			if (!arguments.length) {
    				return this.getLabelBefore(this._time + _tinyNum);
    			}
    			return this.seek(value, true);
    		};
    		
    		return TimelineMax;
    		
    	}, true);

    var TimelineMax = globals.TimelineMax;

    /*!
     * VERSION: 1.3.9
     * DATE: 2019-05-17
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
     * This work is subject to the terms at http://greensock.com/standard-license or for
     * Club GreenSock members, the software agreement that was issued with your membership.
     * 
     * @author: Jack Doyle, jack@greensock.com
     **/

    		var _RAD2DEG = 180 / Math.PI,
    			_r1 = [],
    			_r2 = [],
    			_r3 = [],
    			_corProps = {},
    			_globals = _gsScope._gsDefine.globals,
    			Segment = function(a, b, c, d) {
    				if (c === d) { //if c and d match, the final autoRotate value could lock at -90 degrees, so differentiate them slightly.
    					c = d - (d - b) / 1000000;
    				}
    				if (a === b) { //if a and b match, the starting autoRotate value could lock at -90 degrees, so differentiate them slightly.
    					b = a + (c - a) / 1000000;
    				}
    				this.a = a;
    				this.b = b;
    				this.c = c;
    				this.d = d;
    				this.da = d - a;
    				this.ca = c - a;
    				this.ba = b - a;
    			},
    			_correlate = ",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",
    			cubicToQuadratic = function(a, b, c, d) {
    				var q1 = {a:a},
    					q2 = {},
    					q3 = {},
    					q4 = {c:d},
    					mab = (a + b) / 2,
    					mbc = (b + c) / 2,
    					mcd = (c + d) / 2,
    					mabc = (mab + mbc) / 2,
    					mbcd = (mbc + mcd) / 2,
    					m8 = (mbcd - mabc) / 8;
    				q1.b = mab + (a - mab) / 4;
    				q2.b = mabc + m8;
    				q1.c = q2.a = (q1.b + q2.b) / 2;
    				q2.c = q3.a = (mabc + mbcd) / 2;
    				q3.b = mbcd - m8;
    				q4.b = mcd + (d - mcd) / 4;
    				q3.c = q4.a = (q3.b + q4.b) / 2;
    				return [q1, q2, q3, q4];
    			},
    			_calculateControlPoints = function(a, curviness, quad, basic, correlate) {
    				var l = a.length - 1,
    					ii = 0,
    					cp1 = a[0].a,
    					i, p1, p2, p3, seg, m1, m2, mm, cp2, qb, r1, r2, tl;
    				for (i = 0; i < l; i++) {
    					seg = a[ii];
    					p1 = seg.a;
    					p2 = seg.d;
    					p3 = a[ii+1].d;

    					if (correlate) {
    						r1 = _r1[i];
    						r2 = _r2[i];
    						tl = ((r2 + r1) * curviness * 0.25) / (basic ? 0.5 : _r3[i] || 0.5);
    						m1 = p2 - (p2 - p1) * (basic ? curviness * 0.5 : (r1 !== 0 ? tl / r1 : 0));
    						m2 = p2 + (p3 - p2) * (basic ? curviness * 0.5 : (r2 !== 0 ? tl / r2 : 0));
    						mm = p2 - (m1 + (((m2 - m1) * ((r1 * 3 / (r1 + r2)) + 0.5) / 4) || 0));
    					} else {
    						m1 = p2 - (p2 - p1) * curviness * 0.5;
    						m2 = p2 + (p3 - p2) * curviness * 0.5;
    						mm = p2 - (m1 + m2) / 2;
    					}
    					m1 += mm;
    					m2 += mm;

    					seg.c = cp2 = m1;
    					if (i !== 0) {
    						seg.b = cp1;
    					} else {
    						seg.b = cp1 = seg.a + (seg.c - seg.a) * 0.6; //instead of placing b on a exactly, we move it inline with c so that if the user specifies an ease like Back.easeIn or Elastic.easeIn which goes BEYOND the beginning, it will do so smoothly.
    					}

    					seg.da = p2 - p1;
    					seg.ca = cp2 - p1;
    					seg.ba = cp1 - p1;

    					if (quad) {
    						qb = cubicToQuadratic(p1, cp1, cp2, p2);
    						a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
    						ii += 4;
    					} else {
    						ii++;
    					}

    					cp1 = m2;
    				}
    				seg = a[ii];
    				seg.b = cp1;
    				seg.c = cp1 + (seg.d - cp1) * 0.4; //instead of placing c on d exactly, we move it inline with b so that if the user specifies an ease like Back.easeOut or Elastic.easeOut which goes BEYOND the end, it will do so smoothly.
    				seg.da = seg.d - seg.a;
    				seg.ca = seg.c - seg.a;
    				seg.ba = cp1 - seg.a;
    				if (quad) {
    					qb = cubicToQuadratic(seg.a, cp1, seg.c, seg.d);
    					a.splice(ii, 1, qb[0], qb[1], qb[2], qb[3]);
    				}
    			},
    			_parseAnchors = function(values, p, correlate, prepend) {
    				var a = [],
    					l, i, p1, p2, p3, tmp;
    				if (prepend) {
    					values = [prepend].concat(values);
    					i = values.length;
    					while (--i > -1) {
    						if (typeof( (tmp = values[i][p]) ) === "string") { if (tmp.charAt(1) === "=") {
    							values[i][p] = prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)); //accommodate relative values. Do it inline instead of breaking it out into a function for speed reasons
    						} }
    					}
    				}
    				l = values.length - 2;
    				if (l < 0) {
    					a[0] = new Segment(values[0][p], 0, 0, values[0][p]);
    					return a;
    				}
    				for (i = 0; i < l; i++) {
    					p1 = values[i][p];
    					p2 = values[i+1][p];
    					a[i] = new Segment(p1, 0, 0, p2);
    					if (correlate) {
    						p3 = values[i+2][p];
    						_r1[i] = (_r1[i] || 0) + (p2 - p1) * (p2 - p1);
    						_r2[i] = (_r2[i] || 0) + (p3 - p2) * (p3 - p2);
    					}
    				}
    				a[i] = new Segment(values[i][p], 0, 0, values[i+1][p]);
    				return a;
    			},
    			bezierThrough = function(values, curviness, quadratic, basic, correlate, prepend) {
    				var obj = {},
    					props = [],
    					first = prepend || values[0],
    					i, p, a, j, r, l, seamless, last;
    				correlate = (typeof(correlate) === "string") ? ","+correlate+"," : _correlate;
    				if (curviness == null) {
    					curviness = 1;
    				}
    				for (p in values[0]) {
    					props.push(p);
    				}
    				//check to see if the last and first values are identical (well, within 0.05). If so, make seamless by appending the second element to the very end of the values array and the 2nd-to-last element to the very beginning (we'll remove those segments later)
    				if (values.length > 1) {
    					last = values[values.length - 1];
    					seamless = true;
    					i = props.length;
    					while (--i > -1) {
    						p = props[i];
    						if (Math.abs(first[p] - last[p]) > 0.05) { //build in a tolerance of +/-0.05 to accommodate rounding errors.
    							seamless = false;
    							break;
    						}
    					}
    					if (seamless) {
    						values = values.concat(); //duplicate the array to avoid contaminating the original which the user may be reusing for other tweens
    						if (prepend) {
    							values.unshift(prepend);
    						}
    						values.push(values[1]);
    						prepend = values[values.length - 3];
    					}
    				}
    				_r1.length = _r2.length = _r3.length = 0;
    				i = props.length;
    				while (--i > -1) {
    					p = props[i];
    					_corProps[p] = (correlate.indexOf(","+p+",") !== -1);
    					obj[p] = _parseAnchors(values, p, _corProps[p], prepend);
    				}
    				i = _r1.length;
    				while (--i > -1) {
    					_r1[i] = Math.sqrt(_r1[i]);
    					_r2[i] = Math.sqrt(_r2[i]);
    				}
    				if (!basic) {
    					i = props.length;
    					while (--i > -1) {
    						if (_corProps[p]) {
    							a = obj[props[i]];
    							l = a.length - 1;
    							for (j = 0; j < l; j++) {
    								r = (a[j+1].da / _r2[j] + a[j].da / _r1[j]) || 0;
    								_r3[j] = (_r3[j] || 0) + r * r;
    							}
    						}
    					}
    					i = _r3.length;
    					while (--i > -1) {
    						_r3[i] = Math.sqrt(_r3[i]);
    					}
    				}
    				i = props.length;
    				j = quadratic ? 4 : 1;
    				while (--i > -1) {
    					p = props[i];
    					a = obj[p];
    					_calculateControlPoints(a, curviness, quadratic, basic, _corProps[p]); //this method requires that _parseAnchors() and _setSegmentRatios() ran first so that _r1, _r2, and _r3 values are populated for all properties
    					if (seamless) {
    						a.splice(0, j);
    						a.splice(a.length - j, j);
    					}
    				}
    				return obj;
    			},
    			_parseBezierData = function(values, type, prepend) {
    				type = type || "soft";
    				var obj = {},
    					inc = (type === "cubic") ? 3 : 2,
    					soft = (type === "soft"),
    					props = [],
    					a, b, c, d, cur, i, j, l, p, cnt, tmp;
    				if (soft && prepend) {
    					values = [prepend].concat(values);
    				}
    				if (values == null || values.length < inc + 1) { throw "invalid Bezier data"; }
    				for (p in values[0]) {
    					props.push(p);
    				}
    				i = props.length;
    				while (--i > -1) {
    					p = props[i];
    					obj[p] = cur = [];
    					cnt = 0;
    					l = values.length;
    					for (j = 0; j < l; j++) {
    						a = (prepend == null) ? values[j][p] : (typeof( (tmp = values[j][p]) ) === "string" && tmp.charAt(1) === "=") ? prepend[p] + Number(tmp.charAt(0) + tmp.substr(2)) : Number(tmp);
    						if (soft) { if (j > 1) { if (j < l - 1) {
    							cur[cnt++] = (a + cur[cnt-2]) / 2;
    						} } }
    						cur[cnt++] = a;
    					}
    					l = cnt - inc + 1;
    					cnt = 0;
    					for (j = 0; j < l; j += inc) {
    						a = cur[j];
    						b = cur[j+1];
    						c = cur[j+2];
    						d = (inc === 2) ? 0 : cur[j+3];
    						cur[cnt++] = tmp = (inc === 3) ? new Segment(a, b, c, d) : new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
    					}
    					cur.length = cnt;
    				}
    				return obj;
    			},
    			_addCubicLengths = function(a, steps, resolution) {
    				var inc = 1 / resolution,
    					j = a.length,
    					d, d1, s, da, ca, ba, p, i, inv, bez, index;
    				while (--j > -1) {
    					bez = a[j];
    					s = bez.a;
    					da = bez.d - s;
    					ca = bez.c - s;
    					ba = bez.b - s;
    					d = d1 = 0;
    					for (i = 1; i <= resolution; i++) {
    						p = inc * i;
    						inv = 1 - p;
    						d = d1 - (d1 = (p * p * da + 3 * inv * (p * ca + inv * ba)) * p);
    						index = j * resolution + i - 1;
    						steps[index] = (steps[index] || 0) + d * d;
    					}
    				}
    			},
    			_parseLengthData = function(obj, resolution) {
    				resolution = resolution >> 0 || 6;
    				var a = [],
    					lengths = [],
    					d = 0,
    					total = 0,
    					threshold = resolution - 1,
    					segments = [],
    					curLS = [], //current length segments array
    					p, i, l, index;
    				for (p in obj) {
    					_addCubicLengths(obj[p], a, resolution);
    				}
    				l = a.length;
    				for (i = 0; i < l; i++) {
    					d += Math.sqrt(a[i]);
    					index = i % resolution;
    					curLS[index] = d;
    					if (index === threshold) {
    						total += d;
    						index = (i / resolution) >> 0;
    						segments[index] = curLS;
    						lengths[index] = total;
    						d = 0;
    						curLS = [];
    					}
    				}
    				return {length:total, lengths:lengths, segments:segments};
    			},



    			BezierPlugin = _gsScope._gsDefine.plugin({
    					propName: "bezier",
    					priority: -1,
    					version: "1.3.9",
    					API: 2,
    					global:true,

    					//gets called when the tween renders for the first time. This is where initial values should be recorded and any setup routines should run.
    					init: function(target, vars, tween) {
    						this._target = target;
    						if (vars instanceof Array) {
    							vars = {values:vars};
    						}
    						this._func = {};
    						this._mod = {};
    						this._props = [];
    						this._timeRes = (vars.timeResolution == null) ? 6 : parseInt(vars.timeResolution, 10);
    						var values = vars.values || [],
    							first = {},
    							second = values[0],
    							autoRotate = vars.autoRotate || tween.vars.orientToBezier,
    							p, isFunc, i, j, prepend;

    						this._autoRotate = autoRotate ? (autoRotate instanceof Array) ? autoRotate : [["x","y","rotation",((autoRotate === true) ? 0 : Number(autoRotate) || 0)]] : null;
    						for (p in second) {
    							this._props.push(p);
    						}

    						i = this._props.length;
    						while (--i > -1) {
    							p = this._props[i];

    							this._overwriteProps.push(p);
    							isFunc = this._func[p] = (typeof(target[p]) === "function");
    							first[p] = (!isFunc) ? parseFloat(target[p]) : target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ]();
    							if (!prepend) { if (first[p] !== values[0][p]) {
    								prepend = first;
    							} }
    						}
    						this._beziers = (vars.type !== "cubic" && vars.type !== "quadratic" && vars.type !== "soft") ? bezierThrough(values, isNaN(vars.curviness) ? 1 : vars.curviness, false, (vars.type === "thruBasic"), vars.correlate, prepend) : _parseBezierData(values, vars.type, first);
    						this._segCount = this._beziers[p].length;

    						if (this._timeRes) {
    							var ld = _parseLengthData(this._beziers, this._timeRes);
    							this._length = ld.length;
    							this._lengths = ld.lengths;
    							this._segments = ld.segments;
    							this._l1 = this._li = this._s1 = this._si = 0;
    							this._l2 = this._lengths[0];
    							this._curSeg = this._segments[0];
    							this._s2 = this._curSeg[0];
    							this._prec = 1 / this._curSeg.length;
    						}

    						if ((autoRotate = this._autoRotate)) {
    							this._initialRotations = [];
    							if (!(autoRotate[0] instanceof Array)) {
    								this._autoRotate = autoRotate = [autoRotate];
    							}
    							i = autoRotate.length;
    							while (--i > -1) {
    								for (j = 0; j < 3; j++) {
    									p = autoRotate[i][j];
    									this._func[p] = (typeof(target[p]) === "function") ? target[ ((p.indexOf("set") || typeof(target["get" + p.substr(3)]) !== "function") ? p : "get" + p.substr(3)) ] : false;
    								}
    								p = autoRotate[i][2];
    								this._initialRotations[i] = (this._func[p] ? this._func[p].call(this._target) : this._target[p]) || 0;
    								this._overwriteProps.push(p);
    							}
    						}
    						this._startRatio = tween.vars.runBackwards ? 1 : 0; //we determine the starting ratio when the tween inits which is always 0 unless the tween has runBackwards:true (indicating it's a from() tween) in which case it's 1.
    						return true;
    					},

    					//called each time the values should be updated, and the ratio gets passed as the only parameter (typically it's a value between 0 and 1, but it can exceed those when using an ease like Elastic.easeOut or Back.easeOut, etc.)
    					set: function(v) {
    						var segments = this._segCount,
    							func = this._func,
    							target = this._target,
    							notStart = (v !== this._startRatio),
    							curIndex, inv, i, p, b, t, val, l, lengths, curSeg, v1;
    						if (!this._timeRes) {
    							curIndex = (v < 0) ? 0 : (v >= 1) ? segments - 1 : (segments * v) >> 0;
    							t = (v - (curIndex * (1 / segments))) * segments;
    						} else {
    							lengths = this._lengths;
    							curSeg = this._curSeg;
    							v1 = v * this._length;
    							i = this._li;
    							//find the appropriate segment (if the currently cached one isn't correct)
    							if (v1 > this._l2 && i < segments - 1) {
    								l = segments - 1;
    								while (i < l && (this._l2 = lengths[++i]) <= v1) {	}
    								this._l1 = lengths[i-1];
    								this._li = i;
    								this._curSeg = curSeg = this._segments[i];
    								this._s2 = curSeg[(this._s1 = this._si = 0)];
    							} else if (v1 < this._l1 && i > 0) {
    								while (i > 0 && (this._l1 = lengths[--i]) >= v1) { }
    								if (i === 0 && v1 < this._l1) {
    									this._l1 = 0;
    								} else {
    									i++;
    								}
    								this._l2 = lengths[i];
    								this._li = i;
    								this._curSeg = curSeg = this._segments[i];
    								this._s1 = curSeg[(this._si = curSeg.length - 1) - 1] || 0;
    								this._s2 = curSeg[this._si];
    							}
    							curIndex = i;
    							//now find the appropriate sub-segment (we split it into the number of pieces that was defined by "precision" and measured each one)
    							v1 -= this._l1;
    							i = this._si;
    							if (v1 > this._s2 && i < curSeg.length - 1) {
    								l = curSeg.length - 1;
    								while (i < l && (this._s2 = curSeg[++i]) <= v1) {	}
    								this._s1 = curSeg[i-1];
    								this._si = i;
    							} else if (v1 < this._s1 && i > 0) {
    								while (i > 0 && (this._s1 = curSeg[--i]) >= v1) {	}
    								if (i === 0 && v1 < this._s1) {
    									this._s1 = 0;
    								} else {
    									i++;
    								}
    								this._s2 = curSeg[i];
    								this._si = i;
    							}
    							t = (v === 1) ? 1 : ((i + (v1 - this._s1) / (this._s2 - this._s1)) * this._prec) || 0;
    						}
    						inv = 1 - t;

    						i = this._props.length;
    						while (--i > -1) {
    							p = this._props[i];
    							b = this._beziers[p][curIndex];
    							val = (t * t * b.da + 3 * inv * (t * b.ca + inv * b.ba)) * t + b.a;
    							if (this._mod[p]) {
    								val = this._mod[p](val, target);
    							}
    							if (func[p]) {
    								target[p](val);
    							} else {
    								target[p] = val;
    							}
    						}

    						if (this._autoRotate) {
    							var ar = this._autoRotate,
    								b2, x1, y1, x2, y2, add, conv;
    							i = ar.length;
    							while (--i > -1) {
    								p = ar[i][2];
    								add = ar[i][3] || 0;
    								conv = (ar[i][4] === true) ? 1 : _RAD2DEG;
    								b = this._beziers[ar[i][0]];
    								b2 = this._beziers[ar[i][1]];

    								if (b && b2) { //in case one of the properties got overwritten.
    									b = b[curIndex];
    									b2 = b2[curIndex];

    									x1 = b.a + (b.b - b.a) * t;
    									x2 = b.b + (b.c - b.b) * t;
    									x1 += (x2 - x1) * t;
    									x2 += ((b.c + (b.d - b.c) * t) - x2) * t;

    									y1 = b2.a + (b2.b - b2.a) * t;
    									y2 = b2.b + (b2.c - b2.b) * t;
    									y1 += (y2 - y1) * t;
    									y2 += ((b2.c + (b2.d - b2.c) * t) - y2) * t;

    									val = notStart ? Math.atan2(y2 - y1, x2 - x1) * conv + add : this._initialRotations[i];

    									if (this._mod[p]) {
    										val = this._mod[p](val, target); //for modProps
    									}

    									if (func[p]) {
    										target[p](val);
    									} else {
    										target[p] = val;
    									}
    								}
    							}
    						}
    					}
    			}),
    			p$1 = BezierPlugin.prototype;


    		BezierPlugin.bezierThrough = bezierThrough;
    		BezierPlugin.cubicToQuadratic = cubicToQuadratic;
    		BezierPlugin._autoCSS = true; //indicates that this plugin can be inserted into the "css" object using the autoCSS feature of TweenLite
    		BezierPlugin.quadraticToCubic = function(a, b, c) {
    			return new Segment(a, (2 * b + a) / 3, (2 * b + c) / 3, c);
    		};

    		BezierPlugin._cssRegister = function() {
    			var CSSPlugin = _globals.CSSPlugin;
    			if (!CSSPlugin) {
    				return;
    			}
    			var _internals = CSSPlugin._internals,
    				_parseToProxy = _internals._parseToProxy,
    				_setPluginRatio = _internals._setPluginRatio,
    				CSSPropTween = _internals.CSSPropTween;
    			_internals._registerComplexSpecialProp("bezier", {parser:function(t, e, prop, cssp, pt, plugin) {
    				if (e instanceof Array) {
    					e = {values:e};
    				}
    				plugin = new BezierPlugin();
    				var values = e.values,
    					l = values.length - 1,
    					pluginValues = [],
    					v = {},
    					i, p, data;
    				if (l < 0) {
    					return pt;
    				}
    				for (i = 0; i <= l; i++) {
    					data = _parseToProxy(t, values[i], cssp, pt, plugin, (l !== i));
    					pluginValues[i] = data.end;
    				}
    				for (p in e) {
    					v[p] = e[p]; //duplicate the vars object because we need to alter some things which would cause problems if the user plans to reuse the same vars object for another tween.
    				}
    				v.values = pluginValues;
    				pt = new CSSPropTween(t, "bezier", 0, 0, data.pt, 2);
    				pt.data = data;
    				pt.plugin = plugin;
    				pt.setRatio = _setPluginRatio;
    				if (v.autoRotate === 0) {
    					v.autoRotate = true;
    				}
    				if (v.autoRotate && !(v.autoRotate instanceof Array)) {
    					i = (v.autoRotate === true) ? 0 : Number(v.autoRotate);
    					v.autoRotate = (data.end.left != null) ? [["left","top","rotation",i,false]] : (data.end.x != null) ? [["x","y","rotation",i,false]] : false;
    				}
    				if (v.autoRotate) {
    					if (!cssp._transform) {
    						cssp._enableTransforms(false);
    					}
    					data.autoRotate = cssp._target._gsTransform;
    					data.proxy.rotation = data.autoRotate.rotation || 0;
    					cssp._overwriteProps.push("rotation");
    				}
    				plugin._onInitTween(data.proxy, v, cssp._tween);
    				return pt;
    			}});
    		};

    		p$1._mod = function(lookup) {
    			var op = this._overwriteProps,
    				i = op.length,
    				val;
    			while (--i > -1) {
    				val = lookup[op[i]];
    				if (val && typeof(val) === "function") {
    					this._mod[op[i]] = val;
    				}
    			}
    		};

    		p$1._kill = function(lookup) {
    			var a = this._props,
    				p, i;
    			for (p in this._beziers) {
    				if (p in lookup) {
    					delete this._beziers[p];
    					delete this._func[p];
    					i = a.length;
    					while (--i > -1) {
    						if (a[i] === p) {
    							a.splice(i, 1);
    						}
    					}
    				}
    			}
    			a = this._autoRotate;
    			if (a) {
    				i = a.length;
    				while (--i > -1) {
    					if (lookup[a[i][2]]) {
    						a.splice(i, 1);
    					}
    				}
    			}
    			return this._super._kill.call(this, lookup);
    		};

    /*!
     * VERSION: 1.16.1
     * DATE: 2018-08-27
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
     * This work is subject to the terms at http://greensock.com/standard-license or for
     * Club GreenSock members, the software agreement that was issued with your membership.
     * 
     * @author: Jack Doyle, jack@greensock.com
     **/

    _gsScope._gsDefine("easing.Back", ["easing.Ease"], function() {
    		
    		var w = (_gsScope.GreenSockGlobals || _gsScope),
    			gs = w.com.greensock,
    			_2PI = Math.PI * 2,
    			_HALF_PI = Math.PI / 2,
    			_class = gs._class,
    			_create = function(n, f) {
    				var C = _class("easing." + n, function(){}, true),
    					p = C.prototype = new Ease();
    				p.constructor = C;
    				p.getRatio = f;
    				return C;
    			},
    			_easeReg = Ease.register || function(){}, //put an empty function in place just as a safety measure in case someone loads an OLD version of TweenLite.js where Ease.register doesn't exist.
    			_wrap = function(name, EaseOut, EaseIn, EaseInOut, aliases) {
    				var C = _class("easing."+name, {
    					easeOut:new EaseOut(),
    					easeIn:new EaseIn(),
    					easeInOut:new EaseInOut()
    				}, true);
    				_easeReg(C, name);
    				return C;
    			},
    			EasePoint = function(time, value, next) {
    				this.t = time;
    				this.v = value;
    				if (next) {
    					this.next = next;
    					next.prev = this;
    					this.c = next.v - value;
    					this.gap = next.t - time;
    				}
    			},

    			//Back
    			_createBack = function(n, f) {
    				var C = _class("easing." + n, function(overshoot) {
    						this._p1 = (overshoot || overshoot === 0) ? overshoot : 1.70158;
    						this._p2 = this._p1 * 1.525;
    					}, true), 
    					p = C.prototype = new Ease();
    				p.constructor = C;
    				p.getRatio = f;
    				p.config = function(overshoot) {
    					return new C(overshoot);
    				};
    				return C;
    			},

    			Back = _wrap("Back",
    				_createBack("BackOut", function(p) {
    					return ((p = p - 1) * p * ((this._p1 + 1) * p + this._p1) + 1);
    				}),
    				_createBack("BackIn", function(p) {
    					return p * p * ((this._p1 + 1) * p - this._p1);
    				}),
    				_createBack("BackInOut", function(p) {
    					return ((p *= 2) < 1) ? 0.5 * p * p * ((this._p2 + 1) * p - this._p2) : 0.5 * ((p -= 2) * p * ((this._p2 + 1) * p + this._p2) + 2);
    				})
    			),


    			//SlowMo
    			SlowMo = _class("easing.SlowMo", function(linearRatio, power, yoyoMode) {
    				power = (power || power === 0) ? power : 0.7;
    				if (linearRatio == null) {
    					linearRatio = 0.7;
    				} else if (linearRatio > 1) {
    					linearRatio = 1;
    				}
    				this._p = (linearRatio !== 1) ? power : 0;
    				this._p1 = (1 - linearRatio) / 2;
    				this._p2 = linearRatio;
    				this._p3 = this._p1 + this._p2;
    				this._calcEnd = (yoyoMode === true);
    			}, true),
    			p = SlowMo.prototype = new Ease(),
    			SteppedEase, ExpoScaleEase, RoughEase, _createElastic;
    			
    		p.constructor = SlowMo;
    		p.getRatio = function(p) {
    			var r = p + (0.5 - p) * this._p;
    			if (p < this._p1) {
    				return this._calcEnd ? 1 - ((p = 1 - (p / this._p1)) * p) : r - ((p = 1 - (p / this._p1)) * p * p * p * r);
    			} else if (p > this._p3) {
    				return this._calcEnd ? (p === 1 ? 0 : 1 - (p = (p - this._p3) / this._p1) * p) : r + ((p - r) * (p = (p - this._p3) / this._p1) * p * p * p); //added p === 1 ? 0 to avoid floating point rounding errors from affecting the final value, like 1 - 0.7 = 0.30000000000000004 instead of 0.3
    			}
    			return this._calcEnd ? 1 : r;
    		};
    		SlowMo.ease = new SlowMo(0.7, 0.7);
    		
    		p.config = SlowMo.config = function(linearRatio, power, yoyoMode) {
    			return new SlowMo(linearRatio, power, yoyoMode);
    		};


    		//SteppedEase
    		SteppedEase = _class("easing.SteppedEase", function(steps, immediateStart) {
    				steps = steps || 1;
    				this._p1 = 1 / steps;
    				this._p2 = steps + (immediateStart ? 0 : 1);
    				this._p3 = immediateStart ? 1 : 0;
    			}, true);
    		p = SteppedEase.prototype = new Ease();	
    		p.constructor = SteppedEase;
    		p.getRatio = function(p) {
    			if (p < 0) {
    				p = 0;
    			} else if (p >= 1) {
    				p = 0.999999999;
    			}
    			return (((this._p2 * p) | 0) + this._p3) * this._p1;
    		};
    		p.config = SteppedEase.config = function(steps, immediateStart) {
    			return new SteppedEase(steps, immediateStart);
    		};


    		//ExpoScaleEase
    		ExpoScaleEase = _class("easing.ExpoScaleEase", function(start, end, ease) {
    			this._p1 = Math.log(end / start);
    			this._p2 = end - start;
    			this._p3 = start;
    			this._ease = ease;
    		}, true);
    		p = ExpoScaleEase.prototype = new Ease();
    		p.constructor = ExpoScaleEase;
    		p.getRatio = function(p) {
    			if (this._ease) {
    				p = this._ease.getRatio(p);
    			}
    			return (this._p3 * Math.exp(this._p1 * p) - this._p3) / this._p2;
    		};
    		p.config = ExpoScaleEase.config = function(start, end, ease) {
    			return new ExpoScaleEase(start, end, ease);
    		};


    		//RoughEase
    		RoughEase = _class("easing.RoughEase", function(vars) {
    			vars = vars || {};
    			var taper = vars.taper || "none",
    				a = [],
    				cnt = 0,
    				points = (vars.points || 20) | 0,
    				i = points,
    				randomize = (vars.randomize !== false),
    				clamp = (vars.clamp === true),
    				template = (vars.template instanceof Ease) ? vars.template : null,
    				strength = (typeof(vars.strength) === "number") ? vars.strength * 0.4 : 0.4,
    				x, y, bump, invX, obj, pnt;
    			while (--i > -1) {
    				x = randomize ? Math.random() : (1 / points) * i;
    				y = template ? template.getRatio(x) : x;
    				if (taper === "none") {
    					bump = strength;
    				} else if (taper === "out") {
    					invX = 1 - x;
    					bump = invX * invX * strength;
    				} else if (taper === "in") {
    					bump = x * x * strength;
    				} else if (x < 0.5) {  //"both" (start)
    					invX = x * 2;
    					bump = invX * invX * 0.5 * strength;
    				} else {				//"both" (end)
    					invX = (1 - x) * 2;
    					bump = invX * invX * 0.5 * strength;
    				}
    				if (randomize) {
    					y += (Math.random() * bump) - (bump * 0.5);
    				} else if (i % 2) {
    					y += bump * 0.5;
    				} else {
    					y -= bump * 0.5;
    				}
    				if (clamp) {
    					if (y > 1) {
    						y = 1;
    					} else if (y < 0) {
    						y = 0;
    					}
    				}
    				a[cnt++] = {x:x, y:y};
    			}
    			a.sort(function(a, b) {
    				return a.x - b.x;
    			});

    			pnt = new EasePoint(1, 1, null);
    			i = points;
    			while (--i > -1) {
    				obj = a[i];
    				pnt = new EasePoint(obj.x, obj.y, pnt);
    			}

    			this._prev = new EasePoint(0, 0, (pnt.t !== 0) ? pnt : pnt.next);
    		}, true);
    		p = RoughEase.prototype = new Ease();
    		p.constructor = RoughEase;
    		p.getRatio = function(p) {
    			var pnt = this._prev;
    			if (p > pnt.t) {
    				while (pnt.next && p >= pnt.t) {
    					pnt = pnt.next;
    				}
    				pnt = pnt.prev;
    			} else {
    				while (pnt.prev && p <= pnt.t) {
    					pnt = pnt.prev;
    				}
    			}
    			this._prev = pnt;
    			return (pnt.v + ((p - pnt.t) / pnt.gap) * pnt.c);
    		};
    		p.config = function(vars) {
    			return new RoughEase(vars);
    		};
    		RoughEase.ease = new RoughEase();


    		//Bounce
    		_wrap("Bounce",
    			_create("BounceOut", function(p) {
    				if (p < 1 / 2.75) {
    					return 7.5625 * p * p;
    				} else if (p < 2 / 2.75) {
    					return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
    				} else if (p < 2.5 / 2.75) {
    					return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
    				}
    				return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
    			}),
    			_create("BounceIn", function(p) {
    				if ((p = 1 - p) < 1 / 2.75) {
    					return 1 - (7.5625 * p * p);
    				} else if (p < 2 / 2.75) {
    					return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
    				} else if (p < 2.5 / 2.75) {
    					return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
    				}
    				return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
    			}),
    			_create("BounceInOut", function(p) {
    				var invert = (p < 0.5);
    				if (invert) {
    					p = 1 - (p * 2);
    				} else {
    					p = (p * 2) - 1;
    				}
    				if (p < 1 / 2.75) {
    					p = 7.5625 * p * p;
    				} else if (p < 2 / 2.75) {
    					p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
    				} else if (p < 2.5 / 2.75) {
    					p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
    				} else {
    					p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
    				}
    				return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
    			})
    		);


    		//CIRC
    		_wrap("Circ",
    			_create("CircOut", function(p) {
    				return Math.sqrt(1 - (p = p - 1) * p);
    			}),
    			_create("CircIn", function(p) {
    				return -(Math.sqrt(1 - (p * p)) - 1);
    			}),
    			_create("CircInOut", function(p) {
    				return ((p*=2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
    			})
    		);


    		//Elastic
    		_createElastic = function(n, f, def) {
    			var C = _class("easing." + n, function(amplitude, period) {
    					this._p1 = (amplitude >= 1) ? amplitude : 1; //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
    					this._p2 = (period || def) / (amplitude < 1 ? amplitude : 1);
    					this._p3 = this._p2 / _2PI * (Math.asin(1 / this._p1) || 0);
    					this._p2 = _2PI / this._p2; //precalculate to optimize
    				}, true),
    				p = C.prototype = new Ease();
    			p.constructor = C;
    			p.getRatio = f;
    			p.config = function(amplitude, period) {
    				return new C(amplitude, period);
    			};
    			return C;
    		};
    		_wrap("Elastic",
    			_createElastic("ElasticOut", function(p) {
    				return this._p1 * Math.pow(2, -10 * p) * Math.sin( (p - this._p3) * this._p2 ) + 1;
    			}, 0.3),
    			_createElastic("ElasticIn", function(p) {
    				return -(this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * this._p2 ));
    			}, 0.3),
    			_createElastic("ElasticInOut", function(p) {
    				return ((p *= 2) < 1) ? -0.5 * (this._p1 * Math.pow(2, 10 * (p -= 1)) * Math.sin( (p - this._p3) * this._p2)) : this._p1 * Math.pow(2, -10 *(p -= 1)) * Math.sin( (p - this._p3) * this._p2 ) * 0.5 + 1;
    			}, 0.45)
    		);


    		//Expo
    		_wrap("Expo",
    			_create("ExpoOut", function(p) {
    				return 1 - Math.pow(2, -10 * p);
    			}),
    			_create("ExpoIn", function(p) {
    				return Math.pow(2, 10 * (p - 1)) - 0.001;
    			}),
    			_create("ExpoInOut", function(p) {
    				return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
    			})
    		);


    		//Sine
    		_wrap("Sine",
    			_create("SineOut", function(p) {
    				return Math.sin(p * _HALF_PI);
    			}),
    			_create("SineIn", function(p) {
    				return -Math.cos(p * _HALF_PI) + 1;
    			}),
    			_create("SineInOut", function(p) {
    				return -0.5 * (Math.cos(Math.PI * p) - 1);
    			})
    		);

    		_class("easing.EaseLookup", {
    				find:function(s) {
    					return Ease.map[s];
    				}
    			}, true);

    		//register the non-standard eases
    		_easeReg(w.SlowMo, "SlowMo", "ease,");
    		_easeReg(RoughEase, "RoughEase", "ease,");
    		_easeReg(SteppedEase, "SteppedEase", "ease,");
    		
    		return Back;
    		
    	}, true);

    var Back = globals.Back;
    var Elastic = globals.Elastic;
    var Bounce = globals.Bounce;
    var RoughEase = globals.RoughEase;
    var SlowMo = globals.SlowMo;
    var SteppedEase = globals.SteppedEase;
    var Circ = globals.Circ;
    var Expo = globals.Expo;
    var Sine = globals.Sine;
    var ExpoScaleEase = globals.ExpoScaleEase;

    /*!
     * VERSION: 2.1.3
     * DATE: 2019-05-17
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2019, GreenSock. All rights reserved.
     * This work is subject to the terms at http://greensock.com/standard-license or for
     * Club GreenSock members, the software agreement that was issued with your membership.
     * 
     * @author: Jack Doyle, jack@greensock.com
     **/

    //the following two lines are designed to prevent tree shaking of the classes that were historically included with TweenMax (otherwise, folks would have to reference CSSPlugin, for example, to ensure their CSS-related animations worked)
    var TweenMax$1 = TweenMax;
    TweenMax$1._autoActivated = [TimelineLite, TimelineMax, CSSPlugin, AttrPlugin, BezierPlugin, RoundPropsPlugin, DirectionalRotationPlugin, Back, Elastic, Bounce, RoughEase, SlowMo, SteppedEase, Circ, Expo, Sine, ExpoScaleEase];

    var PageCurlExample = function PageCurlExample(app){
        this.app = app;
        this.app.example = this;

        var scene = new PIXI$1.Container();
        
        var pageContainer = new PIXI$1.Container();

        var intro = PIXI$1.Sprite.from(app.resources.intro.texture);
        pageContainer.addChild(intro);
            
        var nextPageContainer = new PIXI$1.Container();
        var page1 = PIXI$1.Sprite.from(app.resources.page1.texture);

        nextPageContainer.addChild(page1);

        scene.addChild(nextPageContainer);
        scene.addChild(pageContainer);

        var canvasWidth = intro.width/2;
        var canvasHeight = intro.height/2;

        var designW = intro.width;
        var desginH = intro.height;

        var viewW = desginH*canvasWidth/canvasHeight;
        var viewH = desginH;

        this.app.viewH = viewH;
        this.app.viewW = viewW;

        this.app.contentOffsetX = (viewW - designW)/2;

        scene.x = this.app.contentOffsetX;

        var w = this.app.viewW;
        var h = this.app.viewH;

        this.PrePage = false;

        var nextPageTexture = new  PIXI$1.Texture(page1.texture, new PIXI$1.Rectangle(0-this.app.contentOffsetX, 0 , this.app.viewW, this.app.viewH));
        var page2 = PIXI$1.Sprite.from(nextPageTexture);
        var newTexture = app.renderer.generateTexture(page2);

        var filter = new AmoyPageCurlFilter(0.0,0.0,0.0,0.0, newTexture, 0.05);
        filter.flipMode = this.PrePage;
        intro.filters =[filter];

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);

        app.renderer.resize(w, h);
        app.setAppViewAndRender(canvasWidth,canvasHeight);
        //ui
        this.app.exampleParamsFolderGui = this.app.gui.addFolder('Params');
        this.app.exampleParamsFolderGui.add(this, "PrePage").onChange(function(value) {
            // Fires on every change, drag, keypress, etc.
            this.PrePage = value;
            filter.flipMode = this.PrePage;
        });

        var midW = w/2;
        var midH = h/2;
        
        function onDragStart(event) {
            console.log("onDragStart");
            this.data = event.data;
            var newPosition = this.data.global;
            filter.startPosx = newPosition.x;
            filter.startPosy = newPosition.y;
            filter.radius = 0.04;
            filter.posx = newPosition.x;
            filter.posy = newPosition.y;

            console.log(filter.startPosx);
            console.log(filter.startPosy);
        }
        
        function onDragEnd() {
            this.data = null;
            var dx = filter.posx - filter.startPosx;
            if (dx < -200) {
                var tl = new TimelineLite();
                //减掉圆弧距离 radius为0 其实就是平面了
                tl.to(filter, .5, {startPosx: w, startPosy: midH, posx: midW, posy: midH, radius:0.00});
                tl.call(function () {
                    pageContainer.visible = false;
                });
            }
        }
        
        function onDragMove() {
            if(!Boolean(this.data)){
                return;
            }
            var newPosition = this.data.global;
            filter.posx = newPosition.x;
            filter.posy = newPosition.y;
            console.log("onDragMove");
            console.log(filter.posx);
            console.log(filter.posy);
        }

        pageContainer.interactive = true;
        pageContainer.on("pointerdown", onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointermove', onDragMove);
    };

    PageCurlExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var GameboyExample = function GameboyExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.gameboy.texture);
        pageContainer.addChild(pic);
            
        scene.addChild(pageContainer);
        
        var filter = new AmoyGameboyStyleFilter();
        pageContainer.filters =[filter];

        var w = pic.width;
        var h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);
    };

    GameboyExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var SnowExample = function SnowExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.snow.texture);
        pageContainer.addChild(pic);
            
        scene.addChild(pageContainer);
        
        var filter = new AmoySnowFilter(false, 0);
        pageContainer.filters =[filter];

        var w = pic.width;
        var h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);


        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.01;
        });

    };

    SnowExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var RainExample = function RainExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.rain1.texture);
        pageContainer.addChild(pic);
        pic.scale.set(.7);
            
        scene.addChild(pageContainer);
        
        var filter = new AmoyWeatherRainyFilter(0);
        pageContainer.filters =[filter];

        var w = pic.width;
        var h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);


        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.01;
        });

    };

    RainExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var LightSweepExample = function LightSweepExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.character_sweep.texture);
        pageContainer.addChild(pic);
            
        scene.addChild(pageContainer);
        
        var filter = new AmoyLightSweepFilter();
        pageContainer.filters =[filter];

        var w = pic.width;
        var h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.01;
        });
    };

    LightSweepExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var LensHaloExample = function LensHaloExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.lens_halo.texture);
        pageContainer.addChild(pic);
            
        scene.addChild(pageContainer);
        
        var w = pic.width;
        var h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        var filter = new AmoyLensHaloFilter(10., 10., 0);
        pageContainer.filters =[filter];

        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.02;
        });
    };

    LensHaloExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var CloudExample = function CloudExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic_bg = PIXI$1.Sprite.from(app.resources.cloud_bg.texture);
        pageContainer.addChild(pic_bg);

        var b = PIXI$1.Sprite.from(app.resources.bird.texture);
        b.scale.set(.35);
        pageContainer.addChild(b);

        var ball = PIXI$1.Sprite.from(app.resources.ball1.texture);//src
        pageContainer.addChild(ball);
        ball.blendMode = PIXI$1.BLEND_MODES.MULTIPLY;


        scene.addChild(pageContainer);

        var anim = new PIXI$1.AnimatedSprite([app.resources.bird.texture, app.resources.bird1.texture]);

        /*
         * An AnimatedSprite inherits all the properties of a PIXI sprite
         * so you can change its position, its anchor, mask it, etc
         */
        anim.x = pageContainer.width / 2;
        anim.y = pageContainer.height / 4;
        anim.scale.set(.2);

        anim.anchor.set(0.5);
        anim.animationSpeed = .05;
        anim.play();
        
        scene.addChild(anim);
        var w = pic_bg.width;
        var h = pic_bg.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        var filter = new AmoyWeatherCloudFilter();
        pic_bg.filters =[filter];

        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.02;
        });
    };

    CloudExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var InnerOutlineExample = function InnerOutlineExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.sword.texture);
        pageContainer.addChild(pic);
            
        scene.addChild(pageContainer);
        
        var w = pic.width;
        var h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        var filter = new AmoyInnerOutlineFilter();
        pageContainer.filters =[filter];

        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.02;
        });
    };

    InnerOutlineExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var Light2DExample = function Light2DExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.map.texture);
        pageContainer.addChild(pic);
            
        scene.addChild(pageContainer);
        
        var w = pic.width;
        var h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        var filter = new AmoyLight2dFilter(500., 400.);
        pageContainer.filters =[filter];
    };

    Light2DExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var FluidExample = function FluidExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();
        
        scene.addChild(pageContainer);
        
        var w = 1024;
        var h = 768;
        pageContainer.width = w;
        pageContainer.height = h;
        this.scene = scene;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        var filter2 = new PIXI$1.Filter(null, app.resources.waterfrag.data);
        filter2.uniforms.uTime=0.0;
            
        var filter= new AmoyFluidFilter();
        pageContainer.filters =[filter, filter2];
        this.filter = filter;

        app.events.on('animate', function() {
            filter2.uniforms.uTime +=0.02;
        });

        // //-----mattjs-------//
        var engine,
        world,
        boundaries = [],
        pixiCirles=[];


        function add_circles(nums) {
            for(var i=1; i< nums; i++){
                var c = PIXI$1.Sprite.from(app.resources.ball.texture);
                c.scale.set(2.0);
                // c.pivot = new PIXI.Point(.5, .5);
                var xx = (i%10)*20+50;
                var yy = 10+i*10;
                var b = new Matter.Bodies.circle(xx, yy, 20);

                Matter.World.add(world, [b]);
                if(i==1){ console.log(b.position.x); }
                pixiCirles.push({sprite:c, body:b});
                c.x = xx;
                c.y = yy;
                pageContainer.addChild(c);
            }
                
        }

        function updateWorld() {
            pixiCirles.forEach(function (circle, i) {
                // todo
                circle.sprite.x = circle.body.position.x;
                circle.sprite.y = circle.body.position.y;
            });
        }

        function setup() {
            //-------------------------------Matter
            engine = Matter.Engine.create();
            world = engine.world;
            Matter.Engine.run(engine);
            world.gravity.y = 9.8;
                
            Matter.World.clear(engine.world);

            // ------------------------------Boundaries
            boundaries.push(new Matter.Bodies.rectangle(-25, app.renderer.view.height/2, 50, app.renderer.view.height,{ isStatic: true }));
            boundaries.push(new Matter.Bodies.rectangle(app.renderer.view.width, app.renderer.view.height/2, 50, app.renderer.view.height,{ isStatic: true }));
            boundaries.push(new Matter.Bodies.rectangle(
            app.renderer.view.width/2,
            app.renderer.view.height,
            app.renderer.view.width,
            50,{ isStatic: true }));


            boundaries.forEach(function (element) {
                Matter.World.add(world, [element]);
            });


        // add mouse control
        var mouse = Matter.Mouse.create(app.renderer.view),
            mouseConstraint = Matter.MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        Matter.World.add(world, mouseConstraint);

        app.ticker.add(function () { return updateWorld(); });
        app.ticker.start();
        }

            
        setup();

        add_circles(200);
    };

    FluidExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var SparkExample = function SparkExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic_bg = PIXI$1.Sprite.from(app.resources.spark.texture);
        pageContainer.addChild(pic_bg);

            
        var cloud_cover = PIXI$1.Sprite.from(app.resources.cloud_cover.texture);
        pageContainer.addChild(cloud_cover);
        cloud_cover.x = 10;
        cloud_cover.y = 195;

        scene.addChild(pageContainer);

        var w = pic_bg.width;
        var h = pic_bg.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        var filter = new AmoySparksDriftingFilter(cloud_cover.height, cloud_cover.width/3 , 8);
        cloud_cover.filters =[filter];

        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.02;
        });
    };

    SparkExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var PixelVibrationExample = function PixelVibrationExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.gameboy.texture);
        pageContainer.addChild(pic);
            
        scene.addChild(pageContainer);
        
        var filter = new AmoyPixelVibrationFilter(10, 10);
        pageContainer.filters =[filter];

        var w = pic.width;
        var h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);
    };

    PixelVibrationExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var ReflectionExample = function ReflectionExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var bg = PIXI$1.Sprite.from(app.resources.floor.texture);
        pageContainer.addChild(bg);

        var pic1 = PIXI$1.Sprite.from(app.resources.ball1.texture);
        pageContainer.addChild(pic1);
        pic1.x = 150;
        pic1.y = 150;

        var pic = PIXI$1.Sprite.from(app.resources.ball1.texture);
        pageContainer.addChild(pic);
        pic.y = pic1.y+pic1.height-40;
        pic.x = pic1.x;
        pic.alpha = .6;

        scene.addChild(pageContainer);
        
        var filter = new AmoyReflectionFilter();
        pic.filters =[filter];

        var w = bg.width;
        var h = bg.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);
    };

    ReflectionExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var WaterReflectionExample = function WaterReflectionExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var house = PIXI$1.Sprite.from(app.resources.house.texture);
        pageContainer.addChild(house);

        scene.addChild(pageContainer);
        
        // let filter = new ReflectionFilter({boundary:.0});
        var filter = new AmoyWaterReflectionFilter(0.0, .9);
        house.filters =[filter];

        var w = house.width;
        var h = house.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.01;
        });
    };

    WaterReflectionExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var BloodSplashExample = function BloodSplashExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var fly = PIXI$1.Sprite.from(app.resources.bird_small.texture);
        fly.x = 150;
        fly.y = 150;
        pageContainer.addChild(fly);

        scene.addChild(pageContainer);

        
        var w = 400;
        var h = 400;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        var filter = new AmoyBloodSplashFilter(80, 50, 0, {r:1.0, g:0., b:0.});
        fly.filters =[filter];

        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.02;
        });
    };

    BloodSplashExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var CrossProcessingExample = function CrossProcessingExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.girl.texture);
        pageContainer.addChild(pic);
            
        scene.addChild(pageContainer);
        
        var w = pic.width;
        var h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        var filter = new PIXI$1.Filter(null, app.resources.shader.data, {
            crossSampler: app.resources.cross.texture,
        });
        pageContainer.filters =[filter];
    };

    CrossProcessingExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var MagnifyExample = function MagnifyExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.map.texture);
        pageContainer.addChild(pic);
            
        scene.addChild(pageContainer);
        
        var w = pic.width;
        var h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        var filter = new AmoyMagnifyFilter(500., 400., 2.0 , 80);
        pageContainer.filters =[filter];
        var iTime = 0.0;

        app.events.on('animate', function() {
            iTime++;
            filter.posx = 500 + 300*Math.sin(iTime*.02);
        });

    };

    MagnifyExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var FishEyeExample = function FishEyeExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.map.texture);
        pageContainer.addChild(pic);
            
        scene.addChild(pageContainer);
        
        var w = pic.width;
        var h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        var filter = new AmoyFishEyeFilter();
        pageContainer.filters =[filter];
    };

    FishEyeExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var BarrelDistortionExample = function BarrelDistortionExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.map.texture);
        pageContainer.addChild(pic);
            
        scene.addChild(pageContainer);

        var filter = new AmoyBarrelDistortionFilter(this.barrelPower);

        this.barrelPower = 1.5;
        //ui
        this.app.exampleParamsFolderGui = this.app.gui.addFolder('Params');
        this.app.exampleParamsFolderGui.add(this, "barrelPower", 0, 2.0).onChange(function(value) {
            // Fires on every change, drag, keypress, etc.
            this.barrelPower = value;
            filter.barrelPower = this.barrelPower;
        });

        
        var w = pic.width;
        var h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        pageContainer.filters =[filter];
    };

    BarrelDistortionExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var ClearBackgroundExample = function ClearBackgroundExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();
        scene.addChild(pageContainer);

        var pic_bg = PIXI$1.Sprite.from(app.resources.underwater.texture);
        pic_bg.scale.set(.8);
        pageContainer.addChild(pic_bg);

        // let texture = PIXI.Texture.from('assets/7023.mp4');

        var video = document.createElement("video");
        video.preload = "auto";
        video.loop = true;          // enable looping
        video.src = "assets/7023.mp4";
        video.autoplay = true;


        var fish = PIXI$1.Sprite.from(PIXI$1.Texture.from(video));
        fish.position.x =120;
        fish.position.y =120;
        pageContainer.addChild(fish);

        var w = pic_bg.width;
        var h = pic_bg.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w, h);

        var filter = new AmoyClearBackgroundFilter({r:0.0, g:0.58, b:0.17});
        filter.uniforms.uOffset = 10.0;
        fish.filters =[filter];

    };

    ClearBackgroundExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var WarholPhotoExample = function WarholPhotoExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.paopao.texture);
        pageContainer.addChild(pic);
        // pic.scale.set(.2)
            
        scene.addChild(pageContainer);
        
        var w = pic.width;
        var h = pic.height;

        this.scene = scene;


        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        var filter1 = new AmoyWarholFilter();

        pageContainer.filters =[filter1];
    };

    WarholPhotoExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };

    var ColorblindExample = function ColorblindExample(app){
        this.app = app;
        this.app.example = this;
            
        var scene = new PIXI$1.Container();

        var pageContainer = new PIXI$1.Container();

        var pic = PIXI$1.Sprite.from(app.resources.blind.texture);
        pageContainer.addChild(pic);
        // pic.scale.set(.2)
            
        scene.addChild(pageContainer);
        
        var w = pic.width;
        var h = pic.height;

        this.scene = scene;


        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        var filter1 = new AmoyColorblindFilter();

        pageContainer.filters =[filter1];
    };

    ColorblindExample.prototype.destroy = function destroy (){
        this.scene.parent.removeChild(this.scene);
    };



    var examples = /*#__PURE__*/Object.freeze({
        __proto__: null,
        PageCurlExample: PageCurlExample,
        GameboyExample: GameboyExample,
        SnowExample: SnowExample,
        RainExample: RainExample,
        LightSweepExample: LightSweepExample,
        LensHaloExample: LensHaloExample,
        CloudExample: CloudExample,
        InnerOutlineExample: InnerOutlineExample,
        Light2DExample: Light2DExample,
        FluidExample: FluidExample,
        SparkExample: SparkExample,
        PixelVibrationExample: PixelVibrationExample,
        ReflectionExample: ReflectionExample,
        WaterReflectionExample: WaterReflectionExample,
        BloodSplashExample: BloodSplashExample,
        CrossProcessingExample: CrossProcessingExample,
        MagnifyExample: MagnifyExample,
        FishEyeExample: FishEyeExample,
        BarrelDistortionExample: BarrelDistortionExample,
        ClearBackgroundExample: ClearBackgroundExample,
        WarholPhotoExample: WarholPhotoExample,
        ColorblindExample: ColorblindExample
    });

    var EXAMPLES = [];
    for (var i in examples) {
        EXAMPLES.push(examples[i]);
    }

    var app = new ExampleApplication(EXAMPLES);
    var manifest = [
        { name: 'intro', url: 'assets/xiaoHongMao_intro.jpg' },
        { name: 'page1', url: 'assets/xiaoJinGang_page1.jpg' },
        { name: 'gameboy', url: 'assets/gameboy.jpeg' },
        { name: 'snow', url: 'assets/snow.jpg' },
        { name: 'rain', url: 'assets/rainny.jpeg' },
        { name: 'rain1', url: 'assets/rainny1.jpg' },
        { name: 'character_sweep', url: 'assets/character-sweep.png' },
        { name: 'lens_halo', url: 'assets/lens-halo.jpg' },
        { name: 'cloud_bg', url: 'assets/cloud.jpg' },
        { name: 'cloud_cover', url: 'assets/cloud_cover.png' },
        { name: 'bird', url: 'assets/frame-1.png' },
        { name: 'bird1', url: 'assets/frame-2.png' },
        { name: 'sword', url: 'assets/sword.png' },
        { name: 'map', url: 'assets/gamemap.jpg' },
        { name: 'ball', url: 'assets/ball.png' },
        { name: 'spark', url: 'assets/sparks.jpg' },
        { name: 'ball1', url: 'assets/ball1.png' },
        { name: 'floor', url: 'assets/floor.jpeg' },
        { name: 'house', url: 'assets/house.jpg' },
        { name: 'bird_small', url: 'assets/bird.png' },
        {name: 'shader', url:'assets/cross_process.frag'},
        {name: 'waterfrag', url:'assets/watermaterial.frag'},
        {name:"cross", url:'assets/cross_processing.png'},
        {name:"girl", url:'assets/girl.jpg'},
        {name:"underwater", url:'assets/underwater.jpg'},
        {name:"p17", url:'assets/17.png'},
        {name:"gp17", url:'assets/gray_png_17.png'},
        {name:"paopao", url:'assets/paopao5.jpeg'},
        {name:"blind", url:'assets/blind_bg.jpeg'} ];


    // Load resources then add filters
    app.load(manifest, function () {
        app.startExample();
    });

}(PIXI, PIXI));
//# sourceMappingURL=index.js.map
