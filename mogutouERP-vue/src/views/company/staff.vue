<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="data"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">
          {{ scope.row.Name }}
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职位" align="center">
        <template slot-scope="scope">
          {{ scope.row.Position }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import { getStaff } from '@/api/company'

export default {
  data() {
    return {
      data: [],
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true

      // 模拟数据
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
        this.listLoading = false
      }, 500)
    }
  }
}
</script>
