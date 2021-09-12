<script setup>
import { useSimulation } from "../composables/use-simulation";
import { sign } from "../utils";
import { computed, toRefs, reactive, watch } from "vue";
import { isEqual, cloneDeep } from "lodash-es";

const props = defineProps({
  round: Object,
  fee: [String, Number],
});

const emit = defineEmits(["update"]);
const original = cloneDeep(props.round);

let dirty = [];

watch(
  () => props.round,
  (newRound) => {
    const r = { ...newRound };
    dirty.forEach((d) => {
      delete r[d];
    });
    Object.keys(r).forEach((k) => (round[k] = r[k]));
  }
);

const { fee } = toRefs(props);
const round = reactive({ ...props.round });

function update() {
  dirty = getChangedProperties(round, original);
  emit("update", { ...round.value, dirty: !!dirty.length });
}

function getChangedProperties(updated, old) {
  return Object.keys(updated).filter((k) => {
    if (k === "dirty") return false;
    if (typeof updated[k] === "object") {
      return !isEqual(updated[k], old[k]);
    }
    return updated[k] !== old[k];
  });
}

const { won, bear, bull, total } = useSimulation(round);
const totalFees = computed(() => parseFloat(fee.value) * -3);

const result = computed(() => {
  return total.value + totalFees.value;
});
</script>

<template>
  <div class="round" :class="{ current: !round.closeAt && !round.lockAt }">
    <div class="section">
      <h4>Round {{ round.id }}</h4>
      <div class="field">
        <input
          v-model.number="round.up"
          @input="update"
          placeholder="up"
          class="up"
        />x
      </div>
      <div class="field">
        <input
          v-model.number="round.down"
          @input="update"
          placeholder="down"
          class="down"
        />x
      </div>
    </div>
    <div class="section">
      <h3>Bet</h3>
      <div class="field">
        <input
          type="number"
          v-model.number="round.bet.up"
          @input="update"
          placeholder="up"
          class="up"
          step="0.05"
        />
      </div>
      <div class="field">
        <input
          type="number"
          v-model.number="round.bet.down"
          @input="update"
          placeholder="down"
          class="down"
          step="0.05"
        />
      </div>
    </div>
    <div class="section">
      <label class="switch">
        <input type="checkbox" value="1" @change="update" v-model.number="round.status" />
        <span class="slider"></span> </label
      ><span class="round-result">{{ won }}</span>
    </div>
    <div class="section breakdown small">
      <p class="up">{{ sign(bull.toFixed(4)) }} BNB</p>
      <p class="down">{{ sign(bear.toFixed(4)) }} BNB</p>
      <p>{{ sign(totalFees.toFixed(4)) }} BNB</p>
    </div>
    <div class="section result" :class="result > 0 ? 'up' : 'down'">
      <h3>{{ result.toFixed(4) }} BNB</h3>
    </div>
  </div>
</template>

<style scoped lang="scss">
.round {
  display: flex;
  align-items: center;
  align-items: stretch;
  &.current {
    .section {
      background-color: rgb(71, 60, 90);
    }
  }
}
h4 {
  min-width: 7rem;
  margin: 0;
}
h3 {
  margin: 0;
  font-size: 1rem;
}
p {
  margin: 0;
}
input {
  max-width: 2.75rem;
}
.field {
  font-size: 0.75rem;
  margin-right: 0.5rem;
  padding: 0.25rem;
}
.section {
  display: flex;
  align-items: center;
  margin-right: 0.1rem;
  margin-bottom: 0.2rem;
  background-color: rgb(55, 47, 71);
  padding: 0.5rem;
  &.result {
    min-width: 6.5rem;
    h3 {
      text-align: right;
      width: 100%;
      color: rgb(244, 238, 255);
    }
  }
  &.result.down {
    background-color: rgb(237, 75, 158);
  }
  &.result.up {
    background-color: rgb(49, 208, 170);
  }
  &.breakdown {
    min-width: 6.5rem;
    flex-direction: column;
    align-items: flex-end;
  }
}

.round-result {
  font-size: 0.75rem;
  text-transform: uppercase;
  display: block;
  min-width: 2.5rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.4rem;
  margin-right: 0.5rem;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  display: flex;
  align-items: center;
  padding: 0.15rem;
  &:before {
    content: "";
    display: block;
    height: 80%;
    width: 26px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
}

.slider {
  background-color: rgb(237, 75, 158);
}

input:checked + .slider {
  background-color: rgb(49, 208, 170);
}

input:checked + .slider:before {
  transform: translateX(50%);
}
</style>
