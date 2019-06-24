// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
   production: false,
   /*firebase: { 
     apiKey: "AIzaSyC8tDpNiwjdKvW6vcc504A8IiTO_ZMaepE",
     authDomain: "vsports-local.firebaseapp.com",
     databaseURL: "https://vsports-local.firebaseio.com",
     projectId: "fantastic-2434e",
     storageBucket: "fantastic-2434e.appspot.com",
     messagingSenderId: "554425196940"
   }*/
   firebase: {
    apiKey: "AIzaSyAXjCN16Nmurx-gblZGptYt9PiCWChwLr8",
    authDomain: "fantastic-fanshop.firebaseapp.com",
    databaseURL: "https://fantastic-fanshop.firebaseio.com",
    projectId: "fantastic-fanshop",
    storageBucket: "fantastic-fanshop.appspot.com",
    messagingSenderId: "186633166340",
    appId: "1:186633166340:web:79246922ff22f6a9"  
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
