<template>
  <div>
    <div class="GridTable" ref="VGrid">
      <div class="GridHead" ref="GridHead" :style="'width:'+ GridHeadWidth +'px'">
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
      <div class="GridBody" ref="GridBody" :style="'height:'+height+'px;'">
        <div
          class="GridTr"
          v-for="itemRow in RowPositionOpts"
          :key="itemRow.mtrlcode"
          :style="'height:' + itemRow.height + 'px;'+'width:'+ GridHeadWidth +'px'"
  
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
              <div class="v_border">
                <div class="v_borderLine" :style="isShowBorder"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="GridResizeLine" id="GridResizeLine"></div>
    </div>
  </div>
</template>

<script>
import { useGridOption, useGridEvent, useGridWidth } from "../hooks/index";

const {
  getColumnPositionOpts,
  getGridHeadWidth,
  getColumnOptions,
  getRowPositionOpts,
} = useGridOption();

export default {
  name: "VGrid",
  data() {
    return {
      ColumnOptions: [],
      RowPositionOpts: [],
      gridHeadClientWidth: 0,
      gridBodyClientWidth: 0,
      gridGutterWidth: 0,
    };
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    border:{
      type:Boolean,
      default:true,
    },
    rowHeight:{
      type:Number,
      default:30,
    },
    height:{
      type:Number,
    }
  },
  computed: {
    ColumnPositionOpts() {
      return getColumnPositionOpts(this.ColumnOptions);
    },
    GridHeadWidth(){
      return getGridHeadWidth(this.ColumnOptions);
    },
    isShowBorder(){
      return this.border===false?'width:0px':'width:1px'
    }
  },
  mounted() {
    //获取列配置
    this.ColumnOptions = getColumnOptions(this.$slots.default);
    //获取行配置
    this.RowPositionOpts = getRowPositionOpts(this.data, this.rowHeight);

    //获取Gutter宽度
    const { getClientWidth, getGutterWidth } = useGridWidth();
    this.gridHeadClientWidth = getClientWidth(this.$refs.GridHead);
    this.gridBodyClientWidth = getClientWidth(this.$refs.GridBody);
    this.gridGutterWidth = getGutterWidth(
      this.gridHeadClientWidth,
      this.gridBodyClientWidth
    );

    //添加表头事件
    const { onMousedown, onScrollLeft } = useGridEvent(this);
    let vnodes = document.getElementsByClassName("resize");
    this.$nextTick(function () {
      vnodes.forEach((vnode) => {
        vnode.addEventListener("mousedown", onMousedown);
      });
    });
    this.$refs.GridBody.addEventListener("scroll", onScrollLeft);

  },
  beforeDestroy() {
    const { onMousedown, onScrollLeft } = useGridEvent();
    let vnodes = document.getElementsByClassName("resize");
    vnodes.forEach((vnode) => {
      vnode.removeEventListener("mousedown", onMousedown);
    });
    this.$refs.GridBody.removeEventListener("scroll", onScrollLeft);
  },
  methods: {

  },
};
</script>

<style lang="scss" src='./index.scss' scoped/>


