import * as PIXI from 'pixi.js';
import {AmoyLensHaloFilter} from '@amoy/filters';

export default class LensHaloExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();

        let pic = PIXI.Sprite.from(app.resources.lens_halo.texture);
        pageContainer.addChild(pic);
        
        scene.addChild(pageContainer);
    
        let w = pic.width;
        let h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        let filter = new AmoyLensHaloFilter(10., 10., 0);
        pageContainer.filters =[filter];

        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.02;
        });
    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}