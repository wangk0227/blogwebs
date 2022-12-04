<template>
  <Row class="content" v-show="is_show">
    <Col :xs="6" :sm="6" :md="6" :lg="5" class="content-left">
    </Col>
    <Col :xs="18" :sm="18" :md="18" :lg="19" class="content-main">
      <ul>
        <li v-for='(value,key) in article_list' class="article-content">
          <Title :level="3" class="content-title" @click="getArticleDetails(value.id)">
            {{value.title}}</Title>
          <Text type="secondary" class="content-unimportant">{{ value.create_date_time }} <span>|</span>
            {{ value.category }}
          </Text>
          <Paragraph ellipsis="true" class="content-body" :ellipsis-config="{ rows: 2, }">
            {{ value.excerpt }}
          </Paragraph>
        </li>
      </ul>
      <div class="index-page">
        <Page :total=total @on-change="indexPage"/>
      </div>
    </Col>
  </Row>
</template>

<script>

import '../../assets/blog/blogview.css'
import {
  get_article,
  get_article_page,
  get_article_search,
  get_article_search_page,
  get_category_article
} from '../../requestapi/bolg-index-api'


export default {
  data() {
    return {
      is_show: true,
      article_list: [],
      total: '',
      search: '', // 搜索结果,需要将结果变为get参数携带到后端去
    }
  },
  name: "BlogIndexView",
  methods: {
    getArticle() {
      this.$Loading.start();
      get_article().then(res => {
        let res_data = res.data
        if (res_data.data.length === 0) {
          this.is_show = false
        } else {
          this.article_list = res_data.data
          this.total = res_data.data_count
        }
        this.$emit('loadingCountFunc', 'ok') // 处理 父路由中loading 加载效果
      }).catch(error => {
        this.$router.push({
          name: 'error_500'
        })
      }).finally(() => {
        this.$Loading.finish();
      })
    },
    indexPage(page) {
      this.$Loading.start();
      if (this.search) { // 如果有搜索结果,需要将数据发给搜索的接口中
        get_article_search_page(this.search, page).then(res => {
          let res_data = res.data
          this.article_list = res_data.data
          this.total = res_data.page_data_count
        }).catch(error => {
          this.$router.push({
            name: 'error_500'
          })
        }).finally(() => {
          this.$Loading.finish();
        })
      } else {
        get_article_page(page).then(res => {
          let res_data = res.data
          this.article_list = res_data.data
          this.total = res_data.data_count
        }).catch(error => {
          this.$router.push({
            name: 'error_500'
          })
        }).finally(() => {
          this.$Loading.finish();
        })
      }
    },
    getSearchArticle(search) {
      this.$Loading.start();
      get_article_search(search).then(res => {
        let res_data = res.data
        if (res_data.data.length > 0) {
          this.article_list = res_data.data
          this.total = res_data.page_data_count
        } else {
          this.is_show = false
        }
      }).catch(error => {
        this.$router.push({
          name: 'error_500'
        })
      }).finally(() => {
        this.$Loading.finish();
      })
    },
    categoryArticle(category_id) {
      this.$Loading.start();
      // 根据分类id 获取
      get_category_article(category_id).then(res => {
        let res_data = res.data
        if (res_data.data.length === 0){
          this.is_show = false
        }else {
          this.article_list = res_data.data
          this.total = res_data.data_count
        }

      }).catch(error => {
        this.$router.push({
          name: 'error_500'
        })
      }).finally(() => {
        this.$Loading.finish();
      })
    },
    // 查看文章详情
    getArticleDetails(article_id) {
      this.$router.push({
        name: "BlogArticleDetails",
        query: {'article_id': article_id}
      })
    }
  },
  created() {
    let category_id = this.$route.query.category_id
    let search = this.$route.query.search
    if (category_id) {
      this.categoryArticle(category_id)
    } else if (search) {
      this.getSearchArticle(search)
    } else {
      this.getArticle()
    }
  },
}
</script>

<style scoped>

</style>