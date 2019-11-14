import * as PIXI from 'pixi.js';
import {AmoySparksDriftingFilter} from '@amoy/filters';

export default class SparkExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();

        let pic_bg = PIXI.Sprite.from(app.resources.spark.texture);
        pageContainer.addChild(pic_bg);

        
        let cloud_cover = PIXI.Sprite.from(app.resources.cloud_cover.texture);
        pageContainer.addChild(cloud_cover);
        cloud_cover.x = 10;
        cloud_cover.y = 195;

        scene.addChild(pageContainer);

        let w = pic_bg.width;
        let h = pic_bg.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        let filter = new AmoySparksDriftingFilter(cloud_cover.height, cloud_cover.width/3 , 8);
        cloud_cover.filters =[filter];

        app.events.on('animate', function() {
            filter.uniforms.uTime += 0.02;
        });
    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}