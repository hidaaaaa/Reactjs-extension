import React from "react";
import { Route, Switch } from "react-router-dom";
import { About } from "./routes/About";
import { Home } from "./routes/Home";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

import "./App.css";

export const App = () => {
	return (
		<Switch>
			<Route path="/about">
				<About />
			</Route>
			<Route path="/">
				<Home />
			</Route>
		</Switch>
	);
};
