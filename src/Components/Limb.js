import React from 'react';

export function Limb(props) {


	const handleClick = () => {
		props.handleClick(props.type);
	};


	return(
		<button 
			onClick = {handleClick}
			style={{
				background: "white",
				width: 30,
				height: 30}}
		/>

	)

}



