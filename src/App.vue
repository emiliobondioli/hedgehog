<script setup>
import { PredictionsFetcher } from "./services/predictions";
import { useSimulation } from "./composables/use-simulation";
import { sign } from "./utils";
import { computed, ref } from "@vue/reactivity";
import Hedge from "./components/Hedge.vue";

const fetcher = new PredictionsFetcher();

const rounds = ref([]);
const fee = ref(0.0005);
const simulateLast = ref(10);

const simulationResult = computed(() => {
  return (
    rounds.value
      .filter((r) => r.lockAt)
      .slice(0, simulateLast.value)
      .map((r) => {
        const { total } = useSimulation(r);
        return total.value;
      })
      .reduce((a, b) => a + b, 0) -
    fee.value * simulateLast.value * 3
  );
});

function update() {
  fetcher.get().then((r) => {
    const rds = r.data.rounds
      ?.filter((r) => parseInt(r.totalBets) && !r.failed)
      .map((round) => ({
        ...round,
        bet: {
          up: 0.1,
          down: 0.1,
        },
        status: round.position === "Bull",
        up: round.totalAmount / round.bullAmount,
        down: round.totalAmount / round.bearAmount,
        dirty: false,
      }));
    rds.forEach((round) => {
      const old = rounds.value.find((r) => r.id === round.id);
      if (!old) rounds.value.push(round);
      else if (!old.dirty) updateRound(round);
    });
  });
}
update();
setInterval(update, 5000);

function updateRound(round) {
  const idx = rounds.value.findIndex((r) => r.id === round.id);
  rounds.value[idx] = round;
}
</script>

<template>
  <h2 class="logo">
    <img src="./assets/logo.svg" /> <span class="highlight">hedge</span>hog
  </h2>
  <div class="tools">
    <div>
      <label>Transaction fee </label
      ><input type="number" step="0.0005" v-model="fee" />
      <span class="small"> BNB</span>
      <span class="small hint">
        (will be subtracted from totals: 2 transactions for the bets and 1 to
        collect the winnings)</span
      >
    </div>
    <div>
      <label>Simulate last</label><input type="number" v-model="simulateLast" />
      <span class="small"> Rounds </span>
      <span class="small hint"> (current round is excluded)</span>
      <p>
        TOTAL
        <span :class="simulationResult >= 0 ? 'up' : 'down'"
          >{{ sign(simulationResult.toFixed(4)) }} BNB</span
        >
      </p>
    </div>
  </div>
  <Hedge
    v-for="round in rounds"
    :key="round.id"
    :round="round"
    :fee="fee"
    @update="updateRound"
  />
</template>

<style lang="scss">
body {
  background-color: rgb(38, 33, 48);
}
.up {
  color: rgb(49, 208, 170);
}
.down {
  color: rgb(237, 75, 158);
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
.hint {
  color: rgb(184, 173, 210);
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
  border: 0;
  max-width: 3.5rem;
  background: 0;
  border-bottom: 1px solid rgb(136, 136, 136);
  text-align: center;
  font-weight: bold;
}
</style>
