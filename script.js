

const operations = {
	"pi": Math.PI,
	"e": Math.E,

	"/": (a,b) => a / b, 
	"x": (a,b) => a * b, 
	"+": (a,b) => a + b,
	"-": (a,b) => a - b,

	"(": (a) => a,
	"sin(": (a) => Math.sin(a),
	"cos(": (a) => Math.cos(a),
	"tan(": (a) => Math.tan(a),
	"sqrt(": (a) => Math.sqrt(a),
	"log(": (a) => Math.log(a), 
	"log10(": (a) => Math.log(a) / Math.log(10), 
	"abs(": (a) => Math.abs(a),
	"exp(": (a) => Math.exp(a),

	"^(": (a,b) => a ** b
};

const afterOp = {
	"pi": [0,0],
	"e": [0,0],

	"/": [-1,2], 
	"x": [-1,2], 
	"+": [-1,2],
	"-": [-1,2],

	"(": [0,3],
	"sin(": [0,3],
	"cos(": [0,3],
	"tan(": [0,3],
	"sqrt(": [0,3],
	"log(": [0,3], 
	"log10(": [0,3], 
	"abs(": [0,3], 
	"exp(": [0,3], 

	"^(": [-1,3]
};



let expression = [];
let number = "";

function clearing() {
	expression = [];
	number = "";
	document.getElementById('display').value = "";
}



function addNumber(value) {
	number += value;
	document.getElementById('display').value += value;
}

function addAS(value) {
	if (number != "") {
		expression.push(number);
		number = "";
		expression.push(value);
	}
	else {
		number += value;
	}
	document.getElementById('display').value += value;
}

function addDM(value) {
	expression.push(number);
	number = "";
	expression.push(value);
	document.getElementById('display').value += value;
}

function addConstant(value) {
	if (number != "") {
		expression.push(number);
		expression.push("x");
	}
	number = operations[value];
	document.getElementById('display').value += value;
}

function addClosed(value) {
	if (number != "") {
		expression.push(number);
		number = "";
	}
	expression.push(value);
	document.getElementById('display').value += value;
}

function addFunction(value) {
	if (number != "") {
		expression.push(number);
		expression.push("x");
		number = "";
	}
	expression.push(value);
	document.getElementById('display').value += value;
}



function pops(expr, ii, j, eval) {
	ex = []
	for (let i=0; i<j+afterOp[ii][0]; i++) {
		ex.push(expr[i]);
	}
	ex.push(eval);
	for (let i=j+afterOp[ii][1]; i<expr.length; i++) {
		ex.push(expr[i]);
	}
	return ex;
}

function slices(expr, start, end) {
	let xx = [];
	for (let i=start; i<end; i++) {
		xx.push(expr[i]);
	}
	return xx;
}



function DMAS(expre) {
	let eq = ["/","x"]
	for (let a=0; a<expre.length; a++) {
		if (eq.indexOf(expre[a]) != -1) {

			eval = String( operations[ expre[a]]( parseFloat(expre[a-1]), parseFloat(expre[a+1])));
			expre = pops(expre, expre[a], a, eval);
			a -= 1;
		}
	}
	eq = ["+","-"]
	for (let a=0; a<expre.length; a++) {
		if (eq.indexOf(expre[a]) != -1) {

			eval = String( operations[ expre[a]]( parseFloat(expre[a-1]), parseFloat(expre[a+1])));
			expre = pops(expre, expre[a], a, eval);
			a -= 1;
		}
	}
	console.log(expre);
	console.log("############################################");
	return expre;
}

function BO(express) {
	console.log(express);
	let eq = ["(","sin(","cos(","tan(","sqrt(","log(","log10(","abs(","exp(","^("];
	for (let a=0; a<express.length; a++) {
		if (eq.indexOf(express[a]) != -1) {
			console.log(express[a]);

			let aa = slices(express,0,a+1);
			let bb = slices(express,a+1,express.length);
			bb = BO(bb);

			b = bb.indexOf(")");
			let cc= slices(bb,0,b);
			cc = DMAS(cc);
			let dd = slices(bb,b,bb.length);
			console.log(aa,bb,cc,dd);

			bb = cc.concat(dd);
			express = aa.concat(bb);

			if (express[a] == "^(") {
				eval = String( operations[ express[a]]( parseFloat(express[a-1]), parseFloat(express[a+1])));
				express = pops(express, express[a], a, eval);
				a -= 1;
			}
			else {
				eval = String( operations[ express[a]]( parseFloat(express[a+1]), parseFloat(express[a+2])));
				express = pops(express, express[a], a, eval);
			}
		}
	}
	console.log(express);
	console.log("############################################");
	return express;
}





function calculate() {
	if (number != "") {
		expression.push(number);
	}
	expression = BO(expression);
	expression = DMAS(expression);
	number = DMAS(expression)[0];
	document.getElementById('display').value = number;
	expression = [];
}



