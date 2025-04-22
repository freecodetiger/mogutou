<template>
  <div class="app-container">
    <el-button type="primary" size="mini" align="right" @click="handleCreate">新增员工</el-button>
    <el-button type="success" size="mini" align="right" @click="handleDownload">导出Excel</el-button>

    <hr>
    <el-input v-model="search" placeholder="输入名称关键字搜索" size="mini" align="right"/>
    <el-table
      v-loading="Loading"
      :data="data.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      element-loading-text="Loading"
      style="width: 100%"
    >
      <el-table-column label="姓名" prop="Name"/>
      <el-table-column label="电话" prop="Tel"/>
      <el-table-column label="职位" prop="Position"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="info" icon="el-icon-edit" circle @click="handleEdit(scope.$index, scope.row)"/>
          <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="100%">
      <el-form v-enterToNext="true" ref="postForm" :model="postForm" :rules="rules" status-icon class="form-container">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="postForm.name"/>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="postForm.tel" type="tel"/>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="postForm.position"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleCancle">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// import { getStaff, createStaff, updateStaff, deleteStaff } from '@/api/company'
// 直接使用模拟数据，不调用API
import { validateTel } from '@/utils/validate'

const DialogTitleType = {
  Edit: '编辑',
  Create: '新建'
}

export default {
  data() {
    const checkTel = (rule, value, callback) => {
      if (!validateTel(value)) {
        callback(new Error('必须是11位合法手机号'))
      } else {
        callback()
      }
    }

    return {
      Loading: true,
      dialogVisible: false,
      dialogTitle: '',
      data: [],
      search: '',
      postForm: {
        name: '',
        tel: '',
        position: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
        tel: [{ required: true, validator: checkTel, trigger: 'blur' }],
        position: [
          { required: true, message: '请输入职位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    resetFormData() {
      this.postForm = {
        ID: '',
        name: '',
        tel: '',
        position: ''
      }
    },
    fetchData() {
      this.Loading = true

      // 直接使用模拟数据
      const mockData = [
        {
          UserID: 'user-1',
          Name: '张三',
          Tel: '13800138000',
          Position: '经理'
        },
        {
          UserID: 'user-2',
          Name: '李四',
          Tel: '13900139000',
          Position: '销售'
        },
        {
          UserID: 'user-3',
          Name: '王五',
          Tel: '13700137000',
          Position: '采购'
        }
      ];

      // 直接使用模拟数据，不调用API
      setTimeout(() => {
        this.data = mockData
        this.Loading = false
      }, 500)
    },
    handleEdit(index, row) {
      console.log(index, row)
      this.dialogTitle = DialogTitleType.Edit
      this.dialogVisible = true
      this.postForm.ID = row.UserID
      this.postForm.name = row.Name
      this.postForm.tel = row.Tel
      this.postForm.position = row.Position
      this.$nextTick(() => {
        this.$refs['postForm'].clearValidate()
      })
    },
    handleCreate() {
      this.resetFormData()
      this.dialogTitle = DialogTitleType.Create
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['postForm'].clearValidate()
      })
    },
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.Loading = true
          // 模拟删除操作
          setTimeout(() => {
            this.data.splice(index, 1)
            this.Loading = false
            this.$message.success('删除成功')
          }, 500)
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    handleSubmit() {
      this.$refs['postForm'].validate(valid => {
        if (valid) {
          this.Loading = true

          // 模拟成功响应
          setTimeout(() => {
            if (this.dialogTitle === DialogTitleType.Edit) {
              // 模拟编辑操作
              const index = this.data.findIndex(item => item.UserID === this.postForm.ID)
              if (index !== -1) {
                this.data[index].Name = this.postForm.name
                this.data[index].Tel = this.postForm.tel
                this.data[index].Position = this.postForm.position
              }
              this.Loading = false
              this.dialogVisible = false
              this.$message.success('修改成功')
            } else if (this.dialogTitle === DialogTitleType.Create) {
              // 模拟创建操作
              const newStaff = {
                UserID: 'user-' + Date.now(),
                Name: this.postForm.name,
                Tel: this.postForm.tel,
                Position: this.postForm.position
              }
              this.data.push(newStaff)
              this.Loading = false
              this.dialogVisible = false
              this.$message.success('创建成功')
            }
          }, 500)
        }
      })
    },
    handleCancle() {
      this.Loading = false
      this.dialogVisible = false
    },
    handleDownload() {
      this.Loading = true

      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['姓名', '电话', '职位']
        const filterVal = ['Name', 'Tel', 'Position']
        const list = this.data
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '员工信息表'
        })
      })
      this.Loading = false
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
