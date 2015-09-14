
    var offsetX = 0;
    var offsetY = 0;
    var linkToggle = false;

    var gui = new dat.GUI();
    gui.close();
    var config = {'charge':-500, 'gravity':0.04};
    var charger = gui.add(config, "charge", -500, 0);
    var graver = gui.add(config, 'gravity', 0, 1);

$(function(){


    $( "body" ).keypress(function( event ) {
      if ( event.which == 108 ) {
        linkToggle = !linkToggle;
      }
    });

    $(".bio").click(function(){
        sorter = "";
        force.start();
        clearDesc();
    });

    $(".byYear").click(function(){
        offsetX = 0;
        sorter = "year";
        force.start();
        clearDesc();

    });

    $(".byCat").click(function(){
        offsetX = 0;
        sorter = "category";
        force.start();
        clearDesc();
    });

    $(".byOrg").click(function(){
        offsetX = 0;
        sorter = "organization";
        force.start();
        clearDesc();
    });

    $(".byNone").click(function(){
        offsetX = 0;
        sorter = "";
        force.start();
        clearDesc();
    });

});


var w = window.innerWidth,
    h = 900,
    links = [],
    node, 
    gnode, 
    link;

function charge(d) {
     return -Math.pow(20, 2.0) / 4;
}

var categoryCenters = {
     "software":{x:450,y:240},
     "hardware":{x:600,y:340},
     "biomedical":{x:520,y:465},
     "resources":{x:400,y:474},
     "Education":{x:330,y:340},
     "null":{x:330,y:-500}
}

var yearCenters = {
     "1992":{x:50,y:400},
     "1998":{x:100,y:400},
     "1999":{x:150,y:400},
     "2000":{x:200,y:400},
     "2001":{x:250,y:400},
     "2002":{x:300,y:400},
     "2003":{x:350,y:400},
     "2004":{x:400,y:400},
     "2005":{x:450,y:400},
     "2006":{x:500,y:400},
     "2007":{x:550,y:400},
     "2008":{x:600,y:400},
     "2009":{x:650,y:400},
     "2010":{x:700,y:400},
     "2011":{x:750,y:400},
     "2012":{x:800,y:400},
     "2013":{x:850,y:400},
     "2014":{x:900,y:400},
     "null":{x:500,y:-400}
}

var orgCenters = {
     "TMCx":{x:300,y:400},
     "Mercury":{x:600,y:400},
     "Surge":{x:900,y:400},
     "null":{x:900,y:-400}
}

var sorter = "";

var labels = [
{"Name":"1990","Category":"null","type":"Label","Picture":"http://i.imgur.com/JdTtQ4n.png","Year":"1992","org":"null"},
{"Name":"2000","Category":"null","type":"Label","Picture":"http://i.imgur.com/JdTtQ4n.png","Year":"2001","org":"null"},
    {"Name":"2005","Category":"null","type":"Label","Picture":"http://i.imgur.com/JdTtQ4n.png","Year":"2005","org":"null"},
    {"Name":"2010","Category":"null","type":"Label","Picture":"http://i.imgur.com/JdTtQ4n.png","Year":"2010","org":"null"},
    {"Name":"2014","Category":"null","type":"Label","Picture":"http://i.imgur.com/JdTtQ4n.png","Year":"2014","org":"null"},
    {"Name":"Software","Category":"software","type":"Label","Picture":"http://i.imgur.com/JdTtQ4n.png","Year":"null","org":"null"},
    {"Name":"Hardware","Category":"hardware","type":"Label","Picture":"http://i.imgur.com/JdTtQ4n.png","Year":"null","org":"null"},
    {"Name":"Biomedical","Category":"biomedical","type":"Label","Picture":"http://i.imgur.com/JdTtQ4n.png","Year":"null","org":"null"},
    {"Name":"TMCx","Category":"null","type":"Label","Picture":"http://i.imgur.com/JdTtQ4n.png","Year":"null","org":"TMCx"},
    {"Name":"Mercury","Category":"null","type":"Label","Picture":"http://i.imgur.com/JdTtQ4n.png","Year":"null","org":"Mercury"},
    {"Name":"Surge","Category":"null","type":"Label","Picture":"http://i.imgur.com/JdTtQ4n.png","Year":"null","org":"Surge"}
];

for( obj of companies[0].ventures){
    obj.org = "TMCx";
};

for( obj of companies[1].ventures){
    obj.org = "Mercury";
};

for( obj of companies[2].ventures){
    obj.org = "Surge";
};

var allCompanies = companies[1].ventures.concat(companies[0].ventures).concat(companies[2].ventures).concat(labels);

var TMCx = companies[0].ventures.concat(labels);
var Mercury = companies[1].ventures.concat(labels);
var Surge = companies[2].ventures.concat(labels);

//var nodes = companies[1].ventures.concat(companies[0].ventures);
/*
nodes = TMCx;
nodes = Surge;
nodes = allCompanies;
*/
nodes = Mercury;

