import { DecoraUserPage } from './app.po';

describe('decora-user App', () => {
  let page: DecoraUserPage;

  beforeEach(() => {
    page = new DecoraUserPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
