<template>
  <div class="padding system-operator">
    <StyledCard>
      <div class="data" style="height: calc(100vh - 120px);">
        <div class="data-header margin-top flex cros-start">
          <div class="sub expand">
            <FilterBox
              v-model="filters"
              :defaults="filtersDefault"
              :fields="filtersFields"
              :disabled="pending"
              @on-submit="handleFilterSubmit"
              @on-reset="handleFilterReset"
            />
          </div>
          <div class="sub flex cros-center">
            <el-button
              class="margin-right"
              size="mini"
              type="success"
              @click="modalOperatorEdit = true"
            >
              新增
            </el-button>
            <ColumnToggle v-model="columnVisible" :columns="columnMaps" />
            <el-pagination
              class="margin-left"
              :current-page="pageNumber"
              :page-size="pageSize"
              layout="prev, next"
              :total="total"
              :disabled="pending"
              @current-change="handlePageNumChange"
            />
          </div>
        </div>
        <div class="data-body">
          <el-table
            v-loading="pending"
            :data="data"
            size="mini"
            height="100%"
            stripe
            border
          >
            <el-table-column type="index" label="#" width="60" align="center" />
            <el-table-column
              v-if="columnVisible.includes('nickName')"
              prop="nickName"
              label="操作员名称"
              min-width="120"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.nickName || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="columnVisible.includes('username')"
              prop="username"
              label="登录账号"
              min-width="120"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.username || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="columnVisible.includes('mobile')"
              prop="mobile"
              label="手机号码"
              min-width="120"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.mobile || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="columnVisible.includes('status')"
              prop="status"
              label="状态"
              min-width="70"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-switch
                  v-model="row.status"
                  active-value="Y"
                  inactive-value="N"
                  active-color="#14c85a"
                  :disabled="row.username === 'admin'"
                  @change="handleChangeStatusRow(row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              v-if="columnVisible.includes('creator')"
              prop="creator"
              label="创建人"
              min-width="120"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.creator || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="columnVisible.includes('createTime')"
              prop="createTime"
              label="创建时间"
              min-width="160"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.createTime || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="258"
              align="center"
              fixed="right"
            >
              <template slot-scope="{ row }">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleEditRow(row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="warning"
                  size="mini"
                  plain
                  @click="handleModifyPasswordRow(row)"
                >
                  修改密码
                </el-button>
                <el-button
                  type="success"
                  size="mini"
                  plain
                  @click="handleRoleEditRow(row)"
                >
                  角色分配
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="data-footer margin-top flex cros-start">
          <div class="sub expand"></div>
          <div class="sub padding-large-x">
            <el-pagination
              ref="pager"
              :current-page="pageNumber"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              :disabled="pending"
              @size-change="handlePageSizeChange"
              @current-change="handlePageNumChange"
            />
          </div>
        </div>
      </div>
    </StyledCard>

    <ModalOperatorEdit
      v-model="modalOperatorEdit"
      client-id="manage"
      :operator="modalOperatorEditRow"
      @on-success="fetchList"
    />

    <ModalModifyPassword
      v-model="modalModifyPassword"
      :operator="modalModifyPasswordRow"
    />

    <ModalRoleEdit
      v-model="modalRoleEdit"
      :client-id="filters.client"
      :operator="modalRoleEditRow"
    />
  </div>
</template>

<script>
import {
  GetOperatorsParams,
  GetOperators,
  ToggleOperatorStatus
} from '@/api/system/operator';

// 单元格配置
const COLUMN_MAPS = [
  {
    prop: 'index',
    label: '#',
    disabled: true
  },
  {
    prop: 'nickName',
    label: '操作员名称'
  },
  {
    prop: 'username',
    label: '登录账号'
  },
  {
    prop: 'mobile',
    label: '手机号码'
  },
  {
    prop: 'status',
    label: '状态'
  },
  {
    prop: 'creator',
    label: '创建人'
  },
  {
    prop: 'createTime',
    label: '创建时间'
  }
];

export default {
  name: 'systemOperator',
  components: {
    StyledCard: () => import('_c/StyledCard'),
    FilterBox: () => import('_c/FilterBox'),
    ColumnToggle: () => import('_c/ColumnToggle'),
    ModalOperatorEdit: () => import('./components/ModalOperatorEdit'),
    ModalModifyPassword: () => import('./components/ModalModifyPassword'),
    ModalRoleEdit: () => import('./components/ModalRoleEdit')
  },
  data() {
    return {
      pending: false,
      filters: { ...GetOperatorsParams },
      filtersDefault: { ...GetOperatorsParams },
      columnMaps: COLUMN_MAPS,
      columnVisible: [...COLUMN_MAPS].map(set => set.prop),
      clients: [],
      data: [],
      total: 0,
      pageNumber: 1,
      pageSize: 10,
      modalOperatorEdit: false,
      modalOperatorEditRow: null,
      modalModifyPassword: false,
      modalModifyPasswordRow: null,
      modalRoleEdit: false,
      modalRoleEditRow: null
    };
  },
  computed: {
    // 筛选条件配置
    filtersFields() {
      return [
        {
          key: 'nickName',
          title: '操作员名称',
          placeholder: '请输入',
          maxlength: 16
        },
        {
          key: 'username',
          title: '登录账号',
          placeholder: '请输入',
          maxlength: 16
        },
        {
          key: 'mobile',
          title: '手机号码',
          placeholder: '请输入',
          maxlength: 11
        },
        {
          key: 'status',
          title: '状态',
          widget: 'select',
          style: { width: '120px' },
          enums: [
            {
              key: 'Y',
              value: '正常'
            },
            {
              key: 'N',
              value: '禁用'
            }
          ]
        }
      ];
    }
  },
  watch: {
    modalOperatorEdit(visible) {
      if (visible) return;
      this.modalOperatorEditRow = null;
    },
    modalModifyPassword(visible) {
      if (visible) return;
      this.modalModifyPasswordRow = null;
    }
  },
  methods: {
    // 加载页面数据
    async fetchList() {
      try {
        this.pending = true;
        const { pageNumber, pageSize } = this;
        const data = await GetOperators(this.filters, {
          pageNumber,
          pageSize
        });
        this.data = data.records;
        this.total = +data.total;
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      } finally {
        this.pending = false;
      }
    },

    // 编辑条目
    handleEditRow(row) {
      this.modalOperatorEditRow = row;
      this.modalOperatorEdit = true;
    },

    // 修改密码
    handleModifyPasswordRow(row) {
      this.modalModifyPasswordRow = row;
      this.modalModifyPassword = true;
    },

    // 角色分配
    handleRoleEditRow(row) {
      this.modalRoleEditRow = row;
      this.modalRoleEdit = true;
    },

    // 修改操作员状态
    async handleChangeStatusRow(row) {
      if (row.username === 'admin') return;

      try {
        const _action = row.status === 'Y' ? '启用' : '禁用';
        await this.$confirm(`确定${_action}该操作员？`, '操作提示', {
          type: 'warning'
        });

        await ToggleOperatorStatus(row.id, row.status);

        this.msg({
          type: 'success',
          content: '操作成功'
        });
      } catch (error) {
        if (error === 'cancel') {
          row.status = row.status === 'Y' ? 'N' : 'Y';
          return;
        }
        this.msg({
          type: 'error',
          content: error
        });
      }
    },

    // 提交搜索
    handleFilterSubmit(options) {
      this.filters = options;
      this.pageNumber = 1;
      this.fetchList();
    },

    // 重置搜索
    handleFilterReset(options) {
      this.filters = options;
      this.pageNumber = 1;
      this.fetchList();
    },

    handlePageSizeChange(size) {
      this.pageSize = size;
      this.pageNumber = 1;
      this.fetchList();
    },

    handlePageNumChange(num) {
      this.pageNumber = num;
      this.fetchList();
    }
  },
  mounted() {
    this.fetchList();
  }
};
</script>
