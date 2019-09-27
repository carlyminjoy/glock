<template>

    <div id="active">
        <h1>{{ activeGames }}</h1>
    </div>

</template>


<script>

var d3 = require('d3');

export default {
    name: 'ActiveGamesChart',
    props: ['gamedata'],
    computed: {
        activeGames() {
            return this.gamedata.filter(g => !g.winner).length
        }
    }
}

</script>

<style lang='scss'>

#active {
    h1 {
        font-size: 90px;
        line-height: 90px;
    }
}

</style>