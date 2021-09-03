import firebase from "firebase/app";
import "firebase/database";

const firstFirebaseConfig = {
	apiKey: "AIzaSyB6tHeH-bM0H7BNRYKk7RsKFDboUnxRTE0",
	authDomain: "ref-list-mmd.firebaseapp.com",
	databaseURL:
		"https://ref-list-mmd-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "ref-list-mmd",
	storageBucket: "ref-list-mmd.appspot.com",
	messagingSenderId: "948429359159",
	appId: "1:948429359159:web:2a6ded0e9aba5c483a97b2",
	measurementId: "G-W3WTP6G6NG",
};

const firstDatabase = firebase.initializeApp(
	firstFirebaseConfig,
	"firstDatabase"
);

export const refListDb = firstDatabase.database();

const secondFirebaseConfig = {
	apiKey: "AIzaSyDVDO1ZFVog7w92F-PB6XdwPgLIaSdQiM8",
	authDomain: "server-copy-zoom.firebaseapp.com",
	databaseURL:
		"https://server-copy-zoom-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "server-copy-zoom",
	storageBucket: "server-copy-zoom.appspot.com",
	messagingSenderId: "395568779784",
	appId: "1:395568779784:web:8b2acfa077577c6229f7bd",
	measurementId: "G-JC3ZXTLQD5",
};

// const secondFirebaseConfig = {
// 	apiKey: "AIzaSyCAu9-RUNbDrxnKpNh2NVsb-lwY4yuiIhw",
// 	authDomain: "test-sheets-project-app.firebaseapp.com",
// 	databaseURL: "https://test-sheets-project-app-default-rtdb.firebaseio.com",
// 	projectId: "test-sheets-project-app",
// 	storageBucket: "test-sheets-project-app.appspot.com",
// 	messagingSenderId: "537266275370",
// 	appId: "1:537266275370:web:987f8b98e1d5d86b776f53",
// 	measurementId: "G-PYFG97KCY6",
// };

const secondDatabase = firebase.initializeApp(
	secondFirebaseConfig,
	"secondDatabase"
);

export const db = secondDatabase.database();
