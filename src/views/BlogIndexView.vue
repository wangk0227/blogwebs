<template>
  <div class="layout-base">
    <Layout>
      <Header class="layout-header">
        <Row>
          <Col span="16" offset="4">
            <div class="header-title">
              <h1 class="title" @click="reloadIndex">
                KaiXin
              </h1>
            </div>
            <span>本站内容仅供参考和学习</span>
            <div class="header-search">
              <Input search enter-button placeholder="全站搜索(请搜索文章名称)" @on-search="searchEnter" v-model="search"/>
            </div>
          </Col>
        </Row>
      </Header>
      <div class="header-fixed"></div>
      <Content class="layout-content">
        <Row>
          <Col  :xs="19" :sm="19" :md="19" :lg="20">
            <router-view :key="$route.fullPath" @loadingCountFunc="loadingFunc"></router-view>
          </Col>
          <Col  :xs="5" :sm="5" :md="5" :lg="4" class="content-right content-public">
            <div class="right-main">
              <div class="about">
                <div class="about-title">联系我</div>
                <div class="about-main" style="">
                  <img :src="my_content.created_web_wechat"/>
                  <div>QQ:{{ my_content.created_web_qq }}</div>
                  <div>email:{{ my_content.created_web_email }}
                  </div>
                </div>
              </div>
              <div class="public">
                <div class="public-title">分类</div>
                <div class="public-main">
                  <ul>
                    <li v-for='(value,key) in category_list'
                        @click="getCategoryData(value.id)">{{ value.title }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="public">
                <div class="public-title">最近文章</div>
                <div class="public-main">
                  <ul>
                    <li v-for='(value,key) in recent_category_list'
                        @click="getRecentArticleData(value.id)">{{ value.title }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="public">
                <div class="public-title">其他链接</div>
                <div class="public-main">
                  <ul>
                    <li v-for='(value,key) in link_list'>
                      <a :href="value.link">{{ value.link_name }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Content>
      <Footer class="layout-footer">
        <Row>
          <Col span="16" offset="4" class="footer-col">
            <GlobalFooter :copyright="copyright"/>
          </Col>
        </Row>
      </Footer>
    </Layout>
    <BackTop :height="50" :bottom="80" :duration="5000">
      <div class="top">回到顶部</div>
    </BackTop>
  </div>
</template>
<script>
import '../assets/blog/blogindexview.css'
import {BASE_URL} from '../utlis/config'
import {get_blogger_content, get_category, get_recent_article, get_links} from '../requestapi/bolg-index-api'


export default {
  components: {},
  inject: ['reload'],
  data() {
    return {
      search: '',
      my_content: {
        created_web_qq: "",
        created_web_email: '',
        created_web_wechat: '',
      }, // 关于我的信息
      category_list: [], // 分类
      recent_category_list: [], //最近文章
      link_list: [],
      copyright: '', // 脚注信息
      sites: '',
      loadingCount: 5, // 计算loading 5次请求
    }
  },

  methods: {
    getFootnote() {
      let date = new Date()
      this.copyright = 'Copyright © 2022-' + date.getFullYear() + ' ' + 'Kaixin  豫ICP备2022026717号-1'
    },
    // 获取关于我的信息
    getMyContent() {
      get_blogger_content().then(res => {
        let res_data = res.data
        this.my_content = res_data.data
        this.my_content.created_web_wechat = BASE_URL + this.my_content.created_web_wechat
        this.loadingCount--
      }).catch(error=>{
        this.$router.push({
          name:'error_500'
        })
      })
    },
    // 获取分类信息
    getCategory() {
      get_category().then(res => {
        let res_data = res.data
        this.category_list = res_data.data
        this.loadingCount--
      }).catch(error=>{
        this.$router.push({
          name:'error_500'
        })
      })
    },
    // 根据分类的id获取当前分类下的全部文章数据
    getCategoryData(category_id) {
        this.$router.push({
          name: "BlogIndex",
          query: {'category_id': category_id}
        })
    },
    // 获取最近添加文章
    getRecentArticle() {
      get_recent_article().then(res => {
        let res_data = res.data
        this.recent_category_list = res_data.data
        this.loadingCount--
      }).catch(error=>{
        this.$router.push({
          name:'error_500'
        })
      })
    },
    // 根据最近添加文章id，查看详情页面
    getRecentArticleData(article_id) {
      this.$router.push({
        name: "BlogArticleDetails",
        query: {'article_id': article_id}
      })

    },
    // 获取友情链接
    getLink() {
      get_links().then(res => {
        let res_data = res.data
        this.link_list = res_data.data
        this.loadingCount--
      }).catch(error=>{
        this.$router.push({
          name:'error_500'
        })
      })
    },
    // 搜索内容
    searchEnter() {
      this.$router.push({
        name: "BlogIndex",
        query: {'search': this.search}
      })
    },
    // 访问首页 # 部署到项目中时,需要修改为当前路由
    reloadIndex() {
      location.href = '/'
    },
    // 只要子路由数据返回成功就会直行当前函数
    loadingFunc(data) {
      this.loadingCount--
    },

  },

  created() {
    this.$Loading.start(); // 设置进度条
    this.getFootnote()
    this.getMyContent()
    this.getCategory()
    this.getRecentArticle()
    this.getLink()
  },
  watch: {
    loadingCount: function (newVal, oldVal) {
      if (newVal === 0) {
        this.$Loading.finish();
      } else {
        this.$Loading.error();
      }
    },
  }
}
</script>
<style scoped>

</style>