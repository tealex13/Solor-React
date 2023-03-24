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
		let drawPile = bc.colorsArray.map((firstColor,index) => {
			return (bc.colorsArray.slice(index, bc.colorsArray.length).map(secondColor => {
				return ({ID: uuid(), data: {wild: false,
					colors: [firstColor, secondColor], 
					weightDir: index%2 === 0 ? bc.dirs.left : bc.dirs.right}})
			}))
		}).flat();
		return drawPile;
	}


	const [drawIndex,setDrawIndex] = useState(0);
	const [drawPile,setDrawPile] = useState(generateDrawPile); //move to useRef
	const [displayDraw,setDisplayDraw] = useState(true);
	const [limbData,setLimbData] = useState(
		{leftHand: {coords: [-1,0], selected: false, group: [groupType.left,groupType.hand]},
		rightHand: {coords: [-1,1], selected: false, group: [groupType.right,groupType.hand]},
		leftFoot: {coords: [-1,2], selected: false, group: [groupType.left,groupType.foot]},
		rightFoot: {coords: [-1,3], selected: false, group: [groupType.right,groupType.foot]},
		weight: {coords: [-1,4], selected: false, group:[]}}
		);

	const moveHistory = useRef([]);

	const getDrawOrder = () => {
		const drawOrder = drawPile.map((card,index) => index);
		shuffleArray(drawOrder,props.cardSeed);
		return drawOrder
	}

	const [drawOrder,setDrawOrder] = useState(getDrawOrder);

	const cardHandleClick = (index,drawPile) => () => {

		const tempDrawPile = structuredClone(drawPile);

		tempDrawPile[index].data.wild = !tempDrawPile[index].data.wild;
		if (bc.areMovesOnTree(generateMoveTree(getCardsToDisplay(props.nCardDraw,tempDrawPile,drawOrder),tempDrawPile),moveHistory.current)){
			setDrawPile(tempDrawPile);
		} else {
			alert("The card you want to change to a wild has already been used.")
		}		
	}

	const generateTilesData = (nRows, nCols) =>{
		const holdData  = generateHoldData();
		let tiles = mapHoldsToTiles(nRows, nCols, holdData);	
		mapLimbsToTiles(tiles);
		return tiles;
	}

	const generateHoldData = () => {
		let holdData = [];
		const nTotalTiles =  bc.calculateTotalHolds(props.nRows, props.nCols);
		const iterNum = Math.ceil(nTotalTiles/bc.colorsArray.length);
		for (var i = 0; i < iterNum; i++) {
			holdData = holdData.concat(bc.colorsArray.map((color) =>({color: color})));
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

	const getCardsToDisplay = (nCardDraw,drawPile,drawOrder) => {
		const lastCardInDisplay = (drawIndex + nCardDraw) > drawPile.length ? drawPile.length : drawIndex + nCardDraw;
		return drawOrder.slice(drawIndex,lastCardInDisplay);
	}

	const generateMoveTree = (drawnCardsIndex, drawPile) => {

		const drawnCards = drawnCardsIndex.map(index => drawPile[index]); 

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

		const createFrontOfCardPerm = (curVal,tempArray,recurs) => {
			let tempAcc = {}
			tempAcc = topFirst(curVal,tempArray,recurs);
			tempAcc = mergeObjects(tempAcc, bottomFirst(curVal,tempArray,recurs));
			tempAcc = mergeObjects(tempAcc, topOnly(curVal,tempArray,recurs));
			tempAcc = mergeObjects(tempAcc, bottomOnly(curVal,tempArray,recurs));
			return tempAcc;
		}

		const createWildSideCardPerm = (curVal, tempArray, recurs) => {
			return {[bc.dirWild] : recurs(tempArray)};
		}

		const generateMoveOptions = (drawnCards) => {
			 return drawnCards.reduce((acc,curVal,index,array) => {
			 	let tempAcc = {};
				let tempArray = array.slice();
				tempArray.splice(index,1); //remove element from array

				if (array.length > 0){
					tempAcc = curVal.data.wild ? createWildSideCardPerm(curVal,tempArray,generateMoveOptions) : createFrontOfCardPerm(curVal,tempArray,generateMoveOptions);
				} else{
				}
				return mergeObjects(acc,tempAcc);
			},{});
		}

		return generateMoveOptions(drawnCards);
	}

	const limbHandleClick = (limb) => {
		//if the limb is not wieght, but shares the same space as weight, it cannot be selected
		if((limb !== limbType.weight)
			&& isEqual(limbData[limb].coords,limbData[limbType.weight].coords)){
			const  alertMessage = "The " + limbData[limb].group[0]+" "+limbData[limb].group[1]+ " cannot be selected because it share a space with weight."
			alert(alertMessage);
		} else {
			if(limbData[limb].selected){
				deselectLimb(limb);
			} else {
				selectLimb(limb);
			}
		}
		
	}


	const selectLimb = (limb) => {
		console.log(drawPile[1].data);
		const tempLimbState = {...limbData, ...{[limb] : {...limbData[limb], ...{selected:true}}}};
		setLimbData(tempLimbState);
		}

	const deselectLimb = (limb) => {
		console.log(drawPile[1].data);
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
		selectedLimbs = selectedLimbs.filter(selectedLimb => 
			bc.areMovesOnTree(generateMoveTree(getCardsToDisplay(props.nCardDraw,drawPile,drawOrder),drawPile),addMoveToHistory(moveHistory.current,getMoveType(selectedLimbs,newCoords))));


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

		//Weight is not 1 or higher than hands and 1 or lower than the feet
		selectedLimbs = checkWeightInRange(tempLimbsState) ? selectedLimbs : [];

		//Only one non-weight limb allowed per hold
		const nonWeightLimbs = Object.entries(tempLimbsState).filter(([limb,data]) => limb !== limbType.weight);
		selectedLimbs = nonWeightLimbs.slice(0,-1).reduce((invalid,[limb1,data1],index) => {
				return invalid || 
				nonWeightLimbs.slice(index+1).reduce((invalid,[limb2,data2]) => invalid || isEqual(data1.coords,data2.coords),false)
			},false) ? [] : selectedLimbs;

		return selectedLimbs;
	}

	const checkWeightInRange = (limbsState) => {
		return (
			Object.values(limbsState).filter(limb => limb.group.includes(groupType.hand))
				.reduce((valid,limb) => valid || (limb.coords[0] + 1) >= limbsState[limbType.weight].coords[0],false)
			&&
			Object.values(limbsState).filter(limb => limb.group.includes(groupType.foot))
				.reduce((valid,limb) => valid || (limb.coords[0] - 1) <= limbsState[limbType.weight].coords[0],false)
		)
	}

	const getMoveType = (selectedLimbs, coords) => {
		const moveTypes = selectedLimbs.map(limb => 
			limb === limbType.weight ? 
				getWeightMoveType(limbData[limb], coords) :
				getColorMoveType(limbData,limb,coords)
		);
		return moveTypes.every(moveType => moveType === moveTypes[0]) ? moveTypes[0] : "";
	}

	const getWeightMoveType = (limb, coords) => {
		if (isAtStart(limb.coords)){
			return bc.dirWild;
		} else {
			return bc.moveDir(limb.coords, coords);
		}
	}

	const getColorMoveType = (limbsState,limb,coords) => {
		let oppositeLimb = false;
		switch (limb){
		case limbType.leftHand:
			oppositeLimb = limbType.rightHand;
			break;
		case limbType.rightHand:
			oppositeLimb = limbType.leftHand;
			break;
		case limbType.leftFoot:
			oppositeLimb = limbType.rightFoot;
			break;
		case limbType.rightFoot:
			oppositeLimb = limbType.leftFoot;
			break;
		}

		if ((oppositeLimb) && 
			(isEqual(limbsState[limbType.weight].coords,limbsState[oppositeLimb].coords))){
			return bc.colorWild;
		}
		else {
			return generateHoldData()[bc.mapFromBoard(coords[0],coords[1],props.nCols)].color;
		}
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
	const cardsToDisplay = getCardsToDisplay(props.nCardDraw,drawPile,drawOrder);
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
					{cardsToDisplay.map((index) => {
						return(<Card key = {drawPile[index].ID} data = {drawPile[index].data} handleClick = {cardHandleClick(index,drawPile)}/>)
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