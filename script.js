//Global variable declared to retain the data from the reader in openfile function
var data = [];

//openFile is used once a file is selected to read it and store the data to be plotted once the user has chosen title and axis labels
function openFile(Event) {
    "use strict";
    
    //retrieving the file and initiating the reader reader
    var input = Event.target;
    var reader = new FileReader();
    
    //once the reader has loaded this takes the data and stores it for future use
    reader.onload = function () {
        data = reader.result;
    };
    reader.readAsText(input.files[0]);  
}

//parseData parses the data into a form that canvasJS can use 
function parseData() {
    "use strict";
    var lines, point, newdata = [];

        
    //splitting the file into individual lines
    lines = data.split(/\n/);
    
    
    //iterates through the lines in the file sorting out the x and y components of the graph
    for (var i = 0; i < lines.length;i++) {
        if (lines[i].length > 0) {
            point = lines[i].split(",");
            
            // these conditions make sure that the inputted data is of the correct form
            try{
                document.getElementById("errBox").innerHTML = [];
                if (point.length != 2){
                    throw "wrong dimensions in data"
                }
                if (point[0].match(/[a-z|A-Z]/)){
                    throw "data must be numbers"
                }
                if (point[1].match(/[a-z|A-Z]/)){
                    throw "data must be numbers"
                }
            }
            catch(err) {
                document.getElementById("errBox").innerHTML = err;
                break;
            }
            newdata.push({
                x: parseFloat(point[0]),
                y: parseFloat(point[1])
            });
        }
    }

    return newdata
}
    
//plot goes to get data then decided if the user wants to save or not 
function plot() {
    
    //this gets the data to plot from parseData
    var plotData = parseData(data)
    
    //if else is to determine if the user wants their plot saved as a jpg file
    if (document.getElementById("save").checked == false){
        
        //this creates the plot then renders it
        var graph = new CanvasJS.Chart("chartContainer",{
        title: {
            text: document.getElementById("title").value
        },
        axisX: {
            title: document.getElementById("xLabel").value
        },
        axisY: {
            title: document.getElementById("yLabel").value
        },
        data: [{
            type: "line",
            dataPoints: plotData
        }]
    });
    graph.render();
    }else{
        
        //this creates the plot, renders it and then saves it
        var graph = new CanvasJS.Chart("chartContainer",{
        title: {
            text: document.getElementById("title").value
        },
        axisX: {
            title: document.getElementById("xLabel").value
        },
        axisY: {
            title: document.getElementById("yLabel").value
        },
        data: [{
            type: "line",
            dataPoints: plotData
        }]
    });
        
    //the only reason this render is here is incase the user wants to save before they've tried plotting atleast once
    graph.render();
    graph.exportChart({format: "jpg"});
    }
}

