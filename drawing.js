$(function() {"use strict";
    var canvas = $("#it"), context =canvas[0].getContext('2d'), undo, redoArray=[], width, height, theBody = $('body'), pressing, lineArray =[], aLinesArray =[];
    function setCanvasSize() {
        var theBody = $('body');
        width = theBody.innerWidth();
        height = theBody.innerHeight();
        canvas.attr("width", width).attr("height", height);
        if(localStorage.linesArray){
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
     function redraw() {
        aLinesArray = JSON.parse(localStorage.linesArray);
       $.each(aLinesArray,function(index,lineArray1){
           var startPoint = lineArray1[0];
           context.beginPath();
           context.moveTo(startPoint.x, startPoint.y);
         $.each(lineArray1,function(index1,line1){
            if(index1>0){
                 context.lineTo(line1.x, line1.y);
                 }
                 context.stroke();   
          });  
       });
    }
       $('#clear').click(function() {
           localStorage.clear();
           aLinesArray=[];
           context.clearRect(0,0,width,height);
       }); 
           
       
       undo = (function()  {
        $("#undo").click(function(){
            if(aLinesArray.length){
            redoArray.push(aLinesArray.pop());
            localStorage.linesArray = JSON.stringify(aLinesArray);
            context.clearRect(0,0,width,height);
            redraw();
            }
        });
    }());
   
    
    function redo(){
        $("#redo").click(function(){
            if(redoArray.length){
            aLinesArray.push(redoArray.pop());
            localStorage.linesArray = JSON.stringify(aLinesArray);
            redraw();
            }
        });
    }
      redo();
    $("#lineButton").click(function() {
       canvas.unbind();
       $('body').unbind();
        canvas.mousedown(function(event) {
            $(canvas).css('cursor', 'pointer');
            if(event.which===1){
            lineArray=[ ];
            pressing = true;
            console.dir(event);
            context.beginPath();
            context.moveTo(event.offsetX, event.offsetY);
            }
        });

        $("#it").mousemove(function(event) {
           //event.preventDefault();
            if (pressing) {
                redoArray=[];
                lineArray.push({
                    x : event.offsetX,
                    y : event.offsetY
                });
                context.lineTo(event.offsetX, event.offsetY);
                context.stroke();
            }
        });
       canvas.mouseleave(function(){
           if(pressing===true){
               aLinesArray.push(lineArray);
            localStorage.linesArray = JSON.stringify(aLinesArray);
            var newArray = JSON.parse(localStorage.linesArray);
            canvas.mouseenter(function(){
                lineArray=[ ];
            console.dir(event);
            context.beginPath();
            context.moveTo(event.offsetX, event.offsetY);
            });}
           });
        $(window).mouseup(function() {
            if((pressing===true)&&(lineArray.length>1)){
            aLinesArray.push(lineArray);
            localStorage.linesArray = JSON.stringify(aLinesArray);
            var newArray = JSON.parse(localStorage.linesArray);
            console.dir(newArray);
            } 
            pressing = false;
            canvas.unbind('mouseenter');
        });
    });

});
