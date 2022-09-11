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
      { title: "ميني شيت", value: "minisheet" },
      { title: "النتائج دور اول", value: "finalMarks" },
      { title: "النتائج دور ثاني", value: "finalMarksSecondTry" },
      { title: "التقارير دور اول", value: "reports" },
      { title: "السعي", value: "notFinalMarks" },
    ],
  }),
};
</script>

<style>
</style>