/* global it, expect */
import React from "react"
import { mount, shallow, configure, } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import SortableList from "../react/components/SortableList.jsx"

configure({ adapter: new Adapter(), })

const items = ["item1", "item2", "item3",]

it("Should render correctly", () => {
	const component = shallow(
		<SortableList items={items} onOrderChange={() => {}} renderData={() => {}}/>
	)
	expect(component).toMatchSnapshot()
})

it("Should render needed components", () => {
	const component = mount(
		<SortableList items={items} onOrderChange={() => {}} renderData={(item) => <div>{item}</div>}/>
	)
	const list = component.find(".list-group")
	expect(list).toHaveLength(1)
	const listItems = list.find(".sortable-list-item")
	expect(listItems).toHaveLength(items.length)
	for (let i=0; i<items.length; i++) {
		expect(listItems.at(i).props().children.props.children).toStrictEqual(items[i])
	}
})
