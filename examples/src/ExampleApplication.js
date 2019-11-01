import {
    Application,
    settings,
    Container,
    Rectangle,
    Sprite,
    TilingSprite,
    utils
} from 'pixi.js';

const { EventEmitter } = utils;

/*global dat,ga*/
/**
 * Demo show a bunch of fish and a dat.gui controls
 * @class
 * @extends PIXI.Application
 */
export default class ExampleApplication extends Application {

    constructor(examples) {
        const gui = new dat.GUI();
        gui.useLocalStorage = false;
        this.examples = examples;
        // Get the initial dementions for the application
        const domElement = document.querySelector('#container');
        const initWidth = domElement.offsetWidth;
        const initHeight = domElement.offsetHeight;

        super({
            view: document.querySelector('#stage'),
            width: initWidth,
            height: initHeight,
            autoStart: false,
            antialias:true,
            backgroundColor:0x000000,
        });

        settings.PRECISION_FRAGMENT = 'highp';

        this.domElement = domElement;
        this.gui = gui;
        this.initWidth = initWidth;
        this.initHeight = initHeight;
        this.animating = true;
        this.rendering = true;
        this.events = new EventEmitter();
        this.animateTimer = 0;
        const app = this;
        this.example=null;
        this.exampleParamsFolderGui=null;
    }

    startExample() {
        if(this.examples && (this.examples.length > 0)){
            this._exampleName=this.examples[0].name;

            let examplenames= []
            this.examples.forEach(element => {
                examplenames.push(element.name);
            });
            this.gui.add(this, "ExampleName", examplenames);
            this.ExampleName = this._exampleName;
        }
    }

    set ExampleName(name){
        console.log("-----change Example--------"+name);
        this.changeExample(name)
    }

    get ExampleName(){
        return this._exampleName;
    }

    changeExample(name){
        if(this.example){
            this.destroyCurrentExample();
        }

        if(this.exampleParamsFolderGui){
            this.gui.removeFolder(this.exampleParamsFolderGui);
            this.exampleParamsFolderGui=null;
        }

        this.examples.forEach(element => {
            if(element.name == name){
                this.example = new element(this);
            }
        });
    }

    /**
     * Convenience for getting resources
     * @member {object}
     */
    get resources() {
        return this.loader.resources;
    }

    /**
     * Load resources
     * @param {object} manifest Collection of resources to load
     */
    load(manifest, callback) {
        this.loader.add(manifest).load(() => {
            callback();
            this.init();
            this.start();
        });
    }

    /**
     * Called when the load is completed
     */
    init() {
        // Handle fish animation
        this.ticker.add(this.animate, this);
    }

    /**
     * Resize the demo when the window resizes
     */
    setAppViewAndRender(w, h) {
        let stage =  document.querySelector('#stage');
        stage.style.width = w;
        stage.style.height = h;
        this.render();
    }

    /**
     * Animate the fish, overlay and filters (if applicable)
     * @param {number} delta - % difference in time from last frame render
     */
    animate(delta) {

        this.animateTimer += delta;

        const {animateTimer} = this;

        this.events.emit('animate', delta, animateTimer);

    }

    destroyCurrentExample(){
        this.example.destroy();
        this.example = null;
    }
}
