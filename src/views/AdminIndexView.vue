<template>
  <div class="layout">
    <Layout :style="{minHeight: '100vh'}">
      <Sider collapsible :collapsed-width="78" v-model="isCollapsed" breakpoint="md">
        <Menu :active-name="menu_name" theme="dark" width="auto" :class="menuitemClasses"
              v-on:on-select="menuName">
          <Icon type="ios-alert-outline"/>
          <MenuItem name="博客Admin" to="index">
            <Icon type="ios-apps-outline"/>
            <span>博客Admin</span>
          </MenuItem>
          <!-- to 属性支持 跳转-->
          <MenuItem name="博客分类" to="category">
            <Icon type="ios-albums-outline"/>
            <span>博客分类</span>
          </MenuItem>
          <MenuItem name="博客文章" to="articles">
            <Icon type="md-book"/>
            <span>博客文章</span>
          </MenuItem>
          <MenuItem name="博客留言" to="messages">
            <Icon type="ios-create-outline"/>
            <span>博客留言</span>
          </MenuItem>
          <MenuItem name="友情链接" to="links">
            <Icon type="ios-browsers-outline"/>
            <span>友情链接</span>
          </MenuItem>
          <MenuItem name="站点管理" to="contents">
            <Icon type="ios-browsers-outline"/>
            <span>站点管理</span>
          </MenuItem>
          <MenuItem name="博客账户" to="user">
            <Icon type="ios-contact-outline"/>
            <span>博客账户</span>
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
          <Row justify="start" class="code-row-bg">
            <Col span="8">
              <Avatar icon="ios-person" size="large" :src="picture_url" shape="square"/>
            </Col>
            <Col span="7" offset="9">
              <span><Title :level="5" style="display: inline-block;padding: 0 15px">{{username}}</Title></span>
              <Tag color="geekblue">{{ role }}</Tag>
              <Button type="text" @click="login_out" :loading="loading">退出登录</Button>
            </Col>
          </Row>

        </Header>
        <Content :style="{padding: '0 16px 16px'}">
          <Breadcrumb :style="{margin: '10px 0'}">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem v-text="menu_name"></BreadcrumbItem>
          </Breadcrumb>
          <Card>
            <router-view/>
          </Card>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import {login_out} from '../requestapi/user_api'
import {BASE_URL, tokens, menu_names, user_datas} from '../utlis/config'
import {save_menu_name, del_cookie, get_user_data} from '../utlis/cookie'

export default {
  name: "IndexView",
  inject: ['reload'],
  data() {
    return {
      isCollapsed: false,
      menu_name: '',
      loading: false,
    };
  },
  methods: {
    login_out() {
      this.loading = true
      login_out().then(res => {
        const data = res.data
        this.$Message.success({content: data.data, duration: 3})
        // 删除cookie记录
        this.cookieClear()
        this.loading = false
        this.$router.push('/')
      }).catch(error => {
        this.$Message.error({content: error, duration: 3})
      }).finally(() => {
        location.reload()
      })
    },
    menuName(name) {
      this.menu_name = name
    },
    cookieClear() {
      // 删除缓存记录
      del_cookie(tokens)
      del_cookie(menu_names)
      del_cookie(user_datas)
    }
  },
  computed: {
    menuitemClasses: function () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    },
    username: function () {
      try {
        return JSON.parse(this.$store.state.user_data).username
      } catch (e) {
        return JSON.parse(get_user_data()).username
      }
    },
    picture_url: function () {
      try {
        return BASE_URL + JSON.parse(this.$store.state.user_data).user_picture
      } catch (e) {
        return BASE_URL + JSON.parse(get_user_data()).user_picture
      }
    },
    role: function () {
      try {
        return JSON.parse(this.$store.state.user_data).user_role
      } catch (e) {
        return JSON.parse(get_user_data()).user_role
      }
    }
  },
  watch: {
    menu_name: function (value) {
      save_menu_name(value)
    }
  },
  created() {
    this.menu_name = this.$store.state.menu_name
  }

}
</script>

<style scoped>
.layout-con {
  height: 100%;
  width: 100%;
}

.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width .2s ease .2s;
}

.menu-item i {
  transform: translateX(0px);
  transition: font-size .2s ease, transform .2s ease;
  vertical-align: middle;
  font-size: 16px;
}

.collapsed-menu span {
  width: 0;
  transition: width .2s ease;
}

.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size .2s ease .2s, transform .2s ease .2s;
  vertical-align: middle;
  font-size: 22px;
}

.dev-run-preview .dev-run-preview-edit {
  display: none
}

.demo-spin-icon-load {
  animation: ani-demo-spin 1.5s linear infinite;
}

</style>