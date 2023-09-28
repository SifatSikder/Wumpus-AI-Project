// let tempMoves = moves.slice()
// let tempTurns = knowledgeBase.turns().slice()
// console.log("moves.size:" + tempMoves.length + "\tturns.size:" + tempTurns.length);
// try {
//     turn(left);
//     turn(left);
//     move();
//     while (position[0] != cell[0] || position[1] != cell[1]) {
//         let nextMove = tempMoves[tempMoves.length - 1];
//         if (position[0] + direction[0] == nextMove[0] && position[1] + direction[1] == nextMove[1]) {
//             move();
//             tempMoves.pop()
//         } else {
//             let TURN = tempTurns[tempTurns.length - 1];
//             if (TURN == left) {
//                 turn(right);
//                 tempTurns.pop()
//             } else if (TURN == right) {
//                 turn(left);
//                 tempTurns.pop();
//             }
//         }
//     }
//     return true;
// } catch (e) {
//     console.log(e);
//     return false;
// }
