<template>
  <div>
    <div class="GridTable" ref="VGrid">
      <!-- Head -->
      <div class="GridHead" ref="GridHead" :style="GridHeadWidth">
        <div class="GridTr">
          <div
            class="GridTh"
            v-for="(item, index) in ColumnPositionOpts"
            :key="item.prop"
            :ref="item.prop"
            :style="'left:' + item.left + 'px;width:' + item.width + 'px'"
          >
            <div class="ThBox">
              <div v-if="index === 0" class="checkbox_container">
                <input
                  type="checkbox"
                  class="checkbox"
                  @click="onTotalCheckBox"
                />
              </div>
              <span class="text"> {{ item.label }}</span>
              <div class="resize" :data-mtrlcode="item.prop"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Body -->
      <div class="GridBody" ref="GridBody" :style="'height:' + height + 'px;'">
        <div
          class="GridTr"
          v-for="rowItem in data"
          :key="rowItem.mtrlcode"
          :style="'height:' + rowHeight + 'px;' + GridHeadWidth"
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
              rowHeight +
              'px'
            "
          >
            <div class="TdBox">
              <div v-if="index === 0" class="checkbox_container">
                <input
                  class="checkbox"
                  type="checkbox"
                  @click="onCheckBox($event, rowItem)"
                />
              </div>
              <span class="text">{{ rowItem[colItem.prop] }}</span>
              <div class="v_border">
                <div class="v_borderLine" :style="borderWidth"></div>
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
import { MULTI_SElECT_STATUS } from "../type/index";

import {
  useGridOption,
  useGridWidth,
} from "../hooks/index";

const {
  getColumnPositionOpts,
  getGridHeadWidth,
  getColumnOptions,
  updateColumnOpts
} = useGridOption();

import {
  select,
  selectAll,
  deselect,
  getMultiStatus,
  switchCheckBox,
  switchAllCheckBox,
} from '../hooks/useGridMultiSelect';

