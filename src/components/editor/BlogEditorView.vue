<template>
  <div>
    <div style="border: 1px solid #ccc;">
      <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editor"
          :defaultConfig="toolbarConfig"
          :mode="mode"
      />
      <Editor
          style="height: 500px; overflow-y: hidden;"
          v-model="html"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="onCreated"
          @onChange='onChange'
      />
    </div>
  </div>
</template>

<script>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import {Boot} from '@wangeditor/editor';
import {BASE_URL} from '../../utlis/config'
import {delete_editor} from '../../requestapi/editor-api'
import {get_token} from '../../utlis/cookie'
import {Message} from "view-ui-plus";

export default {
  name: "EditorView",
  components: {Editor, Toolbar}, // 引入组件
  provide() {
    return {
      deleteImage: this.deleteImage
    }
  },
  data() {
    return {
      editor: null, //编辑器实例对象
      html: "<p><br></p>", // 编辑器默认内容 在编辑器中使用
      toolbarConfig: {
        excludeKeys: ['fullScreen', 'insertVideo', 'insertTable'], // 清除一些菜单选项
      }, //工具栏配置文件 参考文档
      editorConfig: {
        placeholder: "请输入内容...",
        MENU_CONF: {
          uploadImage: {
            headers: {
              AcceptToken: get_token()
            },
            // withCredentials: true,
            withCredentials: true,
            server: BASE_URL + 'api/v1/adminHome/editor/img/',
            fieldName: 'editorImageName', // 设置后端接收图片对象的key
            base64LimitSize: 1024 * 1024, // 1m 图片按照base64方式进行存储
            maxFileSize: 10 * 1024 * 1024, // 最大图片上传为3m

            customInsert(res, insertFn) {  // 自定义插入图片 按照自己的方式
              // res 即服务端的返回结果
              let resUlr = BASE_URL + res.url
              let resAlt = res.art
              let resHref = res.href
              insertFn(resUlr, resAlt, resHref)
            },
            onError(file, err, res) {
              Message.error({content: '抱歉没有权限!'})
            },
            onInsertedImage(imageNode) {
              if (imageNode == null) return
              const {src, alt, url, href} = imageNode
              console.log('inserted image', src, alt, url, href)
            }
          }
        }
      },
      mode: "default" // or 'simple' 完全模式还是简介模式
    }
  },
  methods: {
    onCreated(editor) { // 创建实例对象
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    getDataHtml() { // 将数据发给调用的父组件
      return this.html
    },
    getDateText() { // 获取文本
      return this.editor.getText()
    },
    clearEditor() {
      this.editor.clear()
    },
    saveDataHtml(data) {
      this.editor.dangerouslyInsertHtml(data)
    },
    onChange() {
      // 也就是说当前old 对象比 对象慢1拍
      let reg = /[a-z0-9]{32}.[a-z]{3}/g
      let str = this.html.match(reg) || [] // 找到当前符合的图片名称列表 最新删选的img列表
      this.old = this.img_new || []
      this.img_new = str
      let repeat_img_list = this.repeat(this.old, this.img_new)
      if (repeat_img_list.length > 0) {
        delete_editor(repeat_img_list).then(res => {
          let res_data = res.data
          if (res_data.code === 403) {
            Message.error({content: res_data.error})
          }
        }).catch(error => {
        }).finally(() => {
        })
      }
    },
    // 处理在编辑器中删除的图片 将不同的列表进行去重
    repeat(_old, _new) {
      let repeat_img = []
      if (_old.length > _new.length) {
        for (let i = 0; i < _old.length; i++) {
          if (_new.indexOf(_old[i]) === -1) {
            repeat_img.push(_old[i])
          }
        }
        return repeat_img
      }
      return repeat_img
    },
    // 获取全部的h1-h5标签内容
    getHeader() {
      return this.editor.getElemsByTypePrefix('header')
    }
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
  beforeCreate() {
    function H1(slateElem, childrenHtml) {
      const id = `h1-${childrenHtml}` // 使用h1与当前文本内容作为拼接对象
      return `<h1 id="${id}">${childrenHtml}</h1>`
    }

    function H2(slateElem, childrenHtml) {
      const id = `h2-${childrenHtml}`
      return `<h2 id="${id}">${childrenHtml}</h2>`
    }

    function H3(slateElem, childrenHtml) {
      const id = `h3-${childrenHtml}`
      return `<h3 id="${id}">${childrenHtml}</h3>`
    }

    function H4(slateElem, childrenHtml) {
      const id = `h4-${childrenHtml}`
      return `<h4 id="${id}">${childrenHtml}</h4>`
    }

    function H5(slateElem, childrenHtml) {
      const id = `h5-${childrenHtml}`
      return `<h5 id="${id}">${childrenHtml}</h5>`
    }

    Boot.registerElemToHtml({
      type: 'header1',
      elemToHtml: H1,
    })
    Boot.registerElemToHtml({
      type: 'header2',
      elemToHtml: H2,
    })
    Boot.registerElemToHtml({
      type: 'header3',
      elemToHtml: H3,
    })
    Boot.registerElemToHtml({
      type: 'header4',
      elemToHtml: H4,
    })
    Boot.registerElemToHtml({
      type: 'header5',
      elemToHtml: H5,
    })
  }

}
</script>

<style scoped>

</style>