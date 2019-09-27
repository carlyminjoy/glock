<template>

    <div id="all-games-chart">
        <div id='games'></div>
    </div>

</template>


<script>

var d3 = require('d3');
var moment = require('moment');

export default {
    name: 'AllGamesChart',
    props: ['gamedata'],
    mounted() {
        var margin = {top: 10, right: 30, bottom: 60, left: 60};
        var width = 400 - margin.left - margin.right;
        var height = 300 - margin.top - margin.bottom;

        let svg = d3.select("#all-games-chart")
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", `translate(${margin.left},${margin.right})`);

        let formattedGameData = this.gamedata.map(gd => {
            gd.date = gd.date.slice(0,10)
            return gd;
        });

        let data = d3.nest()
            .key(d => d.date)
            .entries(formattedGameData);

        data = data.map(d => {
            return {
                date: d3.timeParse("%Y-%m-%d")(d.key),
                value: d.values.length
            }
        })

        console.log('data', data);

        // let data = [
        //     {
        //         date: d3.timeParse("%Y-%m-%d")('2019-09-09'),
        //         value: 4
        //     },
        //     {
        //         date: d3.timeParse("%Y-%m-%d")('2019-09-15'),
        //         value: 8
        //     },
        //     {
        //         date: d3.timeParse("%Y-%m-%d")('2019-09-19'),
        //         value: 5
        //     },
        //     {
        //         date: d3.timeParse("%Y-%m-%d")('2019-09-26'),
        //         value: 3
        //     }
        // ]

        var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, width ]);
            svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.value; })])
            .range([ height, 0 ]);
            svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#2d3e50")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
                )
    }
}

</script>

<style lang='scss'>

#all-games-chart {
    display:flex;
    align-items:center;
    justify-content:center;

    .guide {
        padding: 30px;

        h3 {
            padding: 15px 30px;
            font-weight: bold;
            color: #fff;

            &:first-child {
                background: #2d3e50;
            }

            &:last-child {
                background: #ff5963;
            }
        }
    }
}
</style>