import React from 'react';
import {Limb} from "./Limb";

export const limbType = {
	leftHand: "leftHand",
	rightHand: "rightHand",
	leftFoot: "leftFoot",
	rightFoot: "rightFoot",
	weight: "weight"
}

export function LimbsDisplay(props){
		return(

			<div>
				<div className = "limbRow topRow">
					<div>
						{props.limbsData.limbsToDisplay.find((element) => element == limbType.leftHand) && <Limb/>}
					</div>
					<div>
						{props.limbsData.limbsToDisplay.find((element) => element == limbType.rightHand) && <Limb/>}
					</div>
				</div>				
					{props.children}
				<div className = "limbRow bottomRow">
					<div>
						{props.limbsData.limbsToDisplay.find((element) => element == limbType.leftFoot) && <Limb/>}
					</div>
					<div>
						{props.limbsData.limbsToDisplay.find((element) => element == limbType.rightFoot) && <Limb/>}
					</div>
				</div>
			</div>

		)
	}





