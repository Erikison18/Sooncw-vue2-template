<template>
  <el-dialog
    :visible.sync="modal"
    title="角色权限分配"
    width="480px"
    append-to-body
  >
    <div class="modal">
      <div class="modal-body auth">
        <div class="auth-sub auth-menus">
          <div class="scroll">
            <el-tree
              v-if="menusTree.length"
              ref="tree"
              :data="menusTree"
              :default-checked-keys="authMenuChecked"
              node-key="menuId"
              show-checkbox
              check-strictly
              highlight-current
              @node-click="handleMenuChange"
              @check-change="handleMenuCheck"
            />
            <div v-else class="empty">
              <el-result
                title="暂无菜单权限"
                subTitle="当前客户端暂未配置菜单权限"
              >
                <template slot="icon">
                  <el-image
                    src="/images/state-empty.svg"
                    style="width: 128px;"
                  />
                </template>
              </el-result>
            </div>
          </div>
          <div v-if="menusTree.length" class="flex main-end options">
            <el-button
              type="primary"
              size="mini"
              plain
              @click="handleMenuCheckAll"
            >
              全选
            </el-button>
            <el-button
              type="danger"
              size="mini"
              plain
              @click="handleMenuClearAll"
            >
              清空
            </el-button>
          </div>
        </div>
      </div>
      <div class="modal-options" :disabled="pending">
        <el-button size="small" @click="modal = false">
          取消
        </el-button>
        <el-button size="small" type="success" @click="handleSubmit">
          保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  GetAuthMenusOfClient,
  ReduceAuthMenus
} from '@/api/system/authority_menus';
import { GetRoleAuths, UpdateRoleAuth } from '@/api/system/roles';

// 新增或编辑角色
export default {
  name: 'ModalAuthEdit',
  props: {
    value: Boolean,

    // 客户端标识
    clientId: {
      type: String,
      require: true
    },

    // 编辑的角色
    role: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      modal: this.$props.value,
      pending: false,
      menus: [],
      currentMenu: null,
      authMenuChecked: [] // 实时勾选的菜单权限
    };
  },
  computed: {
    // 递归处理的菜单树
    menusTree() {
      return ReduceAuthMenus(this.menus);
    }
  },
  watch: {
    value(value) {
      this.modal = value;
    },
    modal(value) {
      if (!value) {
        this.menus = [];
        this.authConfig = [];
        this.authMenuChecked = [];
      } else {
        this.init();
      }
      this.$emit('input', value);
    },

    menusTree() {
      const { menusTree } = this;
      if (!menusTree.length) return;
      this.currentMenu = menusTree[0];
      this.$nextTick(() => {
        this.$refs.tree.setCurrentNode(menusTree[0]);
      });
    }
  },
  methods: {
    // 初始化
    async init() {
      try {
        const { clientId, role } = this.$props;
        this.menus = await GetAuthMenusOfClient(clientId);
        const _authMenus = await GetRoleAuths(role.roleId);
        this.authMenuChecked = [..._authMenus].map(row => row.relationId); // [{relationId:'1'}] => ['1']
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      }
    },

    // 选中或取消选择菜单
    // 选择某个菜单时，需要同时选中当前菜单的父级及其父级的父级
    // 取消选择某个菜单是，需要同时清除该菜单的子级及其子级的子级
    handleMenuCheck(menu, checked) {
      if (checked) {
        // 获取当前菜单的父级及其父级的父级，直到顶层父级
        const _groups = [menu.menuId];

        const _getParent = node => {
          if (node.parentId === '0') return;
          const _parent = this.menus.find(row => row.menuId === node.parentId);
          if (!_parent) return;
          _groups.push(_parent.menuId);
          _getParent(_parent);
        };

        _getParent(menu);

        // 调整已选择菜单
        _groups.forEach(id => {
          const _index = this.authMenuChecked.find(_id => _id === id);
          if (!_index) {
            this.authMenuChecked.push(id);
          }
          this.$refs.tree.setChecked(id, true);
        });
      } else {
        // 获取当前菜单的子级及其子级的子级
        const _groups = [menu.menuId];

        const _getChild = node => {
          const _childs = [...this.menus].filter(
            row => row.parentId === node.menuId
          );
          if (_childs.length) {
            _childs.forEach(child => {
              _groups.push(child.menuId);
              _getChild(child);
            });
          }
        };

        _getChild(menu);

        // 调整已选择菜单
        _groups.forEach(id => {
          const _index = this.authMenuChecked.findIndex(_id => _id === id);
          if (_index !== -1) {
            this.authMenuChecked.splice(_index, 1);
          }
          this.$refs.tree.setChecked(id, false);
        });
      }
    },

    // 监听菜单条目选择
    handleMenuChange(menu) {
      this.currentMenu = menu;
    },

    // 菜单-全选
    handleMenuCheckAll() {
      this.authMenuChecked = [...this.menus].map(row => row.menuId);
      this.authMenuChecked.forEach(id => {
        this.$refs.tree.setChecked(id, true);
      });
    },

    // 菜单-清空
    handleMenuClearAll() {
      this.authMenuChecked = [];
      this.menus.forEach(menu => {
        this.$refs.tree.setChecked(menu.menuId, false);
      });
    },

    // 提交操作
    async handleSubmit() {
      try {
        const { role } = this.$props;
        const { authMenuChecked } = this;

        await this.$confirm('确定保存当前配置？', '操作提示', {
          type: 'warning'
        });

        await UpdateRoleAuth(role.roleId, authMenuChecked);

        this.msg({
          type: 'success',
          content: '操作成功'
        });

        this.modal = false;
        this.$emit('on-success');
      } catch (error) {
        if (error === 'cancel') return;
        this.msg({
          type: 'error',
          content: error
        });
      } finally {
        this.pending = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../../../styles/const.scss';

/deep/.el-tree-node__content {
  padding-bottom: 4px !important;
  padding-top: 4px !important;
  margin: 4px 0;
}

.modal {
  height: (calc(100vh - 263px));
  max-height: unset;

  &-body {
    overflow: hidden;
    padding: 0;
  }
}

.auth {
  align-items: stretch;
  display: flex;
  justify-content: space-between;
  position: relative;

  &-sub {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;

    .scroll {
      flex: 1;
      overflow: auto;
      padding: $void * 2;
    }

    .empty {
      padding: 40px 0;
    }

    .options {
      background-color: $bg;
      border-top: 1px $colorBorder solid;
      padding: $void;
    }
  }

  &-resources {
    border-left: 1px $colorBorder solid;
    flex: 1;

    .scroll {
      padding: $void;
    }

    /deep/.el-checkbox {
      background-color: fade-out($colorBorder, 0.5);
      border-radius: 4px;
      align-items: center;
      display: flex;
      padding: $void;
      margin: $void;

      .el-checkbox__input {
        flex-shrink: 0;
        height: 14px;
        overflow: hidden;
        width: 14px;
      }

      .el-checkbox__label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &.is-checked {
        background-color: #f0f7ff;
      }
    }
  }
}
</style>
