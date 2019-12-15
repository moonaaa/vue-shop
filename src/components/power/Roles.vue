<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-button type="primary">添加角色</el-button>
            <el-table :data="roleList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['borderBottom', index === 0?'borderTop':'', 'vCenter']" v-for="(item, index) in scope.row.children"
                            :key=(item.id)>
                            <el-col :span="5">
                                <el-tag @close="removeRightById(scope.row, item.id)" closable>{{item.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[indexC1 === 0?'':'borderTop', 'vCenter']" v-for="(itemC1, indexC1) in item.children"
                                    :key=(itemC1.id)>
                                    <el-col :span="6">
                                        <el-tag @close="removeRightById(scope.row, itemC1.id)" closable type="success">{{itemC1.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag closable @close="removeRightById(scope.row, itemC2.id)" type="warning"
                                            v-for="(itemC2, indexC2) in itemC1.children" :key=(itemC2.id)>{{itemC2.authName}}</el-tag>

                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="roleName" label="角色名称">
                </el-table-column>
                <el-table-column prop="roleDesc" label="角色描述">
                </el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限对话框 -->
        <el-dialog title="提示" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClose">
            <el-tree :default-checked-keys="defKeys" show-checkbox default-expand-all node-key="id" :data="rightsList" :props="rightProps" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      setRightDialogVisible: false,
      rightsList: [],
      rightProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点id
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const {
        data: res
      } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.roleList = res.data
    },
    async removeRightById (role, id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const {
        data: res
      } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data
    },
    async showSetRightDialog (role) {
      this.roleId = role.id
      const {
        data: res
      } = await this.$http.get(`rights/tree`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 获取角色下所有三级节点id，保存到defKeys
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 对话框关闭是清空defKsys
    setRightDialogClose () {
      this.defKeys = []
    },
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {
        data: res
      } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style scoped>
    .el-tag {
        margin: 7px;
    }

    .borderTop {
        border-top: 1px solid #eee;
    }

    .borderBottom {
        border-bottom: 1px solid #eee;
    }

    .vCenter {
        display: flex;
        align-items: center;
    }
</style>
