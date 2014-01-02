google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

function drawChart() {
  console.log("drawChart\n");
  var data = google.visualization.arrayToDataTable([
    ['Date', 'Temperature', 'Log(Pressure)']
    <%= @data %>
  ]);

  var options = {
    title: <%= @plotTitle %>,
    dateFormat: 'dd.MM.yy hh:mm',
    hAxis: {format: 'Y,M,d,H'},
    hAxis: {title: 'Date'},
    pointSize: 2,
    vAxes: {0: {logScale: false, title: 'Temperature', viewWindowMode: 'explicit', viewWindow: { max: <%= @maxTemp %>, min: <%= @minTemp %>,} },
            1: {logScale: false, title: 'Log(Pressure)', viewWindowMode: 'pretty' }},
    series:{0:{targetAxisIndex:0},
            1:{targetAxisIndex:1}}
//           , explorer: {}        
  };
  
  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
//         var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
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
