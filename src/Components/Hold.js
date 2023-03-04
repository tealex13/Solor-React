import React from 'react';
import {Limb, limbType} from "./Limb";
import './Hold.css'


export default class Hold extends React.Component{
	constructor(props){
		super(props);

	}
	render(){
		return(
			<div className = "hold">
				<div className = "limbRow topRow">
					<div>
						{this.props.holdData.limbsToDisplay.find((element) => element == limbType.leftHand) && <Limb/>}
					</div>
					<div>
						{this.props.holdData.limbsToDisplay.find((element) => element == limbType.rightHand) && <Limb/>}
					</div>
				</div>
				<div>
					<button className = "holdColor"
						style={{
							background: this.props.holdData.color,
							width: 100,
							height: 100}}
					/>
				</div>
				<div className = "limbRow bottomRow">
					<div>
						{this.props.holdData.limbsToDisplay.find((element) => element == limbType.leftFoot) && <Limb/>}
					</div>
					<div>
						{this.props.holdData.limbsToDisplay.find((element) => element == limbType.rightFoot) && <Limb/>}
					</div>
				</div>
			</div>

		)
	}
}

Hold.defaultProps = {
	holdData: {limbsToDisplay: []}
}