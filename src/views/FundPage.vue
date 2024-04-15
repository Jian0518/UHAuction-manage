<template>
  <div class="container">
    <div class="handle-box">
      <el-button @click="deleteAll">Batch Delete</el-button>
      <el-input v-model="searchWord" placeholder="Filter keywords"></el-input>
      <el-button type="primary" @click="newRow">Add</el-button>
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
      <el-table-column
        label="ID"
        prop="id"
        width="50"
        align="center"
      ></el-table-column>

      <el-table-column label="Description" prop="description" width="200px" align="center">
      </el-table-column>

      <el-table-column label="Type" prop="type" width="100" align="center">
      </el-table-column>

      <el-table-column label="Amount" prop="amount" width="100" align="center">
      </el-table-column>

      <el-table-column label="Date" width="100" align="center">
        <template v-slot="scope">
          {{ formatDate(scope.row.date) }}
        </template>
      </el-table-column>

      <el-table-column label="Operation" width="160" align="center">
        <template v-slot="scope">
          <el-button @click="editRow(scope.row)">Edit</el-button>
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

  <!-- Add pop-up box -->
  <el-dialog title="New" v-model="newVisible">
    <el-form :model="newForm">
      <el-form-item label="Id">
        <el-input v-model="newForm.id"></el-input>
      </el-form-item>

      <el-form-item label="Type         ">
        <el-input v-model="newForm.type"></el-input>
      </el-form-item>

      <el-form-item label="Description  ">
        <el-input type="textarea" v-model="newForm.description"></el-input>
      </el-form-item>

      <el-form-item label="Amount       ">
        <el-input v-model="newForm.amount"></el-input>
      </el-form-item>

      <el-form-item label="Time     ">
        <el-date-picker
          v-model="newForm.date"
          type="date"
          :picker-options="pickerOptions"
          placeholder="Select Date"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="newVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveFund">Save</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- Edit pop-up box -->
  <el-dialog title="Edit" v-model="editVisible">
    <el-form :model="editForm">
      <el-form-item label="Type         ">
        <el-input v-model="editForm.type"></el-input>
      </el-form-item>

      <el-form-item label="Description  ">
        <el-input type="textarea" v-model="editForm.description"></el-input>
      </el-form-item>

      <el-form-item label="Amount       ">
        <el-input v-model="editForm.amount"></el-input>
      </el-form-item>

      <el-form-item label="End Time     ">
        <el-date-picker
          v-model="editForm.date"
          type="date"
          :picker-options="pickerOptions"
          placeholder="Select Date"
          style="width: 100%"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="editVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveEdit">Edit</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- Delete pop-up box -->
  <del-dialog
    :delVisible="delVisible"
    @confirm="confirm"
    @cancelRow="delVisible = $event"
  ></del-dialog>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  watch,
} from "vue";
import { HttpManager } from "@/api/index";
import DelDialog from "@/components/dialog/DelDialog.vue";
export default defineComponent({
  components: {
    DelDialog,
  },
  methods: {
    formatDate(dateString) {
      // Create a new Date object from the provided date string
      const date = new Date(dateString);

      // Extract year, month, and day from the date object
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because getMonth() returns 0-based index
      const day = date.getDate().toString().padStart(2, "0");

      // Return formatted date string in "YYYY-MM-DD" format
      return `${year}-${month}-${day}`;
    },
  },

  setup() {
    const { proxy } = getCurrentInstance();

    const tableData = ref([]);
    const userData = ref([]);
    const tempDate = ref([]);
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
          if (item.title.includes(searchWord.value)) {
            tableData.value.push(item);
          }
        }
      }
    });

    getData();

    async function getData() {
      tableData.value = [];
      tempDate.value = [];
      const result = (await HttpManager.getAllFund()) as ResponseBody;
      const users = (await HttpManager.getAllUser()) as ResponseBody;
      tableData.value = result.data;
      userData.value = users.data;
      tempDate.value = result.data;
      currentPage.value = 1;
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

    /**
     * edit
     */
    const editVisible = ref(false);
    const editForm = reactive({
      id: "",
      type: "",
      amount: "",
      description: "",
      date: "",
    });

    function editRow(row) {
      idx.value = row.id;
      editForm.id = row.id;
      editForm.type = row.type;
      editForm.description = row.description;
      editForm.date = row.date;
      editForm.amount = row.amount;
      editVisible.value = true;
    }
    /*
     * new
     */
    const newVisible = ref(false);
    const newForm = reactive({
      id: "",
      type: "",
      amount: "",
      description: "",
      date: "",
    });

    function newRow() {
      newForm.id = "";
      newForm.type = "";
      newForm.description = "";
      newForm.date = "";
      newForm.amount = "";
      newVisible.value = true;
    }

    async function saveEdit() {
      const item = {
        id: editForm.id,
        type: editForm.type,
        amount: editForm.amount,
        description: editForm.description,
        date: editForm.date,
      };

      const result = (await HttpManager.updateFund(item)) as ResponseBody;

      if (result.code == "200") getData();
      editVisible.value = false;
    }

    async function saveFund() {
      const fund = {
        type: newForm.type,
        amount: newForm.amount,
        description: newForm.description,
        date: newForm.date,
      };

      const result = (await HttpManager.addFund(fund)) as ResponseBody;

      if (result.code == "200") getData();
      newVisible.value = false;
    }

    const idx = ref(-1);
    const multipleSelection = ref([]);
    const delVisible = ref(false);

    async function confirm() {
      const result = (await HttpManager.deleteFund(idx.value)) as ResponseBody;
      (proxy as any).$message({
        message: result.message,
        type: result.type,
      });
      if (result.code == "200") getData();
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
      searchWord,
      data,
      tableData,
      editVisible,
      newVisible,
      delVisible,
      pageSize,
      currentPage,
      newForm,
      editForm,
      getUserName,
      deleteAll,
      handleSelectionChange,
      saveEdit,
      attachImageUrl: HttpManager.attachImageUrl,
      editRow,
      newRow,
      handleCurrentChange,
      confirm,
      saveFund,
      deleteRow,
    };
  },
});
</script>

<style scoped></style>
