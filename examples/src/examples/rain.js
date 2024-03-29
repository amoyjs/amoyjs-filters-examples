import * as PIXI from 'pixi.js';
import {AmoyWeatherRainyFilter} from '@amoy/filters';

export default class RainExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();

        let pic = PIXI.Sprite.from(app.resources.rain1.texture);
        pageContainer.addChild(pic);
        pic.scale.set(.7)
        
        scene.addChild(pageContainer);
    
        let filter = new AmoyWeatherRainyFilter(0);
        pageContainer.filters =[filter];

        let w = pic.width;
        let h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);


        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.01;
        });

    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}