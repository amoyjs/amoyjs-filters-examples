import ExampleApplication from './ExampleApplication';
import * as examples from './examples';
var EXAMPLES = [];
for (const i in examples) {
    EXAMPLES.push(examples[i]);
}

const app = new ExampleApplication(EXAMPLES);
const manifest = [
    { name: 'intro', url: 'assets/xiaoHongMao_intro.jpg' },
    { name: 'page1', url: 'assets/xiaoJinGang_page1.jpg' },
    { name: 'gameboy', url: 'assets/gameboy.jpeg' },
    { name: 'snow', url: 'assets/snow.jpg' },
    { name: 'rain', url: 'assets/rainny.jpeg' },
    { name: 'rain1', url: 'assets/rainny1.jpg' },
    { name: 'character_sweep', url: 'assets/character-sweep.png' },
    { name: 'lens_halo', url: 'assets/lens-halo.jpg' },
    { name: 'cloud_bg', url: 'assets/cloud.jpg' },
    { name: 'cloud_cover', url: 'assets/cloud_cover.png' },
    { name: 'bird', url: 'assets/frame-1.png' },
    { name: 'bird1', url: 'assets/frame-2.png' },
    { name: 'sword', url: 'assets/sword.png' },
    { name: 'map', url: 'assets/gamemap.jpg' },
    { name: 'ball', url: 'assets/ball.png' },
    { name: 'spark', url: 'assets/sparks.jpg' },
    { name: 'ball1', url: 'assets/ball1.png' },
    { name: 'floor', url: 'assets/floor.jpeg' },
    { name: 'house', url: 'assets/house.jpg' },
    { name: 'bird_small', url: 'assets/bird.png' },
    {name: 'shader', url:'assets/cross_process.frag'},
    {name: 'waterfrag', url:'assets/watermaterial.frag'},
    {name:"cross", url:'assets/cross_processing.png'},
    {name:"girl", url:'assets/girl.jpg'},
    {name:"underwater", url:'assets/underwater.jpg'},
    {name:"p17", url:'assets/17.png'},
    {name:"gp17", url:'assets/gray_png_17.png'},
    {name:"paopao", url:'assets/paopao5.jpeg'},
    {name:"blind", url:'assets/blind_bg.jpeg'},
];


// Load resources then add filters
app.load(manifest, () => {
    app.startExample();
});