// getCurrentTabUId(async (id) => {
// 	id &&
// 		chrome.tabs.sendMessage(id, message, (response) => {
// 			// console.log("refList", refList);
// 			if (
// 				refList.findIndex((item: any) => {
// 					return item === response.username;
// 				}) > -1
// 			) {
// 				setData(response || data);
// 				setIsRef(true);
// 				localStorage.setItem("type", JSON.stringify(response.type));
// 				localStorage.setItem("currentBalance", JSON.stringify(response.value));
// 				return notification.success({
// 					message: "Đăng nhập thành công",
// 				});
// 			} else {
// 				setIsRef(false);
// 				return notification.error({
// 					message: "Đăng nhập thất bại",
// 					description: (
// 						<div>
// 							Bạn không nằm trong hệ thống của chúng tôi, liên hệ
// 							<a
// 								target="_blank"
// 								rel="noopener noreferrer"
// 								href="https://telegram.me/ritzvo81"
// 							>
// 								SF.Inc
// 							</a>
// 						</div>
// 					),
// 				});
// 			}
// 		});
// });
