import React from 'react';
import './Card.css';

export function Card(props) {
	const displayColor = (index) => {
		return (<div  style={{background: props.data.colors[index]}} className = "cardColor">
				</div>);
	}
	return(
		<span className = "card">

			<>
				{displayColor(0)}
				<img src={require("./Arrow.png")} alt="right Arrow" className = {"arrow " + props.data.weightDir}/>
				{displayColor(1)}
			</>
		</span>
	)
}
//transform: scalex{-1};
//classNamr ={${wieghtDir === dirs.left} ? ""} 

