<template>
  <Button @click="value = true" type="primary" class="btn_create">新增</Button>
  <Drawer width="640" v-model="value" :mask-closable="false" title="添加新的用户信息" :styles="styles">
    <Form :model="formData" :rules='rules_user' ref="form">
      <Row :gutter="32">
        <Col span="20">
          <FormItem label="用户昵称" label-position="top" prop='name'>
            <Input prefix="ios-contact-outline" clearable v-model="formData.name" placeholder="请输入用户昵称"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="20">
          <FormItem label="登录用户名" label-position="top" prop='username'>
            <Input prefix="ios-person-outline" clearable v-model="formData.username" placeholder="请输入用户名"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="20">
          <FormItem label="密码" label-position="top" prop='pwd'>
            <Input type="password" prefix="ios-lock-outline" clearable v-model="formData.pwd"
                   placeholder="至少6位密码，区分大小写"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="20">
          <FormItem label="确认密码" label-position="top" prop="confirm_pwd">
            <Input type="password" prefix="ios-lock-outline" clearable v-model="formData.confirm_pwd"
                   placeholder="确认密码"/>
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
      <Button style="margin-right: 8px" @click="value = false">取消</Button>

      <Button type="success" @click="create_data" v-if="is_show">新增</Button>
      <Button type="success" v-else disabled>新增</Button>
    </div>
  </Drawer>
</template>

<script>
import {create_user} from '../../requestapi/user_api'
import {pwd_md5} from '../../utlis/config' // 登录采用md加密操作

export default {
  inject: ['reload'],
  name: "LinkDrawerView",
  data() {
    const validatePassCheck = (rule, value, callback) => {
      if (value !== this.$refs.form.model.pwd) {
        callback(new Error('两次输入的密码不匹配！'));
      } else {
        callback();
      }
    };
    return {
      value: false,
      user_img_name: '',
      formData: {
        name: '',
        username: '',
        user_img: '',
        role: 2,
        pwd: '',
        is_show: 'Y',
        confirm_pwd: '',
      },
      role_0: 0,
      role_1: 1,
      role_2: 2,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      rules_user: {
        name: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        username: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        pwd: [
          {
            required: true, message: '密码不能为空！', trigger: 'change'
          },
          {
            min: 6, message: '密码不能少于6位！', trigger: 'change'
          }
        ],
        confirm_pwd: [
          {
            required: true, message: '确认密码不能为空！', trigger: 'change'
          },
          {validator: validatePassCheck, trigger: 'change'}
        ]
      },
    }
  },
  methods: {
    create_data() {
      let formData = new FormData();
      formData.append('name', this.formData.name)
      formData.append('username', this.formData.username)
      formData.append('user_img', this.formData.user_img)
      formData.append('role', this.formData.role)
      formData.append('pwd', pwd_md5(this.formData.pwd))
      formData.append('is_show', this.formData.is_show)
      if (!formData.get('user_img')) {
        formData.delete('user_img') // 不传入头像使用数据库设置默认值
      }
      create_user(formData).then(res => {
        let res_data = res.data

        this.$Message.success({content: res_data.data, duration: 3})
        this.value = false

      }).catch(error => {
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
        this.reload()
      })
    },
    update_user_img(event) {
      // 获取上传图片本地对象
      event.preventDefault()
      this.formData.user_img = event.target.files[0]
      this.user_img_name = event.target.files[0].name
    },
    uploadFileUserImg() {
      this.$refs.fileUserImg.dispatchEvent(new MouseEvent('click'))
    },
  },
  computed: {
    is_show() {
      return !!(this.formData.name && this.formData.username && this.formData.pwd && this.formData.confirm_pwd && this.formData.confirm_pwd === this.formData.pwd);
    }
  }

}
</script>

<style scoped>
.btn_create {
  margin-bottom: 8px;
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