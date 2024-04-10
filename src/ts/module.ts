import { id as moduleId } from '../module.json' assert { type: 'json' };
import DogBrowser from './apps/dogBrowser';
import '../styles/main.scss';
import { ModuleData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/packages.mjs';

interface MyModule extends Game.ModuleData<ModuleData> {
  dogBrowser: DogBrowser;
}

let module: MyModule;

Hooks.once('init', () => {
  console.log(`Initializing ${moduleId}`);

  module = (game as Game).modules.get(moduleId) as MyModule;
  module.dogBrowser = new DogBrowser();
});

Hooks.on('renderActorDirectory', (_: Application, html: JQuery): void => {
  const button = $(`<button class="cc-sidebar-button" type="button">🐶</button>`);
  button.on('click', () => {
    module.dogBrowser.render(true);
  });
  html.find('.directory-header .action-buttons').append(button);
});
