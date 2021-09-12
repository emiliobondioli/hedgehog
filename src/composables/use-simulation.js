import { computed, ref } from "vue";

export function useSimulation(round) {
  const won = computed(() => (round.status ? "up" : "down"));

  const bear = computed(() => {
    if (round.status) return -parseFloat(round.bet.down);
    else
      return (
        parseFloat(round.bet.down) * parseFloat(round.down) -
        parseFloat(round.bet.down)
      );
  });

  const bull = computed(() => {
    if (!round.status) return -round.bet.up;
    else return round.bet.up * round.up - round.bet.up;
  });

  const total = computed(() => {
    return bear.value + bull.value;
  });

  return { won, bear, bull, total };
}
