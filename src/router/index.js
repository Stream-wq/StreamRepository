import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import('@/views/index')
const Home = () => import('@/views/home')//首页
const Project = () => import('@/views/project/project')

//协议
const Service = () => import('@/views/treaty/service')
const RulesService = () => import('@/views/treaty/rulesTreaty')

//用户相关
const ForgetPassword = () => import('@/views/user/forgetPassword')
const SafeVerify = () => import('@/views/user/safeValid')
const ResetPassword = () => import('@/views/user/resetPassword')
const ModifyPassword = () => import('@/views/user/modifyPassword')
const SalePassword = () => import('@/views/user/salePassword')
const MemberCenter = () => import('@/views/user/userCenter')
const KYC = () => import('@/views/user/memberPage/KYC')
const Security = () => import('@/views/user/memberPage/userSecurity')
const ModifyBind = () => import('@/views/user/modifyBindAccount')
const Invite = () => import('@/views/user/memberPage/invite')
const TRT = () => import('@/views/user/memberPage/TRT')

//人才
const Personnel = () => import("@/views/person/personnel")
const ExpertDetail = () => import("@/views/person/expertDetail")
const MyExpert = () => import("@/views/person/myExpert")
const MyInfo = () => import("@/views/person/expert/myinfo")
const Favor = () => import("@/views/person/expert/Favor")

//钱包
const Wallet = () => import('@/views/wallet/wallet')
const Recharge = () => import('@/views/wallet/recharge')
const Withdraw = () => import('@/views/wallet/withdraw')
const Address = () => import('@/views/wallet/address')
const ProjectCheckout = () => import('@/views/wallet/shop')

//举报
const Report = () => import('@/views/report/report')

//其他
const Question = () => import('@/views/other/question')
const Support = () => import('@/views/other/support')
const Notfount = () => import('@/views/error')//404
const Activity = () => import('@/views/other/activity')//404

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      name: 'error',
      component: Notfount
    },
    {
      path: '/',
      name: 'Index',
      redirect: '/home',
      component: Index,
      children: [
        {
          path: '/home',
          name: 'Home',
          component: Home,
          meta:{keepAlive: true,}
        },
        {
          path: '/project/:id',
          name: 'Project',
          component: Project,
        },
        {
          path: '/service',
          name: 'Service',
          component: Service
        },
        {
          path: '/rules',
          name: 'RulesService',
          component: RulesService
        },
        {
          path: '/forget/:type',
          name: 'ForgetPassword',
          component: ForgetPassword
        },
        {
          path: '/forget/:type/reset',
          name: 'ResetPassword',
          component: ResetPassword,
          meta: {isLevel: true, level: '/forget'}
        },
        {
          path: '/verify/:type',
          name: 'SafeVerify',
          component: SafeVerify,
          meta: {requiresAuth: true}
        },
        {
          path: '/modify/:type',
          name: 'ModifyPassword',
          component: ModifyPassword,
          meta: {requiresAuth: true}
        },
        {
          path: '/modifybind/:type',
          name: 'ModifyBind',
          component: ModifyBind,
          meta: {requiresAuth: true}
        },
        {
          path: '/salepwd',
          name: 'SalePassword',
          component: SalePassword,
          meta: {requiresAuth: true}
        },
        {
          path: '/member',
          redirect: '/member/KYC',
          name: 'MemberCenter',
          component: MemberCenter,
          meta: {requiresAuth: true},
          children: [
            {
              path: '/member/KYC',
              name: 'KYC',
              component: KYC,
              meta: {requiresAuth: true},
            },
            {
              path: '/member/security',
              name: 'Security',
              component: Security,
              meta: {requiresAuth: true},
            },
            {
              path: '/member/invite',
              name: 'Invite',
              component: Invite,
              meta: {requiresAuth: true},
            },
            {
              path: '/member/TRT',
              name: 'TRT',
              component: TRT,
              meta: {requiresAuth: true}
            }
          ]
        },
        {
          path: '/personnel',
          name: 'Personnel',
          component: Personnel,
          meta:{keepAlive: true,}
        },
        {
          path: '/personnel/detail/:id',
          name: 'ExpertDetail',
          component: ExpertDetail,
        },
        {
          path: '/experts',
          name: 'MyExpert',
          redirect: '/personnel/experts',
          component: MyExpert,
          meta: {requiresAuth: true},
          children: [
            {
              path: '/personnel/experts',
              name: 'MyInfo',
              component: MyInfo,
              meta: {requiresAuth: true},
            },
            {
              path: '/personnel/favor',
              name: 'Favor',
              component: Favor,
              meta: {requiresAuth: true},
            }
          ]
        },
        {
          path: '/wallet',
          name: 'Wallet',
          component: Wallet
        },
        {
          path: '/wallet/recharge',
          name: 'Recharge',
          component: Recharge,
          meta: {requiresAuth: true},
        },
        {
          path: '/wallet/withdraw',
          name: 'Withdraw',
          component: Withdraw,
          meta: {requiresAuth: true},
        },
        {
          path: '/wallet/address',
          name: 'Address',
          component: Address,
          meta: {requiresAuth: true},
        },
        {
          path: '/wallet/projectcheckout/:pid',
          name: 'ProjectCheckout',
          component: ProjectCheckout,
          meta: {requiresAuth: true}
        },
        {
          path: '/report',
          name: 'Report',
          component: Report
        },
        {
          path: '/question',
          name: 'Question',
          component: Question
        },
        {
          path: '/support',
          name: 'Support',
          component: Support
        },
        {
          path: '/activity/:id',
          name: 'Activity',
          component: Activity
        }
      ]
    },

  ],
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})
