import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

class Logout extends Component {
	componentDidMount() {
		this.props.logoutUser();
	}
	render() {
		// if (this.props.isAuthenticated) {
		// 	return <Redirect to="/" />;
		// }
		return (
			<div>
				<p>
					You are now logged out. Click <Link to="/login">here</Link> to log back in.
				</p>
			</div>
		);
	}
}

export default Logout;
