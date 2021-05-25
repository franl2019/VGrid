function useGridOption() {

    //获取列配置项
    function getColumnOptions(columnVNodeList) {
        let columnOptions = []
        for (let index = 0; index < columnVNodeList.length; index++) {
            const columnVNode = columnVNodeList[index];
            if(!columnVNode.componentOptions)break;
            const columnProp = columnVNode.componentOptions.propsData;
          
            if (columnProp) {
                if (!columnProp.width) {
                    columnProp.width = 200
                }
                columnOptions.push(columnProp);
            }

        }
        return columnOptions
    }

    //计算各列的位置
    function getColumnPositionOpts(columnOptions) {
        //累计宽度
        let beforeWidth = 0
        for (let index = 0; index < columnOptions.length; index++) {
            const columnOpt = columnOptions[index];
            columnOpt.left = beforeWidth;
            beforeWidth = beforeWidth + columnOpt.width;
        }
        return columnOptions
    }

    //计算各行的位置
    function getRowPositionOpts(data,rowHeight) {
        let rowPositionOpts = JSON.parse(JSON.stringify(data))
        if(!rowHeight){
            rowHeight = 25;
        }
   
        for (let index = 0; index < rowPositionOpts.length; index++) {
            const row = rowPositionOpts[index];
            row.height = rowHeight;
        }

        return rowPositionOpts
    }

    function updateColumnOpts(columnOpts,columnName,columnWidth) {
        columnOpts.forEach(columnOpt => {
            if(columnOpt.prop === columnName){
                columnOpt.width = columnWidth
            }
        });
        return columnOpts
    }
    return {
        getColumnOptions,
        getColumnPositionOpts,
        getRowPositionOpts,
        updateColumnOpts
    }
}

export default useGridOption;