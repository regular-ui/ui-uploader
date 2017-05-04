import { Component } from 'rgui-ui-base';
import { Uploader } from '../uploader/index.js';
import template from './index.rgl';
import fileTemplate from './fileTemplate.rgl';
import uploadTemplate from './uploadTemplate.rgl';

/**
 * @class UploaderPro
 * @extends Component
 * @param {Object}                  options.data                     =  绑定属性
 * @param {string='Hello World'}    options.data.message            <=> 消息
 * @param {boolean=false}           options.data.disabled            => 是否禁用
 * @param {boolean=true}            options.data.visible             => 是否显示
 * @param {string=''}               options.data.class               => 补充class
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
    /**
     * @method toggle(open) 展开/收起
     * @public
     * @param  {boolean} open 展开/收起状态。如果无此参数，则在两种状态之间切换。
     * @return {void}
     */
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
});

export default UploaderPro;
