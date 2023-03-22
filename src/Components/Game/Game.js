import {useRef, useState} from 'react';
import * as bc from "../../Helper Functions/board calculator";
import {shuffleArray, mergeObjects} from "../../Helper Functions/Generic Helpers"
import Hold from "../Hold/Hold.js";
import uuid from 'react-uuid';
import {Card} from "../Card/Card.js";
import {Tile, limbType, groupType} from "../Tile/Tile.js";
import {Limb} from "../Limb/Limb.js";
import isEqual from "lodash/isEqual";
import './Game.css';

function Game (props){

	const generateDrawPile = () => {
		let drawPile = colorsArray.map((firstColor,index) => {
			return (colorsArray.slice(index, colorsArray.length).map(secondColor => {
				return ({ID: uuid(), data: {colors: [firstColor, secondColor], weightDir: index%2 === 0 ? bc.dirs.left : bc.dirs.right}})
			}))
		}).flat();
		shuffleArray(drawPile, props.cardSeed);
		return drawPile;
	}

	const [drawIndex,setDrawIndex] = useState(0);
	const [drawPile,setDrawPile] = useState(generateDrawPile); //move to useRef
	const [displayDraw,setDisplayDraw] = useState(true);
	const [limbData,setLimbData] = useState(
		{leftHand: {coords: [-1,0], selected: false, group: [groupType.left,groupType.hand]},
		rightHand: {coords: [-1,1], selected: false, group: [groupType.right,groupType.hand]},
		leftFoot: {coords: [-1,0], selected: false, group: [groupType.left,groupType.foot]},
		rightFoot: {coords: [-1,5], selected: false, group: [groupType.right,groupType.foot]},
		weight: {coords: [0,2], selected: false, group:[]}}
		);

	const moveHistory = useRef([]);

	const generateTilesData = (nRows, nCols) =>{
		const holdData  = generateHoldData();
		let tiles = mapHoldsToTiles(nRows, nCols, holdData);	
		mapLimbsToTiles(tiles);
		return tiles;
	}

	const generateHoldData = () => {
		let holdData = [];
		const nTotalTiles =  bc.calculateTotalHolds(props.nRows, props.nCols);
		const iterNum = Math.ceil(nTotalTiles/colorsArray.length);
		for (var i = 0; i < iterNum; i++) {
			holdData = holdData.concat(colorsArray.map((color) =>({color: color})));
		}
		shuffleArray(holdData,props.boardSeed);
		holdData = holdData.slice(0,nTotalTiles);
		return holdData;
	}

	const mapHoldsToTiles = (nRows, nCols, holdData) =>{
		let tiles = [];
		for (var i = 0; i < nRows; i++) {
			tiles[i] = {ID: uuid(),
				data: generateRowData(nCols, i, holdData.slice(bc.mapFromBoard(i,0,nCols),bc.mapLastInRowFromBoard(i,nCols)+1))};
		}
		return tiles;
	}

	const generateRowData = (nCols, rowIndex, holdData) =>{
		let tempRow = [];
		for (var j = 0; j < bc.calcRowLen(nCols,rowIndex); j++) {
			tempRow[j] = {ID: uuid(), holdData: {...holdData[j], ...{handleClick: holdHandleClick([rowIndex,j])}}, limbsData: {}};
		}
		return tempRow;
	}

	const isAtStart = (coords) => {
		return coords[0] === -1;
	}

	const mapLimbsToTiles = (tiles) => {
		Object.entries(limbData)
		.filter(([key,value]) => (!isAtStart(value.coords)))
		.map(([key,value]) => {
			let tempLimbsData = tiles[value.coords[0]].data[value.coords[1]].limbsData;
			return (tiles[value.coords[0]].data[value.coords[1]].limbsData = {...tempLimbsData, ...formatLimbsForTile(key,value)});
		});
		return (tiles);
	}

	const getCardsToDisplay = (nCardDraw) => {
		const lastCardInDisplay = (drawIndex + nCardDraw) > drawPile.length ? drawPile.length : drawIndex + nCardDraw;
		return drawPile.slice(drawIndex,lastCardInDisplay);
	}

	const generateMoveTree = () => {
		const drawnCards = getCardsToDisplay(props.nCardDraw);

		const topFirst = (card,remainingCards,recurs) => {
			return {[card.data.colors[0]] :{[card.data.weightDir]: {[card.data.colors[1]]:recurs(remainingCards)}}};
		}
		const bottomFirst = (card,remainingCards,recurs) => {
			return {[card.data.colors[1]]:{[bc.getOppositeDir(card.data.weightDir)]: {[card.data.colors[0]]:recurs(remainingCards)}}};
		}
		const topOnly = (card,remainingCards,recurs) => {
			return {[card.data.colors[0]]:recurs(remainingCards)};
		}
		const bottomOnly = (card,remainingCards,recurs) => {
			return {[card.data.colors[1]]:recurs(remainingCards)};
		}

		const generateMoveOptions = (drawnCards) => {
			 return drawnCards.reduce((acc,curVal,index,array) => {
			 	let tempAcc = {};
				let tempArray = array.slice();
				tempArray.splice(index,1); //remove element from array

				if (array.length > 0){
					tempAcc = topFirst(curVal,tempArray,generateMoveOptions);
					tempAcc = mergeObjects(tempAcc, bottomFirst(curVal,tempArray,generateMoveOptions));
					tempAcc = mergeObjects(tempAcc, topOnly(curVal,tempArray,generateMoveOptions));
					tempAcc = mergeObjects(tempAcc, bottomOnly(curVal,tempArray,generateMoveOptions));
				} else{
				}
				return mergeObjects(acc,tempAcc);
			},{});
		}

		return generateMoveOptions(drawnCards);
	}

	const limbHandleClick = (limb) => {
		if(limbData[limb].selected){
			deselectLimb(limb);
		} else {
			selectLimb(limb);
		}
	}

	const selectLimb = (limb) => {
		const tempLimbState = {...limbData, ...{[limb] : {...limbData[limb], ...{selected:true}}}};
		setLimbData(tempLimbState);
		}

	const deselectLimb = (limb) => {
		const tempLimbState = {...limbData, ...{[limb] : {...limbData[limb], ...{selected:false}}}};
		setLimbData(tempLimbState);
	}

	const holdHandleClick = (coords) => () => {
		let selectedLimbs = Object.entries(limbData).filter(([key,value]) => (value.selected)).map(([key,value]) => (key));

		selectedLimbs = validateMove(selectedLimbs,coords);
		if (selectedLimbs.length > 0){
			moveLimbs(selectedLimbs,coords);
			moveHistory.current = addMoveToHistory(moveHistory.current,getMoveType(selectedLimbs,coords));
		}	
	} 

	const addMoveToHistory = (history,move) => {
		const tempHistory = [...history];
		tempHistory.push([move]);
		return tempHistory;
	}

	const validateMove = (selectedLimbs,newCoords) => {
		//Tests that require previous state
		//weight cannot be moves a the same time as other limbs
		selectedLimbs = selectedLimbs.includes(limbType.weight) & (selectedLimbs.filter(limb => limb !== limbType.weight).length > 0) ?
			[] : selectedLimbs;

		//Same hold as starting hold not allowed
		selectedLimbs = selectedLimbs.filter((limb) => !isEqual(limbData[limb].coords, newCoords));

		//Only allow movement within a range of starting hold
		selectedLimbs = selectedLimbs.filter((limb) => {
		const tempLimbCoords = isAtStart(limbData[limb].coords) ? [limbData[limb].coords[0],newCoords[1]] : limbData[limb].coords;
		return(props.maxMoveDist >= bc.dist(tempLimbCoords,newCoords))
		}); 

		//Limbs follow a valid sequence along move tree;
		console.log(addMoveToHistory(moveHistory.current,getMoveType(selectedLimbs,newCoords)));
		selectedLimbs = selectedLimbs.filter(selectedLimb => bc.areMovesOnTree(generateMoveTree(),addMoveToHistory(moveHistory.current,getMoveType(selectedLimbs,newCoords))));


		//Current state tests
		const tempLimbsState = applyNewCoords({...limbData},selectedLimbs,newCoords);

		//Limbs stay in range of other limbs
		selectedLimbs = selectedLimbs.filter(selectedLimb => //max distance between limbs
			!limbData[selectedLimb].group.reduce((invalidGroup, groupee) => (
				invalidGroup ||
				Object.values(limbData)
				.filter(limb => (limb.group.find(element => element === groupee)))
				.reduce((invalid,limb) => {
					const tempLimbCoords = isAtStart(limb.coords) ? [limb.coords[0],newCoords[1]] : limb.coords;
					return (invalid || props.maxGroupDist < bc.dist(tempLimbCoords,newCoords))},false))
				,false)
			);

		//As a result of the move weight is on or less above hands and 1 or less below the feet
		// selectedLimbs = checkWeightInRange(tempLimbsState) ? selectedLimbs : [];

		return selectedLimbs;
	}

	const checkWeightInRange = (limbsState) => {
		return (
			Object.values(limbsState).reduce((valid,limb) => {
				let tempValid = true;
				if (limb.group.includes(groupType.foot)){
					tempValid = limbsState[limbType.weight].coords[0] >= (limb.coords[0] - 1);
				} else if (limb.group.includes(groupType.hand)){
					tempValid = limbsState[limbType.weight].coords[0] <= (limb.coords[0] + 1);
				} else{
				}
				return valid && tempValid;
			},true)
		)
	}

	const getMoveType = (limbs, coords) => {
			const moveTypes = limbs.map(limb => 
				limb === limbType.weight ? bc.moveDir(limbData[limb].coords, coords) : generateHoldData()[bc.mapFromBoard(coords[0],coords[1],props.nCols)].color
			);
			return moveTypes.every(moveType => moveType === moveTypes[0]) ? moveTypes[0] : "";
		}

	const deselectAllLimbs = (limbs) => {
		return Object.fromEntries(Object.entries(limbs).map(([key,value]) => [key, value = {...value, ...{selected: false}}]));
	}

	const applyNewCoords = (limbsState, selectedLimbs, newCoords) => {
		let tempLimbsState = {...limbData};
		selectedLimbs.forEach((limb) => {
			tempLimbsState = {...tempLimbsState, ...{[limb] : {...tempLimbsState[limb], ...{coords: newCoords}}}};
			})
		return tempLimbsState;
	}

	const moveLimbs = (selectedLimbs, coords) => {
		let tempLimbsState = applyNewCoords({...limbData},selectedLimbs,coords);
		tempLimbsState = deselectAllLimbs(tempLimbsState);
		setLimbData(tempLimbsState);
		}

	const formatLimbsForTile = (key,value) => {
		return{[key]: {selected: value.selected, handleClick: limbHandleClick}};
	}

	const drawCards = () => {
		const newDrawIndex = drawIndex + props.nCardDraw;
		setDrawIndex(newDrawIndex);
		setDisplayDraw(newDrawIndex + props.nCardDraw < drawPile.length);
		moveHistory.current = [];
	}

	const generateLimbsAtStart = () => {
		let limbsAtStart = {};
		Object.entries(limbData)
		.filter(([key,value]) =>(isAtStart(value.coords)))
		.forEach(([key,value]) => (
			limbsAtStart = {...limbsAtStart, ...formatLimbsForTile(key,value)}
			));
		return	limbsAtStart;
	}


	const tilesData = generateTilesData(props.nRows, props.nCols);
	const cardDisplay = getCardsToDisplay(props.nCardDraw);
	const limbsAtStart = generateLimbsAtStart();
	
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
				{displayDraw ?
					<button onClick = {drawCards}> 
						Draw
					</button>
					: null}						
			</div>	
			
		</>

	)

}



const colorsArray = ["white","orange","green","purple","black","red"];

Game.defaultProps = {
	nRows: 10,
	nCols: 6,
	boardSeed: 1234,
	cardSeed: 4321,
	nCardDraw: 2,
	maxMoveDist: 1,
	maxGroupDist: 3
};
export default Game;