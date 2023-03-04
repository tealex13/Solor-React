import React from 'react';
import Limb from "./Limb";
import './Hold.css'


export default class Hold extends React.Component{
	constructor(props){
		super(props);

	}
	render(){
		return(
			<div className = "hold">
				<div className = "limbRow topRow">
					<Limb/>
					<Limb/>
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
					<Limb/>
					<Limb/>
				</div>
			</div>

		)
	}
}

Hold.defaultProps = {
	leftHand: false,
	rightHand: false,
	leftFoot: false,
	rightFoot: false,
	weight: false
}