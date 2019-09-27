<template>

    <div id="stats">
        <modes-chart v-if='loadData' :gamedata=loadData />
        <all-games-chart v-if='loadData' :gamedata=loadData />
    </div>

</template>


<script>

import axios from 'axios';
import ModesChart from './../components/ModesChart';
// import ActiveGamesChart from './../components/ActiveGamesChart';
import AllGamesChart from './../components/AllGamesChart';

export default {
    name: 'Stats',
    components: {
        // ActiveGamesChart,
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