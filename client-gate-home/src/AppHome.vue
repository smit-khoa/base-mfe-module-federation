<template>
  <div class="home">
    <h1>home</h1>

    <div style="height: calc(100vh - 210px); width: 90%">
      <!-- <Table /> -->
      <!-- <Table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :selectable="true"
        row-key="id"
        @row-click="onRowClick"
        @selection-change="onSelectionChange"
        @sort-change="onSortChange"
        @filter-change="onFilterChange"
        @column-resize="onColumnResize"
      /> -->
      <!-- <Table
        :columns="columns"
        :data="tableData"
        :group-mode="true"
        group-by="department"
        :selectable="true"
        :expanded-groups="expandedGroups"
        @group-toggle="onGroupToggle"
        @update:expandedGroups="onUpdateExpandedGroups"
        @selection-change="onSelectionChange"
      /> -->

      <!-- Virtual Table với external data -->
      <Table2
        :container-height="500"
        :columns="virtualTableColumns"
        :rows="virtualTableRows"
        :is-checkbox="true"
        @selection-change="onSelectionChange"
      >
        <!-- Slot cho cột ID -->
        <template #cell-0="{ value }">
          <div class="custom-cell">
            <strong>{{ value }}</strong>
          </div>
        </template>

        <!-- Slot cho cột Name -->
        <template #cell-1="{ value }">
          <div class="custom-cell">
            <span class="user-name">{{ value }}</span>
          </div>
        </template>

        <!-- Slot cho cột Email -->
        <template #cell-2="{ value }">
          <div class="custom-cell">
            <a :href="`mailto:${value}`" class="email-link">{{ value }}</a>
          </div>
        </template>

        <!-- Slot cho cột Department -->
        <template #cell-3="{ value }">
          <div class="custom-cell">
            <span
              :class="[
                'department-badge',
                getDepartmentClass(value),
                'flex items-center justify-center',
              ]"
              style="height: 26px"
            >
              {{ value }}
            </span>
          </div>
        </template>

        <!-- Slot cho cột Position -->
        <template #cell-4="{ value }">
          <div class="custom-cell">
            <span class="position-text">{{ value }}</span>
          </div>
        </template>

        <!-- Slot cho cột Phone -->
        <template #cell-5="{ value }">
          <div class="custom-cell">
            <span class="phone-text">{{ value }}</span>
          </div>
        </template>

        <!-- Slot cho cột Age -->
        <template #cell-6="{ value }">
          <div class="custom-cell">
            <span class="age-badge">{{ value }} tuổi</span>
          </div>
        </template>

        <!-- Slot cho cột Status -->
        <template #cell-7="{ value }">
          <div class="status-cell">
            <span
              :class="[
                'status-badge',
                value ? 'status-active' : 'status-inactive',
                'flex items-center justify-center',
              ]"
              style="height: 26px"
            >
              {{ value ? "Hoạt động" : "Không hoạt động" }}
            </span>
          </div>
        </template>

        <!-- Slot cho cột Score -->
        <template #cell-8="{ value }">
          <div class="custom-cell">
            <div class="score-container">
              <div class="score-bar">
                <div
                  class="score-fill"
                  :style="{
                    width: `${value}%`,
                    backgroundColor: getScoreColor(value),
                  }"
                ></div>
              </div>
              <span class="score-text">{{ value }}%</span>
            </div>
          </div>
        </template>

        <!-- Slot cho cột Actions -->
        <template #cell-9="{ rowIndex, row }">
          <div class="actions-cell">
            <button class="action-btn edit-btn" @click="editRow(rowIndex, row)">
              ✏️
            </button>
            <button
              class="action-btn delete-btn"
              @click="deleteRow(rowIndex, row)"
            >
              🗑️
            </button>
            <button class="action-btn view-btn" @click="viewRow(rowIndex, row)">
              👁️
            </button>
          </div>
        </template>
      </Table2>
      <!-- <Table2 :data="users" :columns="columns2" :container-height="400" /> -->
      <!-- <Table2 /> -->
      <!-- <Table2
        :data="users"
        :columns="columns2"
        :enable-virtual-columns="true"
        :column-buffer="3"
        selectable
      /> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Trạng thái loading
const isLoading = ref(false);

