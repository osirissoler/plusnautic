import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
	apiKey: "AIzaSyCkZnyD3b6N5K7JSCvuNnhCHI7wni7QQhI",
	authDomain: "plusnautic.firebaseapp.com",
	projectId: "plusnautic",
	storageBucket: "plusnautic.appspot.com",
	messagingSenderId: "379757610089",
	appId: "1:379757610089:web:647780d3f105130a920ef8",

};

const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
const dbf = getFirestore();

export {dbf, firebase };
