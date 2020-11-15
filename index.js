var table = document.getElementById("sudoku");
var html = document.getElementsByTagName("html")[0];
var now_cell_button;


var tema_color = "#00c0c0";
var map_text_color = "#00c0c0";
var input_text_color = "#000000";
var same_value_color = "#d0d0d0";
var conflict_value_color = "#ff0000";
var basic_background_color = "";
var cell_hover_color = "#eeee00";
var memo_active_color = "#00dddd";

var myCells;
var cell_size;
var keyboard;
var cell_buttons;
var numkeys;
var erasekey;
var memokey;
var dif_buttons;
var dropdown_content;
var upper_interface;
var timer;

//init
init();

function init(){
	create_empty_map();
	init_map();
	init_interface_design();
	document.getElementById("start_button").focus();
}

function init_map(){
	load_map(map0);

	myCells = document.getElementsByClassName("myCell");
	cell_size = 60;//myCells[0].style.width;
	keyboard = document.getElementById("keyboard");
	cell_buttons = document.getElementsByClassName("myInput");
	numkeys = document.getElementsByClassName("numkey");
	erasekey = document.getElementById("erasekey");
	memokey = document.getElementById("memokey");
	dif_buttons = document.getElementsByClassName("dif_button");
	dropdown_content = document.getElementsByClassName("dropdown-content")[0];
	upper_interface = document.getElementById("upper_interface");
	timer_box = document.getElementById("timer_box");
	
	init_event();
	
	now_cell_button = table.rows[0].cells[0].children[0];
}

function init_event(){
	init_mapcell_hover();
	init_mapcell_onclick();
	init_numkey_onclick();
	init_erasekey_onclick();
	init_memokey_onclick()
	init_html_onclick();
	init_start_onclick();
	init_restart_onclick();
	init_dif_click();
}

document.onkeydown = function (e) {
    var keyCode = e.keyCode;
	var ij = now_cell_button.name;
	if(keyboard.style.display != "none"){
		if(keyCode == 48 || keyCode == 46 || keyCode == 8) {
			document.getElementById("erasekey").click();
		}else if(keyCode == 49 || keyCode == 97) {
			document.getElementById("1key").click();
		}else if(keyCode == 50 || keyCode == 98) {
			document.getElementById("2key").click();
		}else if(keyCode == 51 || keyCode == 99) {
			document.getElementById("3key").click();
		}else if(keyCode == 52 || keyCode == 99) {
			document.getElementById("4key").click();
		}else if(keyCode == 53 || keyCode == 100) {
			document.getElementById("5key").click();
		}else if(keyCode == 54 || keyCode == 101) {
			document.getElementById("6key").click();
		}else if(keyCode == 55 || keyCode == 102) {
			document.getElementById("7key").click();
		}else if(keyCode == 56 || keyCode == 103) {
			document.getElementById("8key").click();
		}else if(keyCode == 57 || keyCode == 104) {
			document.getElementById("9key").click();
		}
	}else if(ij != ""){
		var i = parseInt(ij/10);
		var j = ij%10;
		if(keyCode == 37) {
			j--;
			if(j<0){
				j=0;
			}
		}else if(keyCode == 38) {
			i--;
			if(i<0){
				i=0;
			}
		}else if(keyCode == 39) {
			j++;
			if(j>8){
				j=8;
			}
		}else if(keyCode == 40) {
			i++;
			if(i>8){
				i=8;
			}
		}
		//console.log(keyCode+": "+i+","+j);
		now_cell_button = table.rows[i].cells[j].children[0];
		now_cell_button.focus();
	}
};

//init interface
function init_interface_design(){
	var buttons = document.getElementsByClassName("interface_button");
	for(var i = 0; i < buttons.length; i++){
		buttons[i].style.backgroundColor = tema_color;
	} 
}