// Định nghĩa các cột của bảng
const columns = ref([
  {
    key: "id",
    title: "ID",
    width: 80,
    dataType: "number",
    sortable: true,
    resizable: true,
    fixed: "left",
  },
  {
    key: "name",
    title: "Họ tên",
    width: 200,
    dataType: "text",
    sortable: true,
    filterable: true,
    resizable: true,
    fixed: "left",
  },
  {
    key: "email",
    title: "Email",
    width: 250,
    dataType: "text",
    sortable: true,
    filterable: true,
    resizable: true,
  },
  {
    key: "phone",
    title: "Số điện thoại",
    width: 150,
    dataType: "text",
    sortable: true,
    filterable: true,
    resizable: true,
  },
  {
    key: "department",
    title: "Phòng ban",
    width: 150,
    dataType: "text",
    sortable: true,
    filterable: true,
    resizable: true,
  },
  {
    key: "position",
    title: "Chức vụ",
    width: 150,
    dataType: "text",
    sortable: true,
    filterable: true,
    resizable: true,
  },
  {
    key: "startDate",
    title: "Ngày vào làm",
    width: 130,
    dataType: "date",
    sortable: true,
    filterable: true,
    resizable: true,
  },
  {
    key: "status",
    title: "Trạng thái",
    width: 120,
    dataType: "boolean",
    sortable: true,
    filterable: true,
    resizable: true,
  },
  {
    key: "actions",
    title: "Thao tác",
    width: 150,
    sortable: false,
    filterable: false,
    resizable: true,
    slot: "actions",
  },
]);

// Dữ liệu mẫu cho bảng - Tạo data phong phú cho grouping
const tableData = ref([
  // IT Department
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@company.com",
    phone: "0901234567",
    department: "IT",
    position: "Senior Developer",
    startDate: "2022-01-15",
    status: true,
  },
  {
    id: 2,
    name: "Hoàng Văn Em",
    email: "em.hoang@company.com",
    phone: "0901234571",
    department: "IT",
    position: "Junior Developer",
    startDate: "2023-08-01",
    status: true,
  },
  {
    id: 3,
    name: "Đặng Văn Giang",
    email: "giang.dang@company.com",
    phone: "0901234573",
    department: "IT",
    position: "DevOps Engineer",
    startDate: "2022-09-15",
    status: true,
  },
  {
    id: 4,
    name: "Lê Thị Hương",
    email: "huong.le@company.com",
    phone: "0901234580",
    department: "IT",
    position: "Frontend Developer",
    startDate: "2023-03-10",
    status: true,
  },
  {
    id: 5,
    name: "Trần Minh Khôi",
    email: "khoi.tran@company.com",
    phone: "0901234581",
    department: "IT",
    position: "Backend Developer",
    startDate: "2022-11-20",
    status: false,
  },

  // HR Department
  {
    id: 6,
    name: "Trần Thị Bình",
    email: "binh.tran@company.com",
    phone: "0901234568",
    department: "HR",
    position: "HR Manager",
    startDate: "2021-03-20",
    status: true,
  },
  {
    id: 7,
    name: "Bùi Thị Hạnh",
    email: "hanh.bui@company.com",
    phone: "0901234574",
    department: "HR",
    position: "HR Specialist",
    startDate: "2023-01-20",
    status: true,
  },
  {
    id: 8,
    name: "Võ Văn Lâm",
    email: "lam.vo@company.com",
    phone: "0901234582",
    department: "HR",
    position: "Recruiter",
    startDate: "2023-05-15",
    status: true,
  },

  // Finance Department
  {
    id: 9,
    name: "Lê Minh Cường",
    email: "cuong.le@company.com",
    phone: "0901234569",
    department: "Finance",
    position: "Accountant",
    startDate: "2022-06-10",
    status: false,
  },
  {
    id: 10,
    name: "Nguyễn Thị Mai",
    email: "mai.nguyen@company.com",
    phone: "0901234583",
    department: "Finance",
    position: "Financial Analyst",
    startDate: "2022-08-25",
    status: true,
  },
  {
    id: 11,
    name: "Phạm Văn Nam",
    email: "nam.pham@company.com",
    phone: "0901234584",
    department: "Finance",
    position: "Finance Manager",
    startDate: "2021-12-01",
    status: true,
  },

  // Marketing Department
  {
    id: 12,
    name: "Phạm Thị Dung",
    email: "dung.pham@company.com",
    phone: "0901234570",
    department: "Marketing",
    position: "Marketing Specialist",
    startDate: "2023-02-12",
    status: true,
  },
  {
    id: 13,
    name: "Lý Thị Oanh",
    email: "oanh.ly@company.com",
    phone: "0901234585",
    department: "Marketing",
    position: "Content Creator",
    startDate: "2023-07-08",
    status: true,
  },
  {
    id: 14,
    name: "Đỗ Văn Phúc",
    email: "phuc.do@company.com",
    phone: "0901234586",
    department: "Marketing",
    position: "Digital Marketing Manager",
    startDate: "2022-04-18",
    status: true,
  },
  {
    id: 15,
    name: "Huỳnh Thị Quỳnh",
    email: "quynh.huynh@company.com",
    phone: "0901234587",
    department: "Marketing",
    position: "SEO Specialist",
    startDate: "2023-09-12",
    status: false,
  },

  // Operations Department
  {
    id: 16,
    name: "Võ Thị Phượng",
    email: "phuong.vo@company.com",
    phone: "0901234572",
    department: "Operations",
    position: "Operations Manager",
    startDate: "2021-11-30",
    status: false,
  },
  {
    id: 17,
    name: "Cao Văn Sơn",
    email: "son.cao@company.com",
    phone: "0901234588",
    department: "Operations",
    position: "Project Coordinator",
    startDate: "2022-10-05",
    status: true,
  },
  {
    id: 18,
    name: "Trần Thị Thu",
    email: "thu.tran@company.com",
    phone: "0901234589",
    department: "Operations",
    position: "Quality Assurance",
    startDate: "2023-04-22",
    status: true,
  },

  // Sales Department
  {
    id: 19,
    name: "Nguyễn Văn Tùng",
    email: "tung.nguyen@company.com",
    phone: "0901234590",
    department: "Sales",
    position: "Sales Manager",
    startDate: "2021-09-14",
    status: true,
  },
  {
    id: 20,
    name: "Lê Thị Uyên",
    email: "uyen.le@company.com",
    phone: "0901234591",
    department: "Sales",
    position: "Sales Executive",
    startDate: "2022-12-08",
    status: true,
  },
  {
    id: 21,
    name: "Phan Văn Việt",
    email: "viet.phan@company.com",
    phone: "0901234592",
    department: "Sales",
    position: "Account Manager",
    startDate: "2023-06-30",
    status: true,
  },
]);

