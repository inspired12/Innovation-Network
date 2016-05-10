        var w = window.innerWidth,
            h = 900,offsetX =0,offsetY = 0,
            links = [],
            node, 
            gnode, 
            link;

        var categories = []; 

        var force = d3.layout.force();

        var vis = d3.select("#main").append("svg")
            .attr("width", w)
            .attr("height", h);

        function update() {

          gnode = vis.selectAll("g.node")
            .data(nodes).enter().append("g").classed("gnode",true)
            .call(force.drag)
            .on('mouseover', function(d){
              var nodeUnderMouse = this;
              vis.selectAll('.gnode')
                .transition()
                .duration(200)
                .style('opacity', function () {
                  return (this === nodeUnderMouse) ? 1.0 : 0.3;
                });
            })
            .on('mouseout', function(d){
              vis.selectAll('.gnode')
              .transition()
              .duration(200)
              .style({opacity:'1'});
            })
            .on('click', function(d,e){
                  //  offsetX = 400;
                    console.log(d);
              });

          node = gnode.append("circle")
              .attr("class", "node")
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; })
              .attr("r", function(d) { return parseInt(d.val.slice(1))*2; })
              .style("fill", function(d){  return "#999999"  }).style("opacity","0.75");

         var labels = gnode.append("text")
          .attr("dx",function(d) { 
                if(d.name.split(" ").length>1){ 
              //    return  -d.name.length/2 * 1.5;
                } 
            })
          .attr("dy",function(d) { 
            if(d.name.split(" ").length>1){ 
            } 
              return "0"
            })
          .attr("fill",function(d){ 
            return "white";   
          })
          .text(function(d) {
            var label = "";
            label = d.name;
            return label;
            })
          .attr("transform","translate(4,2) rotate(-10)");

          vis.selectAll('g text').each(insertLinebreaks);

          force.start();

        } 

        var insertLinebreaks = function (d) {
            var el = d3.select(this);
            var words = d.name.split(' ');
            el.text('');
            for (var i = 0; i < words.length; i++) {
                var tspan = el.append('tspan').text(words[i]);
                if (i > 0){
 //                   tspan.attr('x', -words[i].length/2 * 6 ).attr('dy', '12');
                }
            }
        };

        function tick(e) {
           gnode.each(moveTowardCategoryCenter(e.alpha));
           gnode.attr("transform", function(d) { 
                return 'translate(' + [d.x, d.y] + ')'; 
           });
        };

        function getCenter(d){

                var cols = 6;
                var index = categories.indexOf(d.category);
                var center = {x: 120+ 250 * (index%cols) ,y:200 + 100* (index/cols)};
                return center;

        }

        function moveTowardCategoryCenter(alpha) {
          return function(d) {

                var cols = 10;
                var center = {x:w/2,y:h/2};
 //             var center = {x:w/2 + Math.sin(d.index)*200,y:h/2+ Math.cos(d.index)*200,};

                if(!bool){
                        center = getCenter(d);
                }else{
                        center = {x:100+ 150 * (d.index%cols) ,y:100 + 50* (d.index/cols)};
                }

                d.y += ((center.y) - d.y) * 0.4 * alpha;
                d.x += (center.x + offsetX - d.x) * 0.4 * alpha;

          };

        }


        function toggleLabels(){
                vis.selectAll("text").style("opacity", 0 );
                setTimeout(function(){    vis.selectAll("text").transition().duration(3000).style("opacity", 1 ); }, 5000);
        }
        function onLabels(){
                vis.selectAll("text").transition().duration(3000).style("opacity", 1 ); 
        }


var bool = true;

    $(function(){

    $("body").click(function(){
        bool = !bool;
if(bool){
                          force.charge(function(d) { 
                              return  -10;
                           });
}else{

                          force.charge(function(d) { 
                              return parseInt(d.val.slice(1))*-100 ; 
                           });
}
        force.start();
    });

     Tabletop.init( { key: '1mj32f0CA_ExXaq066kfvWbNFwZq1n6SEk-t8_1o9gf8',
                       callback: function(data, tabletop) { 

                          nodes = data;
                          nodes.map(function(i,o){ if(categories.indexOf(i.category)==-1){ categories.push(i.category);} },categories);

                          force.nodes(nodes)
                          //.links(links)  //not active
                         // .linkDistance(80)
                          .size([w, h])
                          .on("tick", tick)
                          .on("start", toggleLabels)
                          .on("end", onLabels)
                          .charge(function(d) { 
                              return  -10;
                           });

                           update();

                     },simpleSheet: true } )

    });

