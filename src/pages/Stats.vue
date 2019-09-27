<template>

    <div id="stats" class='page'>
        <h2>Game Statistics</h2>
        <div class='charts'>
            <div class='chart-container'>
                <h3>Games by difficulty</h3>
                <modes-chart v-if='loadData' :gamedata=loadData />
            </div>

            <div class='chart-container'>
                <h3>Recent games</h3>
                <all-games-chart v-if='loadData' :gamedata=loadData />
            </div>

            <div class='chart-container'>
                <h3>Active games</h3>
                <active-games-chart v-if='loadData' :gamedata=loadData />
            </div>
        </div>
    </div>

</template>


<script>

import axios from 'axios';
import ModesChart from './../components/ModesChart';
import ActiveGamesChart from './../components/ActiveGamesChart';
import AllGamesChart from './../components/AllGamesChart';

export default {
    name: 'Stats',
    components: {
        ActiveGamesChart,
        AllGamesChart,
        ModesChart
    },
    data() {
        return {
            loadData: null
        }
    },
    mounted() {
        let vm = this;

        axios.get("/api/all")
            .then(res => vm.loadData = res.data)
            .catch(e => console.log(e))
    }
}

</script>


<style lang='scss'>

#stats {
    padding: 60px 30px 30px 30px;

    .charts {
        display:flex;
        flex-wrap:wrap;
        margin-top: 30px;
        justify-content:center;

        .chart-container {
            margin: 10px;
            background: #eee;
            flex-basis: 320px;
            flex-grow: 1;
            height: 400px;
            display:flex;
            flex-direction: column;
            justify-content:space-between;
            align-items:center; 
            padding: 20px 0;
            div {
                flex-grow: 1;
                display:flex;
                align-items: center;
            }

        }   
    }
}

</style>