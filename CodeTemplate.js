$(document).ready(function(){
	
document.body.onmousedown = function() { return false; } //so page is unselectable

	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var mx, my;
	
	var screen = 0;
	setInterval(function(){
	if (screen == 1) timer++;
	}, 100);
	
	var timer = 0;
	var day = 0;
	var tempday = 0;
	var tempday2 = 0;
	var temphour = 0;
	var quake = false;
	var erupt = false;
	var sick = false;
	
	var eventbegin = false;
	
	var stats = false;
	
	var males = 0;
	var females = 0;
	
	var hiddennum = 102304506;
	var humans = [];
	var babies = [];
	var error = false;
	var pause = false;
	
	var avgfit;
	
	var bimu;
	var bwis;
	var bstr;
	var bhp;
	var bwgt;
	var bcp;
	var bfit;
	var simu;
	var swis;
	var sstr;
	var shp;
	var swgt;
	var scp;
	var sfit;
	
	function human(){
		this.specialName = hiddennum;
		// DNA is the human's stats in the following order: 
		//			strand A:		Physical Stats: HEALTH, WEIGHT, COMBAT POWER
		//			strand B:		Traits: IMMUNITY, WISDOM, STRENGTH
		//																					
		this.sA = [20, 40, 10];
		this.sB = [10, 10, 10];
		this.food = 4 + rand(5);
		this.water = 10 + rand(5);
		this.index = 0;
		this.gender = getRGender();
		this.mother = -1;
		
		this.x = 45 + rand(70);
		this.y = 180 + rand(30);
		this.size = 16;
		this.speed = 0.5;
		this.obj = -1;
		this.target = -1;
		this.hp = this.sA[0];
		this.weight = this.sA[1];
		this.aggrolvl = 7 + rand(2);
		this.fitness = this.sA[0] + this.sA[1] + this.sA[2] + this.sB[0] + this.sB[1] + this.sB[2];
		
		this.skinc = ("#f" + rand(9) + "f" + rand(9) + "8" + rand(9));
		if(this.gender == "female"){
			this.skinc = ("#f" + rand(9) + "f" + rand(9) + "8" + rand(9));
		} else if(this.gender == "male"){
			this.skinc = ("#f" + rand(9) + "A" + rand(9) + "7" + rand(9));
		}
		this.canbreed = true;
		
		this.pregnant = false;
		this.pregclock = 1000;
		
		this.pregnancy = function(){
			if(this.pregclock > 0 && this.pregnant == true) this.pregclock--;
			if(this.pregclock <= 0){
				this.pregclock = 1100;
				var baby = findmyBaby(this.index);
				if(babies[baby].mother != -1 && babies[baby].mother == this.index){
					babies[baby].x = this.x;
					babies[baby].y = this.y;
				}
				humans.push(babies[baby]);
				babies.splice(baby, 1);
				humans[humans.length - 1].x = this.x;
				humans[humans.length - 1].y = this.y;
				for(var i = 0; i < humans.length; i++){
					humans[i].index = i;
				}
				console.log("Human " + humans[humans.length - 1].index + " has been born!");
				if(humans[humans.length - 1].sB[0] > humans[bimu].sB[0]) bimu = (humans.length - 1);
				if(humans[humans.length - 1].sB[1] > humans[bwis].sB[1]) bwis = (humans.length - 1);
				if(humans[humans.length - 1].sB[2] > humans[bstr].sB[2]) bstr = (humans.length - 1);
				if(humans[humans.length - 1].sA[0] > humans[bhp].sA[0]) bhp = (humans.length - 1);
				if(humans[humans.length - 1].sA[1] > humans[bwgt].sA[1]) bwgt = (humans.length - 1);
				if(humans[humans.length - 1].sA[2] > humans[bcp].sA[2]) bcp = (humans.length - 1);
				if(humans[humans.length - 1].fitness > humans[bfit].fitness) bfit = (humans.length - 1);
				
				if(humans[humans.length - 1].sB[0] < humans[simu].sB[0]) simu = (humans.length - 1);
				if(humans[humans.length - 1].sB[1] < humans[swis].sB[1]) swis = (humans.length - 1);
				if(humans[humans.length - 1].sB[2] < humans[sstr].sB[2]) sstr = (humans.length - 1);
				if(humans[humans.length - 1].sA[0] < humans[shp].sA[0]) shp = (humans.length - 1);
				if(humans[humans.length - 1].sA[1] < humans[swgt].sA[1]) swgt = (humans.length - 1);
				if(humans[humans.length - 1].sA[2] < humans[scp].sA[2]) scp = (humans.length - 1);
				if(humans[humans.length - 1].fitness < humans[sfit].fitness) sfit = (humans.length - 1);
				
				if(humans[humans.length - 1].gender == "male") males++;
				else females++;
				
				avgfit = Math.floor((((avgfit * (humans.length - 1)) + humans[humans.length - 1].fitness) / humans.length) * 100) / 100;
				
				this.pregnant = false;
				this.speed *= 2;
				this.food -= 2;
				this.water -= 2;
				this.hp -= (0.5 * this.hp + rand(10));
			}
		}
		
		this.draw = function(){
			ctx.fillStyle = this.skinc;
			ctx.fillRect(this.x, this.y, this.size, this.size);
			ctx.fillStyle = 'black';
			ctx.font = '8pt Arial';
			//ctx.fillText("Food: " + Math.round(this.food) + " Water: " + Math.round(this.water), this.x - 5, this.y - 30);
			//ctx.fillText("HP: " + this.sA[0] + " WGT: " + this.sA[1] + " CP: " + this.sA[2], this.x - 5, this.y - 20);
			//ctx.fillText("IMU: " + this.sB[0] + " WIS: " + this.sB[1] + " STR: " + this.sB[2], this.x - 5, this.y - 10);
			ctx.fillText(this.index + ", " + Math.floor(this.fitness * 100) / 100, this.x + 4, this.y - 10);
			ctx.fillStyle = 'red';
			ctx.fillRect(this.x - 4, this.y - 4, 24, 2);
			ctx.fillStyle = 'lightgreen';
			ctx.fillRect(this.x - 4, this.y - 4, Math.round(24 * (this.hp / this.sA[0])), 2);
			ctx.fillStyle = 'black';
		}
		
		this.roam = function(){
			var rmove = rand(100);
				if(this.x + this.size < 1008 && this.y > 5 && this.y + this.size < 754){
					if(rmove <= 40 && rmove > 35){
						this.x += this.speed;
					} 
				} if(this.x > 5 && this.y > 5 && this.y + this.size < 754){
					if(rmove <= 35 && rmove > 30){
						this.x -= this.speed;
					} 
				} if(this.y + this.size < 754 && this.x > 5 && this.x + this.size < 1008){
					if(rmove <= 30 && rmove > 25){
						this.y += this.speed;
					}
				} if(this.y > 5 && this.x > 5 && this.x + this.size < 1008){
					if(rmove <= 25 && rmove > 20){
						this.y -= this.speed;
					}
				}
				if(rmove > 70) this.fobj();
		}
		
		this.task = function(){									// TASKING A.I
			if(this.food + this.water > this.sA[1]){
				var randomizer = rand(2);
				if(randomizer == 0){
					this.food -= 1;
				}else if(randomizer == 1){
					this.water -= 1;
				}
			}
			this.fobj = function(){
				if(this.gender == "male" && males > Math.floor(((humans.length) / 100) * 70)) this.obj = 7;		// ELIMANATE ALL OTHER MALES
				else if(this.hp < (this.sA[0] / 2) && this.food > 5 && this.water > 5) this.obj = 8;	// Get Health
				else if((this.food < 5 || this.water < 5) && this.aggrolvl > 7) this.obj = 6;			// Fight for food/water
				else if(this.food < 10 && this.food < this.water) this.obj = 1;			// Desperate Gather food
				else if(this.water <10 && this.water < this.food) this.obj = 2;			// Desperate Gather water
				else if(this.food == this.water && this.food < 10 && this.water < 10) this.obj = 1;		// Prevent Objective Stalling
				else if(this.food == this.water && this.food >= 10 && this.water >= 10) this.obj = 4;		// Prevent Objective Stalling
				else if(this.food >= 19 && this.water >= 19) this.obj = 3;					// Breed
				else if(this.food >= 10 && this.food <= 22 && this.water >= 10 && this.water <= 22 && this.food < this.water) this.obj = 4;				// Bountyful Gather food
				else if(this.food >= 10 && this.food <= 22 && this.water >= 10 && this.water <= 22 && this.water < this.food) this.obj = 5;				// Bountyful Gather water
				
				else this.obj = 1;
			}
			if(this.obj == -1) this.obj = 1;
			if(this.obj == 0) this.roam();
			else if(this.obj == 1) this.gather("food", true);
			else if(this.obj == 2) this.gather("water", true);
			else if(this.obj == 8) this.gather("health", true);
			else if(this.obj == 3) this.mate();
			else if(this.obj == 4) this.gather("food", false);
			else if(this.obj == 5) this.gather("water", false);
			else if(this.obj == 6) this.fight(null);
			else if(this.obj == 7) this.fight("male");
			
		}
		
		this.gather = function(resource, isdesperate){
			if(resource == "food"){
			if(isdesperate) this.target = findclosest(this.x, this.y, sources, null);
			else this.target = findbestfood(this.x, this.y, sources);
			if(this.target == -1) this.target = findclosest(this.x, this.y, sources, null);
				if(typeof sources[this.target] === 'undefined') {
					this.target = findclosest(this.x, this.y, sources, null);
					console.log("Food source not found for: " + this.index);
					this.obj = 6;
				}
				else {
					if(this.x <= sources[this.target].x + 2){
						this.x += this.speed;
					}
					if(this.x > sources[this.target].x + 2){
						this.x -= this.speed;
					}
					if(this.y >= sources[this.target].y + 1){
						this.y -= this.speed;
					}
					if(this.y < sources[this.target].y + 1){
						this.y += this.speed;
					}
					if(this.x + this.size >= sources[this.target].x && this.x < sources[this.target].x + sources[this.target].w && this.y + this.size >= sources[this.target].y && this.y < sources[this.target].y + sources[this.target].h && sources[this.target].bloom == true){
						this.food += ((sources[this.target].value / 20) + (0.002 * this.sB[1]));
						sources[this.target].amount -= ((sources[this.target].value / 20) + (0.002 * this.sB[1]));
						if(sources[this.target].amount <= 0){
							sources[this.target].bloom = false;
						}
						if(isdesperate){
							this.fobj();
						}
						if(this.food >= this.weight / 2){
							this.fobj();
						}
					} else if (sources[this.target].bloom == false) {
						this.fobj();
					}
				}
				
			}
			if(resource == "water"){
				if(typeof wsources[0] === 'undefined') {
					console.log("Water source not found for: " + this.index);
					this.fobj();
				}
				else {
					if(this.x <= wsources[0].x + rand(100)){
						this.x += this.speed;
					}
					if(this.y >= wsources[0].y + 170){
						this.y -= this.speed;
					}
					if(this.y < wsources[0].y + 199){
						this.y += this.speed;
					}
					if(this.x + this.size >= wsources[0].x && this.x < wsources[0].x + wsources[0].w && this.y + this.size >= wsources[0].y && this.y < wsources[0].y + wsources[0].h + 1){
						this.water += (0.01 + (0.003 * this.sB[1]));
						if(!(isdesperate)){
							this.fobj();
						}
						if(this.water >= this.weight / 2){
							this.fobj();
						}
					}
				}
				
			}
			
			if(resource == "health"){
				if(typeof sources[8] === 'undefined') {
					console.log("Healing source not found for: " + this.index);
					this.fobj();
				} else {
					if(this.x <= sources[8].x + 2){
						this.x += this.speed;
					}
					if(this.x > sources[8].x + 2){
						this.x -= this.speed;
					}
					if(this.y >= sources[8].y + 1){
						this.y -= this.speed;
					}
					if(this.y < sources[8].y + 1){
						this.y += this.speed;
					}
					if(this.x + this.size >= sources[8].x && this.x < sources[8].x + sources[8].w && this.y + this.size >= sources[8].y && this.y < sources[8].y + sources[8].h && sources[8].bloom == true){
						if(this.hp < this.sA[0]) this.hp++;
						this.food += ((sources[8].value / 20) + (0.0001 * this.sB[1]));
						sources[8].amount -= ((sources[8].value / 20) + (0.001 * this.sB[1]));
						if(!(isdesperate)){
							this.fobj();
						}
						if(this.food >= this.weight / 2 || this.hp >= this.sA[0]){
							console.log("Yum yum, " + this.index + " feels better already!");
							this.fobj();
							this.hp = this.sA[0];
						}
					}
				}
				
			}
		}		
		
		this.mate = function(){
			if(this.food > 19 && this.water > 19) this.canbreed = true;
			if(this.food < 20 || this.water < 20) this.fobj();
			if(this.x + this.size <= structures[0].x + Math.floor(structures[0].w / 2) - 10){
				this.x += this.speed;
			}
			if(this.x > structures[0].x + Math.floor(structures[0].w / 2)){
				this.x -= this.speed;
			}
			if(this.y >= structures[0].y + Math.floor(structures[0].h / 2) + 24){
				this.y -= this.speed;
			}
			if(this.y + this.size < structures[0].y + Math.floor(structures[0].h / 2) + this.size + 10){
				this.y += this.speed;
			}
			if(this.x + this.size > structures[0].x && this.x <= structures[0].x + (structures[0].w / 2) && this.y + this.size >= structures[0].y && this.y < structures[0].y + structures[0].h){
			var temp = "";
			if(this.gender == "male") temp = "male";
			else if (this.gender == "female") temp = "female";
			var partner = findclosest(this.x, this.y, humans, this.index, temp);
			if(humans[partner].gender == this.gender) alternatefindclosest(this.x, this.y, humans, this.gender);
			if(this.canbreed == false) {
				console.log(this.index + "CANT BREED");
				this.fobj();
			}
					if(humans[partner].gender != this.gender && humans[partner].obj == 3 && this.canbreed == true && this.x + this.size >= humans[partner].x && this.x <= humans[partner].x + humans[partner].size && this.y + this.size >= humans[partner].y && this.y <= humans[partner].y + humans[partner].size && this.index != partner && humans[partner].canbreed == true){
						console.log("	Human " + (humans.length + babies.length) + " has been conceived!");
						console.log("	Human " + (humans.length + babies.length) + "'s parents are " + this.index + " and " + partner + "!");
						breed(this.index, partner);
						this.canbreed = false;
						humans[partner].canbreed = false;
						if(humans[this.index].gender == "female"){
							humans[this.index].pregnant = true;
							humans[this.index].speed *= 0.5;
						}
						else if(humans[partner].gender == "female"){
							humans[partner].pregnant = true;
							humans[partner].speed *= 0.5;
						}
						this.food = 5;
						humans[partner].food = 5;
						this.water = 5;
						humans[partner].water = 5;
						this.fobj();
						humans[partner].fobj();
					}
			}
		}
		
		this.fight = function(string){
			if(string != "male"){
				if(this.aggrolvl > 7) var target = findclosest(this.x, this.y, humans, this.index, this.index);
				else if(this.aggrolvl <=7) this.fobj();
				if(target == this.index){
					this.fobj();
				} else if(target != this.index){
					if(humans[target].sA[2] < this.sA[2]){
						if(this.x < humans[target].x) this.x+= this.speed;
						else if(this.x > humans[target].x) this.x-= this.speed;
						if(this.y < humans[target].y) this.y+= this.speed;
						else if(this.y > humans[target].y) this.y-= this.speed;
						if(this.x + this.size > humans[target].x && this.x <= humans[target].x + humans[target].size && this.y + this.size > humans[target].y && this.y <= humans[target].y + humans[target].size){
							console.log("Human " + this.index + " is fighting " + target);
							humans[target].hp-= (this.sA[2] * 0.5);
							this.hp-=(humans[target].sA[2] * 0.5);
							this.food += 4;
							this.water += 4;
							humans[target].food -= 4;
							humans[target].water -= 4;
							this.fobj();
						}
					} else {
						this.fobj();
					}
				}
			} else if(string == "male"){
				var target = findclosest(this.x, this.y, humans, this.index, "female");
				if(humans[target].gender == "female") this.fobj();			
				if(target == this.index){
					this.fobj();
				} else if(target != this.index){
					if(this.x < humans[target].x) this.x+= this.speed;
					else if(this.x > humans[target].x) this.x-= this.speed;
					if(this.y < humans[target].y) this.y+= this.speed;
					else if(this.y > humans[target].y) this.y-= this.speed;
					if(humans[target].sA[2] <= this.sA[2]){
						if(this.x + this.size > humans[target].x && this.x <= humans[target].x + humans[target].size && this.y + this.size > humans[target].y && this.y <= humans[target].y + humans[target].size){
							console.log("Human " + this.index + " is fighting " + target);
							humans[target].hp-= (this.sA[2] * 0.5);
							this.hp-=(humans[target].sA[2] * 0.5);
							this.food += 4;
							this.water += 4;
							humans[target].food -= 4;
							humans[target].water -= 4;
							this.fobj();
						}
					} else target = findclosest(this.x, this.y, humans, this.index, "male");
					this.fobj();
				}
				this.fobj();
			}
		}
	}
	
	function findmyBaby(mom){
		var position = 0;
		for(var i = 0; i < babies.length - 1; i++){
			if(babies[i].mother = humans[mom]){
				position = i;
			}
		}
		return position;
	}
	
	function findclosest(x, y, array, excluding, excluding2){		// int, int, array, int
		var position = 0;
		for(var i = 1; i < array.length - 1; i++){
			if(array == sources && sources[i].bloom == true){
				if(Math.sqrt(Math.abs(((x - array[i].x) ^ 2) + ((y - array[i].y) ^ 2))) < Math.sqrt(Math.abs(((x - array[position].x) ^ 2) + ((y - array[position].y) ^ 2)))){
					position = i;
				}
			}   else if(array == humans){
				if(Math.sqrt(Math.abs(((x - array[i].x) ^ 2) + ((y - array[i].y) ^ 2))) < Math.sqrt(Math.abs(((x - array[position].x) ^ 2) + ((y - array[position].y) ^ 2)))){
						if((i || position) != excluding) position = i;
				}
			}   else if(array == humans && excluding2 == "female"){
				if(Math.sqrt(Math.abs(((x - array[i].x) ^ 2) + ((y - array[i].y) ^ 2))) < Math.sqrt(Math.abs(((x - array[position].x) ^ 2) + ((y - array[position].y) ^ 2)))){
						if((i || position) != excluding && (humans[i].gender != excluding2)) position = i;
				}
			}   else if(array == humans && excluding2 != null){
				if(Math.sqrt(Math.abs(((x - array[i].x) ^ 2) + ((y - array[i].y) ^ 2))) < Math.sqrt(Math.abs(((x - array[position].x) ^ 2) + ((y - array[position].y) ^ 2)))){
						if((i || position) != excluding && (humans[i].gender != excluding2)) position = i;
						console.log(position);
				}
			}   else if(array != (sources || humans)){
				if(Math.sqrt(Math.abs(((x - array[i].x) ^ 2) + ((y - array[i].y) ^ 2))) < Math.sqrt(Math.abs(((x - array[position].x) ^ 2) + ((y - array[position].y) ^ 2)))){
					position = i;
				}
			}
		}
		if(position == excluding) position = (rand(humans.length - 2) + 1);
		return position;
	}
	function alternatefindclosest(x, y, array, excluding){		// int, int, array, int
		var position = array.length - 1;
		for(var i = array.length - 1; i > 0; i--){
			if(array == humans){
				if(Math.sqrt(Math.abs(((x - array[i].x) ^ 2) + ((y - array[i].y) ^ 2))) < Math.sqrt(Math.abs(((x - array[position].x) ^ 2) + ((y - array[position].y) ^ 2)))){
						if((humans[i].gender || humans[position].gender) != excluding) position = i;
				}
			}
		}
		return position;
	}
	
	function findbestfood(x, y, array){
		var position = 0;
		for(var i = 0; i < array.length; i++){
			if(array[i].value > array[position].value && array[i].bloom == true){
				position = i;
			}
		}
		return position;
	}
	
	function breed(parent1, parent2){
		var p1 = parent1;
		var p2 = parent2;
		while(p1 == p2) p2 = rand(humans.length - 1);
		babies.push(new human());
		babies[babies.length - 1].index = ((humans.length - 1) + (babies.length));
		
		if(humans[p1].gender == "male") babies[babies.length - 1].mother = p2;
		else babies[babies.length - 1].mother = p1;
		
		if(humans[p2].gender == "male") babies[babies.length - 1].mother = p1;
		else babies[babies.length - 1].mother = p2;
		
		babies[babies.length - 1].gender = getRGender();
		babies[babies.length - 1].aggrolvl = Math.round((humans[p1].aggrolvl + humans[p2].aggrolvl) / 2) + (rand(2) - 1);
		if(babies[babies.length - 1].gender == "female"){
			babies[babies.length - 1].skinc = ("#f" + rand(9) + "f" + rand(9) + "8" + rand(9));
			babies[babies.length - 1].agrrolvl -= 1;
		}
		else if(babies[babies.length - 1].gender == "male"){
			babies[babies.length - 1].skinc = ("#f" + rand(9) + "A" + rand(9) + "7" + rand(9));
			babies[babies.length - 1].agrrolvl += 1;
		}
		babies[babies.length - 1].food = 4 + rand(5);
		babies[babies.length - 1].water = 10 + rand(5);
		babies[babies.length - 1].sB[0] = Math.floor((humans[p1].sB[0] + humans[p2].sB[0]) / 2);
		babies[babies.length - 1].sB[1] = Math.floor((humans[p1].sB[1] + humans[p2].sB[1]) / 2);
		babies[babies.length - 1].sB[2] = Math.floor((humans[p1].sB[2] + humans[p2].sB[2]) / 2);
		babies[babies.length - 1].speed += (babies[babies.length - 1].sB[1] * 0.1 - 0.5);
		var mutator = rand(100);
		if(mutator <= 45 && mutator > 30){
			babies[babies.length - 1].sB[0] += 1;
			babies[babies.length - 1].sB[2] -= 1;
		}
		if(mutator <= 30 && mutator > 15){
			babies[babies.length - 1].sB[1] += 1;
			babies[babies.length - 1].sB[0] -= 1;
		}
		if(mutator <= 15 && mutator > 0){
			babies[babies.length - 1].sB[2] += 1;
			babies[babies.length - 1].sB[1] -= 1;
		}
		while((babies[babies.length - 1].sB[0] + babies[babies.length - 1].sB[1] + babies[babies.length - 1].sB[2]) != 30){
			var balancer = rand(3);
			if(balancer == 0){
				babies[babies.length - 1].sB[0] += 1;
			} else if(balancer == 1){
				babies[babies.length - 1].sB[1] += 1;
			} else if(balancer == 2){
				babies[babies.length - 1].sB[2] += 1;
			}
		}
		
		babies[babies.length - 1].sA[0] = Math.floor(100 * ((humans[p1].sA[0] + humans[p2].sA[0]) / 2 + (babies[babies.length - 1].sB[0] * 0.1 + (rand(4) - 1.8)))) / 100;
		babies[babies.length - 1].sA[1] = Math.floor(100 * ((humans[p1].sA[1] + humans[p2].sA[1]) / 2 + (babies[babies.length - 1].sB[1] * 0.1 + (rand(4) - 1.8)))) / 100;
		babies[babies.length - 1].sA[2] = Math.floor(100 * ((humans[p1].sA[2] + humans[p2].sA[2]) / 2 + (babies[babies.length - 1].sB[2] * 0.1 + (rand(4) - 1.8)))) / 100;
		if(babies[babies.length - 1].sA[0] < 1) babies[babies.length - 1].sA[0] = 1;
		if(babies[babies.length - 1].sA[1] < 1) babies[babies.length - 1].sA[1] = 1;
		if(babies[babies.length - 1].sA[2] < 1) babies[babies.length - 1].sA[2] = 1;
		
		babies[babies.length - 1].hp = babies[babies.length - 1].sA[0];
		babies[babies.length - 1].weight = babies[babies.length - 1].sA[1];
		babies[babies.length - 1].fitness = babies[babies.length - 1].sA[0] + babies[babies.length - 1].sA[1] + babies[babies.length - 1].sA[2] + babies[babies.length - 1].sB[0] + babies[babies.length - 1].sB[1] + babies[babies.length - 1].sB[2];
	}
	
	function getRGender(){
		var r = rand(2);
		var result = "female";
		if(r == 0) {
			result = "male";
		} else if(r == 1){
			result = "female";
		}
		return result;
	}
	
	function daytick(){
		if(day > tempday){
			tempday = day;
			var tmin = 0;
			days.push(avgfit);
			pop.push(humans.length);
			for(var i = 0; i < humans.length; i++){
				if(humans[tmin].sB[0] > humans[i].sB[0]){
					tmin = i;
				}
			}
			kill(tmin);
		}
	}
	
	function merge(e, f){			// MERGE COMBINER
		var arr = [];
		var i = 0;
		var j = 0;
		
		while(i < e.length && j < f.length){
			if(e[i].fitness < f[j].fitness){
				arr.push(e[i]);
				i++;
			} else {
				arr.push(f[j]);
				j++;
			}
		}
		
		while(i < e.length){
			arr.push(e[i]);
			i++;
		}
		
		while(j < f.length){
			arr.push(f[j]);
			j++;
		}
		
		return arr;
	}
	
	function split(array){			// MERGE SORTER
		var a = [];
		var b = [];
		var result = [];
		
		for(var i = 0; i < Math.floor(array.length / 2); i++){
				a[i] = array[i];
				if(!(array.length% 2 == 0)) a[Math.floor(array.length / 2)] = array[Math.floor(array.length / 2)];
				b[i] = array[i + Math.ceil(array.length / 2)];
		}
		
		if(array.length > 1){
			result = merge(split(a), split(b));
		} else {
			result = array;
		}
		
		return result;
	}
	
	function kill(i){
		if(humans[i].gender == "male") males--;
		else females--;
		if(humans[i].pregnant == true){
			var baby = findmyBaby(i);
			console.log("*--- Human " + humans[i].index + "'s baby has died ---*");
			babies.splice(baby, 1);
		}
		if(bimu == i){
			bimu = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].sB[0] >= humans[bimu].sB[0]){
					if(j != i) bimu = j;
				}
			}
		}
		if(bwis == i){
			bwis = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].sB[1] >= humans[bwis].sB[1]){
					if(j != i) bwis = j;
				}
			}
		}
		if(bstr == i){
			bstr = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].sB[2] >= humans[bstr].sB[2]){
					if(j != i) bstr = j;
				}
			}
		}
		if(bhp == i){
			bhp = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].sA[0] >= humans[bhp].sA[0]){
					if(j != i) bhp = j;
				}
			}
		}
		if(bwgt == i){
			bwgt = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].sA[1] >= humans[bwgt].sA[1]){
					if(j != i) bwgt = j;
				}
			}
		}
		if(bcp == i){
			bcp = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].sA[2] >= humans[bcp].sA[2]){
					if(j != i) bcp = j;
				}
			}
		}
		if(bfit == i){
			bfit = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].fitness >= humans[bfit].fitness){
					if(j != i) bfit = j;
				}
			}
		}
		
		if(bimu > i) bimu--;
		if(bwis > i) bwis--;
		if(bstr > i) bstr--;
		if(bhp > i) bhp--;
		if(bwgt > i) bwgt--;
		if(bcp > i) bcp--;
		if(bfit > i) bfit--;
		
		if(simu == i){
			simu = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].sB[0] >= humans[simu].sB[0]){
					if(j != i) simu = j;
				}
			}
		}
		if(swis == i){
			swis = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].sB[1] >= humans[swis].sB[1]){
					if(j != i) swis = j;
				}
			}
		}
		if(sstr == i){
			sstr = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].sB[2] >= humans[sstr].sB[2]){
					if(j != i) sstr = j;
				}
			}
		}
		if(shp == i){
			shp = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].sA[0] >= humans[shp].sA[0]){
					if(j != i) shp = j;
				}
			}
		}
		if(swgt == i){
			swgt = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].sA[1] >= humans[swgt].sA[1]){
					if(j != i) swgt = j;
				}
			}
		}
		if(scp == i){
			scp = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].sA[2] >= humans[scp].sA[2]){
					if(j != i) scp = j;
				}
			}
		}
		if(sfit == i){
			sfit = 0;
			for(var j = 0; j < humans.length; j++){
				if(humans[j].fitness >= humans[sfit].fitness){
					if(j != i) sfit = j;
				}
			}
		}
		
		if(simu > i) simu--;
		if(swis > i) swis--;
		if(sstr > i) sstr--;
		if(shp > i) shp--;
		if(swgt > i) swgt--;
		if(scp > i) scp--;
		if(sfit > i) sfit--;
		
		humans.splice(i, 1);
		var tfit= 0;
		for(var j = 0; j < humans.length; j++){
			humans[j].index = j;
			tfit += humans[j].fitness;
		}
		avgfit = Math.floor((tfit / humans.length) * 100) / 100;
		for(var j = 0; j < babies.length; j++){
			babies[j].index = j + humans.length + 1;
			babies[j].mother--;
		}
		if(humans.length <= 3){
			//console.log("This species has died off due to no suitable mates... Restarting");
			//init();
			breed(rand(humans.length - 1), rand(humans.length - 1));
		}
		split(humans);
	}
	
	
	function drain(){
		if(Math.floor(timer / 200) > temphour){
			temphour++;
			for(var i = 0; i < humans.length; i++){
				humans[i].food--;
				humans[i].water--;
			}
		}
	}

	function disaster(){
		if(day > tempday2 + 2){
		tick = true;
			var random = rand(3);
			if(random == 0){			// Plague	-- Immunity survive
				sick = true;
				tempday2 = day;
			} else if(random == 1){		// Earthquake -- Wisdom Survive
				quake = true;
				tempday2 = day;
			} else if(random == 2){		// Volcano -- Strength survive
				erupt = true;
				tempday2 = day;
			}
		}
		if(humans.length > 70){
			var random = rand(3);
			if(random == 0){			// Plague	-- Immunity survive
				sick = true;
				tempday2 = day;
			} else if(random == 1){		// Earthquake -- Wisdom Survive
				quake = true;
				tempday2 = day;
			} else if(random == 2){		// Volcano -- Strength survive
				erupt = true;
				tempday2 = day;
			}
		}
	}
	
	var tick = true;
	var dtick = 0;
	
	function plague(){
		if(sick){
				ctx.fillStyle = '#003300';
				ctx.fillText("People begin to cough and wheeze...", 95, 590);
				ctx.globalAlpha = 0.5;
				ctx.fillStyle = "#336600";
				ctx.fillRect(0, 0, 1012, 760);
				ctx.globalAlpha = 1;
				eventbegin = true;
				if(eventbegin == true && tick == true) {
					setInterval(function(){
					dtick++;
					}, 3000);
					if(dtick >= 30){
						tick = false;
						cull();
						dtick = 0;
					}
				}
				function cull(){
					var targets = Math.floor(humans.length / (1.5 + (rand(8) * 0.1)));
					for(var j = 0; j < targets; j++){
						var tmin = 0;
							for(var i = 0; i < humans.length; i++){
								if(humans[tmin].sA[0] > humans[i].sA[0]){
								tmin = i;
							}
						}
					console.log("*-- Human " + tmin + " was killed by a vicious plague --*");
					kill(tmin);
					anim("p");
				}
				for(var i = 0; i < humans.length; i++){
						humans[i].hp -= 30 - (humans[i].hp * 1.5);
					}
				sick = false;
				eventbegin = false;
				tick = true;
				dtick = 0;
				}
		}
	}
	
	function earthquake(){
		if(quake){
				ctx.fillStyle = '##996600';
				ctx.fillText("The ground begins to tremble...", 95, 590);
				ctx.translate(10, 0);
				setTimeout(function(){
					ctx.translate(-10, 0);
				}, 10 + rand(10));
				ctx.globalAlpha = 0.1;
				ctx.fillStyle = "##663300";
				ctx.fillRect(0, 0, 1012, 760);
				ctx.globalAlpha = 1;
				eventbegin = true;
				if(eventbegin == true && tick == true) {
					setInterval(function(){
					dtick++;
					}, 3000);
					if(dtick >= 30){
						tick = false;
						cull();
						dtick = 0;
					}
				}
				function cull(){
					anim("e");
					var targets = Math.floor(humans.length / (1.5 + (rand(8) * 0.1)));
					for(var j = 0; j < targets; j++){
						var tmin = 0;
						for(var i = 0; i < humans.length; i++){
							if(humans[tmin].sA[1] > humans[i].sA[1]){
								tmin = i;
							}
						}
					console.log("*-- Human " + tmin + " was killed by a large earthquake --*");
					kill(tmin);
					}
					for(var i = 0; i < humans.length; i++){
						humans[i].hp -= 30 - (humans[i].hp * 1.5);
					}
					quake = false;
					eventbegin = false;
					tick = true;
					dtick = 0;
				}
		}
	}
	
	function volcano(){
		if(erupt){
				ctx.fillStyle = '##ff3300';
				ctx.fillText("A cloud of ash forms overhead...", 95, 590);
				ctx.globalAlpha = 0.6;
				ctx.fillStyle = "#BAAFAF";
				ctx.fillRect(0, 0, 1012, 760);
				ctx.globalAlpha = 1;
				eventbegin = true;
				if(eventbegin == true && tick == true) {
					setInterval(function(){
					dtick++;
					}, 3000);
					if(dtick >= 30){
						tick = false;
						cull();
						dtick = 0;
					}
				}
			function cull(){
					var targets = Math.floor(humans.length / (1.5 + (rand(8) * 0.1)));
					for(var j = 0; j < targets; j++){
						var tmin = 0;
						for(var i = 0; i < humans.length; i++){
							if(humans[tmin].sA[2] > humans[i].sA[2]){
								tmin = i;
							}
						}
					console.log("*-- Human " + tmin + " was killed in a volcanic eruption --*");
					kill(tmin);
					anim("v");
					}
					for(var i = 0; i < humans.length; i++){
						humans[i].hp -= 30 - (humans[i].hp * 1.5);
					}
					erupt = false;
					eventbegin = false;
				tick = true;
				dtick = 0;
			}
		}
	}
	
	function anim(disaster){
		if(disaster == "v"){
		
		} else if(disaster == "e"){
		for(var i = 0; i < 10; i++){
			setTimeout(function(){
				ctx.globalAlpha = 1;
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(0, 0, 1012, 760);
				ctx.globalAlpha = 1;
			}, 50 + rand(50));
			}
		} else if(disaster == "p"){
		
		}
	}
	
	function cave(x, y, w, h, c, col){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.capacity = c;
		this.colour = col;
		
		this.draw = function(){
			ctx.fillStyle = this.colour;
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.fillStyle = 'black';
			ctx.fillRect(this.x + Math.floor(this.w / 7), this.y + Math.floor(this.h / 2), this.w - Math.floor(this.w / 7) * 2, this.h - Math.floor(this.h / 2));
		}
	}
	
	function source(x, y, w, h, a, c, v, itimer){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.colour = c;
		this.amount = a;
		this.bloom = true;
		this.internalclock = itimer * 67;
		this.value = v;
		
		this.draw = function(){
			if(this.colour != "blue"){
				ctx.fillStyle = "#bff442";
				ctx.fillRect(this.x - (this.w / 4), this.y + (this.h / 2), this.w + (this.w / 2), Math.floor(this.h * 3 / 4));
			}
			if(this.bloom){
				ctx.fillStyle = this.colour;
				ctx.fillRect(this.x, this.y, this.w, this.h);
			}
		}
		
		this.grow = function(){
			if(this.internalclock > 0 && this.bloom == false) this.internalclock --;
			if(this.bloom == false && this.internalclock == 0){
				this.amount = a;
				this.bloom = true;
				this.internalclock = itimer * 67;
				if(this.colour == "#cc0066"){
					console.log("Dew Plum has regrown at " + this.x + ", " + this.y + "!");
				} else if (this.colour == "#ac1026"){
					console.log("Violet Citron has regrown at " + this.x + ", " + this.y + "!");
				} else if (this.colour == "#009900"){
					console.log("Healing Fruit has regrown at " + this.x + ", " + this.y + "!");
				}
			}
		}
	}
	
	function showStats(x, y){
		this.x = x;
		this.y = y;
		this.active = false;
		
		this.draw = function(){
			ctx.fillStyle = 'black';
			ctx.fillRect(x, y, 1200, 700);
			ctx.fillStyle = 'green';
			ctx.fillRect(x + 2, y + 2, 1196, 696);
			ctx.fillStyle = 'yellow';
			ctx.fillRect(x + 6, y + 6, 1188, 688);
			
			ctx.fillStyle = 'black';
			ctx.fillRect(1175 + x, y, 25, 25);
			ctx.fillStyle = 'green';
			ctx.fillRect(1176 + x, y + 1, 23, 23);
			ctx.fillStyle = 'yellow';
			ctx.fillRect(1177 + x, y + 2, 21, 21);
			ctx.font = 'bold 18pt Verdana';
			ctx.fillStyle = 'red';
			ctx.fillText("X", 1178 + x, 21 + y);
			ctx.fillStyle = 'black';
			ctx.fillText((mx - x) + " " + (my - y), 700, 100);
			ctx.fillStyle = 'black';
			ctx.fillRect(x + 200, x + 600, 960, 5);
			ctx.fillStyle = 'black';
			ctx.fillRect(x + 200, x + 600, 5, -575);
			
			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.strokeStyle= "black";
			ctx.moveTo(x + (Math.floor(950 / (day)) * 0) + 208, (y + 610) - Math.floor((575 / 70) * (days[0] - 90)));
			for(var i=1; i < days.length; i++){
				ctx.lineTo(x + (Math.floor(950 / (day)) * i) + 205, (y + 610) - Math.floor((575 / 70) * (days[i] - 90)));
			}
			ctx.stroke();
			
			
			ctx.beginPath();
			ctx.strokeStyle= "purple";
			ctx.lineWidth = 3;
			ctx.moveTo(x + (Math.floor(950 / (day)) * 0) + 205, (y + 610) - Math.floor((575 / 70) * (pop[0])));
			for(var i=1; i < pop.length; i++){
				ctx.lineTo(x + (Math.floor(950 / (day)) * i) + 208, (y + 610) - Math.floor((575 / 70) * (pop[i])));
			}
			ctx.stroke();
			
			
			for(var i = 0; i < (day + 1); i++){
				ctx.fillText(i, x + (Math.floor(950 / (day)) * i) + 200, y + 640);
				ctx.fillRect(x + (Math.floor(950 / (day)) * i) + 205, (y + 605) - Math.floor((575 / 70) * (days[i] - 90)), 10, 10);
			}
			for(var i = 0; i < 8; i++){
				ctx.fillText(90 + (i * 10), x + 140, y - (Math.floor(640 / (8)) * i) + 610);
				ctx.fillRect(x + 140, y - (Math.floor(640 / (8)) * i) + 610, 1020, 1);
			}
			for(var i = 0; i < 8; i++){
				ctx.fillStyle = 'purple';
				ctx.fillText(0 + (i * 10), x + 100, y - (Math.floor(640 / (8)) * i) + 600);
				ctx.fillRect(x + 140, y - (Math.floor(640 / (8)) * i) + 611, 1020, 1);
				ctx.fillStyle = 'black';
			}
			ctx.fillText("Day", x + 650, y + 670);
			ctx.font = 'bold 12pt Arial';
			ctx.fillText("Average Fitness = ", x + 20, y + 670);
			ctx.fillStyle = 'black';
			ctx.fillRect(x + 165, y + 656, 16, 16);
			ctx.fillText("Population = ", x + 200, y + 670);
			ctx.fillStyle = 'purple';
			ctx.fillRect(x + 305, y + 656, 16, 16);
			ctx.fillStyle = 'black';
		}
	}
	
	var sources = [];
	sources.push(new source(880, 250, 8, 8, 9999999, "#cc0066", 0.1, 1));	// Infinity fruit
	sources.push(new source(470, 90, 8, 8, 30, "#cc0066", 1, 30));	// Dew Plums
	sources.push(new source(450, 240, 8, 8, 30, "#cc0066", 1, 30));
	sources.push(new source(370, 110, 8, 8, 30, "#cc0066", 1, 30));
	sources.push(new source(420, 80, 8, 8, 30, "#cc0066", 1, 30));
	sources.push(new source(380, 290, 8, 8, 30, "#cc0066", 1, 30));
	
	sources.push(new source(650, 340, 8, 8, 75, "#ac1026", 5, 50));		// Violet Citron
	sources.push(new source(850, 300, 8, 8, 75, "#ac1026", 5, 50));
	
	sources.push(new source(590, 125, 8, 8, 50, "#009900", 1, 30));		// Healing Fruit
	
	sources.push(new source(845, 720, 8, 8, 75, "#ac1026", 5, 35));		// More Fruit
	sources.push(new source(205, 680, 8, 8, 75, "#ac1026", 5, 50));
	sources.push(new source(180, 460, 8, 8, 30, "#cc0066", 1, 30));
	sources.push(new source(490, 580, 8, 8, 30, "#cc0066", 1, 30));
	sources.push(new source(475, 425, 8, 8, 30, "#cc0066", 1, 30));
	sources.push(new source(890, 475, 8, 8, 30, "#cc0066", 1, 30));
	
	
	
	var wsources = [];
	wsources.push(new source(680, 4, 328, 200, 1000, "blue"));
	
	var structures = [];
	structures.push(new cave(30, 130, 100, 65, 8, "#232426"));
	
	var days = [];
	var pop = [];
	var buttons = [];
	function button(x, y, screen, text){
		this.x = x;
		this.y = y;
		this.w = 150;
		this.h = 65;
		this.screen = screen;
		this.text = text;
		
		this.draw = function(){
			ctx.fillStyle = 'black';
			ctx.fillRect(this.x - 5, this.y - 5, this.w + 10, this.h + 10);
			ctx.fillStyle = 'grey';
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.fillStyle = 'white';
			ctx.font = 'bold 35pt Arial';
			ctx.fillText(this.text, this.x + 20, this.y + 50);
		}
	}
	
	buttons.push(new button(70, 180, 1, "Start"));
	buttons.push(new button(70, 280, 2, "Help"));
	function rand(n){return Math.floor(Math.random() * n)}
	var statbox = new showStats(40, 30);
	
	/////////////////////////////////
	////////////////////////////////
	////////	GAME INIT
	///////	Runs this code right away, as soon as the page loads.
	//////	Use this code to get everything in order before your game starts 
	//////////////////////////////
	/////////////////////////////
	function init()
	{
		humans.push(new human());
		babies.push(new human());
		humans.splice(0, humans.length);
		babies.splice(0, babies.length);
		timer = 0;
		day = 0;
		days[0] = 100;
		tempday = 0;
		tempday2 = 0;
		males = 0;
		females = 0;
		quake = false;
		erupt = false;
		sick = false;
		avgfit = 100;
		
		for(var i = 0; i < 6; i++){
			humans.push(new human());
			humans[i].index = i;
			humans[i].speed += 0.5;
		}
		for(var i = 0; i < 4; i++){
			if(humans[i].gender == "male"){
				humans.push(new human());
				humans[humans.length - 1].index = humans.length - 1;
				humans[humans.length - 1].speed += 0.5;
			}
		}
		for(var i = 0; i < humans.length; i++){
			if(humans[i].gender == "male") males++;
			else females++;
		}
		if(males >= females + 1 || males == 0) init();
		screen = 0;
		pop[0] = humans.length;
		
		bimu = 0;
		bwis = 0;
		bstr = 0;
		bhp = 0;
		bwgt = 0;
		bcp = 0;
		bfit = 0;
		
		simu = 0;
		swis = 0;
		sstr = 0;
		shp = 0;
		swgt = 0;
		scp = 0;
		sfit = 0;
		
		console.log("*----------------------------------------*");
		console.log("Welcome to Evolution Simulator");
		console.log("*----------------------------------------*");
		
	//////////
	///STATE VARIABLES
	
	//////////////////////
	///GAME ENGINE START
	//	This starts your game/program
	//	"paint is the piece of code that runs over and over again, so put all the stuff you want to draw in here
	//	"60" sets how fast things should go
	//	Once you choose a good speed for your program, you will never need to update this file ever again.

	if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 16.7);
	}

	init();	
	


	
	
	
	///////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	////////	Main Game Engine
	////////////////////////////////////////////////////
	///////////////////////////////////////////////////
	function paint()
	{
		
		ctx.fillStyle = 'yellow';
		ctx.fillRect(0,0, w, h);
		
		if(screen == 0){
			ctx.fillStyle = 'blue';
			ctx.fillRect(20, 20, (w - 40), 100);
			ctx.fillStyle = 'black';
			ctx.font = 'bold 60pt Arial';
			ctx.fillText("Evolution", 60, 100);
			ctx.fillText("Simulator", 440, 100);
			ctx.fillStyle = 'white';
			ctx.font = 'bold 59pt Arial';
			ctx.fillText("Evolution", 60, 100);
			ctx.fillText("Simulator", 440, 100);
			for(var i = 0; i < buttons.length; i++){
			buttons[i].draw();
			}
		}	if(screen == 1){
				if(error != true){
					ctx.fillStyle = 'lightblue';
					ctx.fillRect(0,0, w, h);
					ctx.fillStyle = "black";
					ctx.fillRect(w - 304, 0, 304, h);
					ctx.fillStyle = "#1F2121";
					ctx.fillRect(w - 302, 2, 299, h - 4);
					
					ctx.fillStyle = "green";		// Simulation Area
					ctx.fillRect(4, 4, w - 312, h - 8);			// | TOP RIGHT: 4, 4 | WIDTH: 1016 | HEIGHT: 752 |
					ctx.fillStyle = 'green';
					ctx.fillRect(1022, 10, 297, 740);
					ctx.fillStyle = 'black';
					ctx.font = 'bold 20pt Arial';
					ctx.fillText("Species", 1035, 40);
					ctx.fillText("Information", 1140, 40);
					ctx.fillStyle = 'white';
					ctx.font = 'bold 19.5pt Arial';
					ctx.fillText("Species", 1034, 41);
					ctx.fillText("Information", 1139, 41);
					ctx.fillText(mx + ", " + my + " Humans: " + humans.length + ", Average Fitness: " + avgfit, 10, 40);
					ctx.fillText(males + " Males, " +  females + " Females, " + babies.length + " Babies", 10, 65);
					ctx.fillStyle = 'yellow';
					ctx.fillRect(1028, 48, 284, 498);
					ctx.fillStyle = 'yellow';
					ctx.fillRect(1028, 556, 284, 186);
				}
				
				for(var i = 0; i < sources.length; i++){
					sources[i].draw();
					sources[i].grow();
				}
				for(var i = 0; i < wsources.length; i++){
					wsources[i].draw();
				}
				for(var i = 0; i < structures.length; i++){
					structures[i].draw();
				}
				for(var i = 0; i < humans.length; i++){
					humans[i].draw();
					humans[i].task();
					humans[i].pregnancy();
					ctx.font = '12pt Arial';
					if(humans[i].food < 0 || humans[i].water < 0 || humans[i].hp <= 0){
						if(humans[i].hp < 0) console.log("*--- Human " + humans[i].index + " has bled to death. ---*");
						else if(humans[i].water < 0) console.log("*--- Human " + humans[i].index + " has died from dehydration. ---*");
						else if(humans[i].food < 0) console.log("*--- Human " + humans[i].index + " has died from starvation. ---*");
						kill(i);
					}		
					
					
				}
				ctx.font = 'bold 11.5pt Arial';
				//console.log(bimu + " " + bwis + " " + bstr + " " + bhp + " " + bwgt + " " + bcp + ", " + humans.length);
				ctx.fillText("Largest Immunity: " + bimu + " with " + humans[bimu].sB[0], 1030, 85);
				ctx.fillText("Smallest Immunity: " + simu + " with " + humans[simu].sB[0], 1030, 110);
				ctx.fillText("Largest Wisdom: " + bwis + " with " + humans[bwis].sB[1], 1030, 145);
				ctx.fillText("Smallest Wisdom: " + swis + " with " + humans[swis].sB[1], 1030, 170);
				ctx.fillText("Largest Strength: " + bstr + " with " + humans[bstr].sB[2], 1030, 205);
				ctx.fillText("Smallest Strength: " + sstr + " with " + humans[sstr].sB[2], 1030, 230);
				ctx.fillText("Largest Total Health: " + bhp + " with " + humans[bhp].sA[0], 1030, 265);
				ctx.fillText("Smallest Total Health: " + shp + " with " + humans[shp].sA[0], 1030, 290);
				ctx.fillText("Largest Total Weight: " + bwgt + " with " + humans[bwgt].sA[1], 1030, 325);
				ctx.fillText("Smallest Total Weight: " + swgt + " with " + humans[swgt].sA[1], 1030, 350);
				ctx.fillText("Largest Combat Power: " + bcp + " with " + humans[bcp].sA[2], 1030, 385);
				ctx.fillText("Smallest Combat Power: " + scp + " with " + humans[scp].sA[2], 1030, 410);
				ctx.fillText("Largest Overall Fitness: " + bfit + " with " + Math.round(humans[bfit].fitness * 100) / 100, 1030, 445);
				ctx.fillText("Smallest Overall Fitness: " + sfit + " with " + Math.round(humans[sfit].fitness * 100) / 100, 1030, 470);
				
				day = Math.floor(timer / 1200);
				ctx.fillStyle = 'white';
				ctx.font = 'bold 20pt Verdana';
				ctx.fillText("Day: " + day, 850, 40);
				ctx.font = 'bold 16pt Verdana';
				ctx.fillText("Hour: " + temphour, 850, 60);
				
				ctx.fillStyle = 'black';
				ctx.fillRect(1035, 700, 30, 30);
				ctx.fillStyle = 'green';
				ctx.fillRect(1039, 704, 22, 22);
				ctx.fillStyle = 'yellow';
				ctx.font = "bold 12pt Verdana";
				ctx.fillText("S", 1044, 721);
				
				daytick();
				drain();
				disaster();
				earthquake();
				volcano();
				plague();
				
				
				if(stats) statbox.draw();
				
				
		}	if(screen == 2){
			ctx.fillStyle = 'yellow';
			ctx.fillRect(0,0, w, h);
		}
		ctx.fillStyle = 'green';
		

		
		
	}////////////////////////////////////////////////////////////////////////////////END PAINT/ GAME ENGINE
	

	
	
	////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////
	/////	MOUSE LISTENER 
	//////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	





	/////////////////
	// Mouse Click
	///////////////
	canvas.addEventListener('click', function (evt){
		if(screen == 0){
			for(var i = 0; i < buttons.length; i++){
				if(mx >= buttons[i].x && mx <= buttons[i].x + buttons[i].w && my >= buttons[i].y && my <= buttons[i].y + buttons[i].h){
						screen = buttons[i].screen;
				}
			}  
		}
		if(screen == 1 && mx >= 1035 && mx <= 1065 && my >= 700 && my <= 730){
			stats = true;
		}
		//if(screen == 1) quake = true;
		if(screen ==1&& stats == true && mx >= statbox.x + 1176 && mx <= statbox.x + 1200 && my >= statbox.y && my <= statbox.y + 24){
			stats = false;
		}
	}, false);

	
	

	canvas.addEventListener ('mouseout', function(){pause = true;}, false);
	canvas.addEventListener ('mouseover', function(){pause = false;}, false);

      	canvas.addEventListener('mousemove', function(evt) {
        	var mousePos = getMousePos(canvas, evt);

		mx = mousePos.x;
		my = mousePos.y;

      	}, false);


	function getMousePos(canvas, evt) 
	{
	        var rect = canvas.getBoundingClientRect();
        	return {
          		x: evt.clientX - rect.left,
          		y: evt.clientY - rect.top
        		};
      	}
      

	///////////////////////////////////
	//////////////////////////////////
	////////	KEY BOARD INPUT
	////////////////////////////////


	

	window.addEventListener('keydown', function(evt){
		var key = evt.keyCode;
		
	//p 80
	//r 82
	//1 49
	//2 50
	//3 51
		
	}, false);




})
