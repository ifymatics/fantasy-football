// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  firebase: {
    //  for development
    apiKey: "AIzaSyAXjCN16Nmurx-gblZGptYt9PiCWChwLr8",
    authDomain: "fantastic-fanshop.firebaseapp.com",
    databaseURL: "https://fantastic-fanshop.firebaseio.com",
    projectId: "fantastic-fanshop",
    storageBucket: "fantastic-fanshop.appspot.com",
    messagingSenderId: "186633166340",
    appId: "1:186633166340:web:79246922ff22f6a9"
    //  // for Production
    // apiKey: "AIzaSyBsc6ks88biwKWegGjg7aSCpF0umaQIs2c",
    // authDomain: "fantastic-6c09c.firebaseapp.com",
    // databaseURL: "https://fantastic-6c09c.firebaseio.com",
    // projectId: "fantastic-6c09c",
    // storageBucket: "fantastic-6c09c.appspot.com",
    // messagingSenderId: "468760298787",
    // appId: "1:468760298787:web:cf8c6ed94ae59bdfed3896"
  }
};



/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
