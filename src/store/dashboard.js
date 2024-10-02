import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'


export const useDashboardStore = defineStore('dashboard', () => {
    let state = reactive({
        firstLoad: true,
        recent12Months: [],
        rangeStart: '',
        rawBillList: [],
        billList: [],
        pieData: [],
        lineData: []
    })
    return { state }
})
