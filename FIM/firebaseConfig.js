import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCscyk9szf5bzPhcL2PpjWur0JQYBWp9iU",
  authDomain: "fimoriginal.firebaseapp.com",
  projectId: "fimoriginal",
  storageBucket: "fimoriginal.appspot.com",
  messagingSenderId: "702451135130",
  appId: "1:702451135130:web:c1d3cc345fc5667ff3a523",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

//IOS: 384006954461-5n5l618g2jvfno035686c1td7i36tu7n.apps.googleusercontent.com
//Android: 384006954461-u523ib6ms3bbmdk60smhisktjrccm6q8.apps.googleusercontent.com
