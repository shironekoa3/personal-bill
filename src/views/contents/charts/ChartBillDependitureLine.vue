<script setup>
import { reactive, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts';

let props = defineProps({
    data: {
        type: Array,
        default: []
    }
})

let state = reactive({
    isChartLoading: false,
})

let myChart;
let option = {
    color: ["#3398DB"],
    title: {
        text: '每日支出',
        subtext: '',
        left: 'center',
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow"
        }
    },
    toolbox: {
        feature: {
            saveAsImage: {
                title: '保存为图片'
            },
        }
    },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        animationDuration: 300,
        animationDurationUpdate: 300,
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
        }
    ]
};

async function getRealData() {
    state.isChartLoading = true
    option.xAxis.data = props.data[0]
    option.series[0].data = props.data[1]
    initChart();
    state.isChartLoading = false
}

watch(() => props.data, (newValue, oldValue) => {
    // console.log('Props Value changed:', newValue);
    getRealData()
});

onMounted(() => {
    // 添加窗口监视
    getRealData()
    window.addEventListener('resize', refreshChart)
})

onUnmounted(() => {
    // 卸载监视
    window.removeEventListener('resize', refreshChart)
})

function initChart() {
    // 加载图表
    let chartDom = document.getElementById('dependiture');
    if (echarts.getInstanceByDom(chartDom)) {
        echarts.getInstanceByDom(chartDom).dispose()
    }
    myChart = echarts.init(chartDom);
    option && myChart.setOption(option);
    state.isChartLoading = false
}
function refreshChart() {
    if (myChart) {
        myChart.resize()
    }
}
</script>

<template>
    <div id="dependiture">

    </div>
</template>

<style scoped>
#dependiture {
    width: 100%;
    height: 100%;
}
</style>
