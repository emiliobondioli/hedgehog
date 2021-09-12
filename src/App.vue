<script setup>
import { PredictionsFetcher } from "./services/predictions";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { ref } from "@vue/reactivity";
import Hedge from "./components/Hedge.vue";

const fetcher = new PredictionsFetcher();

const rounds = ref([]);
const fee = ref(0.005);

function update() {
  fetcher.get().then((r) => {
    rounds.value = r.data.rounds
      ?.filter((r) => r.position)
      .map((round) => ({
        ...round,
        up: round.totalAmount / round.bullAmount,
        down: round.totalAmount / round.bearAmount,
      }));
  });
}
update();
setInterval(update, 5000);

function newHedge() {
  rounds.value.push({});
}
</script>

<template>
  <h2 class="logo">
    <img src="./assets/logo.svg" /> <span class="highlight">hedge</span>hog
  </h2>
  <div class="tools">
    <label>Transaction fee</label><input v-model="fee" />
    <span class="small">BNB</span>
  </div>
  <Hedge
    v-for="(round, index) in rounds"
    :key="index"
    :round="round"
    :fee="fee"
  />
</template>

<style lang="scss">
body {
  background-color: rgb(38, 33, 48);
}
.logo {
  display: flex;
  align-items: center;
  img {
    width: 3.4rem;
    display: block;
    margin-right: 0.5rem;
  }
}
h2 {
  color: rgb(184, 173, 210);
  font-weight: 900;
}
.tools {
  margin-bottom: 0.5rem;
}
.small {
  font-size: 0.75rem;
}
.highlight {
  color: rgb(244, 238, 255);
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgb(244, 238, 255);
  margin-top: 60px;
}
input {
  color: rgb(244, 238, 255);
  max-width: 2.5rem;
  border: 0;
  background: 0;
  border-bottom: 1px solid rgb(136, 136, 136);
  text-align: center;
  font-weight: bold;
}
</style>
