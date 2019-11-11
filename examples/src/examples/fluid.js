import * as PIXI from 'pixi.js';
import {AmoyLight2dFilter} from '@amoy/filters';

export default class FluidExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();
        
        scene.addChild(pageContainer);
    
        let w = 1024;
        let h = 768;

        this.scene = scene;
        this.filter = filter;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        let filter = new PIXI.filters.BlurFilter(15, 4);
        let cfilter = new PIXI.filters.ColorMatrixFilter();
        cfilter.matrix = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 100, -12];
        pageContainer.filters =[filter, cfilter];

        // //-----mattjs-------//
        let engine,
        world,
        boundaries = [],
        pixiCirles=[];


        function add_circles(nums) {
            for(var i=1; i< nums; i++){
                let c = PIXI.Sprite.from(app.resources.ball.texture);
                // c.scale.set(.5);
                let b = new Matter.Bodies.circle((i%10)*20+50, 10, 10)
                // b.velocity = {x:0, y:1};
                // b.mass = 1.9;
                Matter.World.add(world, [b]);
                if(i==1)console.log(b.position.x);
                pixiCirles.push({sprite:c, body:b});
                // circles.push(b);
                pageContainer.addChild(c);
            }
            
        }

        function updateWorld() {
            pixiCirles.forEach((circle, i) => {
                // todo
                circle.sprite.x = circle.body.position.x;
                if(i==1){
                    console.log(circle.body.position.x);
                }
          
                circle.sprite.y = circle.body.position.y;
            });
        }

        function setup() {
            //-------------------------------Matter
            engine = Matter.Engine.create();
            world = engine.world;
            Matter.Engine.run(engine);
            world.gravity.y = 9.8;
            
            Matter.World.clear(engine.world);

            // ------------------------------Boundaries
            boundaries.push(new Matter.Bodies.rectangle(-25, app.renderer.view.height/2, 50, app.renderer.view.height,{ isStatic: true }));
            boundaries.push(new Matter.Bodies.rectangle(app.renderer.view.width, app.renderer.view.height/2, 50, app.renderer.view.height,{ isStatic: true }));
            boundaries.push(new Matter.Bodies.rectangle(
            app.renderer.view.width/2,
            app.renderer.view.height,
            app.renderer.view.width,
            50,{ isStatic: true }));


            boundaries.forEach(element => {
                Matter.World.add(world, [element]);
            });


        // add mouse control
        var mouse = Matter.Mouse.create(app.renderer.view),
            mouseConstraint = Matter.MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        Matter.World.add(world, mouseConstraint);

        app.ticker.add(() => updateWorld());
        app.ticker.start();
        }

        
        setup();

        add_circles(200);
    }

    destroy(){
        this.scene.parent.removeChild(this.scene);
    }

}