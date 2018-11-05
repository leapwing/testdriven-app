import React from 'react';
import PropTypes from 'prop-types';

const AddUser = (props) => {
	return (
		<form onSubmit={(event) => props.addUser(event)}>
			<div className="field">
				<input
					type="text"
					name="username"
					className="input is-large"
					placeholder="Enter a username"
					required
					value={props.username}
					onChange={props.handleChange}
				/>
			</div>
			<div className="field">
				<input
					type="email"
					name="email"
					className="input is-large"
					placeholder="Enter an email address"
					required
					value={props.email}
					onChange={props.handleChange}
				/>
			</div>
			<input type="submit" value="Submit" className="button is-primary is-large is-fullwidth" />
		</form>
	);
};

AddUser.propTypes = {
	username: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
	addUser: PropTypes.func.isRequired
};

export default AddUser;
