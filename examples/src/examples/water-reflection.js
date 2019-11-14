import * as PIXI from 'pixi.js';
import {ReflectionFilter} from '@pixi/filter-reflection'
import {AmoyWaterReflectionFilter} from '@amoy/filters';

export default class WaterReflectionExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();

        let house = PIXI.Sprite.from(app.resources.house.texture);
        pageContainer.addChild(house);

        scene.addChild(pageContainer);
    
        // let filter = new ReflectionFilter({boundary:.0});
        let filter = new AmoyWaterReflectionFilter(0.0, .9);
        house.filters =[filter];

        let w = house.width;
        let h = house.height;

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