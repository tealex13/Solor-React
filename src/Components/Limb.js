import React from 'react';

export function Limb(props) {


	const handleClick = () => {
		props.handleClick(props.type);
	};

	const color =  props.selected? "grey" : "white";
	return(
		<button 
			onClick = {handleClick}
			style={{
				backgroundColor: color,
				width: 30,
				height: 30}}
		/>

	)

}



