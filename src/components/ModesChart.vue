<template>

    <div id="modes-chart">
        <!-- <svg
            :height='height'
            :width='width'>

            <path style="fill: none" stroke="black" d="M0 20 L150 150 L300 100 L450 20 L600 130"></path>

        </svg> -->
        <div class="guide">
            <p>Easy</p>
            <p>Hard</p>
        </div>
        <div id='modes'></div>
    </div>

</template>


<script>

var d3 = require('d3');

export default {
    name: 'ModesChart',
    props: ['gamedata'],
    computed: {
        winnerData() {
            let vm = this;

            if (!vm.gamedata) return [];

            let lineData = d3.nest()
                .key(d => d.winner)
                .entries(vm.gamedata);

            return lineData.map(o => { 
                return {
                    winner: o.key, 
                    amount: o.values.length 
                }
            });
        }
    },
    data() {
        return {
            height: 300,
            width: 300,
            margin: 30
        }
    },
    mounted() {
        let vm = this;

        let radius = Math.min(vm.width, vm.height) / 2 - vm.margin;

        let svg = d3.select("#modes")
            .append("svg")
                .attr("width", vm.width)
                .attr("height", vm.height)
            .append("g")
                .attr("transform", "translate(" + vm.width / 2 + "," + vm.height / 2 + ")");

        let data = {
            easy: vm.gamedata.filter(g => g.mode == 'easy').length,
            hard: vm.gamedata.filter(g => g.mode == 'hard').length
        }

        let color = d3.scaleOrdinal()
            .domain(data)
            .range(["#2d3e50", "#ff5963"])

        let pie = d3.pie()
            .value(d => d.value)

        let data_ready = pie(d3.entries(data))

        svg
            .selectAll('div')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
            )
            .attr('fill', d => color(d.data.key) )
    }
}

</script>

<style lang='scss'>

#modes-chart {
    display:flex;
    align-items:center;
    justify-content:center;

    .guide {
        padding: 30px;
        display:flex;
        flex-direction:column;

        p {
            padding: 5px 10px;
            font-weight: bold;
            color: #fff;
            margin: 10px;

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