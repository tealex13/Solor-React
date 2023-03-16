import React from 'react';
import {calcRowLen,calculateTotalHolds,mapFromBoard, mapLastInRowFromBoard,dist} from "../Helper Functions/board calculator";
import {shuffleArray} from "../Helper Functions/Generic Helpers"
import Hold from "./Hold.js";
import uuid from 'react-uuid';
import {Card} from "./Card.js";
import {Tile, limbType} from "./Tile.js";
import {Limb} from "./Limb.js";
import './Game.css';

class Game extends React.Component{
	constructor(props){
		super(props);
		const drawPile = this.generateDrawPile();
		shuffleArray(drawPile, this.props.cardSeed);
		this.state = {drawIndex: 0, 
			drawPile: drawPile, 
			displayDraw: true,

			limbData: {leftHand: {coords: [2,2], isAtStart: false, selected: false, group: ["left","hand"]},
				rightHand: {coords: [2,2], isAtStart: false, selected: false, group: ["right","hand"]},
				leftFoot: {coords: [2,2], isAtStart: false, selected: false, group: ["left","foot"]},
				rightFoot: {coords: [2,2], isAtStart: false, selected: false, group: ["right","foot"]},
				weight: {coords: [2,2], isAtStart: false, selected: false, group:[]}},
		}

		this.drawCards = this.drawCards.bind(this);
		this.selectLimb = this.selectLimb.bind(this);
		this.deselectLimb = this.deselectLimb.bind(this);
		this.limbHandleClick = this.limbHandleClick.bind(this);
		this.moveLimbs = this.moveLimbs.bind(this);
		this.holdHandleClick = this.holdHandleClick.bind(this);
	}

// Object.values(limbType).map((type) => this.state.limbData[type])

	generateTilesData(nRows, nCols){
		const holdData  = this.generateHoldData();
		let tiles = this.mapHoldsToTiles(nRows, nCols, holdData);	
		this.mapLimbsToTiles(tiles);
		return tiles;
	}

	generateHoldData(){
		let holdData = [];
		const nTotalTiles =  calculateTotalHolds(this.props.nRows, this.props.nCols);
		const iterNum = Math.ceil(nTotalTiles/colorsArray.length);
		for (var i = 0; i < iterNum; i++) {
			holdData = holdData.concat(colorsArray.map((color) =>({color: color})));
		}
		shuffleArray(holdData,this.props.boardSeed);
		holdData = holdData.slice(0,nTotalTiles);
		return holdData;
	}

	mapHoldsToTiles(nRows, nCols, holdData){
		let tiles = [];
		for (var i = 0; i < nRows; i++) {
			tiles[i] = {ID: uuid(),
				data: this.generateRowData(nCols, i, holdData.slice(mapFromBoard(i,0,nCols),mapLastInRowFromBoard(i,nCols)+1))};
		}
		return tiles;
	}

	generateRowData(nCols, rowIndex, holdData){
		let tempRow = [];
		for (var j = 0; j < calcRowLen(nCols,rowIndex); j++) {
			tempRow[j] = {ID: uuid(), holdData: {...holdData[j], ...{handleClick: this.holdHandleClick([rowIndex,j])}}, limbsData: {}};
		}
		return tempRow;
	}

	mapLimbsToTiles(tiles){
		Object.entries(this.state.limbData)
		.filter(([key,value]) => (!value.isAtStart))
		.map(([key,value]) => {
			let tempLimbsData = tiles[value.coords[0]].data[value.coords[1]].limbsData;
			return (tiles[value.coords[0]].data[value.coords[1]].limbsData = {...tempLimbsData, ...this.formatLimbsForTile(key,value)});
		});
		return (tiles);
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

	limbHandleClick(limb){
		if(this.state.limbData[limb].selected){
			this.deselectLimb(limb);
		} else {
			this.selectLimb(limb);
		}
	}

	selectLimb = (limb) => {
		const tempLimbState = {...this.state.limbData, ...{[limb] : {...this.state.limbData[limb], ...{selected:true}}}};
		this.setState((state) => ({limbData: tempLimbState}));
		}

	deselectLimb = (limb) => {
		const tempLimbState = {...this.state.limbData, ...{[limb] : {...this.state.limbData[limb], ...{selected:false}}}};
		this.setState((state) => ({limbData: tempLimbState}));
	}

	holdHandleClick = (coords) => () => {
		let selectedLimbs = Object.entries(this.state.limbData).filter(([key,value]) => (value.selected)).map(([key,value]) => (key));
		selectedLimbs = this.validMoves(selectedLimbs,coords);
		this.moveLimbs(selectedLimbs,coords);
	} 

	validMoves = (limbs,coords) => {
		limbs = limbs.filter((limb) => (this.props.maxMoveDist >= dist(this.state.limbData[limb].coords,coords))); //max distance from ogigin

		limbs = limbs.filter(selectedLimb => //max distance between limbs
			!this.state.limbData[selectedLimb].group.reduce((invalidGroup, groupee) => (
				invalidGroup ||
				Object.values(this.state.limbData)
				.filter(limb => (limb.group.find(element => element === groupee)))
				.reduce((invalid,limb) => (invalid || this.props.maxGroupDist < dist(limb.coords,coords)),false))
				,false)
			)
		return limbs;
	}

	moveLimbs = (limbs, coords) => {
		let tempLimbsState = {...this.state.limbData};
		limbs.forEach((limb) => {
			tempLimbsState = {...tempLimbsState, ...{[limb] : {...this.state.limbData[limb], ...{coords: coords, isAtStart: false, selected: false}}}};
			})
		this.setState((state) => ({limbData: tempLimbsState}));
		}

	formatLimbsForTile(key,value){
		return{[key]: {selected: value.selected, handleClick: this.limbHandleClick}};
	}

	drawCards(){
		const newDrawIndex = this.state.drawIndex + this.props.nCardDraw;
		this.setState({drawIndex: newDrawIndex, 
			displayDraw: newDrawIndex + this.props.nCardDraw < this.state.drawPile.length});

	}

	generateLimbsAtStart(){
		let limbsAtStart = {};
		Object.entries(this.state.limbData)
		.filter(([key,value]) =>(value.isAtStart))
		.forEach(([key,value]) => (
			limbsAtStart = {...limbsAtStart, ...this.formatLimbsForTile(key,value)}
			));
		return	limbsAtStart;
	}



	render(){

		const tilesData = this.generateTilesData(this.props.nRows, this.props.nCols);
		const cardDisplay = this.generateCardDisplay(this.props.nCardDraw);
		const limbsAtStart = this.generateLimbsAtStart();
	
		return(
			<>
				<div>
				{tilesData.reverse().map((row) => {
					return(
						<div key = {row.ID} className = "row">
							{row.data.map((tile) => {
								return (<Tile key = {tile.ID} limbsData = {tile.limbsData}>
									<Hold holdData = {tile.holdData} key = {tile.ID} />
									</Tile>)
							})}
						</div>
					)	
				})}
				</div>
				<div>
					{limbsAtStart ? (<Tile limbsData = {limbsAtStart}>
						<Hold/>
					</Tile>) : null}
				
				</div>
				<div className = "playerControls">
					<div className ="cardDisplay">
						{cardDisplay.map((card) => {
							return(<Card key = {card.ID} data = {card.data}/>)
						})
						}
					</div>
					{this.state.displayDraw ?
						<button onClick = {this.drawCards}> 
							Draw
						</button>
						: null}						
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
	nCardDraw: 3,
	maxMoveDist: 1,
	maxGroupDist: 3


};
export default Game;