const users = ref([
  { id: 1, name: "Nguyễn Văn A", email: "a@example.com", age: 25 },
  { id: 2, name: "Trần Thị B", email: "b@example.com", age: 30 },
]);

const columns2 = ref([
  { field: "id", title: "ID", width: "80" },
  { field: "name", title: "Họ tên", width: "200" },
  { field: "email", title: "Email", width: "250" },
  { field: "age", title: "Tuổi", width: "100" },
]);

// Reactive variables cho grouping
const expandedGroups = ref(["IT", "HR"]); // Mở sẵn IT và HR groups

// Event handlers
const onRowClick = (row, index) => {
  console.log("Row clicked:", row, index);
};

const onSelectionChange = (selectedRows) => {
  console.log("Selected rows:", selectedRows);
  console.log("Number of selected rows:", selectedRows.length);
};

const onSortChange = (sort) => {
  console.log("Sort changed:", sort);
};

const onFilterChange = (filters) => {
  console.log("Filters changed:", filters);
};

const onColumnResize = (columnKey, newWidth) => {
  console.log("Column resized:", columnKey, newWidth);
};

const onGroupToggle = (groupKey, isExpanded) => {
  console.log(
    `Group ${groupKey} is now ${isExpanded ? "expanded" : "collapsed"}`
  );
};

const onUpdateExpandedGroups = (newExpandedGroups) => {
  expandedGroups.value = newExpandedGroups;
  console.log("Expanded groups updated:", newExpandedGroups);
};

// Remove fake data function as we have real data now
// const fakeData = () => {
//   for (let i = 0; i < 1000; i++) {
//     tableData.value.push(tableData.value[0]);
//   }
// };

