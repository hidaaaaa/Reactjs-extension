import { refListDb } from "../firebase/firebase";

export const formatTime = (time) => {
	let date_ob = new Date(time);

	let date = ("0" + date_ob.getDate()).slice(-2);

	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

	let year = date_ob.getFullYear();

	let hours = date_ob.getHours();

	let minutes = date_ob.getMinutes();

	let seconds = date_ob.getSeconds();

	return (
		year +
		"-" +
		month +
		"-" +
		date +
		" " +
		hours +
		":" +
		minutes +
		":" +
		seconds
	);
};

export function getDate() {
	let dateObj = new Date();
	return (
		dateObj.getDate() +
		"-" +
		(dateObj.getUTCMonth() + 1) +
		"-" +
		dateObj.getUTCFullYear()
	);
}

export function getTimeCurrent() {
	let today = new Date();
	return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}

export function getDataFirebase(username) {
	return new Promise((resolve, reject) => {
		refListDb
			.ref("tracking_account")
			.once("value")
			.then((snapshot) => {
				if (snapshot.hasChildren()) {
					snapshot.forEach((childSnapshot) => {
						var key = childSnapshot.key;
						if (key === username) {
							if (childSnapshot.child(getDate()).hasChildren()) {
								return resolve(childSnapshot.child(getDate()).val());
							}
						}
					});
				}
				resolve(false);
			});
	});
}
