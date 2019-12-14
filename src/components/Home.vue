<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="iscollapse? '65px':'200px'">
                <div class="toggle-btn" @click="toggleCollapse">|||</div>
                <el-menu :default-active="activePath" router :collapse-transition="false" :collapse="iscollapse" background-color="#F9F9FB" text-color="#7A7B7D" active-text-color="#2B99F1" :unique-opened="true">
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item @click="saveNavState('/'+subItem.path)" :index="'/'+subItem.path" :key="subItem.id" v-for="subItem in item.children">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      iscollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse () {
      this.iscollapse = !this.iscollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
    .el-header {
        background-color: #03A9F3;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 20px;
    }

    .el-aside {
        background-color: #F9F9FB;
        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #F3F3F5;
    }

    .home-container {
        height: 100%;
    }
    .iconfont {
        margin-right: 5px;
    }
    .toggle-btn{
        background-color: #fff;
        font-size: 10px;
        line-height: 24px;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
        color: #7A7B7D;
    }
</style>
