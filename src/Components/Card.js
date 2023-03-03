import React from 'react';
import './Card.css';

export default class Card extends React.Component{
	constructor(props){
		super(props);

	}
	render(){
		return(
			<span className = "Card" style = {
				{background: "white",
				margin: 10}}>
				{this.props.data.colors.map((color, index) => {
					return(
						<div key = {index}>
							<button 
								style={{
									background: color,
									width: 100,
									height: 100,
									margin: 10}}
							/>
						</div>
						)
				})}
			</span>

		)
	}
}