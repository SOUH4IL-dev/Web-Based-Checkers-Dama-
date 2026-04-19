const BOARD_SIZE = 8;
const boardEl = document.getElementById('board');
const restartBtn = document.getElementById('restartBtn');
const turnPlayerEl = document.getElementById('turnPlayer');
const statusEl = document.getElementById('status');
const capturedByRedEl = document.getElementById('capturedByRed');
const capturedByBlackEl = document.getElementById('capturedByBlack');

let board = [], turn = 'red', selected = null, validMoves = [];
let capturedCount = { red:0, black:0 }, noCaptureMoves = 0;

function initBoard(){
  board = Array.from({length:BOARD_SIZE}, ()=>Array(BOARD_SIZE).fill(null));
  // الأسود فوق
  for(let r=0;r<3;r++) for(let c=0;c<BOARD_SIZE;c++) 
    if((r+c)%2===1) board[r][c] = {color:'black', king:false};
  // الأحمر تحت
  for(let r=BOARD_SIZE-3;r<BOARD_SIZE;r++) for(let c=0;c<BOARD_SIZE;c++) 
    if((r+c)%2===1) board[r][c] = {color:'red', king:false};

  turn='red'; selected=null; validMoves=[];
  capturedCount={red:0,black:0}; noCaptureMoves=0;
  renderBoard();
  statusEl.textContent='اللعبة بدأت — دور الأحمر';
}

function renderBoard(){
  boardEl.innerHTML='';
  for(let r=0;r<BOARD_SIZE;r++){
    for(let c=0;c<BOARD_SIZE;c++){
      const square=document.createElement('div');
      square.className='square '+(((r+c)%2===1)?'dark':'light');
      square.dataset.r=r; square.dataset.c=c;
      square.addEventListener('click',()=>onSquareClick(r,c));

      const cell=board[r][c];
      if(cell){
        const piece=document.createElement('div');
        piece.className=`piece ${cell.color} ${cell.king?'king':''}`;
        if(selected && selected.r===r && selected.c===c) piece.classList.add('selected');
        square.appendChild(piece);
      }
      if(isMoveDestination(r,c, validMoves)) square.classList.add('highlight');
      boardEl.appendChild(square);
    }
  }
  updateCapturedUI(); updateTurnUI();
}

function updateTurnUI(){
  turnPlayerEl.innerText=(turn==='red')?'● أحمر':'● أسود';
  turnPlayerEl.style.color=(turn==='red')?'#e74c3c':'#111';
}
function updateCapturedUI(){
  capturedByRedEl.innerText=capturedCount.red;
  capturedByBlackEl.innerText=capturedCount.black;
}
function isMoveDestination(r,c,moves){
  return moves.some(m=>m.to.r===r && m.to.c===c);
}
function inside(r,c){ return r>=0 && r<BOARD_SIZE && c>=0 && c<BOARD_SIZE; }

function findCapturesFrom(r,c){
  const piece=board[r][c]; if(!piece) return [];
  const results=[]; const enemy=(piece.color==='red')?'black':'red';
  const dirs=piece.king?[[-1,-1],[-1,1],[1,-1],[1,1]]:(piece.color==='red'?[[-1,-1],[-1,1]]:[[1,-1],[1,1]]);
  function dfs(curR,curC,curPiece,captured,visited){
    let found=false;
    for(const [dr,dc] of dirs){
      const midR=curR+dr, midC=curC+dc, landR=curR+2*dr, landC=curC+2*dc;
      if(!inside(midR,midC)||!inside(landR,landC)) continue;
      const mid=board[midR][midC];
      if(mid && mid.color===enemy && board[landR][landC]===null){
        const key=`${midR},${midC}`; if(visited.has(key)) continue;
        const backup=board[landR][landC];
        board[curR][curC]=null; board[midR][midC]=null; board[landR][landC]=curPiece;
        const newVisited=new Set(visited); newVisited.add(key);
        const newCaptured=captured.concat([{r:midR,c:midC}]);
        const deeper=dfs(landR,landC,curPiece,newCaptured,newVisited);
        if(deeper.length>0){found=true; results.push(...deeper);}
        else {results.push({from:{r,c},to:{r:landR,c:landC},captures:newCaptured}); found=true;}
        board[curR][curC]=curPiece; board[midR][midC]={color:enemy,king:false}; board[landR][landC]=backup;
      }
    }
    return found?results:[];
  }
  dfs(r,c,piece,[],new Set()); return results;
}

