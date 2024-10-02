import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'


let defaultStart = new Date();
defaultStart.setDate(1);
defaultStart.setHours(0, 0, 0, 0)
let defaultEnd = new Date();
defaultEnd.setHours(23, 59, 59)


export const useBillStore = defineStore('bill', () => {
    let state = reactive({
        searchDate: [defaultStart, defaultEnd],
        rawData: [],
        tableFilterData: [],
        filterText: ''
    })

    const allExpenditure = computed(() => {
        let temp = 0;
        state.tableFilterData.forEach(i => {
            temp += Number(i.expenditure)
        })
        return temp.toFixed(2);
    })
    const allIncome = computed(() => {
        let temp = 0;
        state.tableFilterData.forEach(i => {
            temp += Number(i.income)
        })
        return temp.toFixed(2);
    })
    const allBillCount = computed(() => {
        let temp = 0;
        state.tableFilterData.forEach(i => {
            temp += i.detail.length
        })
        return temp;
    })


    return { state, allExpenditure, allIncome, allBillCount }
})
