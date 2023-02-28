import React from 'react';

export default class Hold extends React.Component{
	constructor(props){
		super(props);

	}
	render(){
		return(
			<button 
				style={{
					background: "white",
					width: 100,
					height: 100,
					margin: 10}}
			/>

		)
	}
}