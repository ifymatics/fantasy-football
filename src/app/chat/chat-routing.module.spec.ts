import { ChatRoutingModule } from './chat-routing.module';

describe('ChatRoutingModule', () => {
  let chatRoutingModule: ChatRoutingModule;

  beforeEach(() => {
    chatRoutingModule = new ChatRoutingModule();
  });

  it('should create an instance', () => {
    expect(chatRoutingModule).toBeTruthy();
  });
});
