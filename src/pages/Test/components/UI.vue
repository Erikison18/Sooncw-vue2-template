<template>
  <el-card shadow="never">
    <h4 slot="header">UI</h4>

    <div class="flex wrap cros-start main-center expand margin-large-bottom">
      <el-button>按钮</el-button>
      <el-button type="primary">主要</el-button>
      <el-button type="success">成功</el-button>
      <el-button type="danger">危险</el-button>
      <el-button type="warning">警告</el-button>
      <el-button type="info">信息</el-button>
      <el-button type="text" class="padding-large-x">文本</el-button>
      <el-button type="primary" plain>主要</el-button>
      <el-button type="success" plain>成功</el-button>
      <div class="margin-bottom" style="width:100%;" />
      <el-button round>按钮</el-button>
      <el-button type="primary" round>主要</el-button>
      <el-button type="success" round>成功</el-button>
      <el-button type="danger" round plain>危险</el-button>
      <el-button type="warning" round plain>警告</el-button>
      <el-button icon="el-icon-search" circle />
      <el-button type="primary" icon="el-icon-edit" circle plain />
      <el-button type="success" icon="el-icon-check" circle plain />
      <el-button type="info" icon="el-icon-message" circle />
      <el-button type="warning" icon="el-icon-star-off" circle />
      <el-button type="danger" icon="el-icon-delete" circle />
    </div>

    <div class=" margin-bottom">
      <div class="flex margin-bottom" style="width: 100%">
        <div class="expand">
          <el-input
            v-model="value"
            placeholder="请输入内容"
            style="width: 100%"
          />
        </div>
        <div class="margin-x" />
        <div class="expand">
          <el-select v-model="value" placeholder="请选择" style="width: 100%">
            <el-option label="选项一" value="0" />
            <el-option label="选项二" value="0" />
            <el-option label="选项三" value="0" />
            <el-option label="选项四" value="0" />
          </el-select>
        </div>
        <div class="margin-x" />
        <div class="expand">
          <el-date-picker
            v-model="value"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </div>
        <div class="margin-x" />
        <div class="expand">
          <el-time-picker
            v-model="value"
            :picker-options="{
              selectableRange: '18:30:00 - 20:30:00'
            }"
            placeholder="任意时间点"
            style="width: 100%"
          />
        </div>
        <div class="margin-x" />
        <div class="expand">
          <el-input-number
            v-model="value"
            :min="1"
            :max="10"
            label="描述文字"
            style="width: 100%"
          />
        </div>
      </div>
      <div class="flex margin-bottom" style="width: 100%">
        <div class="expand">
          <el-cascader
            v-model="value"
            :options="cascaderOptions"
            style="width: 100%"
          />
        </div>
        <div class="margin-x" />
        <el-dropdown placement="bottom-end">
          <el-button type="primary">
            Dropdown <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="margin-x" />
        <el-color-picker show-alpha />
      </div>
      <div class="margin-bottom">
        <el-checkbox-group v-model="checkbox">
          <el-checkbox label="1">选项一</el-checkbox>
          <el-checkbox label="2">选项二</el-checkbox>
          <el-checkbox label="3">选项三</el-checkbox>
          <el-checkbox label="4">选项四</el-checkbox>
          <el-checkbox label="5" disabled>选项五</el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-model="radio">
          <el-radio :label="3">备选项</el-radio>
          <el-radio :label="6">备选项</el-radio>
          <el-radio :label="9">备选项</el-radio>
        </el-radio-group>
        <el-switch v-model="switchs" :active-value="1" :inactive-value="0" />
        <el-slider v-model="slider" :step="10" show-stops />
        <el-rate />
      </div>
    </div>

    <div class="margin-large-bottom" style="width:100%;" />

    <div class="flex main-center margin-bottom" style="width:100%;">
      <el-transfer v-model="transfer" :data="transferData" />
    </div>
  </el-card>
</template>

<script>
const generateData = () => {
  const data = [];
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `备选项 ${i}`,
      disabled: i % 4 === 0
    });
  }
  return data;
};

