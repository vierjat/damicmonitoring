
function drawChart() {

  var timezoneOffset = new Date().getTimezoneOffset();
  var date = $('#datetimepicker').val();
  var params = {date: date, timezoneOffset: timezoneOffset}

  var callback = function(jsonData) {
    var plotTitle = "DAMIC monitoring data: " + new Date();
    data = {cols: [{id: 'Date', label: 'Date', type: 'datetime'},
        {id: 'Temp', label: 'Temperature', type: 'number'},
        {id: 'Pres', label: 'Log(Pressure)', type: 'number'} ],
      rows: []
    };

    $.each(jsonData['temp'], function(i,el) {
      data['rows'].push({c:[ {v: new Date(el['ts'])}, {v: el['value']}, {v: null}] });
    });

    $.each(jsonData['pres'], function(i,el) {
      data['rows'].push({c:[ {v: new Date(el['ts'])}, {v: null}, {v: el['value']}] });
    });

    // Create our data table out of JSON data loaded from server.
    var data = new google.visualization.DataTable(data);

    var options = {
      title: plotTitle,
      dateFormat: 'dd.MM.yy hh:mm',
      hAxis: {format: 'Y,M,d,H'},
      hAxis: {title: 'Date'},
      pointSize: 2,
      vAxes: {0: {logScale: false, title: 'Temperature [K]', viewWindowMode: 'explicit', viewWindow: { max: jsonData['maxTemp'], min: jsonData['minTemp']} },
              1: {logScale: false, title: 'Log(Pressure)', viewWindowMode: 'pretty' }},
      series:{0:{targetAxisIndex:0},
              1:{targetAxisIndex:1}},
              colors: ['#ff0000', '#483D8B']
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

  $.ajax({
    url: "/getData",
    data: params,
    dataType:"json"
  }).success(function(data){
    callback(data);
  });
}


function drawChartCube() {
  console.log("drawChartCube\n");

  var jsonData = $.ajax({
          url: "/getDataCube",
          dataType:"json",
          async: false
          }).responseText;

  parsedData = JSON.parse(jsonData);

  // Create our data table out of JSON data loaded from server.
  var data = new google.visualization.DataTable(jsonData);

  var options = {
    title: parsedData.p.plotTitle,
    dateFormat: 'dd.MM.yy hh:mm',
    hAxis: {format: 'Y,M,d,H'},
    hAxis: {title: 'Date'},
    pointSize: 2,
    vAxes: {0: {logScale: false, title: 'Temperature [K]', viewWindowMode: 'explicit', viewWindow: { max: parsedData.p.maxTemp, min: parsedData.p.minTemp} },
            1: {logScale: false, title: 'Heater power [%]', viewWindowMode: 'pretty' }},
    series:{0:{targetAxisIndex:0},
            1:{targetAxisIndex:1}},
    colors: ['#ff0000', '#808000']
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}


function drawChartConnie() {
  console.log("drawChartConnie\n");

  var jsonData = $.ajax({
          url: "/getDataConnie",
          dataType:"json",
          async: false
          }).responseText;

  parsedData = JSON.parse(jsonData);

  // Create our data table out of JSON data loaded from server.
  var data = new google.visualization.DataTable(jsonData);

  var options = {
    title: parsedData.p.plotTitle,
    dateFormat: 'dd.MM.yy hh:mm',
    hAxis: {format: 'Y,M,d,H'},
    hAxis: {title: 'Date'},
    pointSize: 2,
    vAxes: {0: {logScale: false, title: 'Temperature [K]', viewWindowMode: 'explicit', viewWindow: { max: parsedData.p.maxTemp, min: parsedData.p.minTemp} },
            1: {logScale: false, title: 'Heater power [%]', viewWindowMode: 'pretty' }},
    series:{0:{targetAxisIndex:0},
            1:{targetAxisIndex:1}},
    colors: ['#ff0000', '#808000']
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

function httpGet(){
  console.log("httpGet\n");
  var xmlHttp = null;

  xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "POST", '/about', false );
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

function proceed () {
  var form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', 'about');
  form.style.display = 'hidden';
  document.body.appendChild(form)
  form.submit();
}

function myFunction(){
  console.log("myFunction\n");

  var xmlhttp;
  xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function()
    {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
      {
      drawChart();
      document.getElementById("chart_div");
      }
    }
  xmlhttp.open("GET","/",true);
  xmlhttp.send();
}
