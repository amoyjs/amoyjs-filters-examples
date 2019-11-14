import * as PIXI from 'pixi.js';
import {AmoyReflectionFilter} from '@amoy/filters';

export default class ReflectionExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();

        let bg = PIXI.Sprite.from(app.resources.floor.texture);
        pageContainer.addChild(bg);

        let pic1 = PIXI.Sprite.from(app.resources.ball1.texture);
        pageContainer.addChild(pic1);
        pic1.x = 150;
        pic1.y = 150;

        let pic = PIXI.Sprite.from(app.resources.ball1.texture);
        pageContainer.addChild(pic);
        pic.y = pic1.y+pic1.height-40;
        pic.x = pic1.x;
        pic.alpha = .6;

        scene.addChild(pageContainer);
    
        let filter = new AmoyReflectionFilter();
        pic.filters =[filter];

        let w = bg.width;
        let h = bg.height;

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