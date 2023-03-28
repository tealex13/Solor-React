import React from 'react';
import rightHand from "../../Images/rightHand.png"
import leftHand from "../../Images/leftHand.png"
import rightFoot from "../../Images/rightFoot.png"
import leftFoot from "../../Images/leftFoot.png"
import weight from "../../Images/weight.png"
import "./Limb.css"

export function Limb(props) {


	const handleClick = () => {
		props.handleClick(props.limbType);
	};

	const image = () => {
		switch(props.limbType){
		case "rightHand":
			return rightHand;
		case "leftHand":
			return leftHand;
		case "rightFoot":
			return rightFoot;
		case "leftFoot":
			return leftFoot;
		case "weight"	:
			return weight;
		}
	}	

	const color =  props.selected? "lightblue" : 'rgba(0,0,0,0)';
	return(
		<div className = "Limb">
			<button 
				onClick = {handleClick} style = {{backgroundColor: color}}>
				<img src = {image()} style = {{width: 50, height: 50}}/>
			</button>
		</div>

	)

}



