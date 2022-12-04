<template>
  <Button @click="value = true" type="primary" class="btn_create">新增</Button>
  <Drawer
      title="添加新的分类"
      v-model="value"
      width="720"
      :mask-closable="false"
      :styles="styles"
  >
    <Form :model="formData" :rules="rules_category">
      <Row :gutter="32">
        <Col span="18">
          <FormItem label="分类名称" label-position="top" prop='title'>
            <Input v-model="formData.title" clearable/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="18">
          <FormItem label="分类简介" label-position="top" prop='category_doc'>
            <Input v-model="formData.category_doc"  maxlength="255" show-word-limit type="textarea" style="width: 508px "/>
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
      <Row :gutter="32">
        <Col span="18">
          <FormItem label="排序" label-position="top">
            <InputNumber :min="1" v-model="formData.order"  controls-outside/>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="value = false">取消</Button>
      <Button type="success" @click="create_link_data('formData')" v-if="is_show">添加</Button>
      <Button type="success" v-else disabled>添加</Button>
    </div>
  </Drawer>
</template>

<script>
import {create_category_data} from '../../requestapi/category-api'
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
        title: '',
        is_show: 'Y',
        category_doc: '',
        order: 1
      },
      rules_category: {
        title: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        category_doc: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    create_link_data() {
        create_category_data(this.formData).then(res => {
          const res_data = res.data
          this.$Message.success({content: res_data.data, duration: 3})
          this.value = false
          this.reload()
        }).catch(error => {
          this.$Message.error({content: error, duration: 3})
        }).finally(()=>{
        })
    }
  },
  computed:{
    is_show(){
      return !!(this.formData.title && this.formData.category_doc);
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