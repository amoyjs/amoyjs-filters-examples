import * as PIXI from 'pixi.js';
import {AmoyLightSweepFilter} from '@amoy/filters';

export default class LightSweepExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();

        let pic = PIXI.Sprite.from(app.resources.character_sweep.texture);
        pageContainer.addChild(pic);
        
        scene.addChild(pageContainer);
    
        let filter = new AmoyLightSweepFilter();
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