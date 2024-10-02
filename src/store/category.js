import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { list as listCategory } from '@/api/category'


export const useCategoryStore = defineStore('category', () => {
    let state = reactive({
        categories: [{
            "id": 1,
            "name": "正在加载...",
            "description": "饮食",
            "createTime": "2023-01-01 00:00:00",
            "updateTime": "2023-01-01 00:00:00",
            "isDeleted": false
        }],
    })

    const getCategories = async () => {
        if (state.categories.length === 1 && state.categories[0].name === '正在加载...') {
            await listCategory().then(resp => {
                if (resp.code !== 200) {
                    ElMessage.error(resp.msg)
                } else {
                    state.categories = resp.data
                }
            })
        }
        return state.categories
    }

    return { state, getCategories }
})
