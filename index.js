import VGrid from "./src";
import VGridColumn from './src/Grid-Column';

VGrid.install = Vue => {
    Vue.component(VGrid.name,VGrid)
    Vue.component(VGridColumn.name,VGridColumn)
}

export default VGrid;