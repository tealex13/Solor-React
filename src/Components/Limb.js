import React from 'react';

export function Limb(props) {

	//{ActiveLimbsArray setActiveLimb} = useContext("contextinitializedinparent")

	//sel
	// constructor(props){
	// 	super(props);
	// 	// alert(this.props.type);
	// }

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



