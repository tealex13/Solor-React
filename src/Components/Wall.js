import React from 'react';
import {calcRowLen,calculateTotal} from "../Helper Functions/board calculator";
import Hold from "./Hold.js";
import uuid from 'react-uuid';


class Wall extends React.Component{
	constructor(props){
		super(props);
		const wallData = this.generateWallData(this.props.nRows, this.props.nCols);
		this.state = {wallData: wallData}
	}

	generateWallData(nRows, nCols){
		let tempRows = [];
		for (var i = 0; i < nRows; i++) {
			tempRows[i] = {ID: uuid(), Data: new Array(calcRowLen(nCols,i))};
			tempRows[i].Data = this.generateRowData(nCols, i);
		}
		return (tempRows);
	}

	generateRowData(nCols, rowIndex){
		let tempRow = []
		for (var j = 0; j < calcRowLen(nCols,rowIndex) - 1; j++) {
			tempRow[j] = {ID: uuid(), color: "red"};
		}
		return tempRow;
	}

	render(){
		let rowTemp = [];
		return(
				this.state.wallData.map((row) => {
					rowTemp = row.Data;
					return(
						<div key = {row.ID}>
						{rowTemp.map((hold) => {
							return(
								<Hold key = {hold.ID} />
								)
						})}
						</div>
					)	
				})

			)
	}
}

const colors = ["white","blue","green","purple","black","red"];

Wall.defaultProps = {
	nRows: 6,
	nCols: 6

};
export default Wall;