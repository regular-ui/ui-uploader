## 示例

### 基本形式

<div class="m-example"></div>

```xml
<uploaderPro/>
```
### 禁用组件

<div class="m-example"></div>

```xml
<uploaderPro url="/upload" disabled>
</uploaderPro>
```

### 文件类型限制

<div class="m-example"></div>

```xml
<uploaderPro url="/upload" extensions="jpg,gif,png"
    on-success={this._onSuccess($event)}
    on-error={this._onError($event)}>
</uploaderPro>
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
<uploaderPro url="/upload" maxSize="10kB"
    on-success={this._onSuccess($event)}
    on-error={this._onError($event)}>
    <button class="u-btn">上传</button>
</uploaderPro>
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
### 自定义预览与上传
#### 重写组件的fileTemplate与uploadTemplate属性，可自定义上传文件预览与上传按钮，fileTemplate中可访问到file及fileList
file格式
```json
{
    name: fileName,
    extName:extName,
    size:size,
    data:上传后后端返回值
}
```
ps:文件缩略图预览可从data中取上传后缩略图地址

<div class="m-example"></div>

```xml
<uploaderPro  fileTemplate="<p>{file.name}</p>" uploadTemplate="<button>上传文件</button>"
    on-success={this._onSuccess($event)}
    on-error={this._onError($event)}>
    <button class="u-btn">上传</button>
</uploaderPro>
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
