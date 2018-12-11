/* global it, jest, expect */
import React from "react"
import { shallow, configure, mount, } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import InputForm from "../react/components/InputForm.jsx"

configure({ adapter: new Adapter(), })

it("Should render correctly", () => {
	const component = shallow(
		<InputForm onSubmit={() => {}}/>
	)
	expect(component).toMatchSnapshot()
})

it("Should render needed components", () => {
	const component = mount(
		<InputForm onSubmit={() => {}} />
	)
	const form = component.find("form")
	expect(form).toHaveLength(1)
	const input = form.find("input")
	expect(input).toHaveLength(1)
	const button = form.find("button")
	expect(button).toHaveLength(1)
})

it("Should handle input change and submit by button press", () => {
	const component = mount(
		<InputForm onSubmit={jest.fn()}/>
	)
	const enteredText = "some text"
	expect(component.state().value).toStrictEqual("")
	component.find("input").simulate("change", { target: { value: enteredText, }, })
	expect(component.state().value).toStrictEqual(enteredText)
	component.find("button").simulate("click")
	expect(component.props().onSubmit).toBeCalledWith(enteredText)
})

it("Should handle input change and submit by enter key press", () => {
	const component = mount(
		<InputForm onSubmit={jest.fn()}/>
	)
	const enteredText = "other text"
	expect(component.state().value).toStrictEqual("")
	component.find("input").simulate("change", { target: { value: enteredText, }, })
	expect(component.state().value).toStrictEqual(enteredText)
	component.find("input").simulate("keyPress", { charCode: 13, })
	expect(component.props().onSubmit).toBeCalledWith(enteredText)
})
