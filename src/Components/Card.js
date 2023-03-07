import React from 'react';
import './Card.css';

export function Card(props) {
	return(
		<span className = "card">
			{props.data.colors.map((color, index) => {
				return(
					<div  style={{background: color}} className = "cardColor">
					</div>
					)
			})}
		</span>
	)
}

