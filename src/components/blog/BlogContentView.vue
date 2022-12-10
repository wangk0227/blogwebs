<template>
  <Row v-if="is_show">
    <Col :xs="6" :sm="6" :md="6" :lg="5" class="left">
      <div class="left-content">
        <ul>
          <li v-for="(parentValue,parentIndex) in headerH1_H5" :key="parentIndex"
            >
            <a href='javascript:void(0)'
               :class='{active: parentIndex === isActive }' @click="parentItem(parentIndex),goAnchor(parentValue.type,parentValue.content)">
              {{ parentValue.content }}</a>
            <dl v-if="parentValue.child.length> 0">
              <dd v-for="(childValue,childIndex) in parentValue.child" :key="childIndex"
                  >
                <a href='javascript:void(0)'
                   :class="{active: headerH1_H5[parentIndex].child[childIndex].content === isChildActive && parentIndex === isParentActive }"
                   @click="childItem(parentIndex,childIndex),goAnchor(childValue.type,childValue.content)">
                  {{ childValue.content }}
                </a>
              </dd>
            </dl>
          </li>
        </ul>
      </div>
    </Col>
    <Col :xs="18" :sm="18" :md="18" :lg="19" class="content">
      <div class="blog-title">
        <Title :level="3" class="title">{{ title }}</Title>
        <div class="other">{{ create_date_time }} <span>|</span> {{ category }} <span>|</span>
          {{ article_read_num }} 阅读
        </div>
      </div>
      <!-- 博客内容     -->
      <div v-html="content"></div>
      <div class="original">
        <strong>原文作者:</strong>
        作者名称
        <hr>
        <strong>版本声明:</strong>
        本作品采用
        <a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/">知识共享署名-非商业性使用-禁止演绎 4.0 国际许可协议</a>
        非商业转载请注明出处,商业转载请联系作者获得授权。
      </div>
    </Col>
  </Row>
</template>

<script>
import '../../assets/prism.css'
import Prism from '../../assets/prism.js'
import '../../assets/blog/blogcontent.css'
import {get_article_content} from '../../requestapi/bolg-index-api'


export default {
  name: "BlogContentView",
  data() {
    return {
      isActive: -1, // 默认选中
      isChildActive: -1, // 2层循环默认选中
      isParentActive: -1, // 2层
      create_date_time: '',
      title: '',
      content: '',
      category: '',
      article_read_num: '',
      headerH1_H5: [],
      is_show:true,

    }
  },
  methods: {
    getContent(article_id) {
      this.$Loading.start();
      get_article_content(article_id).then(res => {
        let res_data = res.data
        if (res_data.data.header) {
          this.headerH1_H5 = JSON.parse(res_data.data.header) // 锚点
        } else {
          this.headerH1_H5 = []
        }
        this.title = res_data.data.title
        this.category = res_data.data.category
        this.content = res_data.data.content
        this.article_read_num = res_data.data.article_read_num
        this.create_date_time = res_data.data.create_date_time
        this.$emit('loadingCountFunc', 'ok') // 处理 父路由中loading 加载效果
        this.$nextTick(() => {
          Prism.highlightAll(); // 代码高亮
        })
      }).catch(error => {
        this.$router.push({
          name: 'error_500'
        })
      }).finally(() => {
        this.$Loading.finish();
      })
    },
    parentItem(index) {
      // 标签默认样式
      this.isActive = index
      this.isChildActive = -1
      this.isParentActive = -1
      return false
    },
    childItem(parentIndex, childIndex) {
      this.isChildActive = this.headerH1_H5[parentIndex].child[childIndex].content
      this.isParentActive = parentIndex
      this.isActive = -1
      return false
    },
    // 跳转到指定的锚点
    goAnchor(types, val) {
      let logotype = types + '-' + val
      let anchor = document.getElementById(logotype);
      // chrome
      document.body.scrollTop = anchor.offsetTop;
      // firefox
      document.documentElement.scrollTop = anchor.offsetTop;
      // safari
      window.pageYOffset = anchor.offsetTop;
    }
  },
  created() {
    let article_id = this.$route.query.article_id
    if (article_id) {
      this.getContent(article_id)
    } else {
      this.is_show = false
    }
  }
}
</script>

<style scoped>
</style>