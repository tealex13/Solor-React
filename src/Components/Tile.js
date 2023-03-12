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

		return(
			<div>
				<div className = "limbRow topRow">
					<div>
						{props.limbsData.find((element) => element.type == limbType.leftHand) ? 
						<Limb type = {limbType.leftHand} handleClick = {props.handleClick}/> : null}
					</div>
					<div>
						{props.limbsData.find((element) => element.type == limbType.rightHand) ? 
						<Limb type = {limbType.rightHand}/> : null} 
					</div>
				</div>				
					{React.cloneElement(props.children, { children: props.limbsData.find((element) => element.type == limbType.weight) ? <Limb type = {limbType.leftHand}/> : null})}
				 <div className = "limbRow bottomRow">
					<div>
						{props.limbsData.find((element) => element.type == limbType.leftFoot) ? 
						<Limb type = {limbType.leftFoot}/> : null}
					</div>
					<div>
						{props.limbsData.find((element) => element.type == limbType.rightFoot) ? 
						<Limb type = {limbType.rightFoot}/> : null} 
					</div>
				</div>
			</div>

		)
	}

Tile.defaultProps = {
	limbsData:{limbsToDisplay: []}
}



