# animate.css - v4.1.1

> CSS 动画库，官方网站<https://animate.style/>

## 在 Vue 中的用法

4.0 版本后，所有的属性都需要添加 `animate__` 前缀。

```html
<!-- 单个元素直接使用 -->
<div class="animate__animated animate__bounceInDown">弹性进入</div>

<!-- 放大缩小 -->
<transition
    enter-active-class="animate__bounceIn"
    leave-active-class="animate__bounceOut">
    <div v-if="visible" class="animate__animated">显示/隐藏</div>
</transition>

<!-- 路由页面切换 -->
<transition enter-active-class="animate__fadeInUp"
    leave-active-class="animate__fadeOutDown">
    <keep-alive>
        <router-view :key="$route.fullPath" />
    </keep-alive>
</transition>
```

## 效果一览

### 强调

- bounce
- flash
- pulse
- rubberBand
- shakeX
- shakeY
- headShake
- swing
- tada
- wobble
- jello
- heartBeat

### 后置进入

- backInDown
- backInLeft
- backInRight
- backInUp

### 后置退出

- Back exits
- backOutDown
- backOutLeft
- backOutRight
- backOutUp

### 反弹进入

- bounceIn
- bounceInDown
- bounceInLeft
- bounceInRight
- bounceInUp

### 反弹退出

- bounceOut
- bounceOutDown
- bounceOutLeft
- bounceOutRight
- bounceOutUp

### 淡入

- fadeIn
- fadeInDown
- fadeInDownBig
- fadeInLeft
- fadeInLeftBig
- fadeInRight
- fadeInRightBig
- fadeInUp
- fadeInUpBig
- fadeInTopLeft
- fadeInTopRight
- fadeInBottomLeft
- fadeInBottomRight

### 淡出

- fadeOut
- fadeOutDown
- fadeOutDownBig
- fadeOutLeft
- fadeOutLeftBig
- fadeOutRight
- fadeOutRightBig
- fadeOutUp
- fadeOutUpBig
- fadeOutTopLeft
- fadeOutTopRight
- fadeOutBottomRight
- fadeOutBottomLeft

### 翻转

- flip
- flipInX
- flipInY
- flipOutX
- flipOutY

### 光速

- lightSpeedInRight
- lightSpeedInLeft
- lightSpeedOutRight
- lightSpeedOutLeft

### 旋转进入

- rotateIn
- rotateInDownLeft
- rotateInDownRight
- rotateInUpLeft
- rotateInUpRight

### 旋转退出

- rotateOut
- rotateOutDownLeft
- rotateOutDownRight
- rotateOutUpLeft
- rotateOutUpRight

### 特殊

hinge
jackInTheBox
rollIn
rollOut

### 缩放进入

- zoomIn
- zoomInDown
- zoomInLeft
- zoomInRight
- zoomInUp

### 缩放退出

- zoomOut
- zoomOutDown
- zoomOutLeft
- zoomOutRight
- zoomOutUp

### 移动进入

- slideInDown
- slideInLeft
- slideInRight
- slideInUp

### 移动退出

- slideOutDown
- slideOutLeft
- slideOutRight
- slideOutUp

## 参考资料

- 官方网站<https://animate.style/>
