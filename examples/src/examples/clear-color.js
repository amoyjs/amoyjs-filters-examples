import * as PIXI from 'pixi.js';
import {AmoyClearBackgroundFilter} from '@amoy/filters';

export default class ClearBackgroundExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();
        scene.addChild(pageContainer);

        let pic_bg = PIXI.Sprite.from(app.resources.underwater.texture);
        pic_bg.scale.set(.8);
        pageContainer.addChild(pic_bg);

        // let texture = PIXI.Texture.from('assets/7023.mp4');


        var video = document.createElement("video");
        video.preload = "auto";
        video.loop = true;              // enable looping
        video.src = "assets/7023.mp4";
        video.autoplay = true;


        let fish = PIXI.Sprite.from(PIXI.Texture.from(video));
        fish.position.x =120;
        fish.position.y =120;
        pageContainer.addChild(fish);

        let w = pic_bg.width;
        let h = pic_bg.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w, h);

        let filter = new AmoyClearBackgroundFilter({r:0.0, g:0.58, b:0.17});
        filter.uniforms.uOffset = 10.0;
        fish.filters =[filter];

    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}