<template>
  <div class="app-container">
    <el-input v-model="search" placeholder="输入名称关键字搜索" size="mini" align="right"/>
    <el-table
      v-loading="listLoading"
      :data="data.filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase()))"
      element-loading-text="Loading"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="品牌">
              <span>{{ props.row.Brand }}</span>
            </el-form-item>
            <el-form-item label="预售量">
              <span>{{ props.row.PresaleNumber }}</span>
            </el-form-item>
            <el-form-item label="销量">
              <span>{{ props.row.SalesVolume }}</span>
            </el-form-item>
            <el-form-item label="售价">
              <span>{{ props.row.Price }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        :filters="[{ text: '有货', value: false }, { text: '缺货', value: true }]"
        :filter-method="filterTag"
        label="产品编号"
        prop="ID"
      >
        <template slot-scope="props">
          <span>{{ props.row.ID }}</span>
          <el-button
            v-if="props.row.isShortage"
            type="danger"
            icon="el-icon-warning"
            size="small"
            circle
          />
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="Name"/>
      <el-table-column label="颜色" prop="Colour"/>
      <el-table-column label="库存" prop="Number"/>
    </el-table>
  </div>
</template>

<style>
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>

<script>
import { getCommodities } from '@/api/commodity'

export default {
  data() {
    return {
      listLoading: true,
      data: [],
      search: ''
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
          ID: 'C001',
          Name: '男士衬衫',
          Colour: '白色',
          Size: 'XL',
          Brand: '优衣库',
          Price: 199.00,
          PurchasePrice: 99.00,
          Number: 100,
          PresaleNumber: 20,
          SalesVolume: 50
        },
        {
          ID: 'C002',
          Name: '女士连衣裙',
          Colour: '红色',
          Size: 'M',
          Brand: 'ZARA',
          Price: 299.00,
          PurchasePrice: 150.00,
          Number: 80,
          PresaleNumber: 30,
          SalesVolume: 40
        },
        {
          ID: 'C003',
          Name: '男士休闲裤',
          Colour: '黑色',
          Size: 'L',
          Brand: 'H&M',
          Price: 249.00,
          PurchasePrice: 120.00,
          Number: 60,
          PresaleNumber: 15,
          SalesVolume: 30
        }
      ]

      getCommodities()
        .then(response => {
          console.log(response)
          this.data = response
          this.processData(response)
        })
        .catch(error => {
          console.error('获取商品列表失败:', error)
          // 使用模拟数据
          this.data = mockData
          this.processData(mockData)
        })
    },

    processData(response) {
      this.listLoading = false
      const len = response.length

      let isShortage = false
      for (let i = 0; i < len; i++) {
        if (response[i].PresaleNumber > response[i].Number) {
          this.data[i].isShortage = true
          isShortage = true
        } else {
          this.data[i].isShortage = false
        }
      }
      if (isShortage) {
        this.$notify({
          title: '缺货提示',
          message: '标有 红色图标 的产品缺货，请及时补货',
          duration: 15000,
          type: 'warning'
        })
      }
    },
    filterTag(value, row) {
      return row.isShortage === value
    }
  }
}
</script>
