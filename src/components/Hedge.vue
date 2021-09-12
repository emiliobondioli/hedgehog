<script setup>
import { computed, reactive, ref, toRefs } from "vue";

const props = defineProps({
  round: Object,
  fee: [String, Number],
});

const { round, fee } = toRefs(props);

const bet = reactive({
  up: 0.1,
  down: 0.1,
});

const status = ref(round.value.position === "Bull");
const won = computed(() => (status.value ? "up" : "down"));

const bear = computed(() => {
  if (status.value) return -bet.down;
  else return bet.down * round.value.down - bet.down;
});

const bull = computed(() => {
  if (!status.value) return -bet.up;
  else return bet.up * round.value.up - bet.up;
});

const totalFees = computed(() => parseFloat(fee.value) * -2);

const result = computed(() => {
  return bear.value + bull.value + totalFees.value;
});

function sign(v) {
  if (parseFloat(v) >= 0) return "+" + v;
  return v;
}
</script>

<template>
  <div class="round">
    <div class="section">
      <h4>Round {{ round.id }}</h4>
      <div class="field">
        <input v-model="round.up" placeholder="up" class="up" />x
      </div>
      <div class="field">
        <input v-model="round.down" placeholder="down" class="down" />x
      </div>
    </div>
    <div class="section">
      <h3>Bet</h3>
      <div class="field">
        <input v-model="bet.up" placeholder="up" class="up" />
      </div>
      <div class="field">
        <input v-model="bet.down" placeholder="down" class="down" />
      </div>
    </div>
    <div class="section">
      <label class="switch">
        <input type="checkbox" value="1" v-model="status" />
        <span class="slider"></span> </label
      ><span class="round-result">{{ won }}</span>
    </div>
    <div class="section breakdown">
      <p class="up">{{ sign(bull.toFixed(4)) }}</p>
      <p class="down">{{ sign(bear.toFixed(4)) }}</p>
      <p>{{ sign(totalFees.toFixed(4)) }}</p>
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
.up {
  color: rgb(49, 208, 170);
}
.down {
  color: rgb(237, 75, 158);
}
.field {
  font-size: 0.75rem;
  margin-right: 0.5rem;
  padding: 0.25rem;
}
.section {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  margin-bottom: 0.15rem;
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
