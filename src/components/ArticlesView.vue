<template>
  <Spin fix :show="loading">
    <!-- 当前组件加载状态显示-->
    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
    <div>Loading</div>
  </Spin>
  <div style="height: 600px">
    <Button type="primary" class="btn_create" @click="addArticle">新增文章</Button>
    <Table border :columns="columns" :data="data">
      <template #excerpt="{row,index}">
        <Ellipsis :text="row.excerpt" :lines="1"/>
      </template>
      <template #recommend_state="{ row, index }">
        <span>{{ State(row.recommend_state) }}</span>
      </template>
      <template #action="{ row, index }">
        <div>
          <Button type="primary" size="small" style="margin-right: 5px" @click="updateArticle(row,index)">查看</Button>
          <Button type="error" size="small" @click="modal = true">删除</Button>
          <Modal v-model="modal" width="360">
            <template #header>
              <p style="color:#ff6600;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>删除文章</span>
              </p>
            </template>
            <div style="text-align:center">
              <p>删除后文章无法进行恢复!</p>
              <p>确定删除吗?</p>
            </div>
            <template #footer>
              <Button type="error" size="large" long :loading="model_loading" @click="remove_data(row,index)">确定删除
              </Button>
            </template>
          </Modal>
        </div>
      </template>
    </Table>
    <div class="page">
      <Page :total="page_count" show-total v-on:on-change="get_articles_data_page"/>
    </div>
  </div>
</template>

<script>
import {get_articles_all, delete_articles, get_data_page} from '../requestapi/articles-api'


export default {
  name: "ArticlesView",
  inject: ['reload'],
  data() {
    return {
      loading: false,
      modal: false,
      page_count: 10,
      model_loading: false,
      columns: [{
        title: '# 序号',
        key: 'index',
        sortable: true
      },
        {
          title: '文章名称',
          key: 'title',
        },
        {
          title: '摘要',
          slot: 'excerpt',
        },
        {
          title: '创建时间',
          key: 'create_date_time'
        },
        {
          title: "归属分类",
          key: 'article_category_name',
        },
        {
          title: '修改时间',
          key: 'update_date_time',
        },
        {
          title: '是否发布',
          slot: 'recommend_state',
          filters: [
            {
              label: '未发布',
              value: 0
            },
            {
              label: '已发布',
              value: 1
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 0) {
              return row.recommend_state === 0;
            } else if (value === 1) {
              return row.recommend_state === 1;
            }
          }
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data: [],
    }
  },
  created() {
    this.get_data_all()
  },
  methods: {
    get_articles_data_page(page) {
      this.loading = true
      get_data_page(page).then(res => {
        const data = res.data
        this.data = data.data
        this.page_count = data.page_data_count
        for (let i = 0; i < data.data.length; i++) { // 添加一个属性
          data.data[i].index = i + 1
        }
      }).catch(error => {
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
        this.loading = false
      })

    },
    get_data_all() {
      get_articles_all().then(res => {
        let res_data = res.data
        this.data = res_data.data
        this.page_count = res_data.page_data_count
        for (let i = 0; i < res_data.data.length; i++) { // 添加一个属性
          res_data.data[i].index = i + 1
        }

      }).catch(error => {
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
        this.loading = false
      })
    },
    remove_data(row, index) {
      this.model_loading = true;
      let data_id = row.id
      delete_articles(data_id).then(res => {
        const data = res.data
        this.data.splice(index, 1);
        this.$Message.success({content: data.data, duration: 3})
      }).catch(error => {
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
        this.model_loading = false;
        this.modal = false;
        this.reload()
      })
    },
    State(val) {
      // 显示状态
      if (val === 1) {
        return '已发布'
      } else {
        return '未发布'
      }
    },
    updateArticle(row, index) {
      this.$router.push({
        name: 'Update_AdminCategory',
        query: {'articles_id': row.id}

      })
    },
    addArticle() {
      this.$router.push({
        name: 'Add_AdminCategory',
      })
    }
  }
}
</script>

<style scoped>
.btn_create {
  margin-bottom: 8px;
}
</style>