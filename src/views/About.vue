<template>
  <div>hahah</div>
</template>
<script lang='tsx'>
import { Vue } from "vue-class-component";
import { onMounted } from "vue";
import { dialogConfirm } from "@/decorator/index";
export default class About extends Vue {
  mounted() {
    this.getData();
  }

  @dialogConfirm("info", "急急急急急急")
  getData() {
    console.log("data");
  }
}
</script>
