import React from 'react';
import './Card.css';

export function Card(props) {

	
	const displayColor = (index) => {
		const pipLocation = (index === 0) ? "topPip" : "bottomPip";
		const backgroundColor = props.unusedMoves.includes(props.data.colors[index]) && !(props.useStatus === "used") ?
			props.data.colors[index]: "grey";
		return (<div  style={{background: backgroundColor}} className = {"cardColor " + pipLocation}>
				</div>);
	}
	return(
		<span className = {props.useStatus + " card"}>
			{props.state.wild ? 
				<>
					<div className = "centerPip">
						<img src={require("./Arrow.png")} alt="right Arrow" className = "arrow leftFacing"/>
						<img src={require("./Arrow.png")} alt="right Arrow" className = "arrow rightFacing"/>
					</div>
					<button className = "wild" onClick = {props.handleClick}/>
				</>:
				<>
					{displayColor(0)}
					<img src={require("./Arrow.png")} alt="right Arrow" className = {"arrow " + props.data.weightDir + "Facing" + " centerPip"}/>
					{displayColor(1)}
					<button className = "wild" onClick = {props.handleClick}/>
				</>
			}
			
		</span>
	)
}
//transform: scalex{-1};
//classNamr ={${wieghtDir === dirs.left} ? ""} 

