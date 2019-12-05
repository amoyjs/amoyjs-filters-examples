import * as PIXI from 'pixi.js';
import {AmoyFluidFilter} from '@amoy/filters';

export default class FluidExample {

    constructor(app){
        this.app = app;
        this.app.example = this;
        
        let scene = new PIXI.Container();

        let pageContainer = new PIXI.Container();
    
        scene.addChild(pageContainer);
    
        let w = 1024;
        let h = 768;
        pageContainer.width = w;
        pageContainer.height = h;
        this.scene = scene;

        app.stage.addChild(this.scene);
        app.renderer.resize(w, h);
        app.setAppViewAndRender(w,h);

        // let filter = new PIXI.filters.BlurFilter(15);
        // let cfilter = new PIXI.filters.ColorMatrixFilter();
        // cfilter.matrix = [1, 0, 0, 0, 0, 0, .00, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 100, -12];
        let cfilter1 = new PIXI.filters.ColorMatrixFilter();
        //0.0, 0.35, 0.5
        cfilter1.matrix =   [0, 0, 0, 0, 0, 0, .35, 0, 0, 0, 0, 0, .5, 0, 0, 0, 0, 0, 1, 0];


        let filter2 = new PIXI.Filter(null, app.resources.waterfrag.data);
        filter2.uniforms.uTime=100.0;
        // pageContainer.filters =[filter, cfilter, cfilter1];

        let filter= new AmoyFluidFilter();
        pageContainer.filters =[filter, filter2];
        this.filter = filter;

        app.events.on('animate', function() {
            filter2.uniforms.uTime +=0.02;
        });

        // //-----mattjs-------//
        let engine,
        world,
        boundaries = [],
        pixiCirles=[];


        function add_circles(nums) {
            for(var i=1; i< nums; i++){
                let c = PIXI.Sprite.from(app.resources.ball.texture);
                c.scale.set(2.0);
                // c.pivot = new PIXI.Point(.5, .5);
                let xx = (i%10)*20+50;
                let yy = 10+i*10;
                let b = new Matter.Bodies.circle(xx, yy, 20)

                Matter.World.add(world, [b]);
                if(i==1)console.log(b.position.x);
                pixiCirles.push({sprite:c, body:b});
                c.x = xx;
                c.y = yy;
                pageContainer.addChild(c);
            }
            
        }

        function updateWorld() {
            pixiCirles.forEach((circle, i) => {
                // todo
                circle.sprite.x = circle.body.position.x;
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