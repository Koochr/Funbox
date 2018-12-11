import React from "react"
import PropTypes from "prop-types"
import { SortableContainer, SortableElement, arrayMove, } from "react-sortable-hoc"

const ListItem = SortableElement(({ value, sortIndex, renderData, }) =>
	<div className="sortable-list-item list-group-item list-group-item-light">
		{renderData(value, sortIndex)}
	</div>
)

const ItemsList = SortableContainer(({ items, renderData, }) => {
	return (
		<div className="list-group">
			{items.map((item, index) => (
				<ListItem
					key={`item-${index}`}
					index={index}
					sortIndex={index}
					value={item}
					renderData={renderData}
				/>
			))}
		</div>
	)
})

export default class WayPointsList extends React.Component {
  static propTypes = {
  	items: PropTypes.array.isRequired,
  	onOrderChange: PropTypes.func.isRequired,
  	renderData: PropTypes.func.isRequired,
  }

  onSortEnd = ({ oldIndex, newIndex, }) => {
  	this.props.onOrderChange(arrayMove(this.props.items, oldIndex, newIndex))
  }

  render() {
  	const { items, renderData, } = this.props
  	return <ItemsList items={items} onSortEnd={this.onSortEnd} renderData={renderData} />
  }
}
