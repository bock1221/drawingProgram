$(function() {"use strict";
    var canvas = $("#it"), context =canvas[0].getContext('2d'), width, height, theBody = $('body'), pressing, lineArray =[], aLinesArray =[];
    function setCanvasSize() {
        var theBody = $('body');
        width = theBody.innerWidth();
        height = theBody.innerWidth();
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
                 context.stroke();   
                } 
         });  
       });
    }


    $("#lineButton").click(function() {
       canvas.unbind();
       $('body').unbind();
        canvas.mousedown(function(event) {
            if(event.which===1){
            var time = 0;
            
            lineArray=[];
            pressing = true;
            console.dir(event);
            context.beginPath();
            /*lineArray.push({
                x : event.offsetX,
                y : event.offsetY
            });*/
            context.moveTo(event.offsetX, event.offsetY);
            }
        });

        canvas.mousemove(function(event) {
            if (pressing) {
                lineArray.push({
                    x : event.offsetX,
                    y : event.offsetY
                });
                context.lineTo(event.offsetX, event.offsetY);
                context.stroke();
            }
        });
        $('body').mouseup(function() {
            if((pressing===true)&&(lineArray.length>1)){
            aLinesArray.push(lineArray);
            localStorage.linesArray = JSON.stringify(aLinesArray);
            var newArray = JSON.parse(localStorage.linesArray);
            console.dir(newArray);
            } 
            pressing = false;
        });
    });

});
