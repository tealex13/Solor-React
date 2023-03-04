import React from 'react';
import './Card.css';

export default class Card extends React.Component{
	constructor(props){
		super(props);

	}
	render(){
		return(
			<span className = "card">
				{this.props.data.colors.map((color, index) => {
					return(
						<div  style={{background: color}} className = "cardColor">
						</div>
						)
				})}
			</span>

		)
	}
}

