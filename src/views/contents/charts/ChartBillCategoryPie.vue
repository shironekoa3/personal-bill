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
    title: {
        text: '支出构成图',
        subtext: '',
        left: 'center',
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        bottom: 10,
        width: '55%',
        left: 'center',
        data: ['饮食', '交通', '日常', 'CityC', 'CityE', 'CityC2', 'CityC4', 'CityC3']
    },
    series: [
        {
            type: 'pie',
            radius: '60%',
            name: '支出构成图',
            center: ['50%', '45%'],
            selectedMode: 'single',
            data: [
                { value: 1548, name: '饮食' },
                { value: 735, name: '交通' },
                { value: 510, name: '日常' },
                { value: 434, name: 'CityC' },
                { value: 434, name: 'CityC2' },
                { value: 434, name: 'CityC3' },
                { value: 434, name: 'CityC4' },
                { value: 335, name: 'CityE' }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

async function getRealData() {
    state.isChartLoading = true
    option.title.text = props.data[0] + '总支出: ' + props.data[1]
    option.legend.data = props.data[2]
    if (option.legend.data?.length === 1 && option.legend.data[0] === 'undefined')
        option.legend.data = []
    option.series[0].name = props.data[0] + ': '
    option.series[0].data = props.data[3]
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
    let chartDom = document.getElementById('main');
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
    <div id="main">

    </div>
</template>

<style scoped>
#main {
    width: 100%;
    height: 100%;
}
</style>
