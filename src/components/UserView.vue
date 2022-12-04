<template>
  <Spin fix :show="loading">
    <!-- 当前组件加载状态显示-->
    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
    <div>Loading</div>
  </Spin>
  <div style="height: 600px">
    <UserDrawer></UserDrawer>
    <Table border :columns="columns" :data="data">
      <template #name="{ row, index }">
        <span>{{ row.name }}</span>
      </template>
      <template #username="{ row, index }">
        <span>{{ row.username }}</span>
      </template>
      <template #is_show="{ row, index }">
        <span>{{ this.state(row.is_show) }}</span>
      </template>
      <template #role="{ row, index }">
        <span> {{ row.role }} </span>
      </template>
      <template #action="{ row, index }">
        <Button type="primary" @click="get_data_single(index,row)" size="small" style="margin-right: 5px;">查看</Button>
        <Button type="error" size="small" @click="remove_data(index,row)">删除</Button>
      </template>
    </Table>
    <div class="page">
      <Page :total="page_count" show-total v-on:on-change="get_data_page"/>
    </div>
  </div>
  <Drawer width="640" v-model="value" :mask-closable="false" title="查看用户内容" :styles="styles">
    <Form :model="formData" :rules='rules_user'>
      <Row :gutter="32">
        <Col span="20">
          <FormItem label="用户昵称" label-position="top" prop='name'>
            <Input prefix="ios-contact-outline" clearable v-model="formData.name" placeholder="请输入新用户昵称"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="20">
          <FormItem label="登录用户名" label-position="top" prop='username'>
            <Input prefix="ios-person-outline" clearable v-model="formData.username" disabled/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="20">
          <FormItem label="原密码" label-position="top" prop='r_pwd'>
            <Input type="password" prefix="ios-lock-outline" clearable v-model="formData.r_pwd" placeholder="请输入新密码"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="20">
          <FormItem label="新密码" label-position="top" prop='pwd'>
            <Input type="password" prefix="ios-lock-outline" clearable v-model="formData.pwd" placeholder="请输入新密码"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="10">
          <FormItem label="用户停用" label-position="top">
            <Select v-model="formData.is_show">
              <Option value="Y">是</Option>
              <Option value="N">否</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="10">
          <FormItem label="用户角色信息" label-position="top">
            <Select v-model="formData.role">
              <Option :value='role_0'>管理员</Option>
              <Option :value='role_1'>普通会员</Option>
              <Option :value='role_2'>游客</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="10">
          <FormItem label="用户头像" label-position="top" prop="user_img">
            <Button for="" icon="ios-cloud-upload-outline" @click="uploadFileUserImg">点击上传新头像</Button>
            <input name="file" type="file" @change="update_user_img" ref="fileUserImg" hidden/>
            <Text style="display: inline-block" v-text="user_img_name"></Text>
            <img :src="img">
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
import {get_data_all, del_user, get_user, update_user, get_user_page} from '../requestapi/user_api'
import {BASE_URL, pwd_md5} from "../utlis/config";
import UserDrawer from './drawer/UserDrawer.vue'

export default {
  name: "UserView",
  inject: ['reload', 'state'],
  components: {
    UserDrawer
  },
  data() {
    return {
      loading: false,
      value: false,
      page_count: '',
      columns: [
        {
          title: '# 序号',
          key: 'index',
          sortable: true
        },
        {
          title: '用户名',
          slot: 'name'
        },
        {
          title: '用户登录名',
          slot: 'username'
        },
        {
          title: '用户是否禁用',
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
          title: '权限角色',
          slot: 'role'
        },
        {
          title: '操作',
          slot: 'action',
          width: 150,
          align: 'center'
        }],
      data: [],
      user_img_name: '',
      role_0: 0,
      role_1: 1,
      role_2: 2,
      img: '',
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      formData: {
        id: '',
        name: '',
        username: '',
        user_img: '',
        role: "",
        pwd: '',
        r_pwd: '',
        is_show: 'Y',

      },
      rules_user: {
        name: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        username: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        pwd: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {
            min: 6, message: '密码不能少于6位！', trigger: 'change'
          }
        ],
        r_pwd: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {
            min: 6, message: '密码不能少于6位！', trigger: 'change'
          }
        ]
      },
    }
  },

  methods: {
    get_user_data_all() {
      this.loading = true
      get_data_all().then(res => {
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
    remove_data(index, row) {
      //数据删除
      this.loading = true
      const data_id = row.id
      del_user(data_id).then(res => {
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
    get_data_single(index, row) {
      this.value = true
      let user_id = row.id
      get_user(user_id).then(res => {
        let res_data = res.data
        this.formData = res_data.data
        this.img = BASE_URL + this.formData.user_img
        this.formData.user_img = ''
      }).catch(error => {
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
      })
    },
    update_user_img(event) {
      // 获取上传图片本地对象
      event.preventDefault()
      this.formData.user_img = event.target.files[0]
      this.user_img_name = event.target.files[0].name
    },
    uploadFileUserImg() {
      // 点击button触发input flie上传图片
      this.$refs.fileUserImg.dispatchEvent(new MouseEvent('click'))
    },
    update_data() {
      //提交更新的内容
      let id = this.formData.id
      let formData = new FormData();
      formData.append('name', this.formData.name)
      formData.append('username', this.formData.username)
      formData.append('user_img', this.formData.user_img)
      formData.append('role', this.formData.role)
      formData.append('pwd', pwd_md5(this.formData.pwd)) // 修改后的密码通过md5加密
      formData.append('is_show', this.formData.is_show)
      formData.append('r_pwd', pwd_md5(this.formData.r_pwd)) // 原密码加密
      if (!formData.get('user_img')) {
        formData.delete('user_img')
      }
      update_user(id, formData).then(res => {
        let res_data = res.data
        if (res_data.code === 200) {
          this.$Message.success({content: res_data.data, duration: 3})
        } else {
          this.$Message.success({content: res_data.error, duration: 3})
        }
      }).catch(error => {
      }).finally(() => {
        this.value = false
        this.reload()
      })
    },
    get_data_page(page) {
      // 页码切换
      this.loading = true
      get_user_page(page).then(res => {
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
  },
  created() {
    this.get_user_data_all()
  },
  computed: {
    is_show() {
      return !!(this.formData.name && this.formData.username && this.formData.pwd);
    }
  }
}
</script>

<style scoped>
img {
  width: 180px;
  height: 100px;
  margin-top: 10px;
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