export default {
  name: "VGrid",
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
  data() {
    return {
      columns: [],
      selectionList: [],
      gridGutterWidth: 0,
      //用于判断是否Y轴滚动
      scrollLeft: 0,
      //点击列名
      columnName: "",
      //表格外边距
      marginLeft: 0,
      //列调节后的宽度
      resizeWidth: 0,
      //点中列到表格左边框的宽度
      boundingClientRectLeft: 0,
    };
  },
  watch: {
    multiStatus: function (newValue) {
      switchAllCheckBox(newValue);
    },
  },
  computed: {
    multiStatus() {
      return getMultiStatus(this.selectionList, this.data);
    },
    ColumnPositionOpts() {
      return getColumnPositionOpts(this.columns);
    },
    GridHeadWidth() {
      return `width:${getGridHeadWidth(this.columns)}px`;
    },
    borderWidth() {
      return this.border === false ? "width:0px" : "width:1px";
    },
  },
  created() {},
  mounted() {
    //获取列配置
    this.columns = getColumnOptions(this.$slots.default);

    //获取Gutter宽度
    const { getClientWidth, getGutterWidth } = useGridWidth();
    this.gridGutterWidth = getGutterWidth(
      getClientWidth(this.$refs.GridHead),
      getClientWidth(this.$refs.GridBody)
    );

    let vnodes = document.getElementsByClassName("resize");
    this.$nextTick(function () {
      vnodes.forEach((vnode) => {
        vnode.addEventListener("mousedown", this.onMousedown);
      });
    });
    this.$refs.GridBody.addEventListener("scroll", this.onScrollLeft);
  },

  beforeDestroy() {
    let vnodes = document.getElementsByClassName("resize");
    vnodes.forEach((vnode) => {
      vnode.removeEventListener("mousedown", this.onMousedown);
    });
    this.$refs.GridBody.removeEventListener("scroll", this.onScrollLeft);
  },

  methods: {
    //多选按钮点击事件
    onCheckBox(event, selectionItem) {
      const checked = event.target.checked;
      if (checked === false) {
        deselect(selectionItem, this.selectionList);
        this.selectionchange();
      } else if (checked === true) {
        select(selectionItem, this.selectionList);
        this.selectionchange();
      }
    },

    //全选按钮点击事件
    onTotalCheckBox() {
      switch (this.multiStatus) {
        case MULTI_SElECT_STATUS.UNCHECKED:

          this.selectionList = selectAll(this.data);
          this.selectionchange();
          switchCheckBox(true);
          break;

        case MULTI_SElECT_STATUS.SELECT:
          this.selectionList = selectAll(this.data);
          this.selectionchange();
          switchCheckBox(true);
          break;

        case MULTI_SElECT_STATUS.SELECT_ALL:
          this.selectionList = [];
          this.selectionchange();
          switchCheckBox(false);
          break;

        default:
          break;
      }
    },

    //多选选项变化事件
    selectionchange() {
      this.$emit("selectionchange", this.selectionList);
    },

    //鼠标按下调节宽度
    onMousedown(event) {
      //获取调节列名
      this.columnName = event.target.dataset.mtrlcode;
      //调节时避免选中文字，临时取消选区文字
      this.$refs.VGrid.style.userSelect = "none";
      this.marginLeft = this.$refs.VGrid.getBoundingClientRect().left;
      let resizeLeft = event.target.getBoundingClientRect().left;
      this.boundingClientRectLeft = this.$refs[
        this.columnName
      ][0].getBoundingClientRect().left;
      this.resizeWidth = resizeLeft - this.marginLeft;

      window.addEventListener("mousemove", this.onMousemove);
      window.addEventListener("mouseup", this.onMouseup);
    },

    //鼠标松开事件
    onMouseup() {
      window.removeEventListener("mousemove", this.onMousemove);
      this.$refs.VGrid.style.userSelect = "";
      this.setResizeState({
        isShow: false,
        width: 0,
      });
      this.columns = updateColumnOpts(
        this.columns,
        this.columnName,
        this.resizeWidth
      );

      if (this.resizeWidth !== 0) {
        this.columnName = "";
        this.marginLeft = 0;
        this.resizeWidth = 0;
        this.boundingClientRectLeft = 0;
      }
      window.removeEventListener("mouseup", this.onMouseup);
    },

    //鼠标移动事件
    onMousemove(event) {
      let gridLeft = this.$refs.VGrid.getBoundingClientRect().left;
      let resizeClientLeft = event.pageX - gridLeft;
      let resizeLine =
        resizeClientLeft - this.boundingClientRectLeft + gridLeft;
      this.resizeWidth = resizeLine < 50 ? 50 : resizeLine;
      this.setResizeState({
        isShow: true,
        width: resizeClientLeft,
      });
    },

    //更新参考线位置
    setResizeState(options) {
      let reSizeLineElement = document.getElementById("GridResizeLine");
      reSizeLineElement.style.display =
        options.isShow == true ? "block" : "none";
      reSizeLineElement.style.left = `${options.width}px`;
    },

    //滚动条事件
    onScrollLeft() {
      let gridBodyElement = this.$refs.GridBody;
      let gridHeadElement = this.$refs.GridHead;
      let tbodyScrollLeft = gridBodyElement.scrollLeft;
      if (tbodyScrollLeft === 0) {
        gridHeadElement.style.transform = `translateX(0px)`;
      } else {
        gridHeadElement.style.transform = `translateX(-${
          tbodyScrollLeft - 4
        }px)`; //css偏移（.resize::after right:4）
      }

      //判断是否Y轴滚动
      if (this.scrollLeft !== tbodyScrollLeft) {
        gridHeadElement.scrollLeft = tbodyScrollLeft;
        this.scrollLeft = tbodyScrollLeft;
      }
    },
  },
};
</script>

<style lang="scss" src='./index.scss' scoped/>


