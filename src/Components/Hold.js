import React from 'react';
import {Limb, limbType} from "./Limb";
import './Hold.css'


export default class Hold extends React.Component{
	constructor(props){
		super(props);

	}
	render(){
		return(
			<div>
				<button className = "holdColor"
					style={{
						background: this.props.holdData.color,
						width: 100,
						height: 100}}
				/>
			</div>
		)
	}
}

Hold.defaultProps = {
	holdData: {limbsToDisplay: []}
}