import React from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import {User} from '@/server/controllers/User';
import {I18n} from '@/server/controllers/I18n';
import PixelPaint from "../components/PixelPaint";
import {Main} from "../components/Main";
import {EE} from '@/helpers/EE';

class App extends React.Component {
	state = {
		loaded: false
	};

	constructor(props) {
		super(props);

		this.init();

		// EE.on('changeLocale', this.init)
	}

	init(){
		I18n.init().then(locale => {
			User.init(locale)
				.then(() => {
					this.setState({loaded: true});
				})
		});

	}

	componentDidMount() {
	}

	render() {
		console.log(this.state);
		if(this.state.loaded) {
			return (
				<Router>
					<Route path="/" exact component={Main}/>
					<Route path="/pixelPaint/" exact component={PixelPaint}/>
				</Router>
			)
		}else{
			return <h1>Loading...</h1>
		}
	}

	componentWillUnmount() {
		// Un-registers the auth state observer.
		// this.unregisterAuthObserver();
	}
}

export default App;
