<template>
  <div class="container">
    <div class="handle-box">
      <el-button @click="deleteAll">Batch Delete</el-button>
      <el-input v-model="searchWord" placeholder="Filter keywords"></el-input>
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
      <el-table-column label="Images" width="130" align="center">
        <template v-slot="scope">
          <img
            :src="`http://localhost:9000/uhauction/item/img/${scope.row.cover}`"
            style="width: 80px"
          />
          <el-button @click="goImagesPage(scope.row.id)">Edit</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="Item Name"
        width="180"
      ></el-table-column>
      <el-table-column label="Description">
        <template v-slot="scope">
          <p style="height: 100px; overflow: scroll">
            {{ scope.row.content }}
          </p>
        </template>
      </el-table-column>

      <el-table-column label="Donor" width="100">
        <template v-slot="scope">
          {{ getUserName(scope.row.donorId) }}
        </template>
      </el-table-column>

      <el-table-column label="End Time" width="100">
        <template v-slot="scope">
          {{ formatDate(scope.row.endTime) }}
        </template>
      </el-table-column>

      <el-table-column label="Comment" width="90" align="center">
        <template v-slot="scope">
          <el-button @click="goCommentPage(scope.row.id)">Edit</el-button>
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

  <!-- Edit pop-up box -->
  <el-dialog title="Edit" v-model="editVisible">
    <el-form :model="editForm">
      <el-form-item label="Name">
        <el-input v-model="editForm.title"></el-input>
      </el-form-item>
      <el-form-item label="Content">
        <el-input type="textarea" v-model="editForm.content"></el-input>
      </el-form-item>
      <el-form-item label="End Time">
        <el-date-picker
          v-model="editForm.endTime"
          type="date"
          :picker-options="pickerOptions"
          placeholder="Select Auction End Date"
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
import mixin from "@/mixins/mixin";
import { HttpManager } from "@/api/index";
import { RouterName } from "@/enums";
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
    const { routerManager } = mixin();

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
      const result = (await HttpManager.getAllItem()) as ResponseBody;
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

    function uploadUrl(id) {
      return HttpManager.attachImageUrl(`/songList/img/update?id=${id}`);
    }


    /**
     * route
     */
    function goImagesPage(id) {
      const breadcrumbList = reactive([
        {
          path: RouterName.ItemList,
          name: "Item List",
        },
        {
          path: "",
          name: "Images",
        },
      ]);
      proxy.$store.commit("setBreadcrumbList", breadcrumbList);
      routerManager(RouterName.Images, {
        path: RouterName.Images,
        query: { id },
      });
    }

    function goCommentPage(id) {
      const breadcrumbList = reactive([
        {
          path: RouterName.ItemList,
          name: "Item List",
        },
        {
          path: "",
          name: "Comment Detail",
        },
      ]);
      proxy.$store.commit("setBreadcrumbList", breadcrumbList);
      routerManager(RouterName.Comment, {
        path: RouterName.Comment,
        query: { id },
      });
    }

    /**
     * add
     */
    const centerDialogVisible = ref(false);
    const registerForm = reactive({
      title: "",
      content: "",
      endTime: "",
    });



    /**
     * edit
     */
    const editVisible = ref(false);
    const editForm = reactive({
      id: "",
      title: "",
      pic: "",
      content: "",
      endTime: "",
      bidCount: "",
      highestBid: ""
    });

    function editRow(row) {
      idx.value = row.id;
      editForm.id = row.id;
      editForm.title = row.title;
      editForm.pic = row.pic;
      editForm.content = row.content;
      editForm.endTime = row.endTime;
      editForm.bidCount = row.bidCount;
      editForm.highestBid = row.highestBid;
      editVisible.value = true;
    }

    async function saveEdit() {
    const item = {
        id: editForm.id,
        title: editForm.title,
        content: editForm.content,
        endTime: editForm.endTime,
        bidCount: editForm.bidCount,
        highestBid: editForm.highestBid
    };

    const result = await HttpManager.updateItem(item) as ResponseBody;

    if (result.code == "200") getData();
    editVisible.value = false;
}


    const idx = ref(-1);
    const multipleSelection = ref([]);
    const delVisible = ref(false);

    async function confirm() {
      const result = (await HttpManager.deleteItem(idx.value)) as ResponseBody;
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
      centerDialogVisible,
      editVisible,
      delVisible,
      pageSize,
      currentPage,
      registerForm,
      editForm,
      getUserName,
      deleteAll,
      handleSelectionChange,
      saveEdit,
      attachImageUrl: HttpManager.attachImageUrl,
      uploadUrl,
      editRow,
      handleCurrentChange,
      confirm,
      deleteRow,
      goImagesPage,
      goCommentPage,
    };
  },
});
</script>

<style scoped></style>
