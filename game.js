//useful vars
var height;
var width;
var mines;
var minesNum;
var board;

//Initials click on "Start new game"
document.getElementById("newgame").onclick = function () {

    if(checkValidInput())
        newGame();
}

//Checks user's input
 function checkValidInput(){

    height=parseInt(document.getElementById("height").value);
    width=parseInt(document.getElementById("width").value);
    mines=parseInt(document.getElementById("mines").value);

    if(isNaN(height)||isNaN(width)||isNaN(mines)|| height<=0||width<=0||mines<=0||width*height<mines){
        window.alert("Please enter valid input.");
        resetPage();
        return false;
    }
    return true;
}

//Resets the page
function resetPage(){
    document.getElementById("height").value = "";
    document.getElementById("width").value = "";
    document.getElementById("mines").value = "";
    document.getElementById("table").innerHTML="";
    document.getElementById("flagsLeft").innerHTML="";
}

//Starts new game
function newGame(){

    height=parseInt(document.getElementById("height").value);
    width=parseInt(document.getElementById("width").value);
    mines=parseInt(document.getElementById("mines").value);
    minesNum=mines;
    document.getElementById("flagsLeft").innerHTML="Flags left: "+mines;
    var rand=0;
    board=initMat();

    var size=height*width;

    for(var i=0;i<height&&mines>0;i++){
        for(var j=0;j<width&&mines>0;j++){

            rand=Math.random();
            if(mines>0&&rand<= mines/size--) {
                mines--;
                board[i][j]=-1;
                updateNeighbors(i,j);
            }
        }
    }

    var designTable ="<tbody>";
    for(var i=0;i<height;i++){
        designTable += "<tr>";
        for(var j=0;j<width;j++){
            var cell="cell_"+i+"_"+j;
            var td = "td_"+i+"_"+j;
            designTable +="<td id=" + td + " onclick='clickedOnCell(event,"+i+","+j+")'" +
                "onmouseover='changeCellColor("+i+","+j+")'"+"onmouseout='resetCellColor("+i+","+j+")'"+

                "><span id="+cell+">";
            if(board[i][j]===-1){
                designTable +="*";
                mines++;
            }
            else if(board[i][j]>0)
                designTable +=board[i][j];
            designTable +="</span></td>";
        }
        designTable +="</tr>";
    }
    designTable +="</tbody>";
    document.getElementById("table").innerHTML = designTable;
    visibility(document.getElementById("zlatan").checked);
}

//Initials matrix
function initMat(){
    var matrix=[];
    for(var i=0;i<height;i++){
        matrix[i]=[];
        for(var j=0;j<width;j++) {
            matrix[i][j]=0;
        }
    }
    return matrix;
}

//Initials zlatanMode
function zlatanMode(){
    var flag=document.getElementById("zlatan").checked;
    if(flag){
        document.body.style.backgroundImage = "url('http://images.performgroup.com" +
            "/di/library/GOAL/51/1d/hd-zlatan-ibrahimovic-manchester-united_wh5yd2eck" +
            "t1q1afq1ih8lnmgm.jpg?t=1470062242')";
    }
    else
        document.body.style.backgroundImage='none';
    visibility(flag);

}

//Changes the visibility of the cells, 'block' or 'none'
function visibility(flag){
    var x;
    if(flag)
        x='block';
    else
        x='none';

    for(var i=0;i<height;i++){
        for(var j=0;j<width;j++){
            var td="td_"+i+"_"+j;
            var cell="cell_"+i+"_"+j;
            if(document.getElementById(td).onclick){
                document.getElementById(cell).style.display=x;
                document.getElementById(cell).style.opacity=1;
            }

        }
    }
}

//Handles onmouseover event
function changeCellColor(i,j){
    var td = "td_"+i+"_"+j;
    if(document.getElementById(td).onclick)
        document.getElementById(td).style.backgroundColor = 'darkcyan';

}

