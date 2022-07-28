<template>
  <div class="padding system-role">
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
              v-if="
                hasPermission(
                  '75d92edc-d6eb-436f-822b-6e17f23d1c60',
                  'FUNCTION'
                )
              "
              class="margin-right"
              size="mini"
              type="success"
              @click="modalRoleEdit = true"
            >
              新增
            </el-button>
            <ColumnToggle v-model="columnVisible" :columns="columnMaps" />
            <el-pagination
              class="margin-left"
              size="mini"
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
              v-if="columnVisible.includes('title')"
              prop="title"
              label="角色名称"
              min-width="120"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.title || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="columnVisible.includes('identifier')"
              prop="identifier"
              label="角色标识"
              min-width="140"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.identifier || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="columnVisible.includes('description')"
              prop="description"
              label="角色描述"
              min-width="200"
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.description || '-' }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="columnVisible.includes('status')"
              prop="status"
              label="状态"
              min-width="100"
              align="center"
            >
              <template slot-scope="{ row }">
                <el-tag v-if="row.status === 'Y'" type="success" size="small">
                  正常
                </el-tag>
                <el-tag
                  v-else-if="row.status === 'N'"
                  type="danger"
                  size="small"
                >
                  禁用
                </el-tag>
                <template v-else>-</template>
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
              width="234"
              align="center"
              fixed="right"
            >
              <template slot-scope="{ row }">
                <el-button
                  v-if="
                    hasPermission(
                      '82fb2114-b181-4dd8-a609-bcd5c1e9dab9',
                      'FUNCTION'
                    )
                  "
                  type="primary"
                  size="mini"
                  @click="handleEditRow(row)"
                >
                  修改
                </el-button>
                <el-button
                  v-if="
                    hasPermission(
                      '014a9c97-5511-47aa-a6d3-cc20f27e319a',
                      'FUNCTION'
                    )
                  "
                  type="success"
                  size="mini"
                  plain
                  @click="handleAuthEditRow(row)"
                >
                  分配权限
                </el-button>
                <el-button
                  v-if="
                    hasPermission(
                      'b93a78b5-26a3-4784-8b3d-c0f37f0dfc06',
                      'FUNCTION'
                    )
                  "
                  type="danger"
                  size="mini"
                  plain
                  @click="handleDeleteRow(row)"
                >
                  删除
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

    <ModalRoleEdit
      v-if="
        hasPermission('75d92edc-d6eb-436f-822b-6e17f23d1c60', 'FUNCTION') ||
          hasPermission('82fb2114-b181-4dd8-a609-bcd5c1e9dab9', 'FUNCTION')
      "
      v-model="modalRoleEdit"
      :client-id="filters.clientId"
      :role="modalRoleEditRow"
      @on-success="fetchList"
    />

    <ModalAuthEdit
      v-if="hasPermission('014a9c97-5511-47aa-a6d3-cc20f27e319a', 'FUNCTION')"
      v-model="modalAuthEdit"
      :client-id="filters.clientId"
      :role="modalAuthEditRow"
      @on-success="fetchList"
    />
  </div>
</template>

<script>
import { GetClients } from '@/api/system/clients';

import { GetRolesOfPage, DeleteRole } from '@/api/system/roles';

import { getUser } from '@/utils/app';

// 获取缓存用户
const USER = getUser();

// 单元格配置
const COLUMN_MAPS = [
  {
    prop: 'index',
    label: '#',
    disabled: true
  },
  {
    prop: 'title',
    label: '角色名称'
  },
  {
    prop: 'identifier',
    label: '角色标识'
  },
  {
    prop: 'description',
    label: '角色描述'
  },
  {
    prop: 'status',
    label: '创建人'
  },
  {
    prop: 'createTime',
    label: '创建时间'
  }
];

export default {
  name: 'systemRole',
  components: {
    StyledCard: () => import('_c/StyledCard'),
    FilterBox: () => import('_c/FilterBox'),
    ColumnToggle: () => import('_c/ColumnToggle'),
    ModalRoleEdit: () => import('./components/ModalRoleEdit'),
    ModalAuthEdit: () => import('./components/ModalAuthEdit')
  },
  data() {
    return {
      pending: false,
      filters: { clientId: USER ? USER.client : null },
      filtersDefault: { clientId: USER ? USER.client : null },
      columnMaps: COLUMN_MAPS,
      columnVisible: [...COLUMN_MAPS].map(set => set.prop),
      clients: [],
      data: [],
      total: 0,
      pageNumber: 1,
      pageSize: 20,
      modalRoleEdit: false,
      modalRoleEditRow: null,
      modalAuthEdit: false,
      modalAuthEditRow: null
    };
  },
  computed: {
    // 筛选条件配置
    filtersFields() {
      const _fields = [];

      if (
        this.hasPermission('6c4a83d9-c853-41cd-ba3a-0c5ef79ac2db', 'FUNCTION')
      ) {
        _fields.push({
          key: 'clientId',
          title: '客户端',
          widget: 'select',
          style: { width: '180px' },
          clearable: false,
          enums: [...this.clients].map(row => {
            return {
              key: row.clientId,
              value: row.name
            };
          })
        });
      }

      return _fields;
    }
  },
  watch: {
    // 切换客户端时加载对应的权限菜单
    currentClient() {
      this.fetchList();
    },

    modalRoleEdit(visible) {
      if (visible) return;
      this.modalRoleEditRow = null;
    },

    modalAuthEdit(visible) {
      if (visible) return;
      this.modalAuthEditRow = null;
    }
  },
  methods: {
    // 初始化
    async init() {
      try {
        // 初始化客户端列表
        this.clients = await GetClients();
        this.fetchList();
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      }
    },

    // 加载页面数据
    async fetchList() {
      try {
        this.pending = true;
        const data = await GetRolesOfPage(this.filters.clientId, {
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
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
      this.modalRoleEditRow = row;
      this.modalRoleEdit = true;
    },

    // 分配权限
    handleAuthEditRow(row) {
      this.modalAuthEditRow = row;
      this.modalAuthEdit = true;
    },

    // 删除角色
    async handleDeleteRow(row) {
      try {
        await this.$confirm('确定删除该角色？', '操作提示', {
          type: 'warning'
        });

        await DeleteRole(row.id);

        this.fetchList();

        this.msg({
          type: 'success',
          content: '操作成功'
        });
      } catch (error) {
        if (error === 'cancel') return;
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
    this.init();
  }
};
</script>
