import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Messaging, getMessaging, getToken, onMessage} from '@angular/fire/messaging';
import {AccountService} from '../accountService/account.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  currentMessage = new BehaviorSubject(null);
  firebaseToken;

  constructor(private accountService: AccountService) {

  }

  async requestPermission() {
    try {
      const messaging = getMessaging();
      const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
      if (token != null) {
        this.accountService.setFirebaseToken(token).subscribe(res => {
          this.firebaseToken = token;
          // console.log('firebase token set successfully');
          // console.log(token);
        }, err => {
          console.error('Unable to set firebase token.', err);
        });
        this.firebaseToken = token;
        // console.log(token);
      }
    } catch (err) {
      console.error('Unable to get permission to notify.', err);
    }
  }

  receiveMessage() {
    const messaging = getMessaging();
    onMessage(messaging, (payload: any) => {
      console.log('new message received. ', payload);
      const NotificationOptions = {
        body: payload.notification.body,
        data: payload.data,
        icon: '/assets/icons/7Task-colored-Logo.svg',
        click_action: 'https://app.seventask.com'
      };
      // this.currentMessage.next(payload);
      navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope').then(registration => {
        registration.showNotification(payload.notification.title, NotificationOptions);
        const audio = new Audio('/assets/sounds/juntos-607.mp3');
        audio.play();
      });
      this.currentMessage.next(payload);
    });
  }
}
