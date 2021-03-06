<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-button type="primary" @click="showAddCateDialog">添加商品</el-button>
            <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type="false"
            :expand-type="false"  show-index index-text="#" border :show-row-hover="false">
                <!-- 是否有效 -->
                <template slot="isOk" slot-scope="scope">
                    <i v-if="scope.row.cat_deleted ===false" style="color: lightgreen;" class="el-icon-success"></i>
                    <i v-else style="color: red;" class="el-icon-error"></i>
                </template>
                <!-- 排序 -->
                 <template slot="level" slot-scope="scope">
                   <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                   <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
                   <el-tag size="mini" v-else type="warning">三级</el-tag>
                </template>
                <!-- 操作 -->
                 <template slot="opt" slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
             <el-pagination
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="queryForm.pagenum"
               :page-sizes="[3, 5, 8, 12]"
               :page-size="queryForm.pagesize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="total">
             </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="addCateDialogVisible"
            width="50%" @close="addCateDialogClosed">
            <el-form :model="addCateForm" :rules="addCateRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                     <el-cascader
                        v-model="selectedOptions"
                        :options="parentCateList"
                        :props="cascaderProps"
                        @change="parentCateChange" clearable>
                     </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryForm: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateRules: {
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      addCateDialogVisible: false,
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      selectedOptions: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    handleSizeChange (newSize) {
      this.queryForm.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryForm.pagenum = newPage
      this.getCateList()
    },
    async getCateList () {
      const {
        data: res
      } = await this.$http.get(`categories`, { params: this.queryForm })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 弹出添加商品对话框
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取一二级分类的数据列表
    async getParentCateList () {
      const {
        data: res
      } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parentCateList = res.data
    },
    parentCateChange () {
      if (this.selectedOptions.length > 0) {
        this.addCateForm.cat_pid = this.selectedOptions[this.selectedOptions.length - 1]
        this.addCateForm.cat_level = this.selectedOptions.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const {
          data: res
        } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedOptions = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style scoped>
    .treeTable{
        margin-top: 15px;
    }
    .el-cascader{
        width: 100%;
    }
</style>