//Handles onmouseout event
function resetCellColor(i,j){
    var td = "td_"+i+"_"+j;
    if(document.getElementById(td).onclick)
        document.getElementById(td).style.backgroundColor = 'deepskyblue';
}

//Updates the neighbors in board
function updateNeighbors(row, col){
    for (var i = row - 1; i < row + 2; i++){
        if (i >= 0 && i < height) {
            for (var j = col - 1; j < col + 2; j++) {
                if (j >= 0 && j < width) {
                    if (board[i][j] >= 0)
                        board[i][j]++;
                }
            }
        }
    }
}

//Handles clicked on Cell event
function clickedOnCell(e,i,j){
    var cell="cell_"+i+"_"+j;
    var td="td_"+i+"_"+j;
    if(e.shiftKey){
        if(document.getElementById(td).getElementsByTagName('div').length!=0)
        {
            mines++;
            document.getElementById("flagsLeft").innerHTML="Flags left: "+mines;
            var divs = document.getElementById(td).getElementsByTagName('div');
            divs[0].parentNode.removeChild(divs[0]);
        }
        else if(mines>0){
            if(document.getElementById(td).getElementsByTagName('div').length==0){
                mines--;
                document.getElementById("flagsLeft").innerHTML="Flags left: "+mines;
                var flag = document.createElement('div');
                flag.innerHTML = 'Flag';
                document.getElementById(td).appendChild(flag);

             }
        }
        else
            alert("No more flags!");

    }
    else if(document.getElementById(td).getElementsByTagName('div').length==0) {
        document.getElementById(td).onclick = "";
        var val = document.getElementById(cell).innerHTML;
        if (val == "*"){
            document.getElementById(cell).style.display = 'block';
            document.getElementById(td).style.backgroundColor = "lightcyan";
            loseGame(i,j);
        }

        else if (val == "")
            showBoard(i, j);
            else {
                document.getElementById(cell).style.display = 'block';
                document.getElementById(td).style.backgroundColor = "lightcyan";
            }
    }
    checkWinGame();

}

//Reveals the board according to the events in the game
function showBoard(i,j){
    var cell="cell_"+i+"_"+j;
    var td="td_"+i+"_"+j;
    var val=document.getElementById(cell).innerHTML;
    var flag = document.getElementById("zlatan").checked;
    if((flag&&document.getElementById(td).style.backgroundColor != "lightcyan")
        ||document.getElementById(cell).style.display=='none'){
        document.getElementById(td).onclick="";
        document.getElementById(cell).style.display='block';
        document.getElementById(td).style.backgroundColor = "lightcyan";
        if(val===""){
            if(i>0)
                showBoard(i-1,j);
            if(i<height-1)
                showBoard(i+1,j);
            if(j>0)
                showBoard(i,j-1);
            if(j<width-1)
                showBoard(i,j+1);
        }
    }
}

//Notices the player that he lose the game
function loseGame(i,j){
    var cell="cell_"+i+"_"+j;
    var td="td_"+i+"_"+j;
    document.getElementById(td).style.backgroundColor = 'red';
    document.getElementById(cell).style.display='block';
    window.alert("You Lose!");
    newGame();

}

//checks if the user win the game
function checkWinGame(){
    var countCorrFlags = 0,countCellsLeft = 0;
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var td = "td_" + i + "_" + j;
            var cell = "cell_" + i + "_" + j;
            if (document.getElementById(cell).innerHTML == '*' &&
                document.getElementById(td).getElementsByTagName('div').length!=0)
                countCorrFlags++;
            if(document.getElementById(td).getElementsByTagName('div').length==0&&
                !document.getElementById(td).onclick=="")
                countCellsLeft++;
        }
    }
    if((minesNum-mines)==countCorrFlags&&countCellsLeft==mines||
        (mines==0&&minesNum==countCorrFlags)){
        window.alert("You Win!")
        newGame();
    }

}





