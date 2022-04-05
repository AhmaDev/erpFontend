<template>
  <v-select
    hide-details
    outlined
    dense
    :value="type"
    :items="items"
    item-value="value"
    item-text="title"
    @change="$router.push('/' + $event + '/' + id)"
  ></v-select>
</template>

<script>
export default {
  props: ["id", "type"],
  data: () => ({
    items: [
      { title: "ماستر شيت", value: "mastersheet" },
      { title: "النتائج دور اول", value: "finalMarks" },
    ],
  }),
};
</script>

<style>
</style>