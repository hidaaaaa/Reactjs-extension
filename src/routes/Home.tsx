import { notification, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import exbaseApi from "../api/exbaseApi";
import { getCurrentTabUId } from "../chrome/utils";
import ChooseExpect from "../components/ChooseExpect/ChooseExpect";
import HistoryTrade from "../components/HistoryTrade/HistoryTrade";
import InputNumberFieldForm from "../components/InputNumberFieldForm/InputNumberFieldForm";
import { db, refListDb } from "../firebase/firebase";
import {
	formatTime,
	getDataFirebase,
	getDate,
	getTimeCurrent,
} from "../function/ultil";
import { ChromeMessage, Sender } from "../types";

const { TabPane } = Tabs;

export const Home = () => {
	const [isRef, setIsRef] = useState(false);
	const [isRunning, setIsRunning] = useState(false);
	const [token, setToken] = useState({});
	const [capitalPerTrade, setCapitalPerTrade] = useState(
		parseFloat(JSON.parse(localStorage.getItem("capitalPerTrade") || "1"))
	);
	const [data, setData] = useState({
		type: "",
		value: "",
		email: "",
		username: "",
	});
	const [historyTrade, setHistoryTrade] = useState(
		JSON.parse(localStorage.getItem("historyTrade") || "[]")
	);
	const [oldHistoryLength, setOldHistoryLength] = useState(1);
	const [listExpect, setListExpect] = useState([] as any[]);
	// const [stopLose, setStopLose] = useState(
	// 	parseFloat(JSON.parse(localStorage.getItem("SL") || `-100`))
	// );
	// const [takeProfit, setTakeProfit] = useState(
	// 	parseFloat(JSON.parse(localStorage.getItem("TP") || "100"))
	// );

	useEffect(() => {
		const ref = db.ref().child("experts");

		ref.get().then(function (snapshot: any) {
			const response = snapshot.val();
			// console.log(response);
			setListExpect(response);
		});
	}, []);

	//refresh every 2 minute
	useEffect(() => {
		const interval = setInterval(() => {
			if (oldHistoryLength > 1) {
				clearInterval(interval);
			}
			if (token !== {}) {
				// console.log("fetch");
				const message: ChromeMessage = {
					from: Sender.React,
					message: "getToken",
				};
				getCurrentTabUId(async (id) => {
					id &&
						chrome.tabs.sendMessage(id, message, async (response) => {
							const tokenValue = await JSON.parse(
								localStorage.getItem("token") || ""
							);
							try {
								const rs = await exbaseApi.token({
									client_id: "exbase-web",
									grant_type: "refresh_token",
									refresh_token: tokenValue.refresh_token,
								});

								await localStorage.setItem("token", JSON.stringify(rs));
								setToken(rs);
							} catch (error) {
								console.log(error);
							}
						});
				});
			}
		}, 70000);

		return () => clearInterval(interval);
	}, []);

	// bet
	useEffect(() => {
		// console.log(isRunning);
		if (isRunning) {
			const ref = db.ref().child("main-server"); // main-sever build product
			const listener = ref.on("value", async (snapshot) => {
				try {
					const { type, expert, date } = await snapshot.val();

					// // console.log("63", JSON.stringify(token));

					const selectedExpect = await JSON.parse(
						localStorage.getItem("selectedExpect") || JSON.stringify(listExpect)
					);
					// console.log("89", selectedExpect);
					if (selectedExpect.findIndex((item: any) => item === expert) > -1) {
						// const profit = parseFloat(
						// 	JSON.parse(localStorage.getItem("profit") || "0")
						// );

						// console.log(profit, takeProfit, stopLose);

						// if (profit >= takeProfit) {
						// 	setIsRunning(false);
						// 	return notification.success({
						// 		message: "Chúc mừng",
						// 		description: "Đã đạt đủ lợi nhuận",
						// 	});
						// }

						// if (profit <= stopLose) {
						// 	setIsRunning(false);
						// 	return notification.error({
						// 		message: "Xin lỗi",
						// 		description: "Đã đạt mốc cắt lỗ",
						// 	});
						// }

						const rs = await exbaseApi.bet({
							betAccountType: JSON.parse(
								localStorage.getItem("type") || "DEMO"
							),
							betAmount: parseFloat(
								JSON.parse(localStorage.getItem("capitalPerTrade") || "1")
							),
							betType: type,
						});

						// console.log("74", rs);

						const tempHistory = historyTrade;

						let trade;

						if (!!rs) {
							if (rs.ok) {
								const dateTrade = formatTime(new Date(rs.d.time));

								trade = {
									dateTrade: dateTrade,
									expert: expert,
									capitalPerTrade: parseFloat(
										JSON.parse(localStorage.getItem("capitalPerTrade") || "1")
									),
									betAccountType: JSON.parse(
										localStorage.getItem("type") || "DEMO"
									),
									betType: type,
									result: "đợi",
									profit: 0,
								};
							} else {
								const dateTrade = formatTime(new Date(date));
								trade = {
									dateTrade: dateTrade,
									expert: expert,
									capitalPerTrade: 0,
									betAccountType: JSON.parse(
										localStorage.getItem("type") || "DEMO"
									),
									betType: type,
									result: "lỗi",
									profit: 0,
								};
							}

							await tempHistory.unshift(trade);
						}

						await await setOldHistoryLength(tempHistory.length);
						await setHistoryTrade(tempHistory);
						await localStorage.setItem(
							"historyTrade",
							JSON.stringify(tempHistory)
						);

						return () => ref.off("value", listener);
					}
				} catch (error) {
					console.log("error to get trade", error);
				}
			});

			// return () => {

			// }
		}
	}, [isRunning]);

	function callback(key: any) {
		// console.log(key);
	}

	// get info user
	const getAccountData = async () => {
		let refList: any[] = [];

		await refListDb
			.ref()
			.child("refList")
			.once("value", async function (snapshot) {
				const _data = snapshot.val();
				const keys = Object.keys(_data);
				const result = keys.map((key, i) => {
					return _data[key].nick ? _data[key].nick : "";
				});
				// console.log(result);
				refList = result;
			});

		const messageSecond: ChromeMessage = {
			from: Sender.React,
			message: "getToken",
		};
		getCurrentTabUId(async (id) => {
			id &&
				chrome.tabs.sendMessage(id, messageSecond, async (response) => {
					// console.log(response.refresh_token);
					try {
						// get api token
						const rs = await exbaseApi.token({
							client_id: "exbase-web",
							grant_type: "refresh_token",
							refresh_token: response.refresh_token,
						});
						// console.log("263", rs);

						setToken(rs);

						// save token to local
						await localStorage.setItem("token", JSON.stringify(rs));

						let username = "";
						let email = "";
						let type = "";
						let value = "";

						try {
							// call api profile
							const profile = await exbaseApi.getProfile();

							// call api success
							if (profile.ok) {
								// save varible username and email
								username = profile.d.nn;
								email = profile.d.e;

								if (
									refList.findIndex((item: any) => {
										return item === username;
									}) > -1
								) {
									try {
										// call api get balance
										const balance = await exbaseApi.getBalance();

										// call api success
										if (balance.ok) {
											type = "DEMO";
											value = balance.d.demoBalance;

											setData({
												type: type,
												username: username,
												value: value,
												email: email,
											});

											await setIsRef(true);
											await localStorage.setItem("type", JSON.stringify(type));
											await localStorage.setItem(
												"currentBalanceDemo",
												JSON.stringify(balance.d.demoBalance)
											);
											await localStorage.setItem(
												"currentBalanceLive",
												JSON.stringify(balance.d.availableBalance)
											);

											// init tracking account

											let oldBalanceDemo = "";
											let oldBalanceLive = "";
											let currentBalanceDemo = "";
											let currentBalanceLive = "";
											let lastUpdate = "";
											let currentTime = await getTimeCurrent();

											const balanceFirebase = await getDataFirebase(username);
											if (balanceFirebase) {
												oldBalanceDemo = balanceFirebase.oldBalanceDemo;
												oldBalanceLive = balanceFirebase.oldBalanceLive;
												lastUpdate = currentTime;
											} else {
												oldBalanceDemo = balance.d.demoBalance;
												oldBalanceLive = balance.d.availableBalance;
												lastUpdate = currentTime;
											}
											currentBalanceDemo = balance.d.demoBalance;
											currentBalanceLive = balance.d.availableBalance;

											await refListDb
												.ref("tracking_account")
												.child(username)
												.child(getDate())
												.set({
													oldBalanceDemo,
													oldBalanceLive,
													currentBalanceDemo,
													currentBalanceLive,
													lastUpdate,
												});

											return notification.success({
												message: "Đăng nhập thành công!",
											});
										}
									} catch (error) {}

									// call api false
								} else {
									setIsRef(false);
									return notification.error({
										message: "Đăng nhập thất bại",
										description: (
											<div>
												Bạn không nằm trong hệ thống của chúng tôi, liên hệ
												<a
													target="_blank"
													rel="noopener noreferrer"
													href="https://telegram.me/ritzvo81"
												>
													SF.Inc
												</a>
											</div>
										),
									});
								}
							} else {
								return notification.error({
									message: "Hãy refresh lại sàn Exbase và lấy lại thông tin",
								});
							}
						} catch (error) {}
					} catch (error) {
						console.log(error);
					}
				});
		});
	};

	// change capitalpertrade

	const handleChangeCapitalPerTrade = (values: any): void => {
		// console.log("167", values);
		if (values <= 0) {
			localStorage.setItem("capitalPerTrade", "1");
		} else {
			localStorage.setItem("capitalPerTrade", values.capitalPerTrade);
			setCapitalPerTrade(values.capitalPerTrade);
		}
	};

	//change stopLoss and takeProfit

	// const handleChangeSLTP = (values: any) => {
	// 	setTakeProfit(values.takeProfit);
	// 	setStopLose(values.stopLose);
	// 	localStorage.setItem("SL", JSON.stringify(values.stopLose));
	// 	localStorage.setItem("TP", JSON.stringify(values.takeProfit));
	// };

	// start bot

	const handleStartBot = () => {
		setIsRunning(true);
	};

	// delete History

	const handleDeleteHisory = (values: any) => {
		// console.log(values);
		if (values) {
			// console.log("dsada", values);
			localStorage.removeItem("historyTrade");
			localStorage.removeItem("profit");
			setHistoryTrade([]);
		}
	};

	// updateBalance

	const handleUpdateBalance = async (values: any) => {
		if (values) {
			try {
				const type = JSON.parse(localStorage.getItem("type") || "DEMO");
				const balance = await exbaseApi.getBalance();
				if (balance.ok) {
					let tempData = data;
					if (type === "DEMO") {
						tempData = {
							...tempData,
							value: balance.d.demoBalance,
							type: type,
						};
					}

					if (type === "LIVE") {
						tempData = {
							...tempData,
							value: balance.d.availableBalance,
							type: type,
						};
					}

					localStorage.setItem("type", JSON.stringify(type));
					await localStorage.setItem(
						"currentBalanceDemo",
						JSON.stringify(balance.d.demoBalance)
					);
					await localStorage.setItem(
						"currentBalanceLive",
						JSON.stringify(balance.d.availableBalance)
					);
					setData(tempData);
				}
			} catch (error) {}
		}
	};

	// change type

	const handleChangeTypeDemo = async () => {
		try {
			const balance = await exbaseApi.getBalance();
			if (balance.ok) {
				let tempData = data;
				tempData = {
					...tempData,
					value: balance.d.demoBalance,
					type: "DEMO",
				};
				setData(tempData);

				localStorage.setItem("type", JSON.stringify("DEMO"));
				await localStorage.setItem(
					"currentBalanceDemo",
					JSON.stringify(balance.d.demoBalance)
				);
				await localStorage.setItem(
					"currentBalanceLive",
					JSON.stringify(balance.d.availableBalance)
				);
			}
		} catch (error) {}
	};
	const handleChangeTypeLive = async () => {
		try {
			const balance = await exbaseApi.getBalance();
			if (balance.ok) {
				let tempData = data;
				tempData = {
					...tempData,
					value: balance.d.availableBalance,
					type: "LIVE",
				};
				setData(tempData);

				localStorage.setItem("type", JSON.stringify("LIVE"));
				await localStorage.setItem(
					"currentBalanceDemo",
					JSON.stringify(balance.d.demoBalance)
				);
				await localStorage.setItem(
					"currentBalanceLive",
					JSON.stringify(balance.d.availableBalance)
				);
			}
		} catch (error) {}
	};

	return (
		<div className="app">
			{!isRef ? (
				<div className="app__header">
					<button onClick={getAccountData} className="app__button">
						Lấy Thông Tin Người Dùng
					</button>
				</div>
			) : (
				<>
					<div className="app__header flex">
						<div className="header__email">
							<h1>{data.username}</h1>
						</div>
						<div>
							<div
								className="header__balance demo"
								onClick={handleChangeTypeDemo}
							>
								<div className="header__balance-type  ">DEMO</div>
							</div>
							<div
								className="header__balance live"
								onClick={handleChangeTypeLive}
							>
								<div className="header__balance-type l">LIVE</div>
							</div>
							<div className="header__balance">
								<div className="header__balance-type">{data.type}</div>
								<div className="header__balance-value">{data.value}</div>
							</div>{" "}
							<button className="app__button" onClick={handleStartBot}>
								Chạy Bot
							</button>
						</div>
					</div>
					<div className="app__body">
						<div>
							{isRunning ? (
								<div className="running">Trạng thái: Đang chạy</div>
							) : (
								<div className="no-running">Trạng thái: Chưa chạy</div>
							)}
						</div>

						<InputNumberFieldForm
							handleChangeCapitalPerTrade={handleChangeCapitalPerTrade}
							capitalPerTrade={capitalPerTrade}
						/>

						{/* <ChangeSLTP
							stopLose={stopLose}
							takeProfit={takeProfit}
							handleChangeSLTP={handleChangeSLTP}
						/> */}

						<Tabs defaultActiveKey="1" onChange={callback} centered>
							<TabPane tab="Thống kê" key="1">
								<HistoryTrade
									historyTrade={historyTrade}
									handleDeleteHisory={handleDeleteHisory}
									handleUpdateBalance={handleUpdateBalance}
									data={data}
								/>
							</TabPane>
							<TabPane tab="Chọn CG" key="2">
								<ChooseExpect listExpect={listExpect} />
							</TabPane>
							<TabPane tab="Liên hệ" key="3"></TabPane>
						</Tabs>
					</div>
					<div className="app__footer">
						Liên hệ hỗ trợ?
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://telegram.me/ritzvo81"
						>
							Liên hệ
						</a>
					</div>
				</>
			)}
		</div>
	);
};
