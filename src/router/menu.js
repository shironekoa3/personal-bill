import IHome from '@/components/icons/IHome.vue';
import IList from '@/components/icons/IList.vue';
import ICategory from '@/components/icons/ICategory.vue';
import ITutorial from '@/components/icons/ITutorial.vue';

export default [
    {
        id: '1',
        name: '首页',
        icon: IHome,
        route: '/'
    },
    {
        id: '2',
        name: '账单列表',
        icon: IList,
        route: '/bill-list'
    },
    {
        id: '3',
        name: '分类管理',
        icon: ICategory,
        route: '/category-manager'
    },
    {
        id: '4',
        name: '账单导出教程',
        icon: ITutorial,
        route: '/tutorial'
    }
]