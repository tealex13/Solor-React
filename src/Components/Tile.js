import React from 'react';
import {Limb} from "./Limb";

export const limbType = {
	leftHand: "leftHand",
	rightHand: "rightHand",
	leftFoot: "leftFoot",
	rightFoot: "rightFoot",
	weight: "weight"
}

export function Tile(props){
		// console.log(props.limbsData[limbType.leftHand]? "hello0" : "not found");
		// console.log(props.limbsData.find((element) => (Object.keys(element).find((element) => (element === limbType.rightHand)))));
		// console.log(Object.keys(props.limbsData[0]).find((element) => (element === limbType.leftHand)));

		return(
			<div>
				<div className = "limbRow topRow">
					<div>
						{props.limbsData[limbType.leftHand] ? 
						<Limb type = {limbType.leftHand} handleClick = {props.limbsData[limbType.leftHand].handleClick}/> : null}
					</div>
					<div>
						{props.limbsData[limbType.rightHand] ? 
						<Limb type = {limbType.rightHand}/> : null} 
					</div>
				</div>				
					{React.cloneElement(props.children, { children: (props.limbsData[limbType.weight] ? <Limb type = {limbType.weight}/> : null)})}
				 <div className = "limbRow bottomRow">
					<div>
						{props.limbsData[limbType.leftFoot] ? 
						<Limb type = {limbType.leftFoot}/> : null}
					</div>
					<div>
						{props.limbsData[limbType.rightFoot] ? 
						<Limb type = {limbType.rightFoot}/> : null} 
					</div>
				</div>
			</div>

		)
	}

Tile.defaultProps = {
	limbsData:{limbsToDisplay: []}
}



