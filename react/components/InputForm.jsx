import React from "react"
import PropTypes from "prop-types"

export default class InputForm extends React.Component {
	static propTypes = {
		onSubmit: PropTypes.func.isRequired,
	}

	state = {
		value: "",
	}

	handleChange = event => {
		this.setState({ value: event.target.value, })
	}

	handleSubmit = () => {
		this.props.onSubmit(this.state.value)
		this.setState({ value: "", })
	}

	onKeyPress = event => {
		if (event.charCode === 13) {
			event.preventDefault()
			this.handleSubmit()
		}
	}

	render() {
		return <React.Fragment>
			<form className="input-form">
				<input
					className="input-field form-control"
					type="text"
					onChange={this.handleChange}
					value={this.state.value}
					onKeyPress={this.onKeyPress}
				/>
				<button className="btn btn-warning" type="button" onClick={this.handleSubmit}>Add</button>
			</form>
		</React.Fragment>
	}
}
