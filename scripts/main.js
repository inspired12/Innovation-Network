        var w = window.innerWidth,
            h = 900,offsetX =0,offsetY = 0,
            links = [],
            node, 
            gnode, 
            link;

        var categories = []; 
        var countries = []; 

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
                  return (this === nodeUnderMouse) ? 1.0 : 0.5;
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
                    //alert(d.name+"\n"+d.val+"\n"+d.joined+"\n"+d.country+"\n"+d.category+"\n"+d.investors);
                    alert(d.name+" is a company from "+d.country+" valued at "+d.val+" billion dollars, and working on "+d.category+".\nIt raised it's first billion on "+d.joined+" through "+d.investors+".\n It is number "+(nodes.indexOf(d)+1)+" of 161");
              });

          node = gnode.append("circle")
              .attr("class", "node")
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; })
              .attr("r", function(d) { return parseInt(d.val.slice(1))*2; })
              .style("fill", function(d){  return "#999999"  }).style("opacity","0.75");

         var labels = gnode.append("text")
          .attr("fill",function(d){ 
            return "white";   
          })
          .text(function(d) {
             return d.name;
            })
          .attr("transform","translate(4,2) rotate(-5)");

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
                var indexCat = categories.indexOf(d.category);
                var indexCoun = countries.indexOf(d.country);
                var center ;


                switch (layout){
/*
                    case "0":
                        cols = 10;
                        center = {x:100+ 150 * (d.index%cols) ,y:100 + 50* (d.index/cols)};
                    break;
*/
                    case "1":
                        //center = {x:100+ 150 * (d.index%cols) ,y:100 + 50* (d.index/cols)};
                        center = {x: 150+ 250 * (indexCoun%cols) ,y:300 + 100* (indexCoun/cols)};
                    break;
                    case "2":
                        center = {x: 150+ 250 * (indexCat%cols) ,y:300 + 100* (indexCat/cols)};
                    break;
                    default:
                        center = {x:w/4 + Math.sin(d.index)*(200*(d.index/150)),y:h/2+ Math.cos(d.index)*(200*(d.index/150))};
                    break;
                }
                return center;

        }

        function moveTowardCategoryCenter(alpha) {
          return function(d) {

                var cols = 10;
                var center = getCenter(d);

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


    var layout = 0;

    $(function(){

        $('input[name=materials]').on('change',function(){
            layout = ($('input[name=materials]:checked').val());
            force.start();
        });


     Tabletop.init( { key: '1mj32f0CA_ExXaq066kfvWbNFwZq1n6SEk-t8_1o9gf8',
                       callback: function(data, tabletop) { 

                          nodes = data;
                          nodes.map(function(i,o){ if(categories.indexOf(i.category)==-1){ categories.push(i.category);} },categories);
                          nodes.map(function(i,o){ if(countries.indexOf(i.country)==-1){ countries.push(i.country);} },countries);

                          force.nodes(nodes)
                          //.links(links)  //not active
                         // .linkDistance(80)
                          .size([w, h])
                          .on("tick", tick)
                          .on("start", toggleLabels)
                          .on("end", onLabels)
                          .charge(function(d) { 
                              return parseInt(d.val.slice(1))*-100 ; 
                           });

                           update();

                     },simpleSheet: true } )

    });

