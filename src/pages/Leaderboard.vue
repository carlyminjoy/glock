<template>
    <div class="leaderboard-container">
        <h1>Leaderboard</h1>

        <ol>
            <li v-for='result in orderedResults' :key='result._id'>
                <strong>{{ result.winner }}</strong> beat {{ result.loser }} - {{ result.round }} rounds
            </li>
        </ol>
    </div>
</template>


<script>
import Game from "./../components/Game.vue";
import Chat from "./../components/Chat.vue";
import axios from 'axios';

export default {
    name: "Play",
    components: {
        Game,
        Chat
    },
    computed: {
        orderedResults() {
            if (!this.results) return [];
            return this.results.sort(this.compare);
        }
    },
    data() {
        return {
            results: null
        }
    },
    methods: {
        compare( a, b ) {
            if ( a.round < b.round ){
                return 1;
            }
            if ( a.round > b.round ){
                return -1;
            }
            return 0;
        }
    },
    mounted() {
        let vm = this;
        axios.get("/api/leaderboard")
            .then(res => vm.results = res.data)
            .catch(e => console.log(e))
    }
};
</script>


<style lang='scss'>
.leaderboard-container {
    ol {
        text-align:left;
    }
}
</style>
