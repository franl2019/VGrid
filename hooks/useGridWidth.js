function useGridWidth() {

    //获取OffsetWidth
    function getOffsetWidth(element) {
        return element.offsetWidth
    }

    //获取clientWidth
    function getClientWidth(element) {
        return element.clientWidth
    }

    //Gutter插槽宽度
    function getGutterWidth(offsetWidth, clientWidth) {
        return offsetWidth - clientWidth;
    }

    return {
        getOffsetWidth,
        getClientWidth,
        getGutterWidth
    }
}

export default useGridWidth;