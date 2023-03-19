import React from 'react';
import {Limb} from "./Limb";
import "./Tile.css"

export const limbType = {
	leftHand: "leftHand",
	rightHand: "rightHand",
	leftFoot: "leftFoot",
	rightFoot: "rightFoot",
	weight: "weight"
}

export const groupType = {
	hand: "hand",
	foot: "foot",
	left: "left",
	right: "right"
}

export function Tile(props){

		const handleClick = (limb) => () => {
			props.limbsData[limb].handleClick(limb);
		}

		return(
			<div className = "tile">
				<div className = "central background">
					{props.children}
				</div>
				<div className = "central overlay">
					{props.limbsData[limbType.weight] ?
						<Limb handleClick = {handleClick(limbType.weight)} selected = {props.limbsData.weight.selected}/> : null}
				</div>
				<div className = "top left overlay">
					{props.limbsData[limbType.leftHand] ? 
						<Limb handleClick = {handleClick(limbType.leftHand)} selected = {props.limbsData.leftHand.selected}/> : null}
				</div>
				<div className = "top right overlay">
					{props.limbsData[limbType.rightHand] ? 
						<Limb handleClick = {handleClick(limbType.rightHand)} selected = {props.limbsData.rightHand.selected}/> : null} 
				</div>
				<div className = "bottom left overlay">
					{props.limbsData[limbType.leftFoot] ? 
						<Limb handleClick = {handleClick(limbType.leftFoot)} selected = {props.limbsData.leftFoot.selected}/> : null}
				</div>
				<div className = "bottom right overlay">
					{props.limbsData[limbType.rightFoot] ? 
						<Limb handleClick = {handleClick(limbType.rightFoot)} selected = {props.limbsData.rightFoot.selected}/> : null} 
				</div>
				
			</div>

		)
	}

Tile.defaultProps = {
	limbsData:{}
}



