<template>
  <el-breadcrumb class="crumbs" separator="/">
    <el-breadcrumb-item
      v-for="item in breadcrumbList"
      :key="item.name"
      :to="{ path: item.path, query: item.query }"
    >
      {{ item.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>

  <div class="container">
    <div class="handle-box">
      <el-button @click="deleteAll">Batch Delete</el-button>
      <el-input
        v-model="searchWord"
        placeholder="Filter by keywords"
      ></el-input>
    </div>

    <el-table
      height="550px"
      border
      size="small"
      :data="data"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
        align="center"
      ></el-table-column>


      <el-table-column label="Images" width="130" align="center">
        <template v-slot="scope">
          <img
            :src="`http://localhost:9000/uhauction/item/img/${scope.row.name}`"
            style="width: 80px"
          />
        </template>
      </el-table-column>


      <el-table-column label="Operation" width="150" align="center">
        <template v-slot="scope">
          <el-button type="danger" @click="deleteRow(scope.row.id)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="total, prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="tableData.length"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>

  <!-- delete prompt window -->
  <del-dialog
    :delVisible="delVisible"
    @confirm="confirm"
    @cancelRow="delVisible = $event"
  ></del-dialog>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, watch, ref, computed } from "vue";
import { useStore } from "vuex";
import { HttpManager } from "@/api";
import DelDialog from "@/components/dialog/DelDialog.vue";

export default defineComponent({
  components: {
    DelDialog,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const store = useStore();

    const tableData = ref([]);
    const tempDate = ref([]);
    const userData = ref([]);
    const breadcrumbList = computed(() => store.getters.breadcrumbList);

    const pageSize = ref(5);
    const currentPage = ref(1);

    const data = computed(() => {
      return tableData.value.slice(
        (currentPage.value - 1) * pageSize.value,
        currentPage.value * pageSize.value
      );
    });
    const searchWord = ref("");
    watch(searchWord, () => {
      if (searchWord.value === "") {
        tableData.value = tempDate.value;
      } else {
        tableData.value = [];
        for (let item of tempDate.value) {
          if (item.content.includes(searchWord.value)) {
            tableData.value.push(item);
          }
        }
      }
    });

    getData();

    // get comments
    async function getData() {
      tableData.value = [];
      tempDate.value = [];
      const result = (await HttpManager.getImagesByItemId(
        proxy.$route.query.id
      )) as ResponseBody;
      tableData.value = result.data;
      tempDate.value = result.data;
    }

    function getUserName(id) {
      let userName = null; // Initialize userName variable to store the result
      userData.value.forEach((user) => {
        if (user.id === id) {
          userName = user.alias;
          return; // Exit forEach loop since we found the matching user
        }
      });
      return userName; // Return the userName, if found, otherwise it will be null
    }

    // get current page
    function handleCurrentChange(val) {
      currentPage.value = val;
    }

    const idx = ref(-1);
    const multipleSelection = ref([]);
    const delVisible = ref(false);

    async function confirm() {
      const result = (await HttpManager.deleteImage(
        idx.value
      )) as ResponseBody;
      (proxy as any).$message({
        message: result.message,
        type: result.type,
      });

      if (result) getData();
      delVisible.value = false;
    }
    function deleteRow(id) {
      idx.value = id;
      delVisible.value = true;
    }
    function handleSelectionChange(val) {
      multipleSelection.value = val;
    }
    function deleteAll() {
      for (let item of multipleSelection.value) {
        deleteRow(item.id);
        confirm();
      }
      multipleSelection.value = [];
    }

    return {
      data,
      pageSize,
      currentPage,
      searchWord,
      tableData,
      delVisible,
      breadcrumbList,
      deleteAll,
      handleSelectionChange,
      deleteRow,
      getUserName,
      confirm,
      handleCurrentChange,
      attachImageUrl: HttpManager.attachImageUrl,
    };
  },
});
</script>

<style scoped></style>
