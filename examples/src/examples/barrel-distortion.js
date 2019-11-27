import * as PIXI from 'pixi.js';
import {AmoyBarrelDistortionFilter} from '@amoy/filters';

export default class BarrelDistortionExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();

        let pic = PIXI.Sprite.from(app.resources.map.texture);
        pageContainer.addChild(pic);
        
        scene.addChild(pageContainer);

        let filter = new AmoyBarrelDistortionFilter(this.barrelPower);

        this.barrelPower = 1.5;
        //ui
        this.app.exampleParamsFolderGui = this.app.gui.addFolder('Params');
        this.app.exampleParamsFolderGui.add(this, "barrelPower", 0, 2.0).onChange(function(value) {
            // Fires on every change, drag, keypress, etc.
            this.barrelPower = value;
            filter.barrelPower = this.barrelPower;
        });

    
        let w = pic.width;
        let h = pic.height;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        pageContainer.filters =[filter];
    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}