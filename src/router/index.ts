import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Layout from '@/views/layout/index.vue'
import Login from '@/views/Login/index.vue'
import type { Material } from '@/types'
import { useMaterialStore } from '@/stores/useMaterial'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { title: '登录' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register/index.vue'),
      meta: { title: '注册' },
    },
    {
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: '/home',
      meta: { title: '首页' },
      children: [
        {
          path: '/home',
          name: 'home',
          component: HomeView,
          meta: { title: '问卷管理' },
        },
        {
          path: '/materials',
          name: 'materials',
          component: () => import('@/views/MaterialsView/Index.vue'),
          redirect: '/select-group',
          meta: { title: '组件市场' },
          children: [
            {
              path: '/select-group',
              name: 'select-group',
              component: () => import('@/views/MaterialsView/SelectGroupView.vue'),
              redirect: '/single-select',
              meta: { title: '选择题型' },
              children: [
                {
                  path: '/single-select',
                  name: 'single-select',
                  component: () =>
                    import('@/components/SurveyComs/Materials/SelectComs/SingleSelect.vue'),
                  meta: { title: '单选题' },
                },
                {
                  path: '/multi-select',
                  name: 'multi-select',
                  component: () =>
                    import('@/components/SurveyComs/Materials/SelectComs/MultiSelect.vue'),
                  meta: { title: '多选题' },
                },
                {
                  path: '/option-select',
                  name: 'option-select',
                  component: () =>
                    import('@/components/SurveyComs/Materials/SelectComs/OptionSelect.vue'),
                  meta: { title: '下拉选择' },
                },
                {
                  path: '/single-pic-select',
                  name: 'single-pic-select',
                  component: () =>
                    import('@/components/SurveyComs/Materials/SelectComs/SinglePicSelect.vue'),
                  meta: { title: '图片单选' },
                },
                {
                  path: '/multi-pic-select',
                  name: 'multi-pic-select',
                  component: () =>
                    import('@/components/SurveyComs/Materials/SelectComs/MultiPicSelect.vue'),
                  meta: { title: '图片多选' },
                },
              ],
            },
            {
              path: '/input-group',
              name: 'input-group',
              component: () => import('@/views/MaterialsView/InputGroupView.vue'),
              redirect: '/text-input',
              meta: { title: '文本输入' },
              children: [
                {
                  path: '/text-input',
                  name: 'text-input',
                  component: () =>
                    import('@/components/SurveyComs/Materials/InputComs/TextInput.vue'),
                  meta: { title: '单行文本' },
                },
              ],
            },
            {
              path: '/advanced-group',
              name: 'advanced-group',
              component: () => import('@/views/MaterialsView/AdvancedGroupView.vue'),
              redirect: '/rate-score',
              meta: { title: '高级题型' },
              children: [
                {
                  path: '/rate-score',
                  name: 'rate-score',
                  component: () =>
                    import('@/components/SurveyComs/Materials/AdvancedComs/RateScore.vue'),
                  meta: { title: '评分题' },
                },
                {
                  path: '/date-time',
                  name: 'date-time',
                  component: () =>
                    import('@/components/SurveyComs/Materials/AdvancedComs/DateTime.vue'),
                  meta: { title: '日期时间' },
                },
              ],
            },
            {
              path: '/note-group',
              name: 'note-group',
              component: () => import('@/views/MaterialsView/NoteGroup.vue'),
              redirect: '/text-note',
              meta: { title: '备注说明' },
              children: [
                {
                  path: '/text-note',
                  name: 'text-note',
                  component: () =>
                    import('@/components/SurveyComs/Materials/NoteComs/TextNote.vue'),
                  meta: { title: '文本备注' },
                },
              ],
            },
            {
              path: '/personal-info-group',
              name: 'personal-info-group',
              component: () => import('@/views/MaterialsView/PersonalInfoGroupView.vue'),
              redirect: '/personal-info-name',
              meta: { title: '个人信息' },
              children: [
                {
                  path: '/personal-info-name',
                  name: 'personal-info-name',
                  component: () =>
                    import('@/components/SurveyComs/Materials/InputComs/TextInput.vue'),
                  meta: { title: '姓名' },
                },
                {
                  path: '/personal-info-id',
                  name: 'personal-info-id',
                  component: () =>
                    import('@/components/SurveyComs/Materials/InputComs/TextInput.vue'),
                  meta: { title: '身份证号' },
                },
                {
                  path: '/personal-info-birth',
                  name: 'personal-info-birth',
                  component: () =>
                    import('@/components/SurveyComs/Materials/AdvancedComs/DateTime.vue'),
                  meta: { title: '出生日期' },
                },
                {
                  path: '/personal-info-gender',
                  name: 'personal-info-gender',
                  component: () =>
                    import('@/components/SurveyComs/Materials/SelectComs/SingleSelect.vue'),
                  meta: { title: '性别' },
                },
                {
                  path: '/personal-info-age',
                  name: 'personal-info-age',
                  component: () =>
                    import('@/components/SurveyComs/Materials/SelectComs/SingleSelect.vue'),
                  meta: { title: '年龄' },
                },
                {
                  path: '/personal-info-education',
                  name: 'personal-info-education',
                  component: () =>
                    import('@/components/SurveyComs/Materials/SelectComs/SingleSelect.vue'),
                  meta: { title: '教育程度' },
                },
                {
                  path: '/personal-info-collage',
                  name: 'personal-info-collage',
                  component: () =>
                    import('@/components/SurveyComs/Materials/InputComs/TextInput.vue'),
                  meta: { title: '大学' },
                },
                {
                  path: '/personal-info-major',
                  name: 'personal-info-major',
                  component: () =>
                    import('@/components/SurveyComs/Materials/InputComs/TextInput.vue'),
                  meta: { title: '专业' },
                },
                {
                  path: '/personal-info-industry',
                  name: 'personal-info-industry',
                  component: () =>
                    import('@/components/SurveyComs/Materials/InputComs/TextInput.vue'),
                  meta: { title: '行业' },
                },
                {
                  path: '/personal-info-career',
                  name: 'personal-info-career',
                  component: () =>
                    import('@/components/SurveyComs/Materials/SelectComs/SingleSelect.vue'),
                  meta: { title: '职业' },
                },
                {
                  path: '/personal-info-company',
                  name: 'personal-info-company',
                  component: () =>
                    import('@/components/SurveyComs/Materials/InputComs/TextInput.vue'),
                  meta: { title: '公司' },
                },
                {
                  path: '/personal-info-position',
                  name: 'personal-info-position',
                  component: () =>
                    import('@/components/SurveyComs/Materials/InputComs/TextInput.vue'),
                  meta: { title: '职位' },
                },
              ],
            },
            {
              path: '/contact-group',
              name: 'contact-group',
              component: () => import('@/views/MaterialsView/ContactGroupView.vue'),
              redirect: '/personal-info-tel',
              meta: { title: '联系方式' },
              children: [
                {
                  path: '/personal-info-tel',
                  name: 'personal-info-tel',
                  component: () =>
                    import('@/components/SurveyComs/Materials/InputComs/TextInput.vue'),
                  meta: { title: '电话' },
                },
                {
                  path: '/personal-info-wechat',
                  name: 'personal-info-wechat',
                  component: () =>
                    import('@/components/SurveyComs/Materials/InputComs/TextInput.vue'),
                  meta: { title: '微信' },
                },
                {
                  path: '/personal-info-qq',
                  name: 'personal-info-qq',
                  component: () =>
                    import('@/components/SurveyComs/Materials/InputComs/TextInput.vue'),
                  meta: { title: 'QQ' },
                },
                {
                  path: '/personal-info-email',
                  name: 'personal-info-email',
                  component: () =>
                    import('@/components/SurveyComs/Materials/InputComs/TextInput.vue'),
                  meta: { title: '邮箱' },
                },
                {
                  path: '/personal-info-address',
                  name: 'personal-info-address',
                  component: () =>
                    import('@/components/SurveyComs/Materials/InputComs/TextInput.vue'),
                  meta: { title: '地址' },
                },
              ],
            },
          ],
        },
        {
          path: '/editor/:id(\\d+)?',
          name: 'editor',
          component: () => import('@/views/EditorView/Index.vue'),
          meta: { title: '问卷设计' },
          children: [
            {
              path: 'survey-type',
              name: 'survey-type',
              component: () => import('@/views/EditorView/LeftSide/SurveyType.vue'),
              meta: { title: '选择题型' },
            },
            {
              path: 'outline',
              name: 'outline',
              component: () => import('@/views/EditorView/LeftSide/Outline.vue'),
              meta: { title: '大纲视图' },
            },
          ],
        },
        {
          path: '/personal',
          name: 'personal',
          component: () => import('@/views/PersonalView/index.vue'),
          meta: { title: '个人中心' },
        },
        {
          path: '/aiSurvey',
          name: 'aiSurvey',
          component: () => import('@/views/AIView/index.vue'),
          meta: { title: 'AI 智能建卷' },
        },
        {
          path: '/preview/:id(\\d+)?',
          name: 'preview',
          component: () => import('@/views/Preview.vue'),
          meta: { title: '问卷预览' },
        },
        {
          path: '/quiz/:id',
          name: 'quiz',
          component: () => import('@/views/QuizView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to, _, next) => {
  const activeView = localStorage.getItem('activeView')
  const store = useMaterialStore()
  if (activeView === 'materials' && to.name) {
    store.setCurrentSurveyCom(to.name as Material)
  }
  next()
})

export default router
