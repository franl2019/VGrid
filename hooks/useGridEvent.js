import { useGridOption } from "../hooks/index";
const { updateColumnOpts } = useGridOption();

function useGridEvent(vm) {

    let columnName = "";
    let gridLeft = 0;
    let resizeWidth = 0;
    let lastColumnWidth = 0;

    function onMousedown(event) {

        columnName = event.target.dataset.mtrlcode;
        let VGrid = document.getElementById('VGrid')
        VGrid.style.userSelect = 'none';
        gridLeft = VGrid.getBoundingClientRect().left;
        let resizeLeft = event.target.getBoundingClientRect().left;
        lastColumnWidth = vm.$refs[columnName][0].getBoundingClientRect().left;
        resizeWidth = resizeLeft - gridLeft;
        setResizeState({
            isShow: true,
            width: resizeWidth
        });

        window.addEventListener("mousemove", onMousemove);
        window.addEventListener("mouseup", onMouseup);
    }


    function onMouseup() {
        window.removeEventListener("mousemove", onMousemove);
        document.getElementById('VGrid').style.userSelect = '';
        setResizeState({
            isShow: false,
            width: 0
        });
        vm.ColumnOptions = updateColumnOpts(vm.ColumnOptions, columnName, resizeWidth);

        if (resizeWidth !== 0) {
            columnName = "";
            gridLeft = 0;
            resizeWidth = 0;
            lastColumnWidth = 0;
        }
        window.removeEventListener("mouseup", onMouseup);
    }

    //鼠标移动事件
    function onMousemove(event) {
        let gridLeft = document.getElementById('VGrid').getBoundingClientRect().left;
        let resizeClientLeft = event.pageX - gridLeft
        let resizeLine = resizeClientLeft- lastColumnWidth + gridLeft
        resizeWidth = resizeLine<30?30:resizeLine
        setResizeState({
            isShow: true,
            width: resizeClientLeft
        });
    }

    function setResizeState(options) {
        let reSizeLineElement = document.getElementById('GridResizeLine')
        reSizeLineElement.style.display = options.isShow == true ? 'block' : 'none';
        reSizeLineElement.style.left = `${options.width}px`;
    }

    return {
        onMousedown,
        onMouseup
    }
}

export default useGridEvent;