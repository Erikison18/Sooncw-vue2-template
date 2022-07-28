<template>
  <div class="padding system-role">
    <StyledCard>
      <div class="flex auth-box">
        <div v-loading="menuPending" class="sub menus">
          <div class="flex head">
            <div class="expand before">
              <el-select
                v-if="
                  hasPermission(
                    'f1130472-f106-4b9f-b861-16dec2baa517',
                    'FUNCTION'
                  )
                "
                v-model="currentClient"
                placeholder="请选择一个客户端"
                size="mini"
              >
                <el-option
                  v-for="(client, inndex) in clients"
                  :key="inndex"
                  :label="client.name"
                  :value="client.clientId"
                />
              </el-select>
            </div>
            <div class="after">
              <el-button
                v-if="
                  hasPermission(
                    '06b4ac4a-09a0-46c6-9b18-d76cae3155ee',
                    'FUNCTION'
                  )
                "
                size="mini"
                type="success"
                @click="modalMenuEdit = true"
              >
                新增菜单权限
              </el-button>
              <el-radio-group
                class="margin-left"
                v-model="authMenuViewMode"
                size="mini"
              >
                <el-radio-button label="TREE">树形</el-radio-button>
                <el-radio-button label="TABLE">表格</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="scroll padding-small">
            <el-tree
              v-if="authMenuViewMode === 'TREE'"
              :data="menusTree"
              icon-class="kd-icon kd-icon-arrow_right"
              :expand-on-click-node="false"
              highlight-current
              @node-click="handleMenuRowChange"
            >
              <div class="flex cros-center auth-menu-row" slot-scope="{ data }">
                <div class="expand flex cros-center base">
                  <i
                    class="kd-icon kd-icon-order handle-copy"
                    v-clipboard="data.identifier"
                    @success="handleCopySuccess"
                    @error="handleCopyError"
                    title="复制权限标识"
                  />
                  <span class="title">{{ data.title }}</span>
                </div>
                <div class="flex main-end options">
                  <el-button
                    v-if="
                      hasPermission(
                        '06b4ac4a-09a0-46c6-9b18-d76cae3155ee',
                        'FUNCTION'
                      )
                    "
                    size="mini"
                    type="success"
                    @click="handleCreateMenuSub(data)"
                  >
                    添加子级
                  </el-button>
                  <el-button
                    v-if="
                      hasPermission(
                        '32b12bc4-9571-4aab-b3da-715cc4cb0fc1',
                        'FUNCTION'
                      )
                    "
                    size="mini"
                    type="primary"
                    plain
                    @click="handleEditMenu(data)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-if="
                      hasPermission(
                        '976590dd-d6c4-411e-b2b8-013d55c7c896',
                        'FUNCTION'
                      )
                    "
                    size="mini"
                    type="danger"
                    plain
                    @click="handleDeleteMenu(data)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </el-tree>
            <el-table
              v-if="authMenuViewMode === 'TABLE'"
              :data="menusTree"
              row-key="id"
              size="mini"
              height="480px"
              border
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              @row-click="handleMenuRowChange"
              highlight-current-row
            >
              <el-table-column
                type="index"
                label="#"
                width="60"
                align="center"
              />
              <el-table-column prop="title" label="权限名称" min-width="300">
                <div class="text-align-center" slot="header">权限名称</div>
                <span slot-scope="{ row }" class="name" :title="row.title">
                  {{ row.title || '-' }}
                </span>
              </el-table-column>
              <el-table-column
                prop="hierarchy"
                label="层级"
                width="100"
                align="center"
              >
                <template slot-scope="{ row }">
                  {{ row.hierarchy || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                prop="identifier"
                label="权限标识"
                width="280"
                align="center"
              >
                <template slot-scope="{ row }">
                  {{ row.identifier || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="235"
                align="center"
                fixed="right"
              >
                <template slot-scope="{ row }">
                  <el-button
                    v-if="
                      hasPermission(
                        '06b4ac4a-09a0-46c6-9b18-d76cae3155ee',
                        'FUNCTION'
                      )
                    "
                    size="mini"
                    type="success"
                    @click="handleCreateMenuSub(row)"
                  >
                    添加子级
                  </el-button>
                  <el-button
                    v-if="
                      hasPermission(
                        '32b12bc4-9571-4aab-b3da-715cc4cb0fc1',
                        'FUNCTION'
                      )
                    "
                    size="mini"
                    type="primary"
                    plain
                    @click="handleEditMenu(row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-if="
                      hasPermission(
                        '976590dd-d6c4-411e-b2b8-013d55c7c896',
                        'FUNCTION'
                      )
                    "
                    size="mini"
                    type="danger"
                    plain
                    @click="handleDeleteMenu(row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="flex main-center foot">
            <div class="expand">
              <div class="count">共 {{ menus.length }} 个菜单权限</div>
            </div>
            <div class="after">
              <el-button
                v-if="
                  hasPermission(
                    '06b4ac4a-09a0-46c6-9b18-d76cae3155ee',
                    'FUNCTION'
                  )
                "
                size="mini"
                type="success"
                @click="modalMenuEdit = true"
              >
                新增菜单权限
              </el-button>
            </div>
          </div>
        </div>
        <div v-loading="resourcePending" class="sub resources">
          <div class="flex cros-center head">
            <div class="expand">
              <h4 v-if="currentMenu" class="padding-x">
                <span>
                  {{ currentMenu.title || '' }}
                </span>
                的资源权限
              </h4>
            </div>
            <div v-if="currentMenu" class="after">
              <el-button
                v-if="
                  hasPermission(
                    '53768510-11bb-4480-abd7-6a3f0f843ec2',
                    'FUNCTION'
                  ) && resources.length
                "
                size="mini"
                type="danger"
                plain
                @click="handleClearResources"
              >
                清空资源
              </el-button>
              <el-button
                v-if="
                  hasPermission(
                    '973a281a-2722-44e4-9ee5-14dbf15fb9aa',
                    'FUNCTION'
                  )
                "
                size="mini"
                type="success"
                @click="handleCreateResource"
              >
                新增资源
              </el-button>
            </div>
          </div>
          <div class="scroll padding-small">
            <el-table :data="resources" size="mini" height="100%" border>
              <el-table-column
                type="index"
                label="#"
                width="60"
                align="center"
              />
              <el-table-column
                prop="title"
                label="权限名称"
                min-width="180"
                align="center"
              >
                <span slot-scope="{ row }" class="name" :title="row.title">
                  {{ row.title || '-' }}
                </span>
              </el-table-column>
              <el-table-column
                prop="identifier"
                label="权限标识"
                min-width="280"
                align="center"
              >
                <template slot-scope="{ row }">
                  {{ row.identifier || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                prop="method"
                label="请求方式"
                min-width="80"
                align="center"
              >
                <template slot-scope="{ row }">
                  {{ row.method || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                prop="url"
                label="后端接口"
                min-width="300"
                align="center"
              >
                <template slot-scope="{ row }">
                  {{ row.url || '-' }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="
                  hasPermission(
                    'df1314e0-be13-454a-a88f-66d74d8ea4ac',
                    'FUNCTION'
                  ) ||
                    hasPermission(
                      'aea902d0-32f7-4ad0-a5b0-097be09fca56',
                      'FUNCTION'
                    )
                "
                label="操作"
                width="145"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="
                      hasPermission(
                        'df1314e0-be13-454a-a88f-66d74d8ea4ac',
                        'FUNCTION'
                      )
                    "
                    size="mini"
                    type="primary"
                    plain
                    @click="handleEditResource(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    v-if="
                      hasPermission(
                        'aea902d0-32f7-4ad0-a5b0-097be09fca56',
                        'FUNCTION'
                      )
                    "
                    size="mini"
                    type="danger"
                    plain
                    @click="handleDeleteResource(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="flex foot">
            <div class="expand"></div>
            <div v-if="currentMenu" class="after">
              <el-button
                v-if="
                  hasPermission(
                    '53768510-11bb-4480-abd7-6a3f0f843ec2',
                    'FUNCTION'
                  ) && resources.length
                "
                size="mini"
                type="danger"
                plain
                @click="handleClearResources"
              >
                清空资源
              </el-button>
              <el-button
                v-if="
                  hasPermission(
                    '973a281a-2722-44e4-9ee5-14dbf15fb9aa',
                    'FUNCTION'
                  )
                "
                size="mini"
                type="success"
                @click="handleCreateResource"
              >
                新增资源
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </StyledCard>

    <ModalMenuEdit
      v-model="modalMenuEdit"
      :client-id="currentClient"
      :menu="modalMenuEditRow"
      :parent-id="modalMenuCreateParent"
      @on-success="fetchMenus"
    />

    <ModalResourceEdit
      v-model="modalResourceEdit"
      :menu-id="currentMenu ? currentMenu.menuId : null"
      :resource="modalResourceEditRow"
      @on-success="fetchResources"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import VueClipboards from 'vue-clipboards';
Vue.use(VueClipboards);

import { GetClients } from '@/api/system/clients';

import {
  ReduceAuthMenus,
  GetAuthMenusOfClient,
  DeleteMenu
} from '@/api/system/authority_menus';

import {
  GetResourcesOfMenu,
  DeleteResourceOfMenu
} from '@/api/system/authority_resources';
import { DeleteResource } from '../../../api/system/authority_resources';

import { getUser } from '@/utils/app';

// 获取缓存用户
const USER = getUser();

export default {
  name: 'systemAuthority',
  components: {
    StyledCard: () => import('_c/StyledCard'),
    ModalMenuEdit: () => import('./components/ModalMenuEdit'),
    ModalResourceEdit: () => import('./components/ModalResourceEdit')
  },
  data() {
    return {
      pending: false,
      authMenuViewMode: 'TREE',
      clients: [],
      currentClient: USER ? USER.client : null,
      menus: [],
      menuPending: false,
      currentMenu: null,
      resources: [],
      resourcePending: false,
      modalMenuEdit: false,
      modalMenuEditRow: null,
      modalMenuCreateParent: null,
      modalResourceEdit: false,
      modalResourceEditRow: null
    };
  },
  computed: {
    // 渲染使用的菜单资源树
    menusTree() {
      return ReduceAuthMenus(this.menus);
    },

    // 筛选条件配置
    filtersFields() {
      return [
        {
          key: 'roleName',
          title: '权限名称',
          placeholder: '请输入'
        }
      ];
    }
  },
  watch: {
    // 切换客户端时加载对应的权限菜单
    currentClient() {
      this.currentMenu = null;
      this.fetchMenus();
    },

    // 选择菜单条目时，获取对应的资源
    currentMenu() {
      this.fetchResources();
    },

    modalMenuEdit(visible) {
      if (visible) return;
      this.modalMenuEditRow = null;
      this.modalMenuCreateParent = null;
    },

    modalResourceEdit(visible) {
      if (visible) return;
      this.modalResourceEditRow = null;
    }
  },
  methods: {
    // 初始化
    async init() {
      try {
        // 初始化客户端列表
        this.clients = await GetClients();
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      }
    },

    // 加载指定客户端下的菜单权限
    async fetchMenus() {
      try {
        this.menuPending = true;
        this.menus = await GetAuthMenusOfClient(this.currentClient);
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      } finally {
        this.menuPending = false;
      }
    },

    // 获取指定菜单的资源
    async fetchResources() {
      try {
        if (!this.currentMenu) {
          this.resources = [];
          return;
        }
        this.resourcePending = true;
        this.resources = await GetResourcesOfMenu(this.currentMenu.menuId);
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      } finally {
        this.resourcePending = false;
      }
    },

    //  选择菜单
    handleMenuRowChange(row) {
      this.currentMenu = row;
    },

    // 新增菜单资源
    handleCreateMenu() {
      this.modalMenuEdit = true;
    },

    // 编辑菜单资源
    handleEditMenu(row) {
      this.modalMenuEditRow = row;
      this.modalMenuEdit = true;
    },

    // 给指定的菜单资源添加子级
    handleCreateMenuSub(row) {
      this.modalMenuCreateParent = row.menuId;
      this.modalMenuEdit = true;
    },

    // 删除菜单资源
    async handleDeleteMenu(row) {
      try {
        await this.$confirm(
          '确定删除该菜单权限，这将删除该菜单权限下的所有子级及其子级的子级？',
          '操作提示',
          {
            type: 'error'
          }
        );

        this.menuPending = true;

        await DeleteMenu(row.menuId);

        this.menus = await GetAuthMenusOfClient(this.currentClient);

        this.currentMenu = null;
        this.resources = [];

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
      } finally {
        this.menuPending = false;
      }
    },

    // 新增权限资源
    handleCreateResource() {
      try {
        const { currentMenu } = this;
        if (!currentMenu) throw '请选择一个菜单资源';
        this.modalResourceEdit = true;
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      }
    },

    // 编辑权限资源
    handleEditResource(row) {
      try {
        const { currentMenu } = this;
        if (!currentMenu) throw '请选择一个菜单资源';
        this.modalResourceEdit = true;
        this.modalResourceEditRow = row;
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      }
    },

    // 删除权限资源
    async handleDeleteResource(row) {
      try {
        await this.$confirm('确定删除该权限资源？', '操作提示', {
          type: 'error'
        });

        this.menuPending = true;

        await DeleteResource(row.id);

        await this.fetchResources();

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
      } finally {
        this.menuPending = false;
      }
    },

    // 清空指定菜单下的所有资源
    async handleClearResources() {
      try {
        const { currentMenu } = this;
        if (!currentMenu) throw '请选择一个菜单资源';

        await this.$confirm('确定清空当前菜单下的权限资源？', '操作提示', {
          type: 'error'
        });

        this.resourcePending = true;

        await DeleteResourceOfMenu(currentMenu.menuId);

        this.resources = await GetResourcesOfMenu(this.currentMenu.menuId);

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
      } finally {
        this.resourcePending = false;
      }
    },

    handleCopySuccess() {
      this.msg({
        type: 'success',
        content: '已复制到剪贴板'
      });
    },

    handleCopyError() {
      this.msg({
        type: 'error',
        content: '您的浏览器不支持复制到剪贴板'
      });
    }
  },
  mounted() {
    this.init();
    this.fetchMenus();
  }
};
</script>

<style lang="scss">
@import '../../../styles/const.scss';

.el-tree-node__content {
  border-radius: 4px;
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 5px;
  margin: 4px 0;
  height: unset;
}

.auth-menu-row {
  position: relative;
  width: 100%;

  .base {
    font-size: 0.95rem;
    overflow: hidden;
    position: relative;

    // 复制图标
    .handle-copy {
      color: $colorTextLight;
      align-items: center;
      cursor: pointer;
      display: flex;
      font-size: 18px;
      justify-content: center;
      height: 28px;
      width: 28px;

      &:hover {
        color: $colorSitSuccess;
      }
    }

    span {
      display: block;
    }

    .title {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .hierarchy {
      color: $colorTextLight;
      font-size: 0.8rem;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .identifier {
    font-size: 0.8rem;
  }

  .options {
    flex-shrink: 0;
    margin-left: $void;
  }
}

.expanded + .auth-menu-row {
  & > .base {
    .title {
      font-weight: bold;
    }
  }
}

.is-current > .el-tree-node__content > .auth-menu-row {
  & > .base {
    .title {
      color: $colorPrimary;
      font-weight: bold;
    }
  }
}
</style>

<style lang="scss" scoped>
@import '../../../styles/const.scss';

.auth-box {
  margin-top: $void;
  position: relative;

  .sub {
    border: 1px $colorBorder solid;
    border-radius: 3px;
    flex: 1;
    overflow: hidden;

    .count {
      color: $colorTextLight;
      font-size: 0.8rem;
      padding: 0 $void;
    }

    .scroll {
      height: (calc(100vh - 224px));
      overflow: auto;
    }

    &.menus {
      margin-right: $void / 2;
    }

    &.resources {
      margin-left: $void / 2;
    }

    .head,
    .foot {
      padding: $voidSmall;
      position: relative;
    }

    .head,
    .foot {
      background-color: fade-out($colorBorder, 0.8);
      height: 30px;

      h4 {
        display: flex;
        font-size: 0.9rem;
        font-weight: bold;
        height: 28px;
        line-height: 28px;

        span {
          display: block;
          overflow: hidden;
          max-width: 200px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .head {
      border-bottom: 1px $colorBorder solid;
    }

    .foot {
      border-top: 1px $colorBorder solid;
    }

    // 权限名称
    .name {
      color: $colorText;
      font-weight: bold;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
