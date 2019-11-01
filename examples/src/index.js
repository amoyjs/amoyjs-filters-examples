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
    { name: 'gameboy', url: 'assets/gameboy.jpeg' }
];


// Load resources then add filters
app.load(manifest, () => {
    app.startExample();
});