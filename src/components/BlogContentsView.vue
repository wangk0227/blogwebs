<template>
  <Spin fix :show="loading">
    <!-- 当前组件加载状态显示-->
    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
    <div>Loading</div>
  </Spin>
  <div style="height: 600px">
    <BlogContentDrawer></BlogContentDrawer>
    <Table border :columns="columns" :data="data">
      <template #web_doc="{ row, index }">
        <Ellipsis :text="row.web_doc" :lines="1"/>
      </template>
      <template #is_show="{ row, index }">
        <span>{{ this.state(row.is_show) }}</span>
      </template>
      <template #action="{ row, index }">
        <div>
          <Button @click="get_data_single(index,row)" type="primary" size="small" style="margin-right: 5px;">查看</Button>
          <Button type="error" size="small" @click="remove_data(index,row)">删除</Button>
        </div>
      </template>
    </Table>
    <div class="page">
      <Page :total="page_count" show-total v-on:on-change="get_data_page"/>
    </div>
  </div>
  <Drawer width="640" v-model="value" :mask-closable="false" title="查看站点信息" :styles="styles">
    <Form :model="formData" :rules="rules_blog_content">
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="QQ" label-position="top" prop='created_web_qq'>
            <Input prefix="ios-people-outline" clearable v-model="formData.created_web_qq" placeholder="请输入qq"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="邮箱" label-position="top" prop='created_web_email'>
            <Input prefix='ios-mail-open-outline' clearable v-model="formData.created_web_email" placeholder="请输入邮箱"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="是否隐藏" label-position="top">
            <Select v-model="formData.is_show">
              <Option value="Y">是</Option>
              <Option value="N">否</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="180">
        <Col span="10">
          <FormItem label="微信图片" label-position="top">
            <Button for="" icon="ios-cloud-upload-outline" @click="uploadFileWechat">点击上传微信二维码</Button>
            <input name="file" type="file" @change="update_created_web_wechat" ref="fileWechat" hidden/>
            <Text style="display: inline-block" v-text="created_web_wechat_name"></Text>
            <img :src="created_web_wechat">
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="value = false">关闭</Button>
      <Button type="success" @click="update_data" v-if="is_show">修改</Button>
      <Button type="primary" disabled v-else>修改</Button>
    </div>
  </Drawer>
</template>

<script>
import {
  get_blogger_content_all,
  get_blogger_content_page,
  delete_blogger_content,
  get_blogger_content,
  update_blogger_content
} from '../requestapi/blogger-contents-api'
import BlogContentDrawer from './drawer/BlogContentDrawer.vue'
import {BASE_URL} from '../utlis/config'


export default {
  name: "LinkView",
  inject: ['reload', 'state'],
  components: {
    BlogContentDrawer
  },
  data() {
    return {
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      loading: false,
      page_count: null,
      text: '测试数据',
      columns: [
        {
          title: '# 序号',
          key: 'index',
          sortable: true
        },
        {
          title: "邮箱",
          key: 'created_web_email',
        },
        {
          title: 'QQ',
          key: 'created_web_qq'
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
      wab_log_img: '',
      created_web_wechat: '',
      wab_log_img_name: '',
      created_web_wechat_name: '',
      formData: {
        id: '',
        web_name: '',
        web_doc: '',
        created_web_email: '',
        created_web_qq: "",
        is_show: '',
        created_web_wechat: '',
        wab_log_img: '',

      },
      value: false,
      pStyle: {
        fontSize: '16px',
        color: 'rgba(0,0,0,0.85)',
        lineHeight: '24px',
        display: 'block',
        marginBottom: '16px'
      },
      rules_blog_content: {
        web_name: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        web_doc: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        created_web_email: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        created_web_qq: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]

      },
    }
  },
  created() {
    this.get_data_all()
  },
  methods: {
    get_data_all() {
      this.loading = true
      get_blogger_content_all().then(res => {
            const res_data = res.data
            this.data = res_data.data
            this.page_count = res_data.page_data_count
            for (let i = 0; i < res_data.data.length; i++) { // 添加一个属性
              res_data.data[i].index = i + 1
            }
          }
      ).catch(error => {
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
        this.loading = false
      })
    },
    remove_data(index, row) {
      //数据删除
      this.loading = true
      const data_id = row.id
      delete_blogger_content(data_id).then(res => {
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
      get_blogger_content_page(page).then(res => {
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
    get_data_single(index, row) {
      this.value = true
      let id = row.id
      get_blogger_content(id).then(res => {
        let res_data = res.data
        this.formData = res_data.data
        this.created_web_wechat = BASE_URL + res_data.data.created_web_wechat_url
        this.formData.created_web_wechat = ''
      }).catch(error => {
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
      })
    },
    update_data() {
      let id = this.formData.id
      let formData = new FormData();
      formData.append('created_web_wechat', this.formData.created_web_wechat)
      formData.append('is_show', this.formData.is_show)
      formData.append('created_web_email', this.formData.created_web_email)
      formData.append('created_web_qq', this.formData.created_web_qq)
      if (!formData.get('created_web_wechat')) {
        formData.delete('created_web_wechat')
      }
      update_blogger_content(id, formData).then(res => {
        let res_data = res.data
        this.$Message.success({content: res_data.data, duration: 3})
      }).catch(error => {
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
        this.value = false
        this.reload()
      })

    },
    update_created_web_wechat(event) {
      event.preventDefault()
      this.formData.created_web_wechat = event.target.files[0]
      this.created_web_wechat_name = event.target.files[0].name
    },
    uploadFileWechat() {
      // 点击button触发input flie上传图片
      this.$refs.fileWechat.dispatchEvent(new MouseEvent('click'))
    },
  },
  computed: {
    is_show() {
      return !!(this.formData.created_web_email && this.formData.created_web_qq);
    }
  }
}
</script>

<style scoped>
img {
  width: 180px;
  height: 100px;
}


.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>