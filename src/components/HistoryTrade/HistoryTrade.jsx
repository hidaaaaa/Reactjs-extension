import { Table } from "antd";
import React, { useEffect, useState } from "react";
import exbaseApi from "../../api/exbaseApi";
import { refListDb } from "../../firebase/firebase";
import {
	formatTime,
	getDataFirebase,
	getDate,
	getTimeCurrent,
} from "../../function/ultil";
import "./HistoryTrade.css";

function HistoryTrade({
	historyTrade,
	handleDeleteHisory,
	handleUpdateBalance,
	data,
}) {
	const [table, setTable] = useState(historyTrade);
	const [totalProfit, setTotalPofit] = useState(0);
	const [countWL, setCountWL] = useState([0, 0]);

	useEffect(() => {
		let timer1 = setInterval(async () => {
			const trade = historyTrade;
			// console.log(trade);

			if (trade.length > 0) {
				const rs = await exbaseApi.getResult({
					betAccountType: trade[0].betAccountType,
				});

				// console.log("19", rs);
				if (rs.ok) {
					const time = formatTime(new Date(rs.d.c[0].createdDatetime));

					if (time === trade[0].dateTrade) {
						trade[0] = {
							...trade[0],
							profit: (
								parseFloat(rs.d.c[0].winAmount) -
								parseFloat(trade[0].capitalPerTrade)
							).toFixed(2),

							result: rs.d.c[0].result,
						};
						setTable(trade);
						localStorage.setItem("historyTrade", JSON.stringify(trade));

						const currentDate = new Date();

						let oldBalanceDemo = "";
						let oldBalanceLive = "";
						let currentBalanceDemo = "";
						let currentBalanceLive = "";
						let lastUpdate = "";
						let currentTime = await getTimeCurrent();

						if (
							currentDate.getHours() === 0 &&
							currentDate.getMinutes() === 7 &&
							currentDate.getSeconds() === 5
						) {
							oldBalanceDemo = JSON.parse(
								localStorage.getItem("currentBalanceDemo")
							);
							oldBalanceLive = JSON.parse(
								localStorage.getItem("currentBalanceLive")
							);

							currentBalanceDemo = JSON.parse(
								localStorage.getItem("currentBalanceDemo")
							);
							currentBalanceLive = JSON.parse(
								localStorage.getItem("currentBalanceLive")
							);

							await refListDb
								.ref("tracking_account")
								.child(data.username)
								.child(getDate())
								.set({
									oldBalanceDemo,
									oldBalanceLive,
									currentBalanceDemo,
									currentBalanceLive,
									currentTime,
								});
						}

						if (
							new Date(rs.d.c[0].createdDatetime).getMinutes() ===
								currentDate.getMinutes() - 2 &&
							new Date(rs.d.c[0].createdDatetime).getSeconds() ===
								currentDate.getSeconds() - 2
						) {
							const balanceFirebase = await getDataFirebase(data.username);
							if (balanceFirebase) {
								oldBalanceDemo = balanceFirebase.oldBalanceDemo;
								oldBalanceLive = balanceFirebase.oldBalanceLive;
								lastUpdate = currentTime;
							} else {
								oldBalanceDemo = JSON.parse(
									localStorage.getItem("currentBalanceDemo")
								);
								oldBalanceLive = JSON.parse(
									localStorage.getItem("currentBalanceLive")
								);
								lastUpdate = currentTime;
							}
							currentBalanceDemo = JSON.parse(
								localStorage.getItem("currentBalanceDemo")
							);
							currentBalanceLive = JSON.parse(
								localStorage.getItem("currentBalanceLive")
							);

							await refListDb
								.ref("tracking_account")
								.child(data.username)
								.child(getDate())
								.set({
									oldBalanceDemo,
									oldBalanceLive,
									currentBalanceLive,
									currentBalanceDemo,
									lastUpdate,
								});
						}

						if (handleUpdateBalance) {
							handleUpdateBalance(true);
						}
					}
				}
			}

			let win = 0;
			let lose = 0;
			let profitDEMO = 0;
			let profitLIVE = 0;
			for (let i = 0; i < trade.length; i++) {
				if (trade[i].betAccountType === "DEMO") {
					if (trade[i].result === "WIN") {
						win++;
						profitDEMO = profitDEMO + parseFloat(trade[i].profit);
					}
					if (trade[i].result === "LOSE") {
						lose++;
						profitDEMO = profitDEMO + parseFloat(trade[i].profit);
					}
				}
				if (trade[i].betAccountType === "LIVE") {
					if (trade[i].result === "WIN") {
						win++;
						profitLIVE = profitLIVE + parseFloat(trade[i].profit);
					}
					if (trade[i].result === "LOSE") {
						lose++;
						profitLIVE = profitLIVE + parseFloat(trade[i].profit);
					}
				}
			}
			if (JSON.parse(localStorage.getItem("type")) === "DEMO") {
				setTotalPofit(profitDEMO.toFixed(2));
			}
			if (JSON.parse(localStorage.getItem("type")) === "LIVE") {
				setTotalPofit(profitLIVE.toFixed(2));
			}

			setCountWL([win, lose]);

			//localStorage.setItem("profit", JSON.stringify(profit));
		}, 1000);

		return () => {
			clearInterval(timer1);
		};
	}, []);

	return (
		<>
			<Table
				dataSource={[...table]}
				pagination={{
					pageSize: 5,
				}}
				bordered
				title={() => (
					<div className="historyTrade__header">
						<div className="historyTrade__title">
							Tổng lợi nhuận :<div>Win/Lose</div>
						</div>
						<div className="historyTrade__info">
							<div className="historyTrade__value">
								{totalProfit > 0 ? (
									<div className="win">{totalProfit}</div>
								) : totalProfit < 0 ? (
									<div className="lose">{totalProfit}</div>
								) : (
									<div>{totalProfit}</div>
								)}
							</div>
							<div className="historyTrade__count">
								<div className="win">{countWL[0]}</div>/
								<div className="lose">{countWL[1]}</div>
							</div>
						</div>
					</div>
				)}
				columns={columns}
			/>
		</>
	);
}

export default HistoryTrade;

const columns = [
	{
		title: "Thời gian",
		dataIndex: "dateTrade",
		key: "dateTrade",
	},
	{
		title: "Chuyên gia",
		dataIndex: "expert",
		key: "expert",
	},
	{
		title: "Số tiền",
		dataIndex: "capitalPerTrade",
		key: "capitalPerTrade",
	},
	{
		title: "Loại ví",
		dataIndex: "betAccountType",
		key: "betAccountType",
	},
	{
		title: "Lệnh",
		dataIndex: "betType",
		key: "betType",
		render: (betType) => {
			if (betType === "UP") {
				return <div className="win">{betType}</div>;
			} else if (betType === "DOWN") {
				return <div className="lose">{betType}</div>;
			} else {
				return <div>{betType}</div>;
			}
		},
	},
	{
		title: "Kết quả",
		dataIndex: "result",
		key: "result",
		render: (result) => {
			if (result === "WIN") {
				return <div className="win-result">{result}</div>;
			} else if (result === "LOSE") {
				return <div className="lose-result">{result}</div>;
			} else {
				return <div>{result}</div>;
			}
		},
	},
	{
		title: "Lợi nhuận",
		dataIndex: "profit",
		key: "profit",
		render: (profit) => {
			if (profit > 0) {
				return <div className="win-result">{profit}</div>;
			} else if (profit < 0) {
				return <div className="lose-result">{profit}</div>;
			} else {
				return <div>{profit}</div>;
			}
		},
	},
];
