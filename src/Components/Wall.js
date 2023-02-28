import React from 'react';
import {calcRowLen,calculateTotal} from "../Helper Functions/board calculator";
import Hold from "./Hold.js";

class Wall extends React.Component{
	constructor(props){
		super(props);
		const rows = this.generateWall(this.props.nRows, this.props.nCols);
		this.state = {rows: rows}
	}

	generateWall(nRows, nCols){
		console.log(nRows);
		let tempRows = [];
		for (var i = 0; i < nRows; i++) {
			tempRows[i] = new Array(calcRowLen(nCols,i));
		}
		return (tempRows);
	}

	render(){

		return(
			<div>
			  {this.state.rows.map((row) =>(<Hold/>

			  	))}
			</div>
			)
	}
}

const colors = ["white","blue","green","purple","black","red"];

Wall.defaultProps = {
	nRows: 6,
	nCols: 7

};
export default Wall;