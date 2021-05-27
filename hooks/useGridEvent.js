import { useGridOption } from "../hooks/index";
const { updateColumnOpts } = useGridOption();

function useGridEvent(vm) {

    //用于判断是否Y轴滚动
    let nowScrollLeft = 0;

    let columnName = "";
    //表格外边距
    let gridLeft = 0;
    //列调节后的宽度
    let resizeWidth = 0;
    //点中列到表格左边框的宽度
    let lastColumnWidth = 0;

    //鼠标按下调节宽度
    function onMousedown(event) {
        
        //获取调节列名
        columnName = event.target.dataset.mtrlcode;
        //调节时避免选中文字，临时取消选区文字
        vm.$refs.VGrid.style.userSelect = 'none';
        gridLeft = vm.$refs.VGrid.getBoundingClientRect().left;
        let resizeLeft = event.target.getBoundingClientRect().left;
        lastColumnWidth = vm.$refs[columnName][0].getBoundingClientRect().left;
        resizeWidth = resizeLeft - gridLeft;

        window.addEventListener("mousemove", onMousemove);
        window.addEventListener("mouseup", onMouseup);
    }

    //鼠标松开事件
    function onMouseup() {
        window.removeEventListener("mousemove", onMousemove);
        vm.$refs.VGrid.style.userSelect = '';
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
        let gridLeft = vm.$refs.VGrid.getBoundingClientRect().left;
        let resizeClientLeft = event.pageX - gridLeft
        let resizeLine = resizeClientLeft - lastColumnWidth + gridLeft
        resizeWidth = resizeLine<50?50:resizeLine
        setResizeState({
            isShow: true,
            width: resizeClientLeft
        });
    }

    //更新参考线位置
    function setResizeState(options) {
        let reSizeLineElement = document.getElementById('GridResizeLine')
        reSizeLineElement.style.display = options.isShow == true ? 'block' : 'none';
        reSizeLineElement.style.left = `${options.width}px`;
    }

    //滚动条事件
    function onScrollLeft() {
      
        let gridBodyElement = vm.$refs.GridBody;
        let gridHeadElement = vm.$refs.GridHead;
        let tbodyScrollLeft = gridBodyElement.scrollLeft;
        if(tbodyScrollLeft === 0){
            gridHeadElement.style.transform = `translateX(0px)`;
        }else{
            gridHeadElement.style.transform = `translateX(-${tbodyScrollLeft - 4}px)`;//css偏移（.resize::after right:4）
        }
        
        //判断是否Y轴滚动
        if (nowScrollLeft !== tbodyScrollLeft) {
            gridHeadElement.scrollLeft = tbodyScrollLeft;
            nowScrollLeft = tbodyScrollLeft;
        }
    }

    return {
        onMousedown,
        onScrollLeft
    }
}

export default useGridEvent;