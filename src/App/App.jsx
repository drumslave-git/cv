import React from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import PixelPaint from "../components/PixelPaint";
import {Main} from "../components/Main";

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Router>
				<Route path="/" exact component={Main} />
				<Route path="/pixelPaint/" exact component={PixelPaint} />
			</Router>
		)
	}
}

export default App;
