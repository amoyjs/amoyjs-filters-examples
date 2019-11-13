import * as PIXI from 'pixi.js';
import {AmoyPageCurlFilter, AmoyGameboyStyleFilter} from '@amoy/filters';
import {TimelineLite} from "gsap/TweenMax";
import { appendFileSync } from 'fs';

export default class PageCurlExample {

    constructor(app){
        this.app = app
        this.app.example = this;

        let scene = new PIXI.Container();
    
        let pageContainer = new PIXI.Container()

        let intro = PIXI.Sprite.from(app.resources.intro.texture)
        pageContainer.addChild(intro)
        
        let nextPageContainer = new PIXI.Container()
        let page1 = PIXI.Sprite.from(app.resources.page1.texture)

        nextPageContainer.addChild(page1)

        scene.addChild(nextPageContainer)
        scene.addChild(pageContainer)

        const canvasWidth = intro.width/2;
        const canvasHeight = intro.height/2;

        let designW = intro.width;
        let desginH = intro.height;

        let viewW = desginH*canvasWidth/canvasHeight;
        let viewH = desginH;

        this.app.viewH = viewH;
        this.app.viewW = viewW;

        this.app.contentOffsetX = (viewW - designW)/2;

        scene.x = this.app.contentOffsetX;

        let w = this.app.viewW;
        let h = this.app.viewH;

        this.PrePage = false;

        let nextPageTexture = new  PIXI.Texture(page1.texture, new PIXI.Rectangle(0-this.app.contentOffsetX, 0 , this.app.viewW, this.app.viewH));
        let page2 = PIXI.Sprite.from(nextPageTexture);
        let newTexture = app.renderer.generateTexture(page2);

        let filter = new AmoyPageCurlFilter(0.0,0.0,0.0,0.0, newTexture, 0.05)
        filter.flipMode = this.PrePage;
        intro.filters =[filter]

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);

        app.renderer.resize(w, h);
        app.setAppViewAndRender(canvasWidth,canvasHeight);
        //ui
        this.app.exampleParamsFolderGui = this.app.gui.addFolder('Params');
        this.app.exampleParamsFolderGui.add(this, "PrePage").onChange(function(value) {
            // Fires on every change, drag, keypress, etc.
            this.PrePage = value;
            filter.flipMode = this.PrePage;
        });

        let midW = w/2
        let midH = h/2

        function calculatePosx(pointerX) {
            // return pointerX
            let m = midW - filter.radius * w;
            return ((w-m)/(w*w)) * Math.pow(pointerX, 2) + m
        }

        function calculatePosy(pointerY) {
            // return pointerY
            let m = midH
            return ((w-m)/(w*w)) * Math.pow(pointerY, 2) + m
        }
    
        function onDragStart(event) {
            console.log("onDragStart")
            this.data = event.data
            const newPosition = this.data.global
            filter.startPosx = newPosition.x
            filter.startPosy = newPosition.y
            filter.radius = 0.04;
            filter.posx = newPosition.x
            filter.posy = newPosition.y

            console.log(filter.startPosx)
            console.log(filter.startPosy)
        }
    
        function onDragEnd() {
            this.data = null
            let dx = filter.posx - filter.startPosx
            if (dx < -200) {
                let tl = new TimelineLite()
                //减掉圆弧距离 radius为0 其实就是平面了
                tl.to(filter, .5, {startPosx: w, startPosy: midH, posx: midW, posy: midH, radius:0.00})
                tl.call(() => {
                    pageContainer.visible = false
                })
            }
        }
    
        function onDragMove() {
            if(!Boolean(this.data)){
                return;
            }
            const newPosition = this.data.global
            filter.posx = newPosition.x
            filter.posy = newPosition.y
            console.log("onDragMove")
            console.log(filter.posx)
            console.log(filter.posy)
        }

        pageContainer.interactive = true
        pageContainer.on("pointerdown", onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointermove', onDragMove)
    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}