import { MULTI_STATUS } from '../type/index'
function useGridMultiSelect() {

    //添加选中到数组
    function select(selectionItem, selectionList) {
        const valueType = Object.prototype.toString.call(selectionItem);

        if (valueType !== "[object Object]") {
            return;
        }

        for (let index = 0; index < selectionList.length; index++) {

            const rowItem = selectionList[index];
            if (rowItem === selectionItem) {
                return;
            }
        }

        selectionList.push(selectionItem) //= [...selectionList, selectionItem];
    }

    //取消选择
    function deselect(selectionItem, selectionList) {

        for (let index = 0; index < selectionList.length; index++) {

            const selection = selectionList[index];
            if (selection === selectionItem) {
                selectionList.splice(index, 1);
            }
        }
    }

    //全选
    function selectAll(selectionList, allList) {

        const valueType = Object.prototype.toString.call(allList);

        if (valueType === "[object Array]") {
            selectionList.push(...allList);
        }
    }


    //获取选择状态
    function getMultiStatus(selectionList, gridDataList) {

        if (selectionList.length === 0) {
            return MULTI_STATUS.UNCHECKED;
        } else if (gridDataList.length === selectionList.length) {
            return MULTI_STATUS.SELECT_ALL;
        } else if (selectionList.length > 0 && gridDataList.length > selectionList.length) {
            return MULTI_STATUS.SELECT;
        }
    }

    function switchCheckBox(isChecked) {

        const boxlist = document.getElementsByClassName("checkbox");

        for (let index = 0; index < boxlist.length; index++) {
            const box = boxlist[index];
            box.checked = isChecked;
        }

    }

    function switchAllCheckBox(newValue) {

        const masterSwitch = document.getElementsByClassName("checkbox")[0];

        switch (newValue) {
            case MULTI_STATUS.UNCHECKED:
                masterSwitch.checked = false;
                break;
            case MULTI_STATUS.SELECT:
                masterSwitch.checked = false;
                break;
            case MULTI_STATUS.SELECT_ALL:
                masterSwitch.checked = true;
                break;
            default:
                break;
        }

    }

    return {
        select,
        selectAll,
        deselect,
        getMultiStatus,
        switchCheckBox,
        switchAllCheckBox
    }
}

export default useGridMultiSelect;