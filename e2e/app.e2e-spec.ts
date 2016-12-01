import { RednotebookClientPage } from './app.po';

describe('rednotebook-client App', function() {
  let page: RednotebookClientPage;

  beforeEach(() => {
    page = new RednotebookClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
