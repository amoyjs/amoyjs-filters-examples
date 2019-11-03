import * as PIXI from 'pixi.js';
import {AmoyPageCurlFilter, AmoyGameboyStyleFilter} from '@amoy/filters';
import {TimelineLite} from "gsap/TweenMax";
import { appendFileSync } from 'fs';

export default class PageCurlExample {

    constructor(app){
        this.app = app
        this.app.example = this;
        
        let scene = new PIXI.Container();
        scene.x = this.app.contentOffsetX;

        let pageContainer = new PIXI.Container()

        let intro = PIXI.Sprite.from(app.resources.intro.texture)
        pageContainer.addChild(intro)
        
        let nextPageContainer = new PIXI.Container()
        let page1 = PIXI.Sprite.from(app.resources.page1.texture)

        nextPageContainer.addChild(page1)

        scene.addChild(nextPageContainer)
        scene.addChild(pageContainer)

        let w = intro.width;
        let h = intro.height;

        let nextPageTexture = PIXI.Texture.from(app.resources.page1.texture.baseTexture);
        nextPageTexture.frame = new PIXI.Rectangle(this.app.contentOffsetX, 0 , this.app.viewW, this.app.viewH);

        let filter = new AmoyPageCurlFilter(0.0,0.0,0.0,0.0, nextPageTexture, 0.05)
        
        intro.filters =[filter]

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);

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
            const newPosition = this.data.getLocalPosition(this.parent)
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
            filter.uniforms.filterArea = new PIXI.Rectangle(250, 50, w-250, h-150);
            const newPosition = this.data.getLocalPosition(this.parent)
            filter.posx = newPosition.x
            filter.posy = newPosition.y
            console.log("onDragMove")
            console.log(filter.posx)
            console.log(filter.posy)
        }

        intro.interactive = true
        intro.on("pointerdown", onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointermove', onDragMove)
    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}