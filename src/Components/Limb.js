import React from 'react';

export const limbType = {
	leftHand: "leftHand",
	rightHand: "rightHand",
	leftFoot: "leftFoot",
	rightFoot: "rightFoot",
	weight: "weight"
}

export class Limb extends React.Component{
	constructor(props){
		super(props);

	}
	render(){
		return(
			<button 
				style={{
					background: "white",
					width: 30,
					height: 30}}
			/>

		)
	}
}



