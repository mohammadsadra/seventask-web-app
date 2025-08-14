// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyAoIrIG84HfroWrNIqrWg_ZMg2ZbizvRrI',
    authDomain: 'seventaskfirebasemessaging.firebaseapp.com',
    projectId: 'seventaskfirebasemessaging',
    storageBucket: 'seventaskfirebasemessaging.appspot.com',
    messagingSenderId: '293255224366',
    appId: '1:293255224366:web:88d0dec9e455e80022d3bf',
    measurementId: 'G-T1ZT0KVWFD'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
