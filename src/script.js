const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize',function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctx.fillStyle = "blue";
	ctx.fillRect(10, 10, 50, 50);
})


ctx.fillStyle = "blue";
ctx.fillRect(10, 10, 50, 50);