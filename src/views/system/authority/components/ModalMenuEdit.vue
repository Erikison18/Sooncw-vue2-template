<template>
  <el-dialog
    :visible.sync="modal"
    :title="menu ? '编辑菜单权限' : '新增菜单权限'"
    width="720px"
    append-to-body
  >
    <div class="modal">
      <div v-loading="pending" class="modal-body">
        <el-form class="form" size="small" label-position="top">
          <el-form-item label="层级">
            <el-radio-group v-model="form.hierarchy">
              <el-radio
                v-for="(item, index) in enumMenuHierarchy"
                :key="index"
                :label="item.key"
              >
                {{ item.value }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="父级">
            <el-cascader
              v-model="form.parentId"
              :options="menusTree"
              :props="menusTreeCascaderProps"
              :show-all-levels="false"
              style="width: 100%;"
              clearable
            />
          </el-form-item>
          <div class="flex">
            <div class="expand margin-large-right">
              <el-form-item label="权限名称" required>
                <el-input
                  v-model="form.title"
                  maxlength="64"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>
            </div>
            <div>
              <el-form-item label="排序" required>
                <el-input-number
                  v-model="form.sort"
                  :min="0"
                  :max="9999"
                  :step="1"
                  clearable
                />
              </el-form-item>
            </div>
          </div>
          <el-form-item label="权限标识" required>
            <div class="flex">
              <div class="expand margin-right">
                <el-input
                  v-model="form.identifier"
                  maxlength="64"
                  placeholder="请输入"
                  clearable
                />
              </div>
              <el-button type="primary" plain @click="createUUID">
                创建UUID标识
              </el-button>
            </div>
          </el-form-item>
          <el-form-item label="图标">
            <el-input
              v-model="form.icon"
              maxlength="128"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="图标URL">
            <el-input
              v-model="form.iconUrl"
              maxlength="255"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="自定义属性">
            <MenuExtra v-model="form.extra" />
          </el-form-item>
          <el-form-item label="权限说明">
            <el-input
              v-model="form.description"
              maxlength="255"
              placeholder="请输入"
              clearable
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio label="Y">正常</el-radio>
              <el-radio label="N">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="modal-options" :disabled="pending">
        <el-button size="small" @click="modal = false">
          取消
        </el-button>
        <el-button size="small" type="success" @click="handleSubmit">
          {{ menu ? '保存修改' : '确定' }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

import {
  EnumMenuHierarchy,
  ReduceAuthMenus,
  GetAuthMenusOfClient,
  CreateMenu,
  CreateMenuParams,
  CreateMenuValidate,
  UpdateMenu,
  UpdateMenuParams,
  UpdateMenuValidate
} from '@/api/system/authority_menus';

// 新增或编辑权限资源
export default {
  name: 'ModalMenuEdit',
  components: {
    MenuExtra: () => import('./MenuExtra')
  },
  props: {
    value: Boolean,

    // 编辑的菜单权限
    menu: {
      type: Object,
      default: () => null
    },

    // 客户端ID，必须
    clientId: {
      type: String,
      require: true
    },

    // 父级ID，添加子级时使用
    parentId: String
  },
  data() {
    return {
      modal: this.$props.value,
      pending: false,
      form: {},
      enumMenuHierarchy: [],
      menus: [],
      menusTreeCascaderProps: {
        label: 'title',
        value: 'menuId',
        emitPath: false,
        checkStrictly: true
      }
    };
  },
  computed: {
    // 渲染使用的菜单资源树
    menusTree() {
      return ReduceAuthMenus(this.menus);
    }
  },
  watch: {
    value(value) {
      this.modal = value;
    },
    modal(value) {
      if (value) {
        // 初始化枚举
        this.init();

        // 初始化当前客户端对应的菜单树
        this.fetchMenus();

        // 初始化表单
        const { menu, parentId, clientId } = this.$props;

        if (parentId) {
          // 添加子级
          this.form = {
            ...CreateMenuParams,
            parentId,
            clientId
          };
        } else {
          if (menu) {
            // 更新
            this.form = {
              ...UpdateMenuParams,
              clientId
            };
            Object.keys(UpdateMenuParams).forEach(key => {
              this.form[key] = menu[key];
            });
          } else {
            // 新增
            this.form = {
              ...CreateMenuParams,
              clientId
            };
            this.menus = [];
          }
        }
      } else {
        this.form = {};
      }
      this.$emit('input', value);
    }
  },
  methods: {
    async init() {
      try {
        this.enumMenuHierarchy = await EnumMenuHierarchy();
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      }
    },

    // 创建 UUID 权限标识
    createUUID() {
      this.form.identifier = uuidv4();
    },

    // 加载指定客户端下的菜单权限
    async fetchMenus() {
      try {
        const { clientId } = this.$props;
        if (!clientId) {
          this.modal = false;
          throw '请选择一个客户端';
        }
        this.pending = true;
        this.menus = await GetAuthMenusOfClient(clientId);
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      } finally {
        this.pending = false;
      }
    },

    // 提交操作
    async handleSubmit() {
      try {
        const { menu } = this.$props;
        const { form } = this;

        if (menu) {
          const _updateForm = await UpdateMenuValidate(form);

          await this.msg({
            mode: 'confirm',
            title: '操作提示',
            content: '确定保存当前修改？'
          });
          this.pending = true;
          await UpdateMenu(menu.id, _updateForm);
        } else {
          const _createForm = await CreateMenuValidate(form);
          await CreateMenu(_createForm);
        }

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

/deep/.el-radio {
  margin-right: $voidLarge;
  margin-bottom: $void;
  padding: 4px 0;

  .el-radio__label {
    text-align: left;
    padding-left: 2px;
  }
}
</style>
