import * as PIXI from 'pixi.js';
import {AmoyMagnifyFilter} from '@amoy/filters';

export default class MagnifyExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();

        let pic = PIXI.Sprite.from(app.resources.map.texture);
        pageContainer.addChild(pic);
        
        scene.addChild(pageContainer);
    
        let w = pic.width;
        let h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        let filter = new AmoyMagnifyFilter(500., 400., 2.0 , 80);
        pageContainer.filters =[filter];
        let iTime = 0.0;

        app.events.on('animate', function() {
            iTime++;
            filter.posx = 500 + 300*Math.sin(iTime*.02);
        });

    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}