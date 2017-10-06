import { AttachmentsModule } from './attachments.module';

describe('AttachmentsModule', () => {
  let attachmentsModule: AttachmentsModule;

  beforeEach(() => {
    attachmentsModule = new AttachmentsModule();
  });

  it('should create an instance', () => {
    expect(attachmentsModule).toBeTruthy();
  });
});
