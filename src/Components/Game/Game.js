import {useRef, useState} from 'react';
import * as bc from "../../Helper Functions/board calculator";
import {shuffleArray, mergeObjects} from "../../Helper Functions/Generic Helpers"
import Hold from "../Hold/Hold.js";
import uuid from 'react-uuid';
import {Card} from "../Card/Card.js";
import {Tile, limbType} from "../Tile/Tile.js";
import {Limb} from "../Limb/Limb.js";
import isEqual from "lodash/isEqual";
import './Game.css';
import * as st from "../../Helper Functions/Shared Types";


function Game (props){

	const generateCardsState = () => { //refactor using array.fill()
		const tempCardState = [];
		for (var i = props.nCardDraw - 1; i >= 0; i--) {
			tempCardState.push({wild: false});
		}
	return tempCardState;
	}

	const [drawIndex,setDrawIndex] = useState(0);
	const [drawPile,setDrawPile] = useState(generateCardsState);
	const [limbsData,setLimbsData] = useState( //refactor move group data up a level
		{leftHand: {coords: [-1,-5], selected: false, group: [st.groupType.left,st.groupType.hand]},
		rightHand: {coords: [-1,-4], selected: false, group: [st.groupType.right,st.groupType.hand]},
		leftFoot: {coords: [-1,-3], selected: false, group: [st.groupType.left,st.groupType.foot]},
		rightFoot: {coords: [-1,-2], selected: false, group: [st.groupType.right,st.groupType.foot]},
		weight: {coords: [-1,-6], selected: false, group:[st.groupType.weight]}}
		);
	const [historyIndex,setHistoryIndex] = useState(0);

	const moveHistory = useRef([]);

	const cardHandleClick = (index,drawPile) => () => {

		const tempDrawPile = structuredClone(drawPile);
		tempDrawPile[index].wild = !tempDrawPile[index].wild;
		if (bc.areMovesOnTree(generateMoveTree(tempDrawPile),moveHistory.current)){
			setDrawPile(tempDrawPile);
		} else {
			alert("The card you want to change to a wild has already been used.")
		}		
	}

	const generateTilesData = () =>{
		
		const mapHoldsToTiles = (holdData) =>{
			const generateRowData = (rowIndex, holdData) =>{
				let tempRow = [];
				for (var j = 0; j < bc.calcRowLen(props.boardData.nCols,rowIndex); j++) {
					tempRow[j] = {ID: uuid(), holdData: {...holdData[j], ...{handleClick: holdHandleClick([rowIndex,j])}}, limbsData: {}};
				}
				return tempRow;
			}

			let tiles = [];
			for (var i = 0; i < props.boardData.nRows; i++) {
				tiles[i] = {ID: uuid(),
					data: generateRowData(i, holdData.slice(bc.mapFromBoard(i,0,props.boardData.nCols),bc.mapLastInRowFromBoard(i,props.boardData.nCols)+1))};
			}
			return tiles;
		}

		const mapLimbsToTiles = (tiles) => {
			Object.entries(limbsData)
			.filter(([key,value]) => (!isAtStart(value.coords)))
			.map(([key,value]) => {
				let tempLimbsData = tiles[value.coords[0]].data[value.coords[1]].limbsData;
				return (tiles[value.coords[0]].data[value.coords[1]].limbsData = {...tempLimbsData, ...formatLimbsForTile(key,value)});
			});
			return (tiles);
		}

		const holdData  = props.boardData.holds;
		let tiles = mapHoldsToTiles(holdData);	
		mapLimbsToTiles(tiles);
		return tiles;
	}
	

	const isAtStart = (coords) => {
		return coords[0] === -1;
	}

	

	const getIndexOfCardsToDisplay = () => {
		const lastCardInDisplay = (drawIndex + props.nCardDraw) > props.cardData.length ? props.cardData.length : drawIndex + props.nCardDraw;
		return props.drawOrder.slice(drawIndex,lastCardInDisplay);
	}

	const generateMoveTree = (cardState) => {
		const drawnCardsData = getIndexOfCardsToDisplay().map(index => props.cardData[index]);
		const cardData = drawnCardsData.map((card,index) => ({...card.data,...{cardNum: index}}));
		const drawnCardsState = mergeObjects(cardData,cardState.slice(0,cardData.length));
		const topFirst = (card,remainingCards,recurs) => {
			return {[card.colors[0]] :{
				[card.weightDir]: {[card.colors[1]]:recurs(remainingCards), cardNum: {[card.cardNum]:null}}, 
				...recurs(remainingCards),
				cardNum: {[card.cardNum]:null}
				}};
		}
		const bottomFirst = (card,remainingCards,recurs) => {
			return {[card.colors[1]]:{
				[bc.getOppositeDir(card.weightDir)]: {[card.colors[0]]:recurs(remainingCards), cardNum: {[card.cardNum]:null}}, 
				...recurs(remainingCards),
				cardNum: {[card.cardNum]:null}
				}};
		}

		const createFrontOfCardPerm = (curVal,tempArray,recurs) => {
			return mergeObjects(topFirst(curVal,tempArray,recurs), bottomFirst(curVal,tempArray,recurs));
		}

		const createWildSideCardPerm = (curVal, tempArray, recurs) => {
			return {[bc.dirWild] : recurs(tempArray)};
		}

		const generateMoveOptions = (drawnCardsData) => {
			 return drawnCardsData.reduce((acc,curVal,index,array) => {
			 	let tempAcc = {};
				let tempArray = array.slice();
				tempArray.splice(index,1); //remove element from array

				if (array.length > 0){
					tempAcc = curVal.wild ? createWildSideCardPerm(curVal,tempArray,generateMoveOptions) : createFrontOfCardPerm(curVal,tempArray,generateMoveOptions);
				} else{
				}
				return mergeObjects(acc,tempAcc);
			},{});
		}
		return generateMoveOptions(drawnCardsState);
	}

	const getRemainingMoves = (drawPile) => {
		let moveTree = generateMoveTree(drawPile);
		delete moveTree.cardNum;
		return bc.getRemainingMoves(moveTree,moveHistory.current);
	}

	const limbHandleClick = (limb) => {
		const performSelection = () => {
			let tempLimbState = deselectAllLimbs({...limbsData});
			if(!limbsData[limb].selected){
				tempLimbState = selectLimb(tempLimbState,limb);
			} else {
			}
			setLimbsData(tempLimbState);
		}

		//if the limb is not wieght, but shares the same space as weight, it cannot be selected
		
		if(limb !== limbType.weight){
			// if limb is on weight it cannot be moved
			if (isEqual(limbsData[limb].coords,limbsData[limbType.weight].coords)) {
				const  alertMessage = "The " + limbsData[limb].group[0]+" "+limbsData[limb].group[1]+ " cannot be selected because it share a space with weight."
				alert(alertMessage);
			} 
			// if the limb is right below weight it cannot be moved
			else if (bc.dist(limbsData[limb].coords,limbsData[limbType.weight].coords) === 1 && limbsData[limb].coords[0] < limbsData[limbType.weight].coords[0]){
	
				const  alertMessage = "The " + limbsData[limb].group[0]+" "+limbsData[limb].group[1]+ " cannot be selected because it is one space below the weight."
				alert(alertMessage);
			} else {
				performSelection();
			}
		} else {
			performSelection();
		}
		
	}


	const selectLimb = (limbsState,limb) => {
		return {...limbsState, ...{[limb] : {...limbsState[limb], ...{selected:true}}}};
		
		}

	const deselectAllLimbs = (limbsState) => {
		return Object.fromEntries(Object.entries(limbsState).map(([key,value]) => [key, value = {...value, ...{selected: false}}]));
	}

	const holdHandleClick = (coords) => () => {
		let selectedLimbs = Object.entries(limbsData).filter(([key,value]) => (value.selected)).map(([key,value]) => (key));

		selectedLimbs = validateMove(selectedLimbs,coords);
		if (selectedLimbs.length > 0){
			moveLimbs(selectedLimbs,coords);
			moveHistory.current = addMoveToHistory(selectedLimbs,coords);
			setHistoryIndex(historyIndex+1);
		}	
	} 

	const addMoveToHistory = (selectedLimbs,newCoords) => {

		const tempHistory = [...moveHistory.current];
		const moveState = {moveType: [getMoveType(selectedLimbs,newCoords)], 
			limbsState: selectedLimbs.map(limb => ([limb,{coords: limbsData[limb].coords}])),
			cardState: drawPile
			};
		tempHistory.push(moveState);
		return tempHistory;
	}

	const validateMove = (selectedLimbs,newCoords) => {
		//Tests that require previous state
		//weight cannot be moves at the same time as other limbs
		selectedLimbs = selectedLimbs.includes(limbType.weight) & (selectedLimbs.filter(limb => limb !== limbType.weight).length > 0) ?
			[] : selectedLimbs;

		//Same hold as starting hold not allowed
		selectedLimbs = selectedLimbs.filter((limb) => !isEqual(limbsData[limb].coords, newCoords));

		//Only allow movement within a range of origin
		selectedLimbs = selectedLimbs.filter((limb) => {
		const tempLimbCoords = isAtStart(limbsData[limb].coords) ? [limbsData[limb].coords[0],newCoords[1]] : limbsData[limb].coords;
		console.log("includes:",limbsData[limb].group.includes(st.groupType.hand), limbType.hand);
		const allowedDistance = isAtStart(limbsData[limb].coords) && limbsData[limb].group.includes(st.groupType.hand) ? 
			props.handStartMoveDist : props.maxMoveDist;
		return(allowedDistance >= bc.dist(tempLimbCoords,newCoords))
		}); 

		//Limbs follow a valid sequence along move tree;
		selectedLimbs = selectedLimbs.filter(selectedLimb => 
			bc.areMovesOnTree(generateMoveTree(drawPile),addMoveToHistory(selectedLimbs,newCoords)));


		//Current state tests
		const tempLimbsState = applyNewCoords({...limbsData},selectedLimbs,newCoords);

		//Limbs stay in range of other limbs
		selectedLimbs = selectedLimbs.filter(selectedLimb => //max distance between limbs
			!limbsData[selectedLimb].group.reduce((invalidGroup, groupee) => (
				invalidGroup ||
				Object.values(limbsData)
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
		selectedLimbs = nonWeightLimbs.slice(0,-1).reduce((invalid,[limb1,data1],index) => { //skipping the last limb because it will be compared to every other limb already
				return invalid || 
					nonWeightLimbs.slice(index+1).reduce((invalid,[limb2,data2]) => invalid || isEqual(data1.coords,data2.coords),false)
			},false) ? [] : selectedLimbs;

		//Group types must match hold allowed group type
		const holdData = props.boardData.holds;
		const limbsToTest = Object.entries(tempLimbsState).filter(([limb,data]) => !isAtStart(data.coords));
		selectedLimbs = limbsToTest.reduce((valid,[limb,limbData]) => {return valid && holdData[bc.mapFromBoard(limbData.coords[0],limbData.coords[1],props.boardData.nCols)].allowedGroupTypes
							.reduce((valid,groupType) =>  {return valid || limbData.group.includes(groupType)},false)
						},true) ? selectedLimbs : [];

		return selectedLimbs;
	}

	const checkWeightInRange = (limbsState) => {
		return (
			Object.values(limbsState).filter(limb => limb.group.includes(st.groupType.hand))
				.reduce((valid,limb) => valid || (limb.coords[0] + 1) >= limbsState[limbType.weight].coords[0],false)
			&&
			Object.values(limbsState).filter(limb => limb.group.includes(st.groupType.foot))
				.reduce((valid,limb) => valid || (limb.coords[0] - 1) <= limbsState[limbType.weight].coords[0],false)
		)
	}

	const getMoveType = (selectedLimbs, coords) => {
		const moveTypes = selectedLimbs.map(limb => 
			limb === limbType.weight ? 
				getWeightMoveType(limbsData[limb], coords) :
				getColorMoveType(limbsData,limb,coords)
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
			return props.boardData.holds[bc.mapFromBoard(coords[0],coords[1],props.boardData.nCols)].color;
		}
	}
	console.log(bc.mapFromBoard(0,3,props.boardData.nCols));
	
	console.log(props.boardData.holds[bc.mapFromBoard(0,3,props.boardData.nCols)]);
	const applyNewCoords = (limbsState, selectedLimbs, newCoords) => {
		let tempLimbsState = {...limbsData};
		selectedLimbs.forEach((limb) => {
			tempLimbsState = {...tempLimbsState, ...{[limb] : {...tempLimbsState[limb], ...{coords: newCoords}}}};
			})
		return tempLimbsState;
	}

	const moveLimbs = (selectedLimbs, coords) => {
		let tempLimbsState = applyNewCoords({...limbsData},selectedLimbs,coords);
		tempLimbsState = deselectAllLimbs(tempLimbsState);
		setLimbsData(tempLimbsState);
		}

	const formatLimbsForTile = (key,value) => {
		return{[key]: {selected: value.selected, handleClick: limbHandleClick}};
	}

	const drawCards = () => {
		const newDrawIndex = drawIndex + props.nCardDraw;
		setDrawIndex(newDrawIndex);
		setDrawPile(generateCardsState());
		setHistoryIndex(0);
		moveHistory.current = [];
	}

	const generateLimbsAtStart = () => {
		let limbsAtStart = {};
		Object.entries(limbsData)
		.filter(([key,value]) =>(isAtStart(value.coords)))
		.forEach(([key,value]) => (
			limbsAtStart = {...limbsAtStart, ...formatLimbsForTile(key,value)}
			));
		return	limbsAtStart;
	}

	const handleUndo = () => {
		const tempHistory = [...moveHistory.current];
		
		setLimbsData(mergeObjects(limbsData,Object.fromEntries(tempHistory[tempHistory.length-1].limbsState)))
		setDrawPile(tempHistory[tempHistory.length-1].cardState);
		tempHistory.pop();
		setHistoryIndex(historyIndex - 1);
		moveHistory.current = tempHistory;

	}
	const unusedCards = bc.flattenCards(getRemainingMoves(drawPile));
	const unusedMoves = bc.flattenMoves(getRemainingMoves(drawPile));
	const tilesData = generateTilesData();
	const indexOfCardsToDisplay = getIndexOfCardsToDisplay();
	const limbsAtStart = generateLimbsAtStart();
	
	
	if (false){
		return <div>tester </div>
	} else {
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
						{indexOfCardsToDisplay.map((cardNum,index) => {
							return(<Card key = {props.cardData[index].ID}
							data = {props.cardData[cardNum].data} 
							state = {drawPile[index]} 
							handleClick = {cardHandleClick(index,drawPile)}
							useStatus = {unusedCards.includes(index.toString())?"usable":"used"}
							unusedMoves = {unusedMoves}/>)
						})
						}
					</div>
					<div className = "buttonBoard">
					<button onClick = {historyIndex > 0 ? handleUndo : null}
						className = {historyIndex > 0? "enabled":"disabled"}> 
							Undo
						</button>
					{drawIndex + props.nCardDraw < props.cardData.length ?
						<>
							<button onClick = {drawCards}> 
								End Round
							</button>
							<h4> Cards Left: {props.cardData.length - drawIndex - props.nCardDraw} </h4>
						</>
						: null}	
					</div>					
				</div>	
				
			</>
	
		);}

}

Game.defaultProps = {

	nCardDraw: 3,
	maxMoveDist: 1,
	maxGroupDist: 3,
	handStartMoveDist: 2,
	handOnlyPercent : 0.15,
	footOnlyPercent : 0.15
};
export default Game;