onMounted(() => {
  // fakeData(); // Remove this line
  // console.log("Table data:", tableData.value);
  // console.log("Departments:", [
  //   ...new Set(tableData.value.map((item) => item.department)),
  // ]);
  // console.log("Mounted");

  for (let i = 0; i < 1000; i++) {
    const userData = {
      id: i,
      name: `Nguyễn Văn ${i}`,
      email: `nguyenvan${i}@example.com`,
      age: 25,
    };

    // Thêm dữ liệu cho các columns mới
    for (let j = 0; j < 20; j++) {
      userData[`column${j}`] = `Data ${i}-${j}`;
    }

    users.value.push(userData);
  }

  for (let i = 0; i < 200; i++) {
    columns2.value.push({
      field: `column${i}`,
      title: `Column ${i}`,
      width: 100,
    });
  }

  // Thêm demo data để test tô màu
  addDemoData();

  // console.log("✅ Demo data đã được thêm cho việc test tô màu");

  generateVirtualTableData();
  // console.log(
  //   "Virtual table data generated:",
  //   virtualTableRows.value.length,
  //   "rows"
  // );
});

// Column configuration cho Table2
const columnConfig = ref([
  {
    index: 2,
    title: "Cột Dropdown",
    width: 150,
    hasSlot: true,
    slotName: "cell-2",
  },
  {
    index: 5,
    title: "Cột Button",
    width: 140,
    hasSlot: true,
    slotName: "cell-5",
  },
  {
    index: 10,
    title: "Trạng thái",
    width: 120,
    hasSlot: true,
    slotName: "cell-10",
  },
  // Thêm cột demo cho tô màu
  {
    index: 3,
    title: "Điểm số",
    width: 100,
  },
  {
    index: 7,
    title: "Loại",
    width: 100,
  },
]);

// Thêm demo data với giá trị cụ thể để test tô màu
const addDemoData = () => {
  // Thêm một số data mẫu với giá trị cụ thể
  const demoValues = ["Cao", "Thấp", "Trung bình", "Xuất sắc", "Kém"];
  const scoreValues = [85, 92, 78, 95, 65, 88, 70, 82, 96, 73];

  // Override một số cell với giá trị demo
  for (let i = 0; i < Math.min(100, users.value.length); i++) {
    // Cột 3 - Điểm số
    if (users.value[i]) {
      users.value[i].col_3 = scoreValues[i % scoreValues.length];

      // Cột 7 - Loại
      users.value[i].col_7 = demoValues[i % demoValues.length];

      // Cột 15 - Status
      users.value[i].col_15 =
        i % 3 === 0 ? "Active" : i % 3 === 1 ? "Inactive" : "Pending";
    }
  }
};

// Event handlers cho custom slots
const onDropdownChange = (event, rowIndex) => {
  const action = event.target.value;
  if (action) {
    console.log(`Dropdown action: ${action} for row ${rowIndex}`);
    // Reset dropdown
    event.target.value = "";
  }
};

const onButtonClick = (rowIndex, value) => {
  console.log(`Button clicked for row ${rowIndex}, value: ${value}`);
  alert(`Thao tác cho dòng ${rowIndex}: ${value}`);
};

const getStatusClass = (value) => {
  // Tạo class dựa trên value để styling
  const hash = value.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const classes = [
    "status-success",
    "status-warning",
    "status-error",
    "status-info",
  ];
  return classes[Math.abs(hash) % classes.length];
};

// Virtual Table Data
const virtualTableColumns = ref([
  {
    key: "id",
    title: "ID",
    width: 80,
    hasSlot: true,
    fixed: true,
    visible: true,
    order: 0,
  },
  {
    key: "name",
    title: "Họ tên",
    width: 200,
    hasSlot: true,
    fixed: true,
    visible: true,
    order: 1,
  },
  {
    key: "email",
    title: "Email",
    width: 250,
    hasSlot: true,
    fixed: false,
    visible: true,
    order: 2,
  },
  {
    key: "department",
    title: "Phòng ban",
    width: 150,
    hasSlot: true,
    fixed: false,
    visible: true,
    order: 3,
  },
  {
    key: "position",
    title: "Chức vụ",
    width: 180,
    hasSlot: true,
    fixed: false,
    visible: true,
    order: 4,
  },
  {
    key: "phone",
    title: "Số điện thoại",
    width: 150,
    hasSlot: true,
    fixed: false,
    visible: true,
    order: 5,
  },
  {
    key: "age",
    title: "Tuổi",
    width: 80,
    hasSlot: true,
    fixed: false,
    visible: true,
    order: 6,
  },
  {
    key: "status",
    title: "Trạng thái",
    width: 120,
    hasSlot: true,
    fixed: false,
    visible: true,
    order: 7,
  },
  {
    key: "score",
    title: "Điểm số",
    width: 120,
    hasSlot: true,
    fixed: false,
    visible: true,
    order: 8,
  },
  {
    key: "actions",
    title: "Thao tác",
    width: 150,
    hasSlot: true,
    fixed: false,
    visible: true,
    order: 9,
  },
]);

