import React from 'react';

export default class Card extends React.Component{
	constructor(props){
		super(props);

	}
	render(){
		return(
			<button 
				style={{
					background: "white",
					width: 200,
					height: 300,
					margin: 10}}
			/>

		)
	}
}