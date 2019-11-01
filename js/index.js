var chessBoard = [];
var me = true;
var over = false;
//赢法数组
var wins = [];
//判断胜负
var mywin = [];
var computer = [];
//判定黑白棋子
for (var i=0; i<15;i++) {
	chessBoard[i] = [];
	for (var j=0; j<15;j++) {
		chessBoard[i][j] = 0;
	}
}
//赢法数组
for (var i=0; i<15;i++) {
	wins[i] = [];
	for (var j=0; j<15;j++) {
		wins[i][j] = [];
	}
};
//赢法统计
//横线
var count = 0;
for (var i=0;i<15;i++) {
	for (var j=0;j<11;j++) {
		for (var k=0;k<5;k++) {
			wins[i][j+k][count] = true;
		}
		count++;
	}
};
//竖线
for (var i=0;i<15;i++) {
	for (var j=0;j<11;j++) {
		for (var k=0;k<5;k++) {
			wins[j+k][i][count] = true;
		}
		count++;
	}
};
//斜线
for (var i=0;i<11;i++) {
	for (var j=0;j<11;j++) {
		for (var k=0;k<5;k++) {
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
};
//反斜线
for (var i=0;i<11;i++) {
	for (var j=14;j>3;j--) {
		for (var k=0;k<5;k++) {
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
};
//console.log(count);
//判断胜负
for (var i=0;i<count;i++) {
	mywin[i] = 0;
	computer[i] = 0;
};
var chess = document.getElementById('chess');		//获取对象
var context = chess.getContext('2d');				//绘制方式
context.strokeStyle = '#bfbfbf';					//直线的样式
var bg = new Image();								//创建一个背景图像
bg.src = 'img/bg.png'		
bg.onload = function (){							//函数加载完成时
	context.drawImage(bg,0,0,450,450)		
	biaoge();										//执行绘制表格的函数
};
function biaoge(){									//绘制表格
for (var i = 0;i<15;i++) {
	context.moveTo(15,15+i*30);
	context.lineTo(435,15+i*30);
	context.stroke();
	context.moveTo(15+i*30,15);
	context.lineTo(15+i*30,435);
	context.stroke();
}
};
var onStep = function(i,j,me){
	context.beginPath();
	context.arc(15+i*30,15+j*30,13,0,2*Math.PI);
	context.closePath();
	var jianbian = context.createRadialGradient(15+i*30,15+j*30,13,15+i*30+2,15+j*30-2,0);
	if (me) {
		jianbian.addColorStop(0,'#0a0a0a');
		jianbian.addColorStop(1,'#636766');
	} else{
		jianbian.addColorStop(0,'#d1d1d1');
		jianbian.addColorStop(1,'#f9f9f9');
	}
	context.fillStyle = jianbian;
	context.fill();
};
chess.onclick = function(e){
	if (over) {
		return;
	}
	if (!me) {
		return;	
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x/30);
	var j = Math.floor(y/30);
	if (chessBoard[i][j] == 0) {
//		console.log('--------------');
		onStep(i,j,me);
		chessBoard[i][j] = 1;
		for (var k=0;k<count;k++) {
			if (wins[i][j][k]){
				mywin[k]++;
				computer[k] = 6;
//				console.log('mywin为'+mywin[k]);
				if (mywin[k] == 5) {
					alert('你赢了');
					over = true;
				}
			}
		}
		if (!over) {
			me = !me;
			computerAi();
		}
	}
}
var computerAi = function() {
	var mySecore = [];
	var computerSecore = [];
	var max = 0;
	var u = 0,v=0;
	for (var i=0;i<15;i++) {
		mySecore[i] = [];
		computerSecore[i] = [];
		for (var j=0;j<15;j++) {
			mySecore[i][j] = 0;
			computerSecore[i][j] = 0;
		}
	}
	for (var i=0;i<15;i++) {
		for (var j=0;j<15;j++) {
			if (chessBoard[i][j] == 0) {
				for (var k=0;k<count;k++) {
					if (wins[i][j][k]) {
						if (mywin[k] == 1) {
							mySecore[i][j] += 200;
						}else if (mywin[k] == 2) {
							mySecore[i][j] += 400;
						}else if (mywin[k] == 3) {
							mySecore[i][j] += 2000;
						}else if (mywin[k] == 4) {
							mySecore[i][j] += 10000;
						}
						if (computer[k] == 1) {
							computerSecore[i][j] += 400;
						}else if (computer[k] == 2) {
							computerSecore[i][j] += 800;
						}else if (computer[k] == 3) {
							computerSecore[i][j] += 5000;
						}else if (computer[k] == 4) {
							computerSecore[i][j] += 20000;
						}
					}
				}
				if (mySecore[i][j] > max) {
					max = mySecore[i][j];
					u = i;
					v = j;
				}else if (mySecore[i][j] == max) {
					if (computerSecore[i][j] >computerSecore[u][v]) {
						u = i;
						v = j;
					}
				}
				if (computerSecore[i][j] > max) {
					max = computerSecore[i][j];
					u = i;
					v = j;
				}else if (computerSecore[i][j] == max) {
					if (mySecore[i][j] >mySecore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}
	onStep(u,v,false);
//	console.log('--------------');
	chessBoard[u][v] = 2;
	for (var k=0;k<count;k++) {
			if (wins[u][v][k]) {
				computer[k]++;
				mywin[k] = 6;
//				console.log('computer为'+computer[k]);
				if (computer[k] == 5) {
					alert('计算机赢了');
					over = true;
				}
			}
		}
		if (!over) {
			me = !me;
		}
}