const virtualTableRows = ref([]);

// Generate virtual table data
const generateVirtualTableData = () => {
  const departments = [
    "IT",
    "HR",
    "Finance",
    "Marketing",
    "Operations",
    "Sales",
  ];
  const positions = [
    "Manager",
    "Senior",
    "Junior",
    "Intern",
    "Lead",
    "Specialist",
  ];
  const names = [
    "Nguyễn Văn An",
    "Trần Thị Bình",
    "Lê Minh Cường",
    "Phạm Thị Dung",
    "Hoàng Văn Em",
    "Võ Thị Phương",
    "Đặng Minh Giang",
    "Bùi Thị Hạnh",
    "Lý Văn Khôi",
    "Cao Thị Lan",
    "Phan Minh Mạnh",
    "Đỗ Thị Nga",
  ];

  for (let i = 0; i < 1000; i++) {
    const department = departments[i % departments.length];
    const position = positions[i % positions.length];
    const name =
      names[i % names.length] + ` ${Math.floor(i / names.length) + 1}`;

    virtualTableRows.value.push({
      id: i + 1,
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, "")}${i}@company.com`,
      department: department,
      position: position,
      phone: `090${String(i).padStart(7, "0")}`,
      age: 22 + (i % 40),
      status: i % 3 !== 0,
      score: 60 + (i % 40),
    });
  }
};

// Virtual table methods
const getDepartmentClass = (department) => {
  const classMap = {
    IT: "dept-it",
    HR: "dept-hr",
    Finance: "dept-finance",
    Marketing: "dept-marketing",
    Operations: "dept-operations",
    Sales: "dept-sales",
  };
  return classMap[department] || "dept-default";
};

const getScoreColor = (score) => {
  if (score >= 90) return "#10b981";
  if (score >= 75) return "#3b82f6";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
};

const editRow = (rowIndex, row) => {
  console.log("Edit row:", rowIndex, row);
  alert(`Chỉnh sửa: ${row.name}`);
};

const deleteRow = (rowIndex, row) => {
  console.log("Delete row:", rowIndex, row);
  if (confirm(`Bạn có chắc muốn xóa ${row.name}?`)) {
    virtualTableRows.value.splice(rowIndex, 1);
  }
};

const viewRow = (rowIndex, row) => {
  console.log("View row:", rowIndex, row);
  alert(
    `Xem thông tin: ${row.name}\nEmail: ${row.email}\nPhòng ban: ${row.department}`
  );
};
</script>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  overflow: hidden;
}

/* Styles cho các button trong bảng */
.btn-edit {
  padding: 4px 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  font-size: 12px;
}

.btn-edit:hover {
  background-color: #2563eb;
}

.btn-delete {
  padding: 4px 12px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-delete:hover {
  background-color: #dc2626;
}

/* Custom cell styling cho slots */
.custom-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  gap: 8px;
}

.cell-value {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
}

.mini-dropdown {
  padding: 2px 4px;
  font-size: 11px;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  min-width: 50px;
}

.mini-dropdown:hover {
  border-color: #3b82f6;
}

.mini-button {
  padding: 2px 6px;
  font-size: 10px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
}

.mini-button:hover {
  background-color: #2563eb;
}

.status-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.status-badge {
  padding: 2px 6px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
}

.status-success {
  background-color: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.status-warning {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.status-error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.status-info {
  background-color: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

/* Department styles */
.dept-it {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.dept-hr {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.dept-finance {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.dept-marketing {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.dept-operations {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.dept-sales {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #333;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.dept-default {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* Status styles */
.status-active {
  background: #10b981;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-inactive {
  background: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
</style>
