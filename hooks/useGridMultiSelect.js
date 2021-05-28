import { MULTISTATUS } from '../type/index'
function useGridMultiSelect() {

    //多选数组
    let MultiSelectList = [];

    //添加选中到数组
    function addMultiSelectItem(colItem) {
        const valueType = Object.prototype.toString.call(colItem)
        //是否为数组
        if (valueType !== "[object Object]") {
            return;
        }
        MultiSelectList.push(colItem);
    }

    //取消选择
    function delectMultiItem(colTarget, colItem) {
        for (let index = 0; index < MultiSelectList.length; index++) {
            const multi = MultiSelectList[index];
            if (multi[colTarget] === colItem[colTarget]) {
                MultiSelectList.splice(index, 1)
            }

        }
    }

    //全选
    function allSelect(multiSelectItems) {
        const valueType = Object.prototype.toString.call(multiSelectItems)
        if (valueType === "[object Array]") {
            MultiSelectList = JSON.parse(JSON.stringify(multiSelectItems));
            for (let index = 0; index < multiSelectItems.length; index++) {
                const multiSelectItem = multiSelectItems[index];
                multiSelectItem.isClick = true
            }
        }
    }

    //获取多选数组
    function getMultiSelectList() {
        return MultiSelectList
    }

    //取消全选
    function delectAll(list) {
        MultiSelectList.length = 0
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            item.isClick = false
        }
    }

    //获取选择状态
    function getMultiStatus(gridArray) {
        if (MultiSelectList.length === 0) {
            return MULTISTATUS.UNCHECKED
        } else if (gridArray.length === MultiSelectList.length) {
            return MULTISTATUS.SELECT_ALL
        } else if (MultiSelectList.length > 0) {
            return MULTISTATUS.SELECT
        }
    }

    return {
        addMultiSelectItem,
        allSelect,
        delectMultiItem,
        getMultiSelectList,
        delectAll,
        getMultiStatus
    }
}

export default useGridMultiSelect;