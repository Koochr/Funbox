/* global beforeEach it, jest, expect */
import React from "react"
import { configure, mount, shallow, } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import App from "../react/App.jsx"

configure({ adapter: new Adapter(), })

beforeEach(() => {
	global.ymaps = {
		ready: jest.fn(),
	}
})

it("Should render correctly", () => {
	const component = shallow(
		<App />
	)
	expect(component).toMatchSnapshot()
})

it("Should render needed components", () => {
	const component = mount( <App />)
	component.instance().refactorWayPoints = jest.fn()
	component.setState({
		wayPoints: [
			{
				name: "wp1",
				coords: [5, 10,],
			},
			{
				name: "wp2",
				coords: [10, 20,],
			},
			{
				name: "wp3",
				coords: [50, 100,],
			},
		],
	})
	const wrapper = component.find(".waypoints-list-wrapper")
	expect(wrapper).toHaveLength(1)
	const form = wrapper.find("form")
	expect(form).toHaveLength(1)
	const list = wrapper.find(".list-group")
	expect(list).toHaveLength(1)
	const map = component.find("#map")
	expect(map).toHaveLength(1)
	const names = wrapper.find(".waypoint-name")
	expect(names).toHaveLength(component.state().wayPoints.length)
	const buttons = wrapper.find(".btn-danger")
	expect(buttons).toHaveLength(component.state().wayPoints.length)
	for (let i=0; i<component.state().wayPoints.length; i++) {
		expect (names.at(i).props().children).toStrictEqual(component.state().wayPoints[i].name)
	}
})

it("Should call lifecycle methods", () => {
	const component = shallow( <App />)
	expect(global.ymaps.ready.mock.calls.length).toStrictEqual(1)
	component.instance().refactorWayPoints = jest.fn()
	component.setState({
		wayPoints: ["someNewValue",],
	})
	expect(component.instance().refactorWayPoints.mock.calls.length).toStrictEqual(1)
})

it("Should handle waypoints refactoring on state change", () => {
	const mockPropertiesSet = jest.fn()
	const mockEventsAdd = jest.fn()

	global.ymaps.Placemark = jest.fn().mockImplementation(() => {
		return {
			properties: {
				set: mockPropertiesSet,
			},
			events: {
				add: mockEventsAdd,
			},
		}
	})
	global.ymaps.Polyline = jest.fn().mockImplementation(() => {
		return { mockPolyLine: "mockPolyline", }
	})

	const component = shallow( <App />)
	component.setState({
		wayPoints: [
			{
				name: "wp1",
				coords: [5, 10,],
			},
			{
				name: "",
				coords: [10, 20,],
			},
			{
				name: "wp3",
				coords: [50, 100,],
			},
		],
		yaMap: {
			geoObjects: {
				removeAll: jest.fn(),
				add: jest.fn(),
			},
		},
	})

	expect(component.state().yaMap.geoObjects.removeAll.mock.calls.length).toStrictEqual(1)
	for (let i=0; i<component.state().wayPoints.length; i++) {
		let preset
		switch (i) {
		case 0:
			preset = "islands#blueHomeCircleIcon"
			break
		case component.state().wayPoints.length-1:
			preset = "islands#blueGovernmentCircleIcon"
			break
		default:
			preset = "islands#blueCircleDotIcon"
		}
		expect(global.ymaps.Placemark)
			.toBeCalledWith(component.state().wayPoints[i].coords, {}, { draggable: true, preset, })
		expect(mockPropertiesSet).toBeCalledWith("index", i)
		expect(mockPropertiesSet).toBeCalledWith("name", component.state().wayPoints[i].name)
		expect(component.state().yaMap.geoObjects.add).toBeCalledWith({
			properties: {
				set: mockPropertiesSet,
			},
			events: {
				add: mockEventsAdd,
			},
		})
		expect(mockEventsAdd).toBeCalledWith("dragend", expect.any(Function))
		expect(mockEventsAdd).toBeCalledWith("click", expect.any(Function))
	}

	expect(global.ymaps.Polyline).toBeCalledWith(
		component.state().wayPoints.map(wayPoint => wayPoint.coords),
		{},
		{ strokeWidth: 6, }
	)
	expect(component.state().yaMap.geoObjects.add).toBeCalledWith({ mockPolyLine: "mockPolyline", })
})

it("Should handle waypoint delete button click", () => {
	const component = mount( <App />)
	component.instance().refactorWayPoints = jest.fn()
	const initialWayPoints = [
		{
			name: "wp1",
			coords: [5, 10,],
		},
		{
			name: "wp2",
			coords: [10, 20,],
		},
		{
			name: "wp3",
			coords: [50, 100,],
		},
	]
	const wayPointToRemove = 1
	component.setState({
		wayPoints: initialWayPoints.slice(),
	})
	const button = component.find(".btn-danger").at(wayPointToRemove)
	button.simulate("click")
	expect(component.state().wayPoints)
		.toStrictEqual(initialWayPoints.slice(0, wayPointToRemove).concat(initialWayPoints.slice(wayPointToRemove + 1)))
})

