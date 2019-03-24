import * as React from 'react';
import SortableList from './components/SortableList';
import InputForm from './components/InputForm';

declare const ymaps: any;

export interface WayPoint {
  name?: string;
  coords: number[];
}

export interface RenderListItem {
  (value: WayPoint, index: number): React.ReactNode;
}

const App: React.FunctionComponent = () => {
  const [wayPoints, setWayPoints] = React.useState<WayPoint[]>([]);
  const [yaMap, setYaMap] = React.useState<any>({});

  const init: () => void = () => {
    setYaMap(
      new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 10,
      }),
    );
  };

  const onWayPointAdd: (name: string) => Promise<void> = async name => {
    name = name[0].toUpperCase() + name.slice(1);
    try {
      const wayPointToAdd = await ymaps.geocode(name);
      const coords = wayPointToAdd.geoObjects.get(0).geometry.getCoordinates();
      setWayPoints([...wayPoints, { name, coords }]);
      yaMap.setCenter(coords);
    } catch (err) {
      alert('Search error!');
    }
  };

  const onWayPointDrag: (index: number, coords: number[]) => Promise<void> = async (index, coords) => {
    let newWayPointName: string;
    try {
      const reverseGeocoder = await ymaps.geocode(coords, { kind: 'house' });
      newWayPointName = reverseGeocoder.geoObjects.get(0).properties.get('name');
    } catch (err) {
      newWayPointName = '';
    }
    setWayPoints(
      wayPoints.map((wayPoint: WayPoint, ind: number) =>
        (ind === index ? { ...wayPoint, name: newWayPointName, coords } : wayPoint)
      )
    );
  };

  const onWayPointRemove: (index: number) => void = index => {
    setWayPoints(wayPoints.filter((wayPoint: WayPoint, ind: number) => ind !== index));
  };

  const refactorWayPoints: () => void = () => {
    if (yaMap.geoObjects) {
      yaMap.geoObjects.removeAll();
      for (let i = 0; i < wayPoints.length; i++) {
        let preset;
        switch (i) {
          case 0:
            preset = 'islands#blueHomeCircleIcon';
            break;
          case wayPoints.length - 1:
            preset = 'islands#blueGovernmentCircleIcon';
            break;
          default:
            preset = 'islands#blueCircleDotIcon';
        }

        const newWayPoint = new ymaps.Placemark(wayPoints[i].coords, {}, { draggable: true, preset });
        newWayPoint.properties.set('index', i);
        newWayPoint.properties.set('name', wayPoints[i].name);
        yaMap.geoObjects.add(newWayPoint);

        newWayPoint.events.add('dragend', (e: any) => {
          onWayPointDrag(e.get('target').properties.get('index'), e.get('target').geometry.getCoordinates());
        });

        newWayPoint.events.add('click', (e: any) => {
          yaMap.balloon.open(e.get('target').geometry.getCoordinates(), {
            contentHeader:
                            e.get('target').properties.get('name')
                            || e
                              .get('target')
                              .geometry.getCoordinates()
                              .map((it: number) => Math.round(it * 1000000) / 1000000)
                              .join('; '),
          });
        });
      }

      if (wayPoints.length > 1) {
        const routeLine = new ymaps.Polyline(
          wayPoints.map((wayPoint: WayPoint) => wayPoint.coords),
          {},
          { strokeWidth: 6 }
        );
        yaMap.geoObjects.add(routeLine);
      }
    }
  };

  const renderWayPointListItem: RenderListItem = (value, sortIndex) => (
    <React.Fragment>
      <div className="waypoint-name">
        {value.name || value.coords.map((it: number) => Math.round(it * 1000000) / 1000000).join('; ')}
      </div>
      <button
        className="btn btn-danger"
        onClick={() => {
          onWayPointRemove(sortIndex);
        }}
      >
          Remove
      </button>
    </React.Fragment>
  );

  React.useEffect(() => {
    ymaps.ready(init);
  }, []);

  React.useEffect(refactorWayPoints);

  return (
    <React.Fragment>
      <div className="waypoints-list-wrapper">
        <InputForm onSubmit={onWayPointAdd} />
        <SortableList items={wayPoints} onOrderChange={setWayPoints} renderData={renderWayPointListItem} />
      </div>
      <div id="map" />
    </React.Fragment>
  );
};

export default App;
