
import * as PIXI from 'pixi.js';
import {AmoyBloodSplashFilter} from '@amoy/filters';

export default class BloodSplashExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();

        let fly = PIXI.Sprite.from(app.resources.bird_small.texture);
        fly.x = 150;
        fly.y = 150;
        pageContainer.addChild(fly);

        scene.addChild(pageContainer);

    
        let w = 400;
        let h = 400;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        let filter = new AmoyBloodSplashFilter(80, 50, 0, {r:1.0, g:0., b:0.});
        fly.filters =[filter];

        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.02;
        });
    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}