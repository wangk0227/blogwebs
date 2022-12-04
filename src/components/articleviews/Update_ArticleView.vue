<template>
  <Spin fix :show="loading">
    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
    <div>Loading</div>
  </Spin>
  <div>
    <Form :model="formData" :rules="rulesArticle">
      <Row :gutter="32">
        <Col span="10">
          <FormItem label="文章名称" label-position="top" prop='title'>
            <Input v-model="formData.title" placeholder="请输入文章名称"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="5">
          <FormItem label="选择文章的状态" label-position="top">
            <Select v-model="formData.recommend_state">
              <Option value="1">发布</Option>
              <Option value="0">不发布</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="5">
          <FormItem label="选择分类" label-position="top" prop="article_category">
            <Select placeholder="请选择分类" v-model="formData.article_category">
              <Option :value="item.id"
                      v-for='(item,index) in categoryList'
                      :key="index"
                      :label="item.title"
              >
              </Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="10">
          <FormItem label="文章的摘要" label-position="top">
            <Input v-model="formData.excerpt" type="textarea" :rows="1" placeholder="请输入当前文中的摘要"/>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="排序" label-position="top">
        <InputNumber v-model="formData.order" controls-outside :min="1"/>
      </FormItem>
    </Form>
    <!-- 绑定ref 调用子组件的函数获取子组件内部的值-->
    <BlogEditorView ref="getData"></BlogEditorView>
    <div class="clearfix">
      <Button class="add_btn" @click="updateData" type="success" v-if="is_show">点击修改</Button>
      <Button class="add_btn" type="success" disabled v-else>点击修改</Button>
    </div>
  </div>
</template>

<script>
import BlogEditorView from '../editor/BlogEditorView.vue'
import {get_category_all} from '../../requestapi/category-api'
import {get_articles, update_articles} from '../../requestapi/articles-api'

export default {
  components: {
    BlogEditorView
  },

  data() {
    return {
      loading: false,
      articles_id: '',
      formData: {
        title: '',
        excerpt: '',
        order: 1,
        recommend_state: '',
        article_category: '',
        content: '',
      },
      categoryList: [],
      rulesArticle: {
        title: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        article_category: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]

      }
    };
  },
  methods: {
    updateData() {
      this.loading = true
      let dateText = this.$refs.getData.getDateText()
      let dataHtml = this.$refs.getData.getDataHtml()
      let getHeader = this.$refs.getData.getHeader()
      let type_name = ''
      let dic = []
      for (let index = 0; index < getHeader.length; index++) {
        if (getHeader[index].type === 'header1') {
          dic.push(
              {'type': 'h1', 'content': getHeader[index].children[0].text, child: []}
          )
          type_name = getHeader[index].type
        } else if (getHeader[index].type === 'header2') {
          if (dic.length > 0 && dic[dic.length - 1].type === 'h1') {
            dic[dic.length - 1].child.push(
                {'type': 'h2', 'content': getHeader[index].children[0].text,'index':0}
            )
          } else {
            dic.push(
                {'content': getHeader[index].children[0].text,'index':0}
            )
          }
          type_name = getHeader[index].type
        }
      }
      if (!dateText) {
        this.$Message.error({content: '博客主体内容不能为空!', duration: 3})
        return
      }
      if (!this.formData.excerpt) {
        this.formData.excerpt = dateText.substr(0, 240)
      }
      this.formData.content = dataHtml.replaceAll('<pre>','<pre class="line-numbers">')
      this.formData.header = JSON.stringify(dic) // 锚点
      update_articles(this.articles_id, this.formData).then(res => {
        let res_data = res.data
        this.$Message.success({content: res_data.data, duration: 3})
        this.$router.push({ // 修改成功跳转会文章列表
          name: 'AdminArticles'
        })
      }).catch(error => {
        this.$Message.success({content: error, duration: 3})
      }).finally(() => {
        this.loading = false
      })

    },
    getCategory() { //获取文章分类
      get_category_all().then(res => {
        let res_data = res.data
        this.categoryList = res_data.data
      }).catch(error => {
        this.$Message.error({content: '获取分类失败!', duration: 3})
      }).finally(() => {

      })
    },
    getDataSingle(id) {
      get_articles(id).then(res => {
        let res_data = res.data
        this.formData = res_data.data
        this.formData.recommend_state = res_data.data.recommend_state.toString()
        this.$refs.getData.saveDataHtml(this.formData.content)
      }).catch(error => {
        this.$Message.error({content: '获取分类失败!', duration: 3})
      }).finally(() => {
        this.loading = false
      })
    }
  },
  created() {
    this.articles_id = this.$route.query.articles_id
    this.loading = true
    this.getCategory()
    this.getDataSingle(this.articles_id)
  },
  computed: {
    is_show() {
      return !!(this.formData.title && this.formData.article_category)
    }
  }
};
</script>
<style scoped>
.add_btn {
  margin-top: 10px;
  float: right;
}

</style>