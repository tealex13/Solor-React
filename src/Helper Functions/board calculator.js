import {mergeObjects} from "./Generic Helpers"
import isEqual from "lodash/isEqual";

export function calcRowLen(nCols, rowNumber){
		return (nCols - rowNumber % 2);
	}

export function calculateTotalHolds(nRows, nCols){
		return (calcRowLen(nCols,0)*Math.ceil(nRows/2) + calcRowLen(nCols,1)*Math.floor(nRows/2));
	}

export function mapFromBoard(rowIndex, colIndex, nCols) {
	return calculateTotalHolds(rowIndex, nCols) + colIndex;
}

export function mapToBoard(Index, nRows, nCols){
	//not tested
	let rowIndex = Math.floor(Index/calcTwoRowsLen(nCols));
	rowIndex = Index - rowIndex * calcTwoRowsLen(nCols) < calcRowLen(nCols,0) ? rowIndex : rowIndex + 1 ; 

	let colIndex = Index % (calcRowLen(nCols,0) + calcRowLen(nCols,1));
	colIndex = colIndex < calcRowLen(nCols,0) ? colIndex : colIndex - calcRowLen(nCols,0);
	return ({rowIndex: rowIndex, colIndex: colIndex});
}

export function mapLastInRowFromBoard (rowIndex, nCols){
	return mapFromBoard(rowIndex,calcRowLen(nCols,rowIndex)-1,nCols);
}

function calcTwoRowsLen(nCols){
	return calcRowLen(nCols,0) + calcRowLen(nCols,1);
}

export function dist (a,b){
	const rs = Math.abs(b[0]-a[0]); //row shift
	const goingRight =  Math.floor((rs + a[0]%2)/2);
	const goingLeft =  Math.floor((rs + (a[0]+1)%2)/2);
	const left = Math.max(a[1] - b[1] - goingLeft,0);
	const right = Math.max(b[1] - a[1] - goingRight,0);
	const dist =  rs + Math.max(left,right);
	return dist;
}

export function moveDir (fromCoords,toCoords){
	const firstIsEven = fromCoords[0]%2 === 0;
	const secondIsEven = toCoords[0]%2 === 0;
	if (firstIsEven === secondIsEven){
		if (fromCoords[1] === toCoords[1]){
			return dirs.center;
		} else{
			return toCoords[1] - fromCoords[1] > 0 ? dirs.right : dirs.left;
		}
	} else if (firstIsEven & !secondIsEven){
		return toCoords[1] - fromCoords[1] >= 0 ? dirs.right : dirs.left;
	} else {
		return toCoords[1] - fromCoords[1] > 0 ? dirs.right : dirs.left;
	}
}

export const getOppositeDir = (direction) => {
	switch(direction){
	case dirs.left:
		return dirs.right;
	case dirs.right:
		return dirs.left;
	case dirs.center:
		return dirs.center;
	}
}

export function areMovesOnTree(moveTree, moves) {
	return completeMoveTypes.reduce((valid,moveType) => {return valid || Object.keys(getRemainingMoves(moveTree, moves)).includes(moveType)},false);   
}

export function getRemainingMoves(moveTree, moves) {
	if (moves.length === 0){
		return moveTree;
	} 
	if (moveTree === undefined){
		return {};
	} else {
		const walkDownTree = (moveTree, moves, validationMethod) => {
			return convertMoveTypes(moves[0].moveType)
			.filter(move => Object.keys(moveTree).includes(move))
			.reduce((valid,move) => {return mergeObjects(valid, validationMethod(move))},{});
		};
		const getAllLast = (moveTree, moves, validationMethod) => {
			const convertedMoveTypes = convertMoveTypes(moves[0].moveType);
			const moveTypesToDelete = completeMoveTypes.filter(moveType => !convertedMoveTypes.includes(moveType));
			moveTypesToDelete.forEach(moveType => delete moveTree[moveType]);
			return moveTree;
		};
	    if (moves.length > 1){
	    	return walkDownTree(moveTree, moves, (move) => getRemainingMoves(moveTree[move],moves.slice(1)));
	    } else {
	        return getAllLast(moveTree, moves, (move) => {return moveTree[move]});
	    } 
	}	   
}

export const convertMoveTypes = (typeIn) => {
	if (typeIn.includes(dirWild)){
		return completeDirs;
	} else if(Object.values(dirs).reduce((includes,dir) => includes || typeIn.includes(dir),false)){
		return [...typeIn, dirWild];
	} else if(typeIn.includes(colorWild)){
		return [...colorsArray, colorWild];
	} else {
		return typeIn;
	}
}

export function flattenCards(moveTree) {

	const recursThrough = (moveTree) => {
		if (typeof moveTree === "object" && moveTree !=  null){
			let nums = moveTree.cardNum ?  
			Object.keys(moveTree.cardNum) : [];
			return Object.entries(moveTree).reduce((unusedCards,[move,submoves]) => {
				//only add if the value is unique
				return [...unusedCards,...recursThrough(submoves).filter(cardNum => !unusedCards.includes(cardNum))];  
			},nums)
		} else {
			return [];
		}
	}
	delete moveTree.cardNum;
	return(recursThrough(moveTree));
}


export function flattenMoves(moveTree) {	
	const recursThrough = (moveTree) => {
		if (typeof moveTree === "object" && moveTree !=  null){
			const moves = Object.entries(moveTree)
				.filter(([move,submoves]) => {return completeMoveTypes.includes(move)});
				// .filter(move => completeMoveTypes.includes(move));
			const submoves = moves.map(([currentMoves,submoves]) => submoves);
			const currentMoves = moves.map(([currentMoves,submoves]) => currentMoves);
			if (!isEqual(submoves,[{}])){
				return submoves.reduce((unusedMoves,submoves) => {
				//only add if the value is unique
				return [...unusedMoves,...recursThrough(submoves).filter(cardNum => !unusedMoves.includes(cardNum))];  
				},currentMoves)
			} else {
				return currentMoves;
			}		
		} else {
			return [];
		}
	}
	return Object.values(moveTree)
		.reduce((unusedMoves,submoves) => {return ([...unusedMoves, ...recursThrough(submoves)])},[]);
	// return(recursThrough(moveTree));
}

export const colorsArray = ["white","orange","green","purple","black","red","blue"];
export const dirs = {left: "left", right: "right", center: "center"};
export const dirWild = "dirWild";
export const colorWild = "colorWild";
const completeColors = [...colorsArray, colorWild];
const completeDirs = [...Object.values(dirs), dirWild];
const completeMoveTypes = [...completeDirs,...completeColors];