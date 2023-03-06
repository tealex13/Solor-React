import React from 'react';
import {calcRowLen,calculateTotalHolds,mapFromBoard, mapLastInRowFromBoard} from "../Helper Functions/board calculator";
import {shuffleArray} from "../Helper Functions/Generic Helpers"
import Hold from "./Hold.js";
import uuid from 'react-uuid';
import Card from "./Card.js";
import {LimbsDisplay} from "./LimbsDisplay.js";
import {Limb, limbType} from "./Limb.js";
import './Game.css';

class Game extends React.Component{
	constructor(props){
		super(props);
		const drawPile = this.generateDrawPile();
		shuffleArray(drawPile, this.props.cardSeed);
		this.state = {drawIndex: 0, 
			drawPile: drawPile, 
			displayDraw: true,
			limbData: [{type: limbType.leftHand, coords: [0,0], isAtStart: false},
				{type: limbType.rightHand, coords: [0,0], isAtStart: false},
				{type: limbType.leftFoot, coords: [2,2], isAtStart: false},
				{type: limbType.rightFoot, coords: [1,2], isAtStart: false},
				{type: limbType.weight, coords: [4,4], isAtStart: true}]
		}

		this.drawCards = this.drawCards.bind(this);
	}

	generateWallData(nRows, nCols){
		const colors  = this.mapColorsToHolds();
		let wall = [];
		for (var i = 0; i < nRows; i++) {
			wall[i] = {ID: uuid(),
				data: this.generateRowData(nCols, i, colors.slice(mapFromBoard(i,0,nCols),mapLastInRowFromBoard(i,nCols)+1))};
		}
		this.state.limbData.filter((limbData) => (!limbData.isAtStart)).map((limbData) => (wall[limbData.coords[0]].data[limbData.coords[1]].data.limbsToDisplay.push(limbData.type)));
		return (wall);
	}

	generateLimbStart(){
		this.state.limbData.filter((limbData) => (limbData.isAtStart));
	}

	generateRowData(nCols, rowIndex, colors){
		let tempRow = [];
		for (var j = 0; j < calcRowLen(nCols,rowIndex); j++) {
			tempRow[j] = {ID: uuid(), data: {color: colors[j], limbsToDisplay: []}};
		}
		return tempRow;
	}

	generateCardDisplay(nCardDraw){
		const lastCardInDisplay = (this.state.drawIndex + nCardDraw) > this.state.drawPile.length ? this.state.drawPile.length : this.state.drawIndex + nCardDraw;
		return this.state.drawPile.slice(this.state.drawIndex,lastCardInDisplay);

	}

	generateDrawPile(){
		const drawPile = colorsArray.map((firstColor,index) => {
			return (colorsArray.slice(index, colorsArray.length).map(secondColor => {
				return ({ID: uuid(), data: {colors: [firstColor, secondColor]}})
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

	drawCards(){
		const newDrawIndex = this.state.drawIndex + this.props.nCardDraw;
		this.setState({drawIndex: newDrawIndex, 
			displayDraw: newDrawIndex + this.props.nCardDraw < this.state.drawPile.length});

	}

	render(){
		const wallData = this.generateWallData(this.props.nRows, this.props.nCols)
		const cardDisplay = this.generateCardDisplay(this.props.nCardDraw);
		const limbsAtStart = {limbsToDisplay: this.state.limbData.filter((data) => (data.isAtStart)).map((data)=>(data.type))};
		console.log(limbsAtStart.lenght === 0);
		return(
			<>
				<div>
				{wallData.reverse().map((row) => {
					return(
						<div key = {row.ID} className = "row">
							{row.data.map((hold) => {
								return (<LimbsDisplay key = {hold.ID} limbData = {hold.data}>
									<Hold holdData = {hold.data}/>
									</LimbsDisplay>)
							})}
						</div>
					)	
				})}
				</div>
				<div>
					{limbsAtStart.limbsToDisplay.length > 0 && (<LimbsDisplay limbData = {limbsAtStart}>
						<Hold/>
					</LimbsDisplay>)}
				
				</div>
				<div className = "playerControls">
					<div className ="cardDisplay">
						{cardDisplay.map((card) => {
							return(<Card key = {card.ID} data = {card.data}/>
								)
						})
						}
					</div>
					{this.state.displayDraw &&
						<button onClick = {this.drawCards}> 
							Draw
						</button>
					}	
				</div>	
				
			</>

		)
	}
}



const colorsArray = ["white","orange","green","purple","black","red"];

Game.defaultProps = {
	nRows: 6,
	nCols: 6,
	boardSeed: 1234,
	cardSeed: 4321,
	nCardDraw: 3


};
export default Game;