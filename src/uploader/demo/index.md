## 示例

### 基本形式

<div class="m-example"></div>

```xml
<uploader url="/upload"
    on-success={this._onSuccess($event)}
    on-error={this._onError($event)}>
    <button class="u-btn">上传</button>
</uploader>
```

```javascript
var component = new RGUI.Component({
    template: template,
    _onSuccess: function($event) {
        RGUI.Notify.success($event.data);
    },
    _onError: function($event) {
        RGUI.Notify.error($event.message);
    }
});
```

> 注意：在IE中实现上传功能时，需要将响应头的`Content-Type`设置为`text/plain`或`text/html`，而不能是`application/json`，否则IE会提示用户下载返回的数据。

### 禁用组件

<div class="m-example"></div>

```xml
<uploader url="/upload" disabled>
    <button class="u-btn" disabled>上传</button>
</uploader>
```

### 文件类型限制

<div class="m-example"></div>

```xml
<uploader url="/upload" extensions="jpg,gif,png"
    on-success={this._onSuccess($event)}
    on-error={this._onError($event)}>
    <button class="u-btn">上传</button>
</uploader>
```

```javascript
var component = new RGUI.Component({
    template: template,
    _onSuccess: function($event) {
        RGUI.Notify.success($event.data);
    },
    _onError: function($event) {
        RGUI.Notify.error($event.message);
    }
});
```

### 文件大小限制

<div class="m-example"></div>

```xml
<uploader url="/upload" maxSize="10kB"
    on-success={this._onSuccess($event)}
    on-error={this._onError($event)}>
    <button class="u-btn">上传</button>
</uploader>
```

```javascript
var component = new RGUI.Component({
    template: template,
    _onSuccess: function($event) {
        RGUI.Notify.success($event.data);
    },
    _onError: function($event) {
        RGUI.Notify.error($event.message);
    }
});
```

### 显示上传进度条

<div class="m-example"></div>

```xml
<uploader url="/upload"
    on-success={this._onSuccess($event)}
    on-error={this._onError($event)}
    on-progress={this._onProgress($event)}>
    <button class="u-btn">上传</button>
</uploader>
```

```javascript
var component = new RGUI.Component({
    template: template,
    _onSuccess: function($event) {
        RGUI.Notify.success($event.data);
    },
    _onError: function($event) {
        RGUI.Notify.error($event.message);
    },
    _onProgress($event) {
        RGUI.Notify.error($event.data);
    },
});
```
