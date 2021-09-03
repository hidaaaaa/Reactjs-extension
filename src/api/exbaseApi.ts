import axiosClient from "./axiosClient";
let isStrue = false;

const exbaseApi = {
	async token(params: any) {
		const token: any = await axiosClient.post("/auth/auth/token", params);

		return token.d;
	},
	async bet(params: {}) {
		if (isStrue) {
			const bet: any = await axiosClient.post(
				"/wallet/binaryoption/bet",
				params
			);

			return bet;
		}
		isStrue = true;
	},
	async getResult(params: any) {
		let url = `/wallet/binaryoption/transaction/close?page=1&size=10&betAccountType=${params.betAccountType}`;
		const result: any = await axiosClient.get(url);

		return result;
	},

	async getBalance() {
		let url = "/wallet/binaryoption/spot-balance";

		const result: any = await axiosClient.get(url);

		return result;
	},

	async getProfile() {
		let url = "/auth/me/profile";

		const result: any = await axiosClient.get(url);

		return result;
	},
};

export default exbaseApi;
