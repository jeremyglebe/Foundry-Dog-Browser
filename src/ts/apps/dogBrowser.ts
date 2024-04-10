import { id as moduleId } from '../../module.json' assert { type: 'json' };

export default class DogBrowser extends Application {
  private imageUrl?: String;

  static override get defaultOptions(): ApplicationOptions {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'dog-browser',
      title: 'Dog Browser',
      template: `modules/${moduleId}/templates/dogs.hbs`,
      width: 720,
      height: 720,
    }) as ApplicationOptions;
  }

  override getData() {
    return {
      imageUrl: this.imageUrl,
    };
  }

  override activateListeners(html: JQuery<HTMLElement>): void {
    console.log('activating listeners');
    super.activateListeners(html);
    html.find('button.module-control').on('click', this._onClickControlButton.bind(this));
  }

  async _onClickControlButton(event: JQuery.TriggeredEvent): Promise<void> {
    event.preventDefault();
    const button = event.target as HTMLElement;
    const action = button.dataset.action;

    switch (action) {
      case 'randomize-dog':
        this._randomizeDog();
        break;
    }
  }

  async _randomizeDog() {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    if (response.status !== 200) {
      ui.notifications?.error(`Unexpected lack of doggos :( ${response.status}: ${response.statusText}`);
      return;
    }
    this.imageUrl = (await response.json()).message;
    this.render();
  }
}
