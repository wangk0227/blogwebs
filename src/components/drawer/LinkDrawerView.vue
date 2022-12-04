<template>
  <Button @click="value = true" type="primary" class="btn_create">新增</Button>
  <Drawer
      title="添加新的链接"
      v-model="value"
      width="720"
      :mask-closable="false"
      :styles="styles"
  >
    <Form :model="formData" :rules="rules_link">
      <Row :gutter="32">
        <Col span="18">
          <FormItem label="链接名称" label-position="top" prop='link_name'>
            <Input v-model="formData.link_name" clearable/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="18">
          <FormItem label="链接网络地址" label-position="top" prop='link'>
            <Input v-model="formData.link" clearable>
            </Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="18">
          <FormItem label="是否隐藏" label-position="top">
            <Select v-model="formData.is_show">
              <Option value="Y">是</Option>
              <Option value="N">否</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="value = false">取消</Button>
      <Button type="success" @click="create_link_data('formData')" v-if="is_show">添加</Button>
      <Button type="success" disabled v-else>添加</Button>
    </div>
  </Drawer>
</template>

<script>
import {create_link_data} from '../../requestapi/link-api'

export default {
  inject: ['reload'],
  name: "LinkDrawerView",
  data() {
    return {
      value: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static'
      },
      formData: {
        link_name: '',
        link: '',
        is_show: 'Y',
      },
      rules_link: {
        link_name: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        link: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    create_link_data() {
      create_link_data(this.formData).then(res => {
        const res_data = res.data
        this.$Message.success({content: res_data.data, duration: 3})
      }).catch(error => {
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
        this.value = false
        this.reload()
      })
    }
  },
  computed: {
    is_show() {
      return !!(this.formData.link_name && this.formData.link)
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