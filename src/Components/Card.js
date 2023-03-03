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
				<div>
				<button 
					style={{
						background: this.props.data.firstColor,
						width: 100,
						height: 100,
						margin: 10}}
				/>
			</div>
			<div>
				<button 
					style={{
						background: this.props.data.secondColor,
						width: 100,
						height: 100,
						margin: 10}}
				/>
				</div>
			</span>

		)
	}
}