//create empty sudoku map
function create_empty_map(){
	var row_;
	var cell_;
	for(var i = 0; i < 9; i++){
		row_ = table.insertRow();
		for(var j = 0; j < 9; j++){
			cell_ = row_.insertCell();
			cell_.class = "myCell";
			cell_.innerHTML = '<button class="myInput" name='+i+j+'></button>';
		}
	}
}

//load map
function load_map(m){
	var map = m;
	var v;
	var c;
	for(var i = 0; i < map.length; i++){
		for(var j = 0; j < map[i].length; j++){
			v = map[i][j];
			c = table.rows[i].cells[j].children[0];
			c.style.backgroundColor= basic_background_color;
			if(v > 0){
				c.value = v;
				c.innerHTML = v;
				c.className = "mapInput";
				c.style.color = map_text_color;
				c.onclick = function(){
					now_cell_button = this;
					this.focus();
				}
			}else{
				c.value = 0;
				c.innerHTML = "&nbsp";
				c.className = "myInput";
				c.style.color = input_text_color; 
			}		
		}
	}
}

//click map cell button
function init_mapcell_onclick(){
	for(var i = 0; i < cell_buttons.length; i++){
		cell_buttons[i].onclick = mapcell_onclick;
	}
}
function mapcell_onclick(){
	keyboard.style.display = "inline-block";
	keyboard.style.left = (table.offsetLeft+this.parentElement.offsetLeft+cell_size*0.5)+"px";
	keyboard.style.top = (table.offsetTop+this.parentElement.offsetTop+cell_size*0.5)+"px";
	now_cell_button = this;
	dropdown_content.style.display = "none";	
	
	if(now_cell_button.children.length == 0){
		memokey.style.backgroundColor = "";
		memokey.value = "0";
	}else{
		memokey.style.backgroundColor = memo_active_color;
		memokey.value = "1";
	}
}


//click keyboard numkey button
function init_numkey_onclick(){
	for(var i = 0; i < numkeys.length; i++){
		numkeys[i].onclick = numkey_onclick;
	}
}
function numkey_onclick(){
	if(memokey.value == 0){
		var old_v = now_cell_button.value;
		now_cell_button.value = this.value;
		now_cell_button.innerHTML = now_cell_button.value;
		check_integrity(now_cell_button, old_v);
		//now_cell_button = "";
		check_success();
		keyboard.style.display = "none";
	}else if(memokey.value == 1){
		var v = this.value-1;
		var c = now_cell_button.children[0].rows[parseInt(v/3)].cells[v%3];
		if(c.innerHTML == v+1){
			c.innerHTML = "&nbsp";
		}else{
			c.innerHTML = v+1;
		}
	}
}

//click keyboard erasekey button
function init_erasekey_onclick(){
	erasekey.onclick = function(){
		var old_v = now_cell_button.value;
		now_cell_button.value = 0;
		now_cell_button.innerHTML = "&nbsp";
		check_integrity(now_cell_button, old_v);
		keyboard.style.display = "none";
	}
}

//click keyboard memokey button
function init_memokey_onclick(){
	memokey.onclick = memokey_onclick;
}
function memokey_onclick(){
	if(memokey.value == 0){
		memokey.style.backgroundColor = memo_active_color;
		memokey.value = "1";
		
		if(now_cell_button.children.length == 0){
			var old_v = now_cell_button.value;
			now_cell_button.value = 0;
			
			now_cell_button.innerHTML = '<table class = "memo_table"></table>';
			var t = now_cell_button.children[0];
			console.log(now_cell_button.parentElement);
			var row_;
			var cell_;
			for(var i =0; i < 3; i++){
				row_ = t.insertRow();
				for(var j = 0; j < 3; j++){
					cell_ = row_.insertCell();
					cell_.className = "memo_cell";
					cell_.innerHTML = "&nbsp";
					cell_.style.borderColor = "lightgrey";
				}
			}
		}
		check_integrity(now_cell_button, old_v);
	}else if(memokey.value == 1){
		memokey.style.backgroundColor = "";
		memokey.value = "0";
	}
}

