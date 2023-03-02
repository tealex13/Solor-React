import React from 'react';
import {calcRowLen,calculateTotalHolds,mapFromBoard, mapLastInRowFromBoard} from "../Helper Functions/board calculator";
import {shuffleArray} from "../Helper Functions/Generic Helpers"
import Hold from "./Hold.js";
import uuid from 'react-uuid';

class Game extends React.Component{
	constructor(props){
		super(props);
		const wallData = this.generateWallData(this.props.nRows, this.props.nCols);
		this.state = {wallData: wallData}
	}

	generateWallData(nRows, nCols){
		const colors  = this.mapColorsToHolds();
		let tempRows = [];
		for (var i = 0; i < nRows; i++) {
			tempRows[i] = {ID: uuid(),
				Data: this.generateRowData(nCols, i, colors.slice(mapFromBoard(i,0,nCols),mapLastInRowFromBoard(i,nCols)+1))};
		}
		return (tempRows);
	}

	generateRowData(nCols, rowIndex, colors){
		let tempRow = [];
		for (var j = 0; j < calcRowLen(nCols,rowIndex); j++) {
			tempRow[j] = {ID: uuid(), data: {color: colors[j]}};
		}
		return tempRow;
	}

	mapColorsToHolds(){
		let tempColors = [];
		const iterNum = Math.ceil(calculateTotalHolds(this.props.nRows, this.props.nCols)/colorsArray.length);
		for (var i = 0; i < iterNum; i++) {
			tempColors = tempColors.concat(colorsArray);
		}
		shuffleArray(tempColors,this.props.boardSeed);
		return tempColors;
	}

	render(){
		return(
			this.state.wallData.reverse().map((row) => {
				return(
					<div key = {row.ID}>
						{row.Data.reverse().map((hold) => {
							return <Hold holdData = {hold.data} key = {hold.ID} />
						})}
					</div>
				)	
			})
		)
	}
}



const colorsArray = ["white","orange","green","purple","black","red"];

Game.defaultProps = {
	nRows: 10,
	nCols: 6,
	boardSeed: 1234,
	cardSeed: 4321


};
export default Game;