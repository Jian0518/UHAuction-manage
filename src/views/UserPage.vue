<template>
  <div class="container">
    <div class="handle-box">
      <el-button @click="deleteAll">Batch Delete</el-button>
      <el-input v-model="searchWord" placeholder="Filter users"></el-input>
    </div>

    <el-table height="550px" border size="small" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column label="ID" prop="id" width="50" align="center"></el-table-column>
      <el-table-column label="Avatar" width="102" align="center">
        <template v-slot="scope">
          <img :src="`https://cn.gravatar.com/avatar/${scope.row.id}?s=164&d=monsterid`" style="width: 80px" />
        </template>
      </el-table-column>
      <el-table-column label="Username" prop="username" width="80" align="center"></el-table-column>
      <el-table-column label="Phone No" prop="mobile" width="120" align="center"></el-table-column>
      <el-table-column label="Email" prop="email" width="120" align="center"></el-table-column>
      <el-table-column label="Operation" width="150" align="center">
        <template v-slot="scope">
          <el-button type="danger" @click="deleteRow(scope.row.id)">Delete</el-button>
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
  <del-dialog :delVisible="delVisible" @confirm="confirm" @cancelRow="delVisible = $event"></del-dialog>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, watch, ref, reactive, computed } from "vue";
import mixin from "@/mixins/mixin";
import { HttpManager } from "@/api";
import DelDialog from "@/components/dialog/DelDialog.vue";


export default defineComponent({
  components: {
    DelDialog,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const { routerManager } = mixin();

    const tableData = ref([]); // record users to display
    const tempDate = ref([]); // for searching purpose

    const pageSize = ref(5); 
    const currentPage = ref(1); 

    // compute amount of data for current table 
    const data = computed(() => {
      return tableData.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
    });

    const searchWord = ref(""); // record the content in input frame
    watch(searchWord, () => {
      if (searchWord.value === "") {
        tableData.value = tempDate.value;
      } else {
        tableData.value = [];
        for (let item of tempDate.value) {
          if (item.username.includes(searchWord.value)) {
            tableData.value.push(item);
          }
        }
      }
    });

    getData();

    // get user data 
    async function getData() {
      tableData.value = [];
      tempDate.value = [];
      const result = (await HttpManager.getAllUser()) as ResponseBody;
      tableData.value = result.data;
      tempDate.value = result.data;
      currentPage.value = 1;
    }

    
    // get current page 
    function handleCurrentChange(val) {
      currentPage.value = val;
    }



    /**
     * delete
     */
    const idx = ref(-1); // record row to be deleted 
    const multipleSelection = ref([]); // record list to be deleted
    const delVisible = ref(false); // show delete pop up 

    async function confirm() {
      const result = (await HttpManager.deleteUser(idx.value)) as ResponseBody;
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

   //handleAvatarSuccess
   function handleAvatarSuccess(){
     location.reload();
   }




    return {
      searchWord,
      data,
      tableData,
      delVisible,
      pageSize,
      currentPage,
      deleteAll,
      handleSelectionChange,
      handleCurrentChange,
      deleteRow,
      handleAvatarSuccess,
      confirm,
      attachImageUrl: HttpManager.attachImageUrl,
    };
  },
});
</script>

<style scoped></style>
