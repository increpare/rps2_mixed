function boardToIndex(ar){
	return ar[0]+3*ar[1]+9*ar[2];
}

function indexToBoard(ar){
	var a0 = ar%3;
	var a1 = Math.floor(ar/3)%3;
	var a2 = Math.floor(ar/9)%3;

	return [a0,a1,a2]
}

function flipBoard(ar){
	return [2-ar[0],2-ar[1],2-ar[2]]
}

function flipIndex(i){
	var board = indexToBoard(i)

	var flipped_board = flipBoard(board)

	var result_index=boardToIndex(flipped_board)

	return result_index
}

function makeTransitionArrayOfOnes(){
	var a = []
	for (var i=0;i<27;i++){
		a.push([1,1,1])
	}
	return a
}

function sumWeights(ar){
	var sum=0;
	for (var i=0;i<ar.length;i++){
		sum+=ar[i];
	}
	return sum;
}

// from min to max-1
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function pickIndexFromWeightArray(ar){
	var sum=sumWeights(ar)
	var rand = getRandomInt(0,sum)
	
	if (rand<ar[0]){
		return 0;
	}
	rand-=ar[0]
	if (rand<ar[1]){
		return 1;
	}
	return 2;
}

function getStartBoard(){
	return [1,1,1];
}

function rps(mymove,theirmove){
	return ((mymove-theirmove+1+3)%3)-1;
}

function evalBoard(board){
	if (board[0]<0||board[1]<0||board[2]<0){
		return -1;
	}
	if (board[0]>2||board[1]>2||board[2]>2){
		return 1;
	}
	return 0;
}

function evaulateMoves(board,mymove,theirmove){
	var result = rps(mymove,theirmove)
	if (result===0){
		return board;
	}
	var newboard = [board[0],board[1],board[2]]
	if (result>0){
		newboard[mymove]++;
	} else {//result<0
		newboard[theirmove]--;
	}
	var result = evalBoard(newboard)
	if (result>0){
		return "win"
	}	
	if (result<0){
		return "lose"
	}
	return newboard;
}

var rps_letters=["r","p","s"]

var transitions=makeTransitionArrayOfOnes();
var max = 100000000;
for( var bla=0;bla<100000000;bla++){
	if (bla%1000===0){
		console.log(bla/max);
	}
	var init_board=getStartBoard();
	var init_board_index=boardToIndex(init_board);

	var current_board=init_board;
	var current_board_index=init_board_index;
	var visited=[];//[board,mymove,theirmove]
	while(true){
		var mymove = pickIndexFromWeightArray(transitions[current_board_index]);
		var flipped_board_index = flipIndex(current_board_index); 
		var aimove = pickIndexFromWeightArray(transitions[flipped_board_index]);

		visited.push([current_board_index,mymove,aimove])

		var evaluated = evaulateMoves(current_board,mymove,aimove);
// 		console.log(`
// ${rps_letters[mymove]} vs ${rps_letters[aimove]}
// before ${current_board}
// after  ${evaluated}

// before_i ${current_board_index}
// after_i  ${boardToIndex(current_board)}
// 			`)

		if (evaluated==="win"){
			for (var i=0;i<visited.length;i++){
				var [visited_index,visited_mymove,visited_theirmove]=visited[i]

				transitions[visited_index][mymove]++;
			}
			break;
		}
		if (evaluated==="lose"){
			for (var i=0;i<visited.length;i++){
				var [visited_index,visited_mymove,visited_theirmove]=visited[i]

				var  visited_index_flipped = flipIndex(visited_index);

				transitions[visited_index_flipped][visited_theirmove]++;
			}
			break;
		}
		current_board=evaluated;
		current_board_index=boardToIndex(current_board);

	}
}

function normaliseWeights(ar){
	var s = ar[0]+ar[1]+ar[2];
	var result = [(100*ar[0]/s).toFixed(0),(100*(ar[0]+ar[1])/s).toFixed(0),(100*(ar[0]+ar[1]+ar[2])/s).toFixed(0)];
	for (var i=0;i<3;i++){
		while (result.length<3){
			result+=" "
		}
	}
	return result;
}

console.log(transitions);

var normalized = transitions.map(normaliseWeights)


console.log("\n\nRESULTS\n\n\n")
for (var i=0;i<normalized.length;i++){
	var board = indexToBoard(i)
	var row=  normalized[i];
	console.log(`${board[0]}${board[1]}${board[2]} : ${row[0]} ${row[1]} ${row[2]}`)
}

var init_board=getStartBoard();
var init_index= boardToIndex(init_board);

var mymove = 1;


// console.log("hello world")

// // var startTransitions=makeTransitionArrayOfOnes()


// console.log(startTransitions)
