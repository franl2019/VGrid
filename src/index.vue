<template>
  <div>
    <div class="GridTable" ref="VGrid">
      <div
        class="GridHead"
        ref="GridHead"
        :style="'width:' + GridHeadWidth + 'px'"
      >
        <div class="GridTr">
          <div
            class="GridTh"
            v-for="(item, index) in ColumnPositionOpts"
            :key="item.prop"
            :ref="item.prop"
            :style="'left:' + item.left + 'px;width:' + item.width + 'px'"
          >
            <div class="ThBox">
              <div v-if="index === 0" class="checkbox">
                <input type="checkbox" value="false" @click="headMultiSelect" />
              </div>
              <span class="text"> {{ item.label }}</span>
              <div class="resize" :data-mtrlcode="item.prop"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="GridBody" ref="GridBody" :style="'height:' + height + 'px;'">
        <div
          class="GridTr"
          v-for="rowItem in RowPositionOpts"
          :key="rowItem.mtrlcode"
          :style="
            'height:' + rowItem.height + 'px;' + 'width:' + GridHeadWidth + 'px'
          "
        >
          <div
            class="GridTd"
            v-for="(colItem, index) in ColumnPositionOpts"
            :key="colItem.mtrlcode"
            :style="
              'left:' +
              colItem.left +
              'px;width:' +
              colItem.width +
              'px;height:' +
              rowItem.height +
              'px'
            "
          >
            <div class="TdBox">
              <div v-if="index === 0" class="checkbox">
                <input
                  type="checkbox"
                  v-model="rowItem.isClick"
                  @click="addMultiList(colItem.prop, rowItem)"
                />
              </div>
              <span class="text">{{ rowItem[colItem.prop] }}</span>
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
import { MULTISTATUS } from "../type/index";

import {
  useGridOption,
  useGridEvent,
  useGridWidth,
  useGridMultiSelect,
} from "../hooks/index";

const {
  getColumnPositionOpts,
  getGridHeadWidth,
  getColumnOptions,
  getRowPositionOpts,
} = useGridOption();

const {
  addMultiSelectItem,
  getMultiSelectList,
  delectMultiItem,
  getMultiStatus,
  allSelect,
  delectAll,
} = useGridMultiSelect();

export default {
  name: "VGrid",
  data() {
    return {
      ColumnOptions: [],
      RowPositionOpts: [],
      gridHeadClientWidth: 0,
      gridBodyClientWidth: 0,
      gridGutterWidth: 0,
      multiStatus: 0,
    };
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    border: {
      type: Boolean,
      default: true,
    },
    rowHeight: {
      type: Number,
      default: 30,
    },
    height: {
      type: Number,
    },
  },
  computed: {
    ColumnPositionOpts() {
      return getColumnPositionOpts(this.ColumnOptions);
    },
    GridHeadWidth() {
      return getGridHeadWidth(this.ColumnOptions);
    },
    isShowBorder() {
      return this.border === false ? "width:0px" : "width:1px";
    },
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

    //列多选按钮
    addMultiList(colTarget, colItem) {
      if (colItem.isClick) {
        delectMultiItem(colTarget, colItem);
        this.$emit("selectionchange", getMultiSelectList());
      } else if (!colItem.isClick) {
        addMultiSelectItem(colItem);
        this.$emit("selectionchange", getMultiSelectList());
      }
    },

    //表头多选按钮
    headMultiSelect() {
      this.multiStatus = getMultiStatus(this.RowPositionOpts);
      switch (this.multiStatus) {

        case MULTISTATUS.UNCHECKED:
          allSelect(this.RowPositionOpts);
          this.$emit("selectionchange", getMultiSelectList());
          break;

        case MULTISTATUS.SELECT_ALL:
          delectAll(this.RowPositionOpts);
          this.$emit("selectionchange", getMultiSelectList());
          break;

        case MULTISTATUS.SELECT:
          allSelect(this.RowPositionOpts);
          this.$emit("selectionchange", getMultiSelectList());
          break;

        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" src='./index.scss' scoped/>


