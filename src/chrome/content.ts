import { ChromeMessage, Sender } from "../types";
type MessageResponse = (response?: any) => void;

const validateSender = (
	message: ChromeMessage,
	sender: chrome.runtime.MessageSender
) => {
	return sender.id === chrome.runtime.id && message.from === Sender.React;
};

const messagesFromReactAppListener = async (
	message: ChromeMessage,
	sender: chrome.runtime.MessageSender,
	response: MessageResponse
) => {
	const isValidated = validateSender(message, sender);
	// console.log(isValidated);

	// function get token

	if (isValidated && message.message === "getToken") {
		const userToken = JSON.parse(localStorage.getItem("USER_TOKEN") || "");
		// console.log(userToken);
		if (!!userToken) {
			await response(userToken);
		}
	}
};

const main = () => {
	// console.log("[content.ts] Main");
	/**
	 * Fired when a message is sent from either an extension process or a content script.
	 */
	chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

	// chrome.runtime.getBackgroundPage(function (bg: any) {
	// 	if (bg.sessionDataHTML) {
	// 		document.body.innerHTML = bg.sessionDataHTML;
	// 	}
	// 	setInterval(function () {
	// 		bg.sessionDataHTML = document.body.innerHTML;
	// 	}, 1000);

	// 	//do the rest of your work here.
	// });
};

main();
