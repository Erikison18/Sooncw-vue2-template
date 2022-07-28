<template>
  <div class="menu-extra">
    <div class="list">
      <el-table :data="list" size="small" border stripe>
        <el-table-column type="index" label="#" width="60" align="center" />
        <el-table-column label="属性名" min-width="128" align="center">
          <template slot-scope="{ row }">
            <el-input
              v-if="row._edit"
              v-model="row.key"
              placeholder="请填写"
              size="small"
              maxlength="64"
              clearable
            />
            <span v-else>{{ row.key || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="属性值" min-width="200" align="center">
          <template slot-scope="{ row }">
            <el-input
              v-if="row._edit"
              v-model="row.value"
              placeholder="请填写"
              size="small"
              maxlength="255"
              clearable
            />
            <span v-else>{{ row.value || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="143" align="center">
          <template slot-scope="{ $index, row }">
            <template v-if="row._edit">
              <el-button
                size="small"
                type="success"
                @click="handleSave($index, row)"
              >
                保存
              </el-button>
              <el-button size="small" @click="handleDelete($index, row)">
                取消
              </el-button>
            </template>
            <template v-else>
              <el-button
                size="small"
                type="primary"
                @click="handleEdit($index, row)"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                plain
                @click="handleDelete($index, row)"
              >
                删除
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="flex main-end margin-top">
      <el-button
        size="small"
        type="success"
        plain
        :disabled="inEdit"
        @click="handleCreate"
      >
        新增一个属性
      </el-button>
    </div>
  </div>
</template>

<script>
// 菜单权限自定义扩展属性编辑器
export default {
  name: 'MenuExtra',
  props: {
    value: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      list: []
    };
  },
  computed: {
    // 是否存在正在编辑的行
    // 存在正在编辑的行时，禁用新增，可以避免列表更新错误
    inEdit() {
      return [...this.list].filter(row => row._edit).length > 0;
    }
  },
  watch: {
    value() {
      this.parseValue();
    }
  },
  methods: {
    // 解析传入值
    parseValue() {
      const { value } = this.$props;
      if (!value) {
        this.list = [];
      } else {
        this.list = Object.keys(value).map(key => {
          return {
            key: key,
            value: value[key],
            _edit: false,
            _cache: null
          };
        });
      }
    },

    // 添加一条属性
    handleCreate() {
      if (this.inEdit) return;
      this.list.push({
        key: null,
        value: null,
        _edit: true,
        _cache: null
      });
    },

    // 编辑属性
    handleEdit(index, row) {
      try {
        if (this.inEdit) throw '请先保存其他编辑中的条目';
        row._cache = { ...row };
        row._edit = true;
        this.list.splice(index, 1, row);
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      }
    },

    // 保存修改
    async handleSave(index, row) {
      try {
        if (this.inEdit) throw '请先保存其他编辑中的条目';

        if (!row.key) throw '请填写属性名';
        if (!/^[0-9a-zA-Z_]{1,}$/.test(row.key))
          throw '属性名只支持字母数字和下划线组合';
        if (!row.value) throw '请填写属性值';

        const _existKeys = [...this.list]
          .filter(row => !row._edit)
          .map(row => row.key);

        if (_existKeys.indexOf(row.key) !== -1) throw '属性名已存在，请检查';

        row._cache = null;
        row._edit = false;
        this.list.splice(index, 1, row);
        this.emitInput();
      } catch (error) {
        this.msg({
          type: 'error',
          content: error
        });
      }
    },

    // 删除属性
    async handleDelete(index, row) {
      if (!row._edit) {
        try {
          if (this.inEdit) throw '请先保存其他修改中属性';
          await this.$confirm('确定移除该属性？', '操作提示');
          this.list.splice(index, 1);
          this.emitInput();
        } catch (error) {
          if (error === 'cancel') return;
          this.msg({
            type: 'error',
            content: error
          });
        }
      } else {
        if (!row._cache) {
          this.list.splice(index, 1);
        } else {
          const _row = row._cache;
          _row._cache = null;
          _row._edit = false;
          this.list.splice(index, 1, _row);
        }
      }
    },

    // 提交修改
    emitInput() {
      this.$emit(
        'input',
        [...this.list].reduce((res, row) => {
          res[row.key] = row.value;
          return res;
        }, {})
      );
    }
  },
  mounted() {
    this.parseValue();
  }
};
</script>
