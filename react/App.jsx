/*global ymaps*/
import React from "react"
import SortableList from "./components/SortableList.jsx"
import InputForm from "./components/InputForm.jsx"

export default class App extends React.Component {
  state = {
  	wayPoints: [],
  	yaMap: {},
  }

  init = () => {
  	this.setState({
  		yaMap: new ymaps.Map("map", {
  			center: [55.76, 37.64,],
  			zoom: 10,
  		}),
  	})
  }

  refactorWayPoints() {
  	this.state.yaMap.geoObjects.removeAll()
  	for (let i=0; i<this.state.wayPoints.length; i++) {

    	let preset
  		switch (i) {
    		case 0:
    			preset = "islands#blueHomeCircleIcon"
  			break
  		case this.state.wayPoints.length-1:
  			preset = "islands#blueGovernmentCircleIcon"
  			break
  		default:
  			preset = "islands#blueCircleDotIcon"
  		}

  		let newWayPoint = new ymaps.Placemark(this.state.wayPoints[i].coords, {}, { draggable: true, preset, })
  		newWayPoint.properties.set("index", i)
  		newWayPoint.properties.set("name", this.state.wayPoints[i].name)
  		this.state.yaMap.geoObjects.add(newWayPoint)

  		newWayPoint.events.add("dragend", e => {
  			this.onWayPointDrag(e.get("target").properties.get("index"), e.get("target").geometry.getCoordinates())
  		})

  		newWayPoint.events.add("click", e => {
  			this.state.yaMap.balloon.open(e.get("target").geometry.getCoordinates(), {
  				contentHeader: e.get("target").properties.get("name")
            || e.get("target").geometry.getCoordinates().map(it => Math.round(it * 1000000)/1000000).join("; "),
  			})
  		})
  	}

  	if (this.state.wayPoints.length > 1) {
  		let routeLine = new ymaps.Polyline(
      		this.state.wayPoints.map(wayPoint => wayPoint.coords),
  			{},
  			{ strokeWidth: 6, }
  		)
  		this.state.yaMap.geoObjects.add(routeLine)
  	}
  }

  onWayPointAdd = async name => {
  	name = name[0].toUpperCase() + name.slice(1)
  	try {
  		let wayPointToAdd = await ymaps.geocode(name)
  		let coords = wayPointToAdd.geoObjects.get(0).geometry.getCoordinates()
  		this.state.wayPoints.push({ name, coords, })
  		this.state.yaMap.setCenter(coords)
  		this.forceUpdate()
  	} catch (err) {
  		alert("Search error!")
  	}
  }

  onWayPointDrag = async (index, coords) => {
  	this.state.wayPoints[index].coords = coords
  	let newWayPointName
  	try {
  		let reverseGeocoder = await ymaps.geocode(coords, { kind: "house", })
  		newWayPointName = reverseGeocoder.geoObjects.get(0).properties.get("name")
  	} catch (err) {
  		newWayPointName = ""
  	}
  	this.state.wayPoints[index].name = newWayPointName
  	this.forceUpdate()
  }

  onWayPointRemove = index => {
  	this.state.wayPoints.splice(index, 1)
  	this.forceUpdate()
  }

  onWayPointOrderChange = wayPointsUpdated => {
  	this.setState({
  		wayPoints: wayPointsUpdated,
  	})
  }

  renderWayPointListItem = (value, sortIndex) =>
  	<React.Fragment>
    	<div className="waypoint-name">
      	{value.name || value.coords.map(it => Math.round(it * 1000000)/1000000).join("; ")}
    	</div>
    	<button className="btn btn-danger" onClick={() => {this.onWayPointRemove(sortIndex)}}>Remove</button>
  	</React.Fragment>


  componentDidMount() {
  	ymaps.ready(this.init)
  }

  componentDidUpdate() {
  	this.refactorWayPoints()
  }

  render() {
  	return <React.Fragment>
  		<div className="waypoints-list-wrapper">
  			<InputForm onSubmit={this.onWayPointAdd}/>
  			<SortableList
  				items={this.state.wayPoints}
  				onOrderChange={this.onWayPointOrderChange}
  				renderData={this.renderWayPointListItem}
  			/>
  		</div>
  		<div id="map"></div>
  	</React.Fragment>
  }
}
