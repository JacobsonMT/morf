var MAXIMALLY_DISTINCT_COLORS = ["#2bce48", "#191919", "#0007dc", "#4c005c", "#993f00", "#005c31", "#f0a3ff", "#ffcc99", "#808080", "#94ffb5", "#8f7c00", "#9dcc00", "#c20088", "#003380", "#ffa405", "#ffa8bb", "#426600", "#ff0010", "#5ef1f2", "#00998f", "#e0ff66", "#740aff", "#990000", "#ffff80", "#ffff00", "#ff5005"];

function isUndefined( variable ) {
   return ( typeof variable === 'undefined' );
}

function handleValidateJobSubmitComplete(xhr, status, args) {
   if(args.confirm) {
      PF('noEmailDlg').show();
   }
}

function start() {
   PF('statusDialog').show();
}

function stop() {
   PF('statusDialog').hide();
}

function clearFastaInput() {
	$('#inputForm\\:inputContent').val('');
}

function pushUpdateHandler() {
   pushUpdate();
}

function handleCreateChart(xhr, status, args){
	
	//console.log(args);
	var values = JSON.parse(args.hc_values);
	console.log(values)
	var labels = JSON.parse(args.hc_labels);
	
	var seriesNames = ['MCW', 'Conservation', 'MC', 'MDC'];
	
	var tooltips = [];
	
	var tooltipCreator = function(idx, rowData) { // Purely for speed
      var s = '<b>Position: ' + idx + ", " + labels[idx] + '</b>';
      
      for (var i = 0; i < rowData.length; i++) {
         var val = vals[i];
         s += '<br/>' + seriesNames[i] + ': ' + val.toFixed(3);
      }
      return s;
	}

	var data = [[], [], [], []];
	var dataMin = 1;
	var dataMax = 0;
	var idx = 0;
   for (pos in values) {
	   var vals = values[pos];
	   tooltips[idx] = tooltipCreator(idx, vals)
	   idx+=1
	   for (var i = 0; i < vals.length; i++) {
         var val = vals[i];
         if (val > dataMax) dataMax = val;
         if (val < dataMin) dataMin = val;
         data[i].push([parseInt(pos,10), val]);
      }
	   

   }
   //console.log(data);
	
    var options = {
    	chart : {
    			renderTo: 'hc_container',
                zoomType: 'xy',
                resetZoomButton: {
                   position: {
                      // align: 'right', // by default
                      // verticalAlign: 'top', // by default
                      x: -200,
                      y: -40
                   }
                }
             },
        title: {
            text: args.hc_title,
        },
        subtitle: {
            text: 'Drag To Zoom',
            align: 'right',
            x: -140,
            y: 25,
        },
        legend : {
        	enabled: false
        },
        colors : MAXIMALLY_DISTINCT_COLORS,
        xAxis: {
            title: {
                text: 'Position',
                min:0
            },
        },
        yAxis: {
            title: {
                text: 'MoRF Propensity'
            },
        },
        tooltip: {
        	crosshairs:true,
            positioner: function (labelWidth, labelHeight, point) {
                return { x: Math.max(Math.min(this.chart.chartWidth - labelWidth, point.plotX-70),0), y: 50 };
            },
            headerFormat: '<b>{series.name}</b><br />',
            pointFormat: 'x = {point.x}, y = {point.y}',
            formatter:function(){
//               console.log(this)
//               var s = '<b>Position: ' + this.x + ", " + labels[this.x] + '</b>';
//
//               $.each(this.points, function () {
//                   s += '<br/>' + this.series.name + ': ' +
//                       this.y.toFixed(3);
//               });
//               return s;
               return tooltips[this.x]
               //return '<b>'+this.series.name+'</b><br/> Position: ' + this.x + ", " + labels[this.x] + "<br/> Probability: " + this.y.toFixed(3);
            },
            shared: true
        },
        plotOptions: {
           series : {
              events: {
                 legendItemClick: function(event) {

                    var defaultBehaviour = event.browserEvent.metaKey || event.browserEvent.ctrlKey;

                    if (!defaultBehaviour) {

                       var seriesIndex = this.index;
                       var series = this.chart.series;

                       var reset = this.isolated;
                       
                       if (isUndefined(reset) ) {
                          reset = true;
                       }

                       console.log(seriesIndex, series, reset, this.isolated);

                       for (var i = 0; i < series.length; i++)
                       {
                          if (series[i].index != seriesIndex)
                          {
                             if (reset) {
                                series[i].setVisible(true, false)
                                series[i].isolated=false;
                             } else {
                                series[i].setVisible(false, false)
                                series[i].isolated=false; 
                             }

                          } else {
                             if (reset) {
                                series[i].setVisible(true, false)
                                series[i].isolated=false;
                             } else {
                                series[i].setVisible(true, false)
                                series[i].isolated=true;
                             }
                          }
                       }
                       this.chart.redraw();

                       return false;
                    }
                 }
              }
           },
            line: {
                marker: {
                    radius: 0.5,
                    states: {
                    	hover: {
                    		enabled: false,
                    		radius: 0.5
                    	}
                    }
                },
                lineWidth: 1.5,
                states: {
                    hover: {
                        lineWidth: 1.5
                    }
                },
                threshold: null
            }
        },
        legend : {
           align : 'right',
           verticalAlign: 'top',
           layout: 'vertical',
           y:20
        },
        series: [{
        	type: 'line',
            name: 'MCW',
            visible: true,
            isolated: true,
            data: data[0],
            color: {
               linearGradient: { x1: 0, y1: dataMin, x2: 0, y2: dataMax},
               stops: [
                   [0, Highcharts.getOptions().colors[5]],
                   [1, Highcharts.getOptions().colors[0]]
               ]
           },
           zIndex: 4
        },
        {
           type: 'line',
              name: 'Conservation',
              visible: false,
              isolated: false,
              data: data[1],
              zIndex: 1
          },
          {
             type: 'line',
                name: 'MC',
                visible: false,
                isolated: false,
                data: data[2],
                zIndex: 3
            },
            {
               type: 'line',
                  name: 'MDC',
                  visible: false,
                  isolated: false,
                  data: data[3],
                  zIndex: 2
              }]
    }
    
    var a = new Highcharts.Chart(options, function(c) {
    	setResizer(c)
    });
    
    
	
}

function setResizer(chart) {
	$(window).resize(function() {
		setTimeout(function() {
			chart.reflow();
		}, 200);
		
    });
}


$(document).ready(function() {
   console.log("spellcheck off")
   $('#inputForm\\:inputContent').attr('spellcheck',false);

   });