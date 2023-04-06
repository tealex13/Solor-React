import React from 'react';
import {Limb} from "../Limb/Limb";
import "./Tile.css"
import * as st from "../../Helper Functions/Shared Types";

export const limbType = {
	leftHand: "leftHand",
	rightHand: "rightHand",
	leftFoot: "leftFoot",
	rightFoot: "rightFoot",
	weight: "weight"
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
						<Limb limbType = {limbType.weight} handleClick = {props.limbsData[limbType.weight].handleClick} selected = {props.limbsData.weight.selected}/> : null}
				</div>
				<div className = "top left overlay">
					{props.limbsData[limbType.leftFoot] ? 
						<Limb limbType = {limbType.leftFoot} handleClick = {props.limbsData[limbType.leftFoot].handleClick} selected = {props.limbsData.leftFoot.selected}/> : null}
				</div>
				<div className = "top right overlay">
					{props.limbsData[limbType.rightFoot] ? 
						<Limb limbType = {limbType.rightFoot} handleClick = {props.limbsData[limbType.rightFoot].handleClick} selected = {props.limbsData.rightFoot.selected}/> : null} 
				</div>
				<div className = "top left overlay">
					{props.limbsData[limbType.leftHand] ? 
						<Limb limbType = {limbType.leftHand} handleClick = {props.limbsData[limbType.leftHand].handleClick} selected = {props.limbsData.leftHand.selected}/> : null}
				</div>
				<div className = "top right overlay">
					{props.limbsData[limbType.rightHand] ? 
						<Limb limbType = {limbType.rightHand} handleClick = {props.limbsData[limbType.rightHand].handleClick} selected = {props.limbsData.rightHand.selected}/> : null} 
				</div>
				
			</div>

		)
	}

Tile.defaultProps = {
	limbsData:{}
}



