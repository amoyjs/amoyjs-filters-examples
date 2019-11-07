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
];


// Load resources then add filters
app.load(manifest, () => {
    app.startExample();
});