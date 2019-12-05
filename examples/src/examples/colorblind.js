import * as PIXI from 'pixi.js';
import {AmoyColorblindFilter} from '@amoy/filters';

export default class ColorblindExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();

        let pic = PIXI.Sprite.from(app.resources.blind.texture);
        pageContainer.addChild(pic);
        // pic.scale.set(.2)
        
        scene.addChild(pageContainer);
    
        let w = pic.width;
        let h = pic.height;

        this.scene = scene;


        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        let filter1 = new AmoyColorblindFilter();

        pageContainer.filters =[filter1];
    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}