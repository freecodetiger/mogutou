<template>
  <div class="app-container">
    <el-input v-model="search" placeholder="输入名称关键字搜索" size="mini" align="right"/>
    <el-table
      v-loading="Loading"
      :data="data.filter(data => !search || data.Name.toLowerCase().includes(search.toLowerCase()))"
      :default-sort = "{prop: 'CreatedAt', order: 'descending'}"
      element-loading-text="Loading"
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="地点">
              <span>{{ props.row.DeliveryAddress }}</span>
            </el-form-item>
            <el-form-item label="预计送货时间">
              <span>{{ props.row.DeliveryTime }}</span>
            </el-form-item>
            <el-form-item label="总价">
              <span>{{ props.row.Amount }}</span>
            </el-form-item>
            <el-form-item label="定金">
              <span>{{ props.row.Deposit }}</span>
            </el-form-item>
            <el-form-item label="运费">
              <span>{{ props.row.Freight }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.Remarks }}</span>
            </el-form-item>
          </el-form>

          <el-table :data="props.row.Goods" style="width: 100%">
            <el-table-column label="ID" prop="ID"/>
            <el-table-column label="名称" prop="Name"/>
            <el-table-column label="颜色" prop="Colour"/>
            <el-table-column label="尺寸" prop="Size"/>
            <el-table-column label="品牌" prop="Brand"/>
            <el-table-column label="数量" prop="Number"/>
          </el-table>
        </template>

      </el-table-column>
      <el-table-column
        :filters="[{ text: '未完成', value: '未完成' }, { text: '已完成', value: '已完成' }]"
        :filter-method="filterTag"
        label="状态"
        prop="State"/>
      <el-table-column label="姓名" prop="Name"/>
      <el-table-column label="电话" prop="Tel"/>
      <el-table-column label="时间" prop="CreatedAt" sortable/>
      <el-table-column label="操作人" prop="Operator"/>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.State === '未完成'" size="mini" type="primary" icon="el-icon-check" circle @click="handleConfirmOrder(scope.row)"/>
          <el-button v-if="scope.row.State === '未完成'" size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"/>
          <el-button size="mini" type="success" icon="el-icon-download" circle @click="handleDownload(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 100px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>

<script>
import { getCustormerOrders, deleteCustormerOrder, confirmCustormerOrder } from '@/api/order'
import { parseTime } from '@/utils'

export default {
  data() {
    return {
      Loading: true,
      data: [],
      search: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.Loading = true

      // 模拟数据
      const mockData = [
        {
          ID: 'CO001',
          Name: '张三',
          Tel: '13800138000',
          DeliveryAddress: '北京市海淀区中关村',
          DeliveryTime: '2023-05-01',
          Amount: 598.00,
          Deposit: 100.00,
          State: '未完成',
          Operator: 'admin',
          CreatedAt: '2023-04-20 10:00:00',
          Goods: [
            {
              ID: 'C001',
              Name: '男士衬衫',
              Colour: '白色',
              Size: 'XL',
              Brand: '优衣库',
              Number: 2
            },
            {
              ID: 'C002',
              Name: '女士连衣裙',
              Colour: '红色',
              Size: 'M',
              Brand: 'ZARA',
              Number: 1
            }
          ]
        },
        {
          ID: 'CO002',
          Name: '李四',
          Tel: '13900139000',
          DeliveryAddress: '北京市朝阳区建国门',
          DeliveryTime: '2023-05-05',
          Amount: 249.00,
          Deposit: 50.00,
          State: '已完成',
          Operator: 'admin',
          CreatedAt: '2023-04-15 14:30:00',
          Goods: [
            {
              ID: 'C003',
              Name: '男士休闲裤',
              Colour: '黑色',
              Size: 'L',
              Brand: 'H&M',
              Number: 1
            }
          ]
        }
      ];

      getCustormerOrders()
        .then(response => {
          console.log(response)
          const len = response.length
          for (let i = 0; i < len; i++) {
            response[i].CreatedAt = this.formatTime(response[i].CreatedAt)
          }
          this.data = response
          this.Loading = false
        })
        .catch(error => {
          console.error('获取客户订单失败:', error)
          // 使用模拟数据
          const len = mockData.length
          for (let i = 0; i < len; i++) {
            mockData[i].CreatedAt = this.formatTime(mockData[i].CreatedAt)
          }
          this.data = mockData
          this.Loading = false
        })
    },
    filterTag(value, row) {
      return row.State === value
    },
    handleConfirmOrder(data) {
      this.$prompt('此操作将确认订单, 请输入运费:', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\d+(\.\d+)?$/,
        inputErrorMessage: '请输入运费'
      })
        .then(({ value }) => {
          this.Loading = true
          confirmCustormerOrder(data.ID, { Freight: Number(value) })
            .then(response => {
              this.Loading = false
              this.$message.success('确认成功')
              this.fetchData()
            })
            .catch((error) => {
              this.Loading = false
              this.$message.error('确认失败: ' + error.response.data.error)
            })
        })
        .catch(() => {
          this.$message.info('已取消确认')
        })
    },
    handleDelete(data) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.Loading = true
          deleteCustormerOrder(data.ID)
            .then(response => {
              this.Loading = false
              this.$message.success('删除成功')
              this.fetchData()
            })
            .catch(() => {
              this.Loading = false
              this.$message.error('删除失败')
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    handleDownload(row) {
      this.Loading = true

       import('@/vendor/Export2Excel').then(excel => {
         const tHeader = ['客户姓名', '电话', '送货地点', '送货时间', '产品编号', '名称', '颜色', '尺寸', '品牌', '数量']
         const filterVal = ['CustomerName', 'Tel', 'DeliveryAddress', 'DeliveryTime', 'ID', 'Name', 'Colour', 'Size', 'Brand', 'Number']
         const data = this.formatJson(filterVal, row.Goods)

         const len = filterVal.length
         const orderInfo = new Array(len)
         for (let i = 0; i < len; i++) {
           orderInfo[i] = undefined
         }
         orderInfo[0] = row.Name
         orderInfo[1] = row.Tel
         orderInfo[2] = row.DeliveryAddress
         orderInfo[3] = row.DeliveryTime
         data.unshift(orderInfo)

         const fileName = '客户订单-' + row.Name + '-' + row.Tel + '-' + row.DeliveryAddress
         excel.export_json_to_excel({
           header: tHeader,
           data,
           autoWidth: true,
           filename: fileName
         })
       })
       this.Loading = false
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    formatTime(time) {
      return parseTime(time)
    }
  }
}
</script>
