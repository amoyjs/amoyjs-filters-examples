import * as PIXI from 'pixi.js';
import {AmoyPixelVibrationFilter} from '@amoy/filters';

export default class PixelVibrationExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();

        let pic = PIXI.Sprite.from(app.resources.gameboy.texture);
        pageContainer.addChild(pic);
        
        scene.addChild(pageContainer);
    
        let filter = new AmoyPixelVibrationFilter(10, 10);
        pageContainer.filters =[filter];

        let w = pic.width;
        let h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);
    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}