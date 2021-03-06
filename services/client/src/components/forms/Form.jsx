import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { registerFormRules, loginFormRules } from './form-rules';
import FormErrors from './FormErrors';
import PropTypes from 'prop-types';

class Form extends Component {
	state = {
		formData: {
			username: '',
			email: '',
			password: ''
		},
		registerFormRules: registerFormRules,
		loginFormRules: loginFormRules,
		valid: false
	};

	componentDidMount() {
		this.clearForm();
		this.validateForm();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.formType !== nextProps.formType) {
			this.clearForm();
			this.validateForm();
		}
	}

	clearForm() {
		this.setState({
			formData: { username: '', email: '', password: '' }
		});
	}

	handleFormChange = (event) => {
		const obj = this.state.formData;
		obj[event.target.name] = event.target.value;
		this.setState(obj);
		this.validateForm();
	};

	handleUserFormSubmit = (event) => {
		event.preventDefault();
		const formType = this.props.formType;
		const data = {
			email: this.state.formData.email,
			password: this.state.formData.password
		};
		if (formType === 'Register') {
			data.username = this.state.formData.username;
		}
		const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/${formType.toLowerCase()}`;
		axios
			.post(url, data)
			.then((res) => {
				this.clearForm();
				this.props.loginUser(res.data.auth_token);
			})
			.catch((err) => {
				this.clearForm();
				if (formType === 'Login') {
					this.props.createMessage('Login failed.', 'danger');
				}
				if (formType === 'Register') {
					this.props.createMessage('That user already exists.', 'danger');
				}
			});
	};
	validateEmail(email) {
		// eslint-disable-next-line
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
	validateForm() {
		const self = this;
		const formData = this.state.formData;
		self.resetRules();
		if (self.props.formType === 'Register') {
			const formRules = self.state.registerFormRules;
			if (formData.username.length > 5) {
				formRules[0].valid = true;
			}
			if (formData.email.length > 5) {
				formRules[1].valid = true;
			}
			if (this.validateEmail(formData.email)) {
				formRules[2].valid = true;
			}
			if (formData.password.length > 10) {
				formRules[3].valid = true;
			}
			self.setState({ registerFormRules: formRules });
			if (self.allTrue()) {
				self.setState({ valid: true });
			}
		}
		if (self.props.formType === 'Login') {
			const formRules = self.state.loginFormRules;
			if (formData.email.length > 0) {
				formRules[0].valid = true;
			}
			if (formData.password.length > 0) {
				formRules[1].valid = true;
			}
			self.setState({ loginFormRules: formRules });
			if (self.allTrue()) {
				self.setState({ valid: true });
			}
		}
	}

	resetRules() {
		const registerFormRules = this.state.registerFormRules;
		for (const rule of registerFormRules) {
			rule.valid = false;
		}
		this.setState({ registerFormRules: registerFormRules });
		const loginFormRules = this.state.loginFormRules;
		for (const rule of loginFormRules) {
			rule.valid = false;
		}
		this.setState(loginFormRules);
		this.setState({ valid: false });
	}

	allTrue() {
		let formRules = loginFormRules;
		if (this.props.formType === 'Register') {
			formRules = registerFormRules;
		}
		for (const rule of formRules) {
			if (!rule.valid) {
				return false;
			}
		}
		return true;
	}

	render() {
		if (this.props.isAuthenticated) {
			return <Redirect to="/" />;
		}

		let formRules = this.state.loginFormRules;
		if (this.props.formType === 'Register') {
			formRules = this.state.registerFormRules;
		}
		return (
			<div>
				<h1 className="title is-1">{this.props.formType}</h1>
				<hr />
				<br />
				<FormErrors formType={this.state.formType} formRules={formRules} />
				<form onSubmit={(event) => this.handleUserFormSubmit(event)}>
					{this.props.formType === 'Register' && (
						<div className="field">
							<input
								name="username"
								type="text"
								className="input is-medium"
								placeholder="Enter a username"
								required
								value={this.state.formData.username}
								onChange={this.handleFormChange}
							/>
						</div>
					)}
					<div className="field">
						<input
							name="email"
							type="email"
							className="input is-medium"
							placeholder="Enter an email address"
							required
							value={this.state.formData.email}
							onChange={this.handleFormChange}
						/>
					</div>
					<div className="field">
						<input
							name="password"
							type="password"
							className="input is-medium"
							placeholder="Enter a password"
							required
							value={this.state.formData.password}
							onChange={this.handleFormChange}
						/>
					</div>
					<input
						type="submit"
						className="button is-primary is-medium is-fullwidth"
						value="submit"
						disabled={!this.state.valid}
					/>
				</form>
			</div>
		);
	}
}

Form.propTypes = {
	formType: PropTypes.string.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	loginUser: PropTypes.func.isRequired,
	createMessage: PropTypes.func.isRequired
};

export default Form;
