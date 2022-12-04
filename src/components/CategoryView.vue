<template>
  <Spin fix :show="loading">
    <!-- 当前组件加载状态显示-->
    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
    <div>Loading</div>
  </Spin>
  <div style="height: 600px">
    <CategoryDrawerView></CategoryDrawerView>
    <Table border :columns="columns" :data="data">
      <template #title="{ row, index }">
        <Input type="text" v-model="title" v-if="editIndex === index"/>
        <span v-else>{{ row.title }}</span>
      </template>
      <template #category_doc="{ row, index }">
        <Input v-model="category_doc" maxlength="255" show-word-limit type="textarea" placeholder="请输入关于当前分类的介绍"
               style="width: 190px" v-if="editIndex === index"/>
        <Ellipsis :text="row.category_doc" :lines="1" v-else/>
      </template>
      <template #is_show="{ row, index }">
        <RadioGroup v-if="editIndex === index" v-model="is_show">
          <Radio label='Y'>隐藏</Radio>
          <Radio label='N'>不隐藏</Radio>
        </RadioGroup>
        <span v-else>{{ this.state(row.is_show) }}</span>
      </template>
      <template #action="{ row, index }">
        <div v-if="editIndex === index">
          <Button type="success" size="small" @click="update_data_save(row,index)" class="btn_save">保存</Button>
          <Button type="warning" size="small" @click="editIndex = -1">取消</Button>
        </div>
        <div v-else>
          <Button type="primary" size="small" style="margin-right: 5px" @click="data_edit(row,index)">编辑</Button>
          <Button type="error" size="small" @click="remove_data(index,row)">删除</Button>
        </div>
      </template>
    </Table>
    <div class="page">
      <Page :total="page_count" show-total v-on:on-change="get_category_data_page"/>
    </div>
  </div>
</template>

<script>
import {
  get_category_all,
  delete_category_data,
  update_category_data,
  get_category_data_page
} from "../requestapi/category-api"
import CategoryDrawerView from './drawer/CategoryDrawerView.vue'

export default {
  inject: ['reload', 'state'],
  components: {
    CategoryDrawerView
  },
  data() {
    return {
      loading: false,
      editIndex: -1,
      page_count: '',
      title: '',
      is_show: '',
      category_doc: '',
      columns: [
        {
          title: '# 序号',
          key: 'index',
          sortable: true
        },
        {
          title: '分类标题',
          slot: 'title',

        },
        {
          title: '创建时间',
          key: 'create_date_time'
        },
        {
          title: "分类简介",
          slot: 'category_doc',
        },
        {
          title: '是否隐藏',
          slot: 'is_show',
          filters: [
            {
              label: '否',
              value: 0
            },
            {
              label: '是',
              value: 1
            }
          ],
          filterMultiple: false,
          filterMethod(value, row) {
            if (value === 1) {
              return row.is_show === 'Y';
            } else if (value === 0) {
              return row.is_show === 'N';
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
  methods: {
    get_data_all() {
      this.loading = true
      get_category_all().then(res => {
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
    update_data_save(row, index) {
      // 修改
      this.loading = true
      let category_id = row.id
      let data = {'title': this.title, 'category_doc': this.category_doc, 'is_show': this.is_show}
      this.data[index].title = this.title;
      this.data[index].category_doc = this.category_doc;
      this.data[index].is_show = this.is_show;
      this.editIndex = -1;
      update_category_data(category_id, data).then(res => {
        const res_data = res.data
        this.$Message.success({content: res_data.data, duration: 3})
      }).catch(error => {
        console.log(error)
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
        this.loading = false
        this.reload()
      })
    },
    remove_data(index, row) {
      //数据删除
      this.loading = true
      const data_id = row.id
      delete_category_data(data_id).then(res => {
        const data = res.data
        this.data.splice(index, 1);
      }).catch(error => {
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
        this.loading = false
        this.reload()
      })
    },
    get_category_data_page(page) {
      // 页码切换
      this.loading = true
      get_category_data_page(page).then(res => {
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
    data_edit(row, index) {
      //操作按钮事件
      //操作按钮事件
      this.title = row.title;
      this.is_show = row.is_show;
      this.category_doc = row.category_doc;
      this.editIndex = index;
    },
  },
  created() {
    this.get_data_all()
  },
}
</script>
<style scoped>
</style>