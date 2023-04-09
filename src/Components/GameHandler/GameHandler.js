import Game from "../Game/Game";
import * as bc from "../../Helper Functions/board calculator";
import uuid from 'react-uuid';
import * as st from "../../Helper Functions/Shared Types";
import {shuffleArray, mergeObjects} from "../../Helper Functions/Generic Helpers"

function GameHandler (props){

	const generateCardsData = () => {
		let cardsData = bc.colorsArray.map((firstColor,index) => {
			return (bc.colorsArray.slice(index, bc.colorsArray.length).map(secondColor => {
				return ({ID: uuid(), data: {
					colors: [firstColor, secondColor], 
					weightDir: index%2 === 0 ? bc.dirs.left : bc.dirs.right}})
			}))
		}).flat();
		return cardsData;
	}

	const generateHoldData = () => {
		const nTotalTiles =  bc.calculateTotalHolds(props.nRows, props.nCols);

		//Create hold group limits
		const numFootHolds = Math.floor(nTotalTiles * props.footOnlyPercent);
		const numHandHolds = Math.floor(nTotalTiles * props.handOnlyPercent);

		const allowedGroupTypes = [...[...Array(numFootHolds)].map(() => [st.groupType.foot,st.groupType.weight]),
			...[...Array(numHandHolds)].map(() => [st.groupType.hand,st.groupType.weight]),
			...[...Array(nTotalTiles - (numHandHolds + numFootHolds))].map(() => [st.groupType.foot,st.groupType.hand,st.groupType.weight])];
		shuffleArray(allowedGroupTypes,props.boardSeed);

		//give holds weight limits
		const numHoldsWithWeightLimits = Math.floor(nTotalTiles * props.holdsWithWeightLimitsPercent);
		const holdWeightLimits = [...Array(numHoldsWithWeightLimits).fill(1),...Array(nTotalTiles - numHoldsWithWeightLimits).fill(0)];
		shuffleArray(holdWeightLimits,props.boardSeed);

		//Create hold color data
		let holdColors = [];
		const iterNum = Math.ceil(nTotalTiles/bc.colorsArray.length);
		for (var i = 0; i < iterNum; i++) {
			holdColors = holdColors.concat(bc.colorsArray.map((color) =>(color)));
		}
		shuffleArray(holdColors,props.boardSeed);


		let holdData = allowedGroupTypes.map((val,index) => ({weightLimit: holdWeightLimits[index], color: holdColors[index], allowedGroupTypes: val})) ;
		
		holdData = holdData.slice(0,nTotalTiles);

		return holdData;
	}

	const getDrawOrder = () => {
		const drawOrder = generateCardsData().map((card,index) => index);
		shuffleArray(drawOrder,props.cardSeed);
		return drawOrder
	}


	return(<Game cardData = {generateCardsData()} drawOrder = {getDrawOrder()} boardData = {{holds: generateHoldData(), nRows: props.nRows, nCols: props.nCols}}/>);

};

export default GameHandler;

GameHandler.defaultProps = {
	nRows: 10,
	nCols: 6,
	boardSeed: 1232,
	cardSeed: 4356,
	handOnlyPercent : 0.20,
	footOnlyPercent : 0.20,
	holdsWithWeightLimitsPercent : 0.20
};