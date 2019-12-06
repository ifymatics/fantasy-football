import { NotificationRoutingModule } from './notification-routing.module';

describe('NotificationRoutingModule', () => {
  let notificationRoutingModule: NotificationRoutingModule;

  beforeEach(() => {
    notificationRoutingModule = new NotificationRoutingModule();
  });

  it('should create an instance', () => {
    expect(notificationRoutingModule).toBeTruthy();
  });
});