function findSimpleMoves(r,c){
  const piece=board[r][c]; if(!piece) return [];
  const moves=[]; const dirs=piece.king?[[-1,-1],[-1,1],[1,-1],[1,1]]:(piece.color==='red'?[[-1,-1],[-1,1]]:[[1,-1],[1,1]]);
  for(const [dr,dc] of dirs){ const nr=r+dr,nc=c+dc;
    if(inside(nr,nc)&&board[nr][nc]===null) moves.push({from:{r,c},to:{r:nr,c:nc},captures:[]});
  }
  return moves;
}

function getAllMovesForPlayer(player){
  const captures=[],moves=[];
  for(let r=0;r<BOARD_SIZE;r++)for(let c=0;c<BOARD_SIZE;c++){
    const p=board[r][c];
    if(p&&p.color===player){
      const caps=findCapturesFrom(r,c);
      if(caps.length>0) captures.push(...caps);
      else moves.push(...findSimpleMoves(r,c));
    }
  }
  return captures.length>0?captures:moves;
}

function applyMove(move){
  const fr=move.from.r,fc=move.from.c,tr=move.to.r,tc=move.to.c;
  const piece=board[fr][fc]; if(!piece) return {tr,tc,promoted:false};
  board[fr][fc]=null; board[tr][tc]=piece;
  if(move.captures && move.captures.length>0){
    for(const cap of move.captures){
      const victim=board[cap.r][cap.c];
      if(victim) capturedCount[victim.color]++;
      board[cap.r][cap.c]=null;
    }
    noCaptureMoves=0;
  } else noCaptureMoves++;
  let promoted=false;
  if(!piece.king){
    if(piece.color==='red' && tr===0){piece.king=true;promoted=true;}
    if(piece.color==='black' && tr===BOARD_SIZE-1){piece.king=true;promoted=true;}
  }
  return {tr,tc,promoted};
}

function onSquareClick(r,c){
  const cell=board[r][c];
  if(selected){
    const chosen=validMoves.find(m=>m.to.r===r && m.to.c===c);
    if(chosen){
      const {tr,tc,promoted}=applyMove(chosen);
      const winner=checkForWin();
      if(winner){
        statusEl.textContent = (winner.result==='draw')
          ? `تعادل — ${winner.reason}`
          : `انتهت اللعبة — الفائز: ${winner.result==='red'?'الأحمر':'الأسود'} (${winner.reason})`;
        renderBoard(); return;
      }
      if(chosen.captures.length>0 && !promoted){
        const further=findCapturesFrom(tr,tc);
        if(further.length>0){selected={r:tr,c:tc}; validMoves=further; renderBoard(); return;}
      }
      selected=null; validMoves=[]; turn=(turn==='red')?'black':'red';
      statusEl.textContent=`دور: ${turn==='red'?'الأحمر':'الأسود'}`;
      renderBoard(); return;
    } else {
      if(cell && cell.color===turn){selected={r,c}; computeValidMovesForSelection(r,c);}
      else {selected=null; validMoves=[];}
      renderBoard(); return;
    }
  } else {
    if(cell && cell.color===turn){selected={r,c}; computeValidMovesForSelection(r,c); renderBoard();}
  }
}

function computeValidMovesForSelection(r,c){
  const allCaps=getAllMovesForPlayer(turn).filter(m=>m.captures&&m.captures.length>0);
  validMoves=allCaps.length>0?findCapturesFrom(r,c):findSimpleMoves(r,c);
}

function checkForWin(){
  const opponent=(turn==='red')?'black':'red';
  let pieces=0, onlyKings=true;
  for(let r=0;r<BOARD_SIZE;r++)for(let c=0;c<BOARD_SIZE;c++){
    const p=board[r][c]; if(p){
      if(p.color===opponent) pieces++;
      if(!p.king) onlyKings=false;
    }
  }
  if(pieces===0) return {result:turn, reason:"الخصم لم يعد لديه أي قطع"};
  if(getAllMovesForPlayer(opponent).length===0) return {result:turn, reason:"الخصم لا يستطيع التحرك"};
  if(noCaptureMoves>=40) return {result:'draw', reason:"40 حركة متتالية بلا أسر"};
  if(onlyKings) return {result:'draw', reason:"لم يتبق سوى ملوك على اللوحة"};
  return null;
}

restartBtn.addEventListener('click', ()=>initBoard());
initBoard();
