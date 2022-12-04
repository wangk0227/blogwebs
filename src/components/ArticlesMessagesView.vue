<template>
  <Spin fix :show="loading">
    <!-- 当前组件加载状态显示-->
    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
    <div>Loading</div>
  </Spin>
  <div style="height: 600px">
    <Table border :columns="columns" :data="data">
      <template #message_content="{ row, index }">
        <Ellipsis :text="row.message_content" :lines="1"/>
      </template>
      <template #action="{ row, index }">
        <div>
          <Button type="primary" size="small" style="margin-right: 5px" @click="view_data(row,index)">查看</Button>
          <Button type="error" size="small" @click="remove_data(index,row)">删除</Button>
        </div>
      </template>
    </Table>
    <div class="page">
      <Page :total="page_count" show-total v-on:on-change="get_data_page"/>
    </div>
  </div>
  <Modal v-model="modal" ok-text="关闭" cancel-text sticky scrollable :mask="false">
    <Divider><span v-text="name"></span></Divider>
    <div v-text="message_content"></div>
  </Modal>

</template>

<script>
import {get_message_all, delete_message_all, get_message_page} from '../requestapi/articles-message-api'

export default {
  inject: ['reload'],
  components: {},
  data() {
    return {
      loading: false,
      editIndex: -1,
      page_count: '',
      modal: false,
      columns: [
        {
          title: '# 序号',
          key: 'index',
          sortable: true
        },
        {
          title: '留言人',
          key: 'message_name',

        },
        {
          title: '创建时间',
          key: 'create_date_time'
        },
        {
          title: "留言文章",
          key: 'article',
        },
        {
          title: '留言内容',
          slot: 'message_content',
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }
      ],
      data: [],
      name: '',
      message_content: '',
    }
  },
  methods: {
    get_data_all() {
      // this.loading = true
      get_message_all().then(res => {
        const data = res.data
        if (data.code === 200) {
          this.data = data.data
          this.page_count = data.page_data_count
          for (let i = 0; i < data.data.length; i++) { // 添加一个属性
            data.data[i].index = i + 1
          }
        } else {
          this.$Message.error({content: data.error, duration: 3})
        }
      }).catch(error => {
      }).finally(() => {
        this.loading = false
      })
    },
    remove_data(index, row) {
      //数据删除
      this.loading = true
      const data_id = row.id
      delete_message_all(data_id).then(res => {
        const data = res.data

        this.data.splice(index, 1);
        this.$Message.success({content: data.data, duration: 3})

      }).catch(error => {
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
        this.loading = false
        this.reload()
      })
    },
    get_data_page(page) {
      // 页码切换
      this.loading = true
      get_message_page(page).then(res => {
        const data = res.data
        this.data = data.data
        this.page_count = data.page_data_count
        for (let i = 0; i < data.data.length; i++) { // 添加一个属性
          data.data[i].index = i + 1
        }

      }).catch(error => {
      }).finally(() => {
        this.loading = false
      })
    },
    view_data(row, index) {
      this.name = row.message_name
      this.message_content = row.message_content
      this.modal = true
    },

  },
  created() {
    this.get_data_all()
  },
}
</script>
<style scoped>
</style>