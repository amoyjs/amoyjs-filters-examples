import * as PIXI from 'pixi.js';
import {AmoyLight2dFilter} from '@amoy/filters';

export default class CrossProcessingExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();

        let pic = PIXI.Sprite.from(app.resources.girl.texture);
        pageContainer.addChild(pic);
        
        scene.addChild(pageContainer);
    
        let w = pic.width;
        let h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        let filter = new PIXI.Filter(null, app.resources.shader.data, {
            crossSampler: app.resources.cross.texture,
        });
        pageContainer.filters =[filter];
    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}