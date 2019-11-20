import * as PIXI from 'pixi.js';
import {AmoyWeatherCloudFilter} from '@amoy/filters';

export default class CloudExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();

        let pic_bg = PIXI.Sprite.from(app.resources.cloud_bg.texture);
        pageContainer.addChild(pic_bg);

        scene.addChild(pageContainer);

        const anim = new PIXI.AnimatedSprite([app.resources.bird.texture, app.resources.bird1.texture]);

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
        let w = pic_bg.width;
        let h = pic_bg.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        let filter = new AmoyWeatherCloudFilter();
        pic_bg.filters =[filter];

        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.02;
        });
    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}