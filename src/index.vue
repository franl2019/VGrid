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
import { MULTI_STATUS } from "../type/index";

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
} = useGridOption();

const {
  select,
  selectAll,
  deselect,
  getMultiStatus,
  switchCheckBox,
  switchAllCheckBox,
} = useGridMultiSelect();

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
        case MULTI_STATUS.UNCHECKED:
          selectAll(this.selectionList, this.data);
          this.selectionchange();
          switchCheckBox(true);
          break;

        case MULTI_STATUS.SELECT:
          selectAll(this.selectionList, this.data);
          this.selectionchange();
          switchCheckBox(true);
          break;

        case MULTI_STATUS.SELECT_ALL:
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

  },
};
</script>

<style lang="scss" src='./index.scss' scoped/>


