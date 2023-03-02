import React from 'react';
import {calcRowLen,calculateTotalHolds,mapFromBoard, mapLastInRowFromBoard} from "../Helper Functions/board calculator";
import {shuffleArray} from "../Helper Functions/Generic Helpers"
import Hold from "./Hold.js";
import uuid from 'react-uuid';
import Card from "./Card.js";

class Game extends React.Component{
	constructor(props){
		super(props);
		const drawPile = this.generateDrawPile();
		shuffleArray(drawPile, this.props.cardSeed);
		// this.state = {drawIndex: 0, drawPile: shuffleArray(this.generateDrawPile(), this.props.cardSeed)};
		this.state = {drawIndex: 0, drawPile: drawPile};
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

	generateCardDisplay(nCardDraw){
		return this.state.drawPile.slice(this.state.drawIndex,this.state.drawIndex+nCardDraw);

	}

	generateDrawPile(){
		const drawPile = colorsArray.map((firstColor,index) => {
			return (colorsArray.slice(index, colorsArray.length).map(secondColor => {
				return ({ID: uuid(), data: {firstColor: firstColor, secondColor: secondColor}})
			}))
		}).flat();
		return drawPile;
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
		const wallData = this.generateWallData(this.props.nRows, this.props.nCols)
		const cardDisplay = this.generateCardDisplay(this.props.nCardDraw);
		return(
			<>
				<div>
				{wallData.reverse().map((row) => {
					return(
						<div key = {row.ID}>
							{row.Data.reverse().map((hold) => {
								return <Hold holdData = {hold.data} key = {hold.ID} />
							})}
						</div>
					)	
				})}
				</div>
				<div>
					{cardDisplay.map((card) => {
						return(<Card key = {card.ID} data = {card.data}/>
							)
					})

					}
				</div>
				
			</>

		)
	}
}



const colorsArray = ["white","orange","green","purple","black","red"];

Game.defaultProps = {
	nRows: 3,
	nCols: 6,
	boardSeed: 1234,
	cardSeed: 4321,
	nCardDraw: 3


};
export default Game;