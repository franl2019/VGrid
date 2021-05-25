<template>
  <div>
    <div class="GridTable" id="VGrid">
      <div class="GridHead">
        <div class="GridTr">
          <div
            class="GridTh"
            v-for="item in ColumnPositionOpts"
            :key="item.prop"
            :ref="item.prop"
            :style="'left:' + item.left + 'px;width:' + item.width + 'px'"
          >
            <div class="ThBox">
              <span class="text"> {{ item.label }}</span>
              <div class="resize" :data-mtrlcode="item.prop"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="GridBody">
        <div
          class="GridTr"
          v-for="itemRow in RowPositionOpts"
          :key="itemRow.mtrlcode"
          :style="'height:' + itemRow.height + 'px'"
        >
          <div
            class="GridTd"
            v-for="itemCol in ColumnPositionOpts"
            :key="itemCol.mtrlcode"
            :style="
              'left:' +
              itemCol.left +
              'px;width:' +
              itemCol.width +
              'px;height:' +
              itemRow.height +
              'px'
            "
          >
            <div class="TdBox">
              <span class="text">{{ itemRow[itemCol.prop] }}</span>
              <div class="border"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="GridResizeLine" id="GridResizeLine"></div>
    </div>
  </div>
</template>

<script>
import { useGridOption, useGridEvent } from "../hooks/index";

const {
  getColumnPositionOpts,
  getColumnOptions,
  getRowPositionOpts,
} = useGridOption();


export default {
  name: "VGrid",
  data() {
    return {
      ColumnOptions: [],
      RowPositionOpts: [],
    };
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ColumnPositionOpts() {
      return getColumnPositionOpts(this.ColumnOptions);
    },
  },
  mounted() {
    const { onMousedown } = useGridEvent(this);
    this.ColumnOptions = getColumnOptions(this.$slots.default);
    this.RowPositionOpts = getRowPositionOpts(this.data, 30);
    let vnodes = document.getElementsByClassName("resize");
    this.$nextTick(function () {
      vnodes.forEach((vnode) => {
        vnode.style.cursor = "w-resize";
        vnode.addEventListener("mousedown", onMousedown);
      });
    });
   
  },
  beforeDestroy() {
    const { onMousedown } = useGridEvent();
    let vnodes = document.getElementsByClassName("resize");
    vnodes.forEach((vnode) => {
        vnode.removeEventListener("mousedown", onMousedown);
      });
  },
  methods: {
    test(event) {
      console.log(event);
    },
  },
};
</script>

<style lang="scss" src='./index.scss' scoped/>


