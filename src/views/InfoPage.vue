<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class="card-content">
          <div class="card-left">
            <el-icon><User /></el-icon>
          </div>
          <div class="card-right">
            <div class="card-num">{{ userCount }}</div>
            <div>Total Users</div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class="card-content">
          <div class="card-left">
            <el-icon><Odometer /></el-icon>
          </div>
          <div class="card-right">
            <div class="card-num">{{ bidCount }}</div>
            <div>Total Bids</div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class="card-content">
          <div class="card-left">
            <el-icon><CollectionTag /></el-icon>
          </div>
          <div class="card-right">
            <div class="card-num">{{ categoryCount }}</div>
            <div>Total Category</div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="hover" :body-style="{ padding: '0px' }">
        <div class="card-content">
          <div class="card-left">
            <el-icon><Box /></el-icon>
          </div>
          <div class="card-right">
            <div class="card-num">{{ itemCount }}</div>
            <div>Total Items</div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="0">
      <el-card
        class="cav-info"
        shadow="hover"
        :body-style="{ padding: '0px' }"
        id=""
      ></el-card>
    </el-col>
    <el-col :span="24">
      <h3>Item Category</h3>
      <el-card
        class="cav-info"
        shadow="hover"
        :body-style="{ padding: '20px 0' }"
        id="categoryTag"
      ></el-card>
    </el-col>
  </el-row>
  <el-row :gutter="0">
    <el-col :span="0">
      <el-card
        class="cav-info"
        shadow="hover"
        :body-style="{ padding: '0px' }"
        id=""
      ></el-card>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
// import { ref, reactive, getCurrentInstance } from "vue";
import { ref, reactive } from "vue";
import * as echarts from "echarts";
import { CollectionTag, User, Box, Odometer } from "@element-plus/icons-vue";
import { HttpManager } from "@/api/index";

// const { proxy } = getCurrentInstance();
const userCount = ref(0);
const itemCount = ref(0);
const bidCount = ref(0);
const categoryCount = ref(0);

const categoryTag = reactive({


xAxis: {
    type: "category",
    data: ["Mobile & Accessories", "Health & Beauty", "Watches", "Fashion", "Women's Bags", "Men's Bag & Wallets", "Men Clothes","Sports & Outdoor","Automotive","Home & Living","Books & Hobbies","Women Clothes","Home Appliances","Women Shoes","Groceries & Pets"],
    axisLabel: {
      rotate: 335 // Rotate the x-axis labels by 45 degrees
    }
  },


  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [0, 0, 0, 0, 0, 0, 0],
      type: "bar",
      barWidth: "20%",
    },
  ],
});



HttpManager.getAllUser().then((res) => {
  const result = res as ResponseBody;
  userCount.value = result.data.length;

});

HttpManager.getAllItem().then((res) => {
  itemCount.value = (res as ResponseBody).data.length;
});
HttpManager.getCategory().then((res) => {
  const result = res as ResponseBody;
  categoryCount.value = result.data.length;


for (let item of result.data) {
    for (let i = 0; i < categoryTag.xAxis.data.length; i++) {
      if (item.name.includes(categoryTag.xAxis.data[i])) {
        categoryTag.series[0].data[i] = item.itemCount;
      }
    }
  }








  // const categoryTagChart = echarts.init(proxy.$refs.categoryTag);
  const categoryTagChart = echarts.init(document.getElementById("categoryTag"));
 categoryTagChart.setOption(categoryTag);
});

HttpManager.getAllBids().then((res) => {
  const result = res as ResponseBody;
  bidCount.value = result.data.length;
});
</script>





<style scoped>

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100px;
  padding-left: 20%;
  text-align: center;
}

.card-left {
  display: flex;
  font-size: 3rem;
}

.card-right {
  flex: 1;
  font-size: 14px;
}

.card-num {
  font-size: 30px;
  font-weight: bold;
}

h3 {
  margin: 10px 0;
  text-align: center;
}
.cav-info {
  border-radius: 6px;

  height: 400px;
  background-color: white;
}
</style>
