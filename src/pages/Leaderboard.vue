<template>
    <div class="leaderboard-container page">
        <h1>Leaderboard</h1>

        <ol>
            <li v-for='result in orderedResults' :key='result._id'>
                <strong>{{ result.winner }}</strong> 
                beat {{ result.player1.username == result.winner ? result.player2.username : result.player1.username }} 
                - {{ result.round }} rounds
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
            let unique = [];
            this.results.forEach(r => {
                let complete = r.winner;
                let exists = unique.find(u => {
                    return u.winner == r.winner
                    && u.loser == r.loser
                    && u.mode == r.mode
                    && u.round == r.round
                })
                if (!exists && complete) unique.push(r)
            })
            return unique.sort(this.compare);
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
        axios.get("/api/all")
            .then(res => vm.results = res.data)
            .catch(e => console.log(e))
    }
};
</script>


<style lang='scss'>
.leaderboard-container {
    padding: 60px;
    ol {
        width: 360px;
        margin: 30px auto;
        text-align:left;
    }
}
</style>
