<template>
  <Button @click="value = true" type="primary" class="btn_create">新增</Button>
  <Drawer width="640" v-model="value" :mask-closable="false" title="添加新的站点信息" :styles="styles">
    <Form :model="formData" :rules="rules_blog_content">
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="QQ" label-position="top" prop='created_web_qq'>
            <Input prefix="ios-people-outline" v-model="formData.created_web_qq" clearable placeholder="请输入qq"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="邮箱" label-position="top" prop='created_web_email'>
            <Input prefix='ios-mail-open-outline' v-model="formData.created_web_email" clearable placeholder="请输入邮箱"/>
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
import {create_blogger_content} from '../../requestapi/blogger-contents-api'

export default {
  inject: ['reload'],
  name: "LinkDrawerView",
  data() {
    return {
      value: false,
      formData: {
        created_web_email: '',
        created_web_qq: "",
        is_show: 'Y',
        created_web_wechat: '',
      },
      wab_log_img_name: '',
      created_web_wechat_name: '',
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
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
    }
  },
  methods: {
    create_data() {
      let formData = new FormData();
      formData.append('is_show', this.formData.is_show)
      formData.append('created_web_wechat', this.formData.created_web_wechat)
      formData.append('created_web_email', this.formData.created_web_email)
      formData.append('created_web_qq', this.formData.created_web_qq)
      create_blogger_content(formData).then(res => {
        let res_data = res.data
        this.$Message.success({content: res_data.data, duration: 3})
      }).catch(error => {
        this.$Message.success({content: error, duration: 3})
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