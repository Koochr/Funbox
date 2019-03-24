import * as React from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { WayPoint, RenderListItem } from '../App';

interface SortableListProps {
  items: WayPoint[];
  onOrderChange: (wayPoints: WayPoint[]) => void;
  renderData: RenderListItem;
}

const ListItem = SortableElement(
  ({ value, sortIndex, renderData }: { value: WayPoint; sortIndex: number; renderData: RenderListItem }) => (
    <div className="sortable-list-item list-group-item list-group-item-light">{renderData(value, sortIndex)}</div>
  ),
);

const ItemsList = SortableContainer(
  ({ items, renderData }: { items: WayPoint[]; renderData: RenderListItem }) => (
    <div className="list-group">
      {items.map((item: WayPoint, index: number) => (
        <ListItem key={`item-${index}`} index={index} sortIndex={index} value={item} renderData={renderData} />
      ))}
    </div>
  ));

const SortableList: React.FunctionComponent<SortableListProps> = props => {
  const onSortEnd: ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => void =
        ({ oldIndex, newIndex }) => {
          props.onOrderChange(arrayMove(props.items, oldIndex, newIndex));
        };

  return <ItemsList items={props.items} onSortEnd={onSortEnd} renderData={props.renderData} />;
};

export default SortableList;
