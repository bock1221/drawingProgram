$(function() {"use strict";
	var canvas = $("#it"), context = canvas[0].getContext('2d'), getDB, drawingLink, dialogBox, sendDB, undo, redoArray = [], width, height, theBody = $('body'), pressing, lineArray = [], aLinesArray = [], strokeColor, drawingName;
	function setCanvasSize() {
		var theBody = $('body');
		width = theBody.innerWidth();
		height = theBody.innerHeight();
		canvas.attr("width", width).attr("height", height);
		if (localStorage.linesArray) {
			aLinesArray = JSON.parse(localStorage.linesArray);
			redraw();
		}
	}

	setCanvasSize();
	// canvas.resizable();

	$(window).resize(function() {
		// canvas.resizable();
		setCanvasSize();
		redraw();
		//myString="["+localStorage.linesArray+"[";

	});
	$(".buttonbBar").focus(function() {
		$(".buttonbBar").blur();
	});
	$("#full").spectrum({
		color : "#ECC",
		showInput : true,
		className : "full-spectrum",
		showInitial : true,
		showPalette : true,
		showSelectionPalette : true,
		maxPaletteSize : 10,
		preferredFormat : "hex",
		localStorageKey : "spectrum.demo",
		move : function(color) {

		},
		show : function() {

		},
		beforeShow : function() {

		},
		hide : function() {

		},
		change : function() {

		},
		palette : [["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"], ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)", "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)", "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)", "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]]
	});
	$("#full").change(function() {
		context.strokeStyle = $("#full").val();
	});
	$("#strokeSize").change(function() {
		context.lineWidth = $("#strokeSize").val();
	});
	function redraw() {
		// aLinesArray = JSON.parse(localStorage.linesArray);
		$.each(aLinesArray, function(index, lineArray1) {
			var startPoint = lineArray1[0];
			context.strokeStyle = startPoint.color1;
			context.lineWidth = startPoint.width1;
			context.beginPath();
			context.moveTo(startPoint.x, startPoint.y);
			$.each(lineArray1, function(index1, line1) {
				if (index1 > 0) {
					context.lineTo(line1.x, line1.y);
				}
				context.stroke();
			});
		});
	}


	$('#clear').click(function() {
		localStorage.clear();
		aLinesArray = [];
		context.clearRect(0, 0, width, height);
	});

	undo = ( function() {
			$("#undo").click(function() {
				if (aLinesArray.length) {
					redoArray.push(aLinesArray.pop());
					localStorage.linesArray = JSON.stringify(aLinesArray);
					context.clearRect(0, 0, width, height);
					redraw();
				}
			});
		}());

	function redo() {
		$("#redo").click(function() {
			if (redoArray.length) {
				aLinesArray.push(redoArray.pop());
				localStorage.linesArray = JSON.stringify(aLinesArray);
				redraw();
			}
		});
	}

	redo();
	$("#lineButton").click(function() {
		canvas.unbind();
		$(window).unbind();
		canvas.mousedown(function(event) {
			$(canvas).css('cursor', 'pointer');
			if (event.which === 1) {
				lineArray = [];
				pressing = true;
				lineArray.push({
					width1 : context.lineWidth,
					color1 : context.strokeStyle,
					x : event.offsetX,
					y : event.offsetY
				});
				context.beginPath();
				context.moveTo(event.offsetX, event.offsetY);
			}
		});

		$("#it").mousemove(function(event) {
			//event.preventDefault();
			if (pressing === true) {
				redoArray = [];
				lineArray.push({
					x : event.offsetX,
					y : event.offsetY
				});
				context.lineTo(event.offsetX, event.offsetY);

				context.stroke();
			}
		});

		canvas.mouseleave(function(event) {
			if (pressing === true) {
				lineArray.push({
					x : event.offsetX,
					y : event.offsetY
				});
				aLinesArray.push(lineArray);
				if (drawingName) {
					sendDb(JSON.strinify(lineArray));
				}
				//lineArray = [];
				// redraw();
				redoArray = [];
				context.lineTo(event.offsetX, event.offsetY);
				context.stroke();
				localStorage.linesArray = JSON.stringify(aLinesArray);
				aLinesArray = JSON.parse(localStorage.linesArray);
				$("#it").unbind('mousemove');
			}
		});
		canvas.mouseenter(function(event) {
			if (pressing === true) {
				lineArray = [];
				lineArray.push({
					width1 : context.lineWidth,
					color1 : context.strokeStyle,
					x : event.offsetX,
					y : event.offsetY
				});
				console.dir(event);
				context.beginPath();
				context.moveTo(event.offsetX, event.offsetY);
			}
		});

		$(window).mouseup(function() {
			if ((pressing === true) && (lineArray.length > 1)) {

				aLinesArray.push(lineArray);
				if (drawingName) {
					sendDB(JSON.stringify(lineArray));
				}
				localStorage.linesArray = JSON.stringify(aLinesArray);
				var newArray = JSON.parse(localStorage.linesArray);
				//console.dir(newArray);
				getDB();
			}
			pressing = false;
			//canvas.unbind('mouseenter');

		});
	});
	getDB = function() {
		$.post("http://localhost/retrieveDrawings.php",{drawingName:drawingName},function(data){
			console.log(data);
		});
	};

	sendDB = function(data) {
		$.post("http://localhost/drawingPDO.php", {
			data : data,
			drawingName : drawingName
		}, function(data) {
			// alert(data);
		});
	};

	dialogBox = $("#dialog").dialog({
		buttons : {

			Ok : function() {
				//$(this).dialog("close");
				drawingName = $("#name").val();
				$(this).dialog("close");
			}
		},
		autoOpen : false,
		title : "enter drawing name"
	}).append("Enter your name:").append("<input type='text' id='name'></input>");

	$("#share").click(function() {
		$.getJSON("http://localhost/getNames.php", null, function(data) {
			//alert(data);
			//var data1=JSON.parse(data);
			$.each(data, function(index, eachName) {
				drawingLink = $('<a href="">' + eachName + '</a><br>').click(function() {
					$("#name").val($(this).html());
					drawingName = $(this).html();
				});
				$("#dialog").append(drawingLink);
			});
		});
		$("#dialog").dialog("open");
	});

});
