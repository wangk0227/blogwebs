<template>
  <Spin fix :show="loading">
    <!-- 当前组件加载状态显示-->
    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
    <div>Loading</div>
  </Spin>
  <div style="height: 600px">
    <LinkDrawerView></LinkDrawerView>
    <Table border :columns="columns" :data="data">
      <template #link_name="{ row, index }">
        <Input type="text" v-model="link_name" v-if="editIndex === index"/>
        <span v-else>{{ row.link_name }}</span>
      </template>
      <template #link="{ row, index }">
        <Input type="text" v-model="link" v-if="editIndex === index"/>
        <span v-else>{{ row.link }}</span>
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
          <Button type="error" size="small" @click="remove_link_data(index,row)">删除</Button>
        </div>
      </template>
    </Table>
    <div class="page">
      <Page :total="page_count" show-total v-on:on-change="get_link_data_page"/>
    </div>
  </div>
</template>

<script>
import {get_link_data, get_link_data_page, delete_link_data, update_link_data} from "../requestapi/link-api"
import LinkDrawerView from './drawer/LinkDrawerView.vue'

export default {
  inject: ['reload', 'state'],
  components: {
    LinkDrawerView
  },
  data() {
    return {
      loading: false,
      editIndex: -1,
      page_count: '',
      link_name: '',
      link: '',
      is_show: '',
      columns: [
        {
          title: '# 序号',
          key: 'index',
          sortable: true
        },
        {
          title: '名称',
          slot: 'link_name'
        },
        {
          title: '网址',
          slot: 'link'
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
    remove_link_data(index, row) {
      //数据删除
      this.loading = true
      const data_id = row.id
      delete_link_data(data_id).then(res => {
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
    get_link_data_page(page) {
      // 页码切换
      this.loading = true
      get_link_data_page(page).then(res => {
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
    get_link_data_all() {
      this.loading = true
      get_link_data().then(res => {
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
    update_data_save(row, index) {
      // 修改
      this.loading = true
      let link_id = row.id
      let data = {'link_name': this.link_name, 'link': this.link, 'is_show': this.is_show}
      this.data[index].link_name = this.link_name;
      this.data[index].link = this.link;
      this.data[index].is_show = this.is_show;
      this.editIndex = -1;
      update_link_data(link_id, data).then(res => {
        const res_data = res.data
        this.$Message.success({content: res_data.data, duration: 3})
      }).catch(error => {
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
        this.loading = false
        this.reload()
      })
    },
    data_edit(row, index) {
      //操作按钮事件
      this.link_name = row.link_name;
      this.link = row.link;
      this.is_show = row.is_show;
      this.editIndex = index;
    },
  },
  created() {
    this.get_link_data_all()
  },
}
</script>
<style scoped>
</style>