var force = d3.layout.force()
  .nodes(nodes)
  .links(links)
  .linkDistance(80)
  .size([w, h])
  .on("tick", tick)
  .charge(function(d) { 
  return (d.type=="Label")?"-800":"-450" ; });

  // .charge(config.charge);
  /* .charge(function(d) { return d._children ? -d.size / 100 : -30; }) */
  /* .linkDistance(function(d) { return d.target._children ? 80 : 30; }) */

var vis = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h);

function update() {
  // Update the nodes…
  gnode = vis.selectAll("g.node")
      .data(nodes).enter().append("g").classed("gnode",true)
      .call(force.drag)
      .on('mouseover', function(d){
            var nodeSelection = d3.select(this).style({opacity:'0.5'});
                })
      .on('mouseout', function(d){
            var nodeSelection = d3.select(this).style({opacity:'1'});
      })
     .on('click', function(d,e){
            if(!linkToggle){
                if(d.type!="Label"){
                            loadProfile(d);
                            offsetX = 400;
                }
            }else{
                window.open(d.url);
            }
      });

  node = gnode.append("circle")
      .attr("class", "node")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", function(d) { return (d.type=="Label")?"100":"30" ; })
      .style("stroke", function(d){  return (d.type=="Label")?"none": (d.org=="TMCx")? "#97d6ed": (d.org=="Surge")? "#edbe97":"#63a2ff"  })
      .style("stroke-width", "2px")
 //     .style("fill", function(d){ if(d.type!="Label"){ return "white" }else{return "none"}});
      .style("fill", function(d){  return (d.type=="Label")?"none": (d.org=="TMCx")? "#97d6ed": (d.org=="Surge")? "#edbe97":"#63a2ff"  });

 var labels = gnode.append("text").attr("font-size",function(d){ return (d.type=="Label")? "20px":"10px";  }).attr("dy",function(d){ if(d.Name.split(" ").length>1){ return "-10"}}).attr("fill",function(d){ return (d.type=="Label") ? "black":"black";   })
      .text(function(d) {
         var label = "";
        if(d.type!="Label"){
        //    $.each(d.Name.split(" "),function(i,o){ label += (o.charAt(0)+".")  });
            label = d.Name;
        }else{
            label = d.Name;
        }
             return label;
     }).attr("y",5);

  vis.selectAll('g text').each(insertLinebreaks);

  // Restart the force layout.
  force.start();

} 

function loadProfile(profile){

    $(".description").slideDown();
    $(".name").html("<h2><a href='"+profile.url+"' target='_blank'>"+profile.Name + "</a></h2><h3>" + profile.Year + " - " + profile.Category+"</h3>");
    $(".desc").html(profile.Bio);
if(profile.url.indexOf("href")>-1){
    $(".link").html(profile.url);
}else{
    $(".link a").attr("href",profile.url);
}
    $(".video a").attr("href",profile.Video);
    $(".profile").attr("src","img/speakerArchive/"+profile.Year+"/"+profile.Picture);
    $(".profile").show();
    $(".menu").show();

}

var insertLinebreaks = function (d) {
    var el = d3.select(this);
    var words = d.Name.split(' ');

    el.text('');

    for (var i = 0; i < words.length; i++) {
        var tspan = el.append('tspan').text(words[i]);
        if (i > 0)
            tspan.attr('x', 0).attr('dy', '10');
    }
};

function clearDesc(){

    $(".description").slideUp();
    $(".name").html("");
    $(".desc").html("");
    $(".profile").hide();
    $(".menu").hide();

}

function tick(e) {

   gnode.each(moveTowardCategoryCenter(e.alpha));

 // node.attr("cx", function(d) { return d.x; })
 //   .attr("cy", function(d) { return d.y; });

    gnode.attr("transform", function(d) { 
        return 'translate(' + [d.x, d.y] + ')'; 
    });

};

function moveTowardCategoryCenter(alpha) {

  return function(d) {

    if(sorter == "year"){
        var center = yearCenters[d.Year];
        if(d.type=="Label"){
            offsetY = 80;
        }
    }else if(sorter == "category"){
        if(d.type=="Label"){
            offsetY = 0;
        }
        var center = categoryCenters[d.Category];

    }else if(sorter == "organization"){
        if(d.type=="Label"){
            offsetY = 0;
        }
        var center = orgCenters[d.org];

    }else {
            offsetY = 1200;
        var center = {x:w/2,y:300};
    }


    if(d.type=="Label"){
        d.y += ((center.y - offsetY) - d.y) * 0.15 * alpha;
    }else{
        d.y += ((center.y) - d.y) * 0.15 * alpha;
    }

    d.x += (center.x + offsetX - d.x) * 0.15 * alpha;

/*

        if(d.type=="Label" && sorter=="year"){
            d.y += ((center.y - 80) - d.y) * 0.15 * alpha;
        }else if(d.type=="Label" && sorter!="year"){
            d.y += (center.y-1000 - d.y) * 0.15 * alpha;
        }else {
            d.y += (center.y - d.y) * 0.15 * alpha;
        }
*/


  };

}


 window.onload = function() {

    charger.onChange(function(value) {
        force.charge(value);
        force.start();
        });


    graver.onChange(function(value) {
        force.gravity(value);
        force.start();
        });

    update();

 };


                           