//click html (background)
function init_html_onclick(){
	html.onclick = function(e){
		if(e.target.className != "dropbtn" ){
			dropdown_content.style.display = "none";
		}
		if(!(e.target.id == "memokey"|| e.target.className == "numkey" || e.target.className == "myInput" || e.target.className == "memo_cell")){
			keyboard.style.display = "none";
		}
	}
}

//check integrity
function check_integrity(e, old_v){
	var rc = e.name;
	var v = e.value;
	var c= rc%10;
	var r = (rc-c)/10;

	var f1 = check_box(r, c, v, old_v);
	var f2 = check_row(r, c, v, old_v);
	var f3 = check_col(r, c, v, old_v);
	if(f1 && f2 && f3){
		e.style.background = basic_background_color;
	}else{
		e.style.background = conflict_value_color;
	}
}
function check_box(r, c, v, old_v){
	var ok = true;
	var now;
	var row;
	var box_r = r-r%3;
	var box_c = c-c%3;
	for(var i = box_r; i < box_r+3; i++){
		row = table.rows[i];
		for(var j = box_c; j < box_c+3; j++){
			if(r == i && c == j){
				continue;
			}
			now = row.cells[j].children[0];
			if(now.value == v && now.value != 0){
				ok = false;
				if(old_v > -1){
					now.style.background = conflict_value_color;
				}
			}else if(now.value == old_v){
				if(check_box(i, j, now.value, -1) && check_row(i,j,now.value,-1) && check_col(i,j,now.value,-1)){
					table.rows[i].cells[j].children[0].style.background = basic_background_color;
				}
			}
		}		
	}
	return ok;
}
function check_row(r, c, v, old_v){
	var ok = true;
	var now;
	//console.log("row: "+r+", "+c);
	for(var j = 0; j < 9; j++){
		if(c == j){
			continue;
		}
		now = table.rows[r].cells[j].children[0];
		if(now.value == v && now.value != 0){
			ok = false;
			if(old_v > -1){
				now.style.background = conflict_value_color;
			}
		}else if(now.value == old_v){
			if(check_box(r, j, now.value, -1) && check_row(r,j,now.value,-1) && check_col(r,j,now.value,-1)){
				table.rows[r].cells[j].children[0].style.background = basic_background_color;
			}
		}
	}
	return ok;
}
function check_col(r, c, v, old_v){
	var ok = true;
	for(var i = 0; i < 9; i++){
		if(r == i){
			continue;
		}
		now = table.rows[i].cells[c].children[0];
		if(now.value == v && now.value != 0){
			ok = false;
			if(old_v > -1){
				now.style.background = conflict_value_color;
			}
		}else if(now.value == old_v){
			if(check_box(i, c, now.value, -1) && check_row(i, c, now.value, -1) && check_col(i, c, now.value, -1)){
				table.rows[i].cells[c].children[0].style.background = basic_background_color;
			}
		}	
	}
	return ok;
}


//change same values when mouse hover
function init_mapcell_hover(){
	for(var i = 0; i < table.rows.length; i++){
		for(var j = 0; j < table.rows[i].cells.length; j++){
			var c = table.rows[i].cells[j].children[0];
			c.onmouseover = mapcell_onmouseover;
			c.onmouseout = mapcell_onmouseout;
		}
	}
}
function mapcell_onmouseover(){
	var v = this.value;
	if(v != 0){
		for(var i = 0; i < table.rows.length; i++){
			for(var j = 0; j < table.rows[i].cells.length; j++){
				var c = table.rows[i].cells[j].children[0];
				if(c.value == v && rgb2hex(c.style.background) != conflict_value_color){
					c.style.background = same_value_color;
				}
			}
		}
	}
	if(rgb2hex(this.style.background) != conflict_value_color){
		this.style.background = cell_hover_color;
	}
} 
function mapcell_onmouseout(){
	var v = this.value;
	if(v != 0){
		for(var i = 0; i < table.rows.length; i++){
			for(var j = 0; j < table.rows[i].cells.length; j++){
				var c = table.rows[i].cells[j].children[0];
				//console.log(i*100+j+": "+rgb2hex(c.style.background)+"  "+same_value_color);
				if(rgb2hex(c.style.background) == same_value_color){
					c.style.background = basic_background_color;
				}
			}
		}
	}
	if(rgb2hex(this.style.background) != conflict_value_color){
		this.style.background = basic_background_color;
	}
} 

