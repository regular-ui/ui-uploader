import { Component } from 'rgui-ui-base';
import { Uploader } from '../uploader/index.js';
import template from './index.rgl';
import fileTemplate from './fileTemplate.rgl';
import uploadTemplate from './uploadTemplate.rgl';

/**
 * @class UploaderPro
 * @extends Component
 * @param {Object}                  options.data                     =  绑定属性
 * @param {string=''}               options.data.url                 => 上传路径
 * @param {string='json'}           options.data.dataType            => 接收数据类型。可以是：`text`、`xml`、`json`。
 * @param {Object}                  options.data.data                => 附加数据
 * @param {string='file'}           options.data.name                => 上传文件的name
 * @param {string|string[]=''}      options.data.extensions          => 可上传的扩展名。默认为空，表示可上传任意文件类型的文件；可以为字符串，多个扩展名用`,`隔开，如：'png,jpg,gif'；也可以为数组，如：['png', 'jpg', 'gif']。
 * @param {string|number=''}        options.data.maxSize             => 可上传的最大文件大小。默认为空，表示可上传任意大小的文件；如果为数字，则表示单位为字节；如果为字符串，可以添加以下单位：`kB`、`MB`、`GB`。
 * @param {boolean=false}           options.data.disabled            => 是否禁用
 * @param {string=''}               options.data.class               => 补充class
 * @param {string='rgl template'}   options.data.fileTemplate        => 上传文件预览模板
 * @param {string='rgl template'}   options.data.uploadTemplate      => 上传文件按钮模板
 */

const UploaderPro = Component.extend({
    name: 'uploaderPro',
    template,
    /**
     * @protected
     * @override
     */
    config() {
        this.defaults({
            message: 'uploaderPro',
            fileList: [],
            fileTemplate:fileTemplate,
            uploadTemplate:uploadTemplate,
        });
        this.supr();
    },
    _onInput($event) {
        this.$emit('input', $event);
    },
    _onSuccess($event) {
        let file=Object.assign({},$event.file);
        file.data=$event.data;
        this._addFiles(file);
        this.$emit('success', {
            sender: this,
            data: $event.data,
            file: $event.file
        });
    },
    _onError($event) {
        this.$emit('error', {
            sender: this,
            name: 'ResponseError',
            message: 'No responseText!',
        });
    },
    _addFiles(files) {
        if(files instanceof Array){
            this.data.fileList.concat(files);
            this.$emit('fileAdd',{file:files});
        }else{
            this.data.fileList.push(files);
            this.$emit('fileAdd',{file:[files]});
        }
    },
    _removeFiles(index) {
        const delFile=this.data.fileList.splice(index,1);
        this.$emit('fileDel',{file:delFile});
    },
    /**
     * @method getFileList() 获取上传文件的列表
     * @public
     * @return {Array} 上传文件的列表
     */
    getFileList() {
        return Array.from(this.data.fileList);
    },
    /**
     * @method clearFileList() 清空上传文件的列表
     * @public
     * @return {void}
     */
    clearFileList() {
        this.data.fileList=[];
        this.$update();
    }
});

export default UploaderPro;
