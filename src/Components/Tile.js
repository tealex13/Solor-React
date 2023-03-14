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

		const handleClick = (limb) => () => {
			props.limbsData[limb].handleClick(limb);
		}

		return(
			<div>
				<div className = "limbRow topRow">
					<div>
						{props.limbsData[limbType.leftHand] ? 
						<Limb handleClick = {handleClick(limbType.leftHand)}/> : null}
					</div>
					<div>
						{props.limbsData[limbType.rightHand] ? 
						<Limb handleClick = {handleClick(limbType.rightHand)}/> : null} 
					</div>
				</div>				
					{React.cloneElement(props.children, {children: (props.limbsData[limbType.weight] ? 
						<Limb handleClick = {handleClick(limbType.weight)}/> : null)})}
				 <div className = "limbRow bottomRow">
					<div>
						{props.limbsData[limbType.leftFoot] ? 
						<Limb handleClick = {handleClick(limbType.leftFoot)}/> : null}
					</div>
					<div>
						{props.limbsData[limbType.rightFoot] ? 
						<Limb handleClick = {handleClick(limbType.rightFoot)}/> : null} 
					</div>
				</div>
			</div>

		)
	}

Tile.defaultProps = {
	limbsData:{}
}