//rbg to hex color
function rgb2hex(rgb){
	if (  rgb.search("rgb") == -1 ) {
          return rgb;
     } else {
          rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
          function hex(x) {
               return ("0" + parseInt(x).toString(16)).slice(-2);
          }
          return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
     }
} 

//update timer
var totalSeconds = 0;
var timerIntervalId;
function init_timer(){
	var m = document.getElementById("minutes");
	var s = document.getElementById("seconds");
	clearInterval(timerIntervalId);
	totalSeconds = 0;
	s.innerHTML = "00";
	m.innerHTML = "00";
	timerIntervalId = setInterval(update_timer, 1000);
}
function update_timer(){
	var m = document.getElementById("minutes");
	var s = document.getElementById("seconds");
	totalSeconds++;
	s.innerHTML = n2nn(totalSeconds % 60);
	m.innerHTML = n2nn(parseInt(totalSeconds / 60));
}
function n2nn(n){
	var s = "";
	if(parseInt(n/10) == 0){
		return "0"+n;
	}
	return n;
}
function get_timer_time(){
	var m = document.getElementById("minutes");
	var s = document.getElementById("seconds");
	return m.innerHTML+":"+s.innerHTML;
}

//start button onclick
function init_start_onclick(){
	var start_button = document.getElementById("start_button");
	start_button.onclick = start_button_onclick;
}
function start_button_onclick(){
	var start_box = document.getElementById("start_box");
	start_box.style.display = "none";
	init_timer();
}

//restart button onclick
function init_restart_onclick(){
	var end_box = document.getElementById("end_box");
	end_box.style.display = "none";
	var restart_button = document.getElementById("restart_button");
	restart_button.onclick = restart_button_onclick;
}
function restart_button_onclick(){
	var end_box = document.getElementById("end_box");
	end_box.style.display = "none";
	init_map();
	init_timer();
}

//success
function show_success(){
	var end_box = document.getElementById("end_box");
	end_box.style.display = "";
	var success_time = document.getElementById("success_time");
	success_time.innerHTML = get_timer_time();
	clearInterval(timerIntervalId);
	document.getElementById("restart_button").focus();
}
function check_success(){
	var c;
	for(var i = 0; i<table.rows.length; i++){
		for(var j = 0; j< table.rows[i].cells.length; j++){
			c = table.rows[i].cells[j].children[0];
			if(c.value == 0 || rgb2hex(c.style.background) == conflict_value_color){
				return;
			}
		}
	}
	show_success();
}

//difficulty change
function init_dif_click(){
	for(var i = 0; i < dif_buttons.length; i++){
		dif_buttons[i].onclick = dif_button_onclick;
	}
	drop_button.onclick = drop_button_onclick;
}
function dif_button_onclick(){
	difficulty = this.value;
	var dif;
	drop_button.value = difficulty;
	console.log("dif: "+difficulty);
	if(difficulty == 1){
		dif = "쉬움";
	}else if(difficulty == 2){
		dif = "보통";
	}else if(difficulty == 3){
		dif = "어려움";
	}
	drop_button.innerHTML = dif;
	map_generate();
	init_map();
	dropdown_content.style.display = "none";
	init_timer();
}
function drop_button_onclick(){
	console.log(dropdown_content.style.display);
if(dropdown_content.style.display == "" || dropdown_content.style.display == "none"){
		dropdown_content.style.display = "block";
	}else{
		dropdown_content.style.display = "none";
	}
}