import React from 'react';
import './Card.css';

export function Card(props) {

	
	const displayColor = (index) => {
		const pipLocation = (index === 0) ? "topPip" : "bottomPip";
		return (<div  style={{background: props.data.colors[index]}} className = {"cardColor " + pipLocation}>
				</div>);
	}
	return(
		<span className = "card">

			<>
				
				{displayColor(0)}
				<img src={require("./Arrow.png")} alt="right Arrow" className = {"arrow " + props.data.weightDir + "Facing" + " centerPip"}/>
				{displayColor(1)}
				<button className = "wild" onClick = {props.data.handleClick}/>
			</>
		</span>
	)
}
//transform: scalex{-1};
//classNamr ={${wieghtDir === dirs.left} ? ""} 