export default {
  data() {
    return {
      value: null,
      switchs: 1,
      radio: null,
      checkbox: [],
      slider: 10,
      cascaderOptions: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                },
                {
                  value: "fankui",
                  label: "反馈"
                },
                {
                  value: "xiaolv",
                  label: "效率"
                },
                {
                  value: "kekong",
                  label: "可控"
                }
              ]
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航"
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航"
                }
              ]
            }
          ]
        },
        {
          value: "zujian",
          label: "组件",
          children: [
            {
              value: "basic",
              label: "Basic",
              children: [
                {
                  value: "layout",
                  label: "Layout 布局"
                },
                {
                  value: "color",
                  label: "Color 色彩"
                },
                {
                  value: "typography",
                  label: "Typography 字体"
                },
                {
                  value: "icon",
                  label: "Icon 图标"
                },
                {
                  value: "button",
                  label: "Button 按钮"
                }
              ]
            },
            {
              value: "form",
              label: "Form",
              children: [
                {
                  value: "radio",
                  label: "Radio 单选框"
                },
                {
                  value: "checkbox",
                  label: "Checkbox 多选框"
                },
                {
                  value: "input",
                  label: "Input 输入框"
                },
                {
                  value: "input-number",
                  label: "InputNumber 计数器"
                },
                {
                  value: "select",
                  label: "Select 选择器"
                },
                {
                  value: "cascader",
                  label: "Cascader 级联选择器"
                },
                {
                  value: "switch",
                  label: "Switch 开关"
                },
                {
                  value: "slider",
                  label: "Slider 滑块"
                },
                {
                  value: "time-picker",
                  label: "TimePicker 时间选择器"
                },
                {
                  value: "date-picker",
                  label: "DatePicker 日期选择器"
                },
                {
                  value: "datetime-picker",
                  label: "DateTimePicker 日期时间选择器"
                },
                {
                  value: "upload",
                  label: "Upload 上传"
                },
                {
                  value: "rate",
                  label: "Rate 评分"
                },
                {
                  value: "form",
                  label: "Form 表单"
                }
              ]
            },
            {
              value: "data",
              label: "Data",
              children: [
                {
                  value: "table",
                  label: "Table 表格"
                },
                {
                  value: "tag",
                  label: "Tag 标签"
                },
                {
                  value: "progress",
                  label: "Progress 进度条"
                },
                {
                  value: "tree",
                  label: "Tree 树形控件"
                },
                {
                  value: "pagination",
                  label: "Pagination 分页"
                },
                {
                  value: "badge",
                  label: "Badge 标记"
                }
              ]
            },
            {
              value: "notice",
              label: "Notice",
              children: [
                {
                  value: "alert",
                  label: "Alert 警告"
                },
                {
                  value: "loading",
                  label: "Loading 加载"
                },
                {
                  value: "message",
                  label: "Message 消息提示"
                },
                {
                  value: "message-box",
                  label: "MessageBox 弹框"
                },
                {
                  value: "notification",
                  label: "Notification 通知"
                }
              ]
            },
            {
              value: "navigation",
              label: "Navigation",
              children: [
                {
                  value: "menu",
                  label: "NavMenu 导航菜单"
                },
                {
                  value: "tabs",
                  label: "Tabs 标签页"
                },
                {
                  value: "breadcrumb",
                  label: "Breadcrumb 面包屑"
                },
                {
                  value: "dropdown",
                  label: "Dropdown 下拉菜单"
                },
                {
                  value: "steps",
                  label: "Steps 步骤条"
                }
              ]
            },
            {
              value: "others",
              label: "Others",
              children: [
                {
                  value: "dialog",
                  label: "Dialog 对话框"
                },
                {
                  value: "tooltip",
                  label: "Tooltip 文字提示"
                },
                {
                  value: "popover",
                  label: "Popover 弹出框"
                },
                {
                  value: "card",
                  label: "Card 卡片"
                },
                {
                  value: "carousel",
                  label: "Carousel 走马灯"
                },
                {
                  value: "collapse",
                  label: "Collapse 折叠面板"
                }
              ]
            }
          ]
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components"
            },
            {
              value: "sketch",
              label: "Sketch Templates"
            },
            {
              value: "jiaohu",
              label: "组件交互文档"
            }
          ]
        }
      ],
      transfer: [],
      transferData: generateData()
    };
  }
};
</script>
