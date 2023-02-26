import React from 'react';
import {calcRowLen,calculateTotal} from "../Helper Functions/board calculator";
class Wall extends React.Component{
	constructor(props){
		super(props);
		const rows = this.generateRows(this.props.nRows, this.props.nCols);
		this.state = {rows: rows}
	}

	generateRows(nRows, nCols){
		console.log(nRows);
		let tempRows = [];
		for (var i = 0; i < nRows; i++) {
			tempRows[i] = new Array(calcRowLen(nCols,i));
		}
		return (tempRows);
	}

	render(){
		var materials = [
		  'Hydrogen',
		  'Helium',
		  'Lithium',
		  'Beryllium'
		];
		return(
			<div>
				{this.state.rows.map((hold,index) => index)}
			</div>
			)
	}
}

Wall.defaultProps = {
	nRows: 6,
	nCols: 7

};
export default Wall;