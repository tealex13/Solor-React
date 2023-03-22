import React from 'react';
import './Hold.css'

export default function Hold(props){
	return(
		<div>
			<button className = "holdColor"
				style={{
					background: props.holdData.color,
					width: 100,
					height: 100}}
				onClick = {props.holdData.handleClick}
			>
			{props.children}
			</button>
		</div>
	)
}

Hold.defaultProps = {
	holdData: {limbsToDisplay: []}
}