import React from 'react';
import './Hold.css'
import * as st from "../../Helper Functions/Shared Types";

export default function Hold(props){
	const getHoldGroup = () => {
		if (props.holdData.allowedGroupTypes){
			if (props.holdData.allowedGroupTypes.includes(st.groupType.hand) && props.holdData.allowedGroupTypes.includes(st.groupType.foot)){
				return ({image:"m24.324 6.4128 68.771 0.44226 18.354 27.862-47.543 48.649h-26.757l-32.948-53.071z"});
			} else if (props.holdData.allowedGroupTypes.includes(st.groupType.hand)){
				return({image:"m47.985 7.2973 25.651-0.66339 12.936 35.491 23.993 32.838-46.658 8.403h-26.757l-32.506-19.017z"});
			} else {
				return( {image:"m41.794 33.391 24.988-24.988 4.9754 24.656 21.947-19.072 14.429 18.52-3.7592 43.342-86.02 5.7494-14.595-53.292 25.651-18.575z"}); }	
		} else {
			return ("");
		}
	}

	return(
		<div className = "hold">
			<button className = {"holdColor"}
				onClick = {props.holdData.handleClick}
			>
				<svg version="1.1" viewBox="0 0 116 84" xmlns="http://www.w3.org/2000/svg" width = "110">
				 <g transform="translate(-.058099 -3.0408)">
				  <path d={getHoldGroup().image} fill={props.holdData.color} stroke="#000" strokeWidth="6.7238"/>
				 </g>
				</svg>
			</button>			
		</div>
	)
}

Hold.defaultProps = {
	holdData: {limbsToDisplay: []}
}