import firebase from "firebase/app";
import { createContext, PropsWithChildren } from "react";
import firebaseConfig from "./firebaseConfig";
import "firebase/auth";
import "firebase/database";

firebase.initializeApp(firebaseConfig);

// let firebaseApp: firebase.app.App;
// if (!firebase.apps.length) {
//   firebaseApp = firebase.initializeApp(firebaseConfig);
// } else {
//   firebaseApp = firebase.app();
// }
// export const firebaseAppAuth = firebaseApp.auth();
// export const providers = {
//   googleProvider: new firebase.auth.GoogleAuthProvider(),
// };

export * from "./dataTypes";

interface FirebaseContextValue {
  /** the currently logged in user */
  // user?: firebase.User | null;
  /** the database */
  db: firebase.database.Database;
}
export const FirebaseContext = createContext<FirebaseContextValue>(undefined!);
const db = firebase.database();

interface PublicProps {}

type Props = PublicProps;

export const FirebaseContextManager = (props: PropsWithChildren<Props>) => {
  const { children } = props;

  const value: FirebaseContextValue = {
    db,
  };

  return <FirebaseContext.Provider value={value} children={children} />;
};
