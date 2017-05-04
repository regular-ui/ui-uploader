import { Component } from 'rgui-ui-base';
import template from './index.rgl';

const SIZE_UNITS = {
    kB: 1000,
    MB: Math.pow(1000, 2),
    GB: Math.pow(1000, 3),
    TB: Math.pow(1000, 4),
};

/**
 * @class Uploader
 * @extends Component
 * @param {Object}                  options.data                     =  绑定属性
 * @param {string=''}               options.data.url                 => 上传路径
 * @param {string='json'}           options.data.dataType            => 接收数据类型。可以是：`text`、`xml`、`json`。
 * @param {Object}                  options.data.data                => 附加数据
 * @param {string='file'}           options.data.name                => 上传文件的name
 * @param {string|string[]=''}      options.data.extensions          => 可上传的扩展名。默认为空，表示可上传任意文件类型的文件；可以为字符串，多个扩展名用`,`隔开，如：'png,jpg,gif'；也可以为数组，如：['png', 'jpg', 'gif']。
 * @param {string|number=''}        options.data.maxSize             => 可上传的最大文件大小。默认为空，表示可上传任意大小的文件；如果为数字，则表示单位为字节；如果为字符串，可以添加以下单位：`kB`、`MB`、`GB`。
 * @param {boolean=false}           options.data.sending            <=  是否正在上传
 * @param {boolean=false}           options.data.disabled            => 是否禁用
 * @param {boolean=true}            options.data.visible             => 是否显示
 * @param {string=''}               options.data.class               => 补充class
 */
const Uploader = Component.extend({
    name: 'uploader',
    template,
    /**
     * @protected
     * @override
     */
    config() {
        this.defaults({
            url: '',
            contentType: 'multipart/form-data',
            dataType: 'json',
            data: {},
            name: 'file',
            extensions: null,
            maxSize: '',
            sending: false,
            _id: new Date().getTime(),
        });
        this.supr();
    },
    /**
     * @method upload() 弹出文件对话框并且上传文件
     * @public
     * @return {void}
     */
    upload() {
        if (this.data.disabled || this.data.sending)
            return;

        this.$refs.file.click();
    },
    /**
     * @method _checkExtensions(file) 检查扩展名
     * @private
     * @param  {File} file 文件对象
     * @return {boolean} 返回是否通过验证
     */
    _checkExtensions(file) {
        if (!this.data.extensions)
            return true;

        const fileName = file.name;
        const extName = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();

        let extensions = this.data.extensions;
        if (typeof extensions === 'string')
            extensions = extensions.split(',');

        if (extensions.includes(extName))
            return true;

        /**
         * @event error 上传错误时触发
         * @property {object} sender 事件发送对象
         * @property {object} name ExtensionError
         * @property {object} message 错误信息
         * @property {object} extensions 可上传的扩展名
         */
        this.$emit('error', {
            sender: this,
            name: 'ExtensionError',
            message: '只能上传' + extensions.join(', ') + '类型的文件！',
            extensions,
        });

        return false;
    },
    /**
     * @method _checkSize(file) 检查文件大小
     * @private
     * @param  {File} file 文件对象
     * @return {boolean} 返回是否通过验证
     */
    _checkSize(file) {
        if (!this.data.maxSize && this.data.maxSize !== 0)
            return true;

        let maxSize;
        if (!isNaN(this.data.maxSize))
            maxSize = +this.data.maxSize;
        else {
            const unit = this.data.maxSize.slice(-2);
            if (!SIZE_UNITS[unit])
                throw new Error('Unknown unit!');

            maxSize = this.data.maxSize.slice(0, -2) * SIZE_UNITS[unit];
        }

        if (file.size <= maxSize)
            return true;

        /**
         * @event error 上传错误时触发
         * @property {object} sender 事件发送对象
         * @property {object} name SizeError
         * @property {object} message 错误信息
         * @property {object} maxSize 可上传的最大文件大小
         * @property {object} size 当前文件大小
         */
        this.$emit('error', {
            sender: this,
            name: 'SizeError',
            message: '文件大小超出限制！',
            maxSize: this.data.maxSize,
            size: file.size,
        });

        return false;
    },
    /**
     * @method _submit() 提交表单
     * @private
     * @return {void}
     */
    _submit() {
        const file = this.$refs.file.files ? this.$refs.file.files[0] : {
            name: this.$refs.file.value,
            size: 0,
        };

        if (!file || !file.name || !this._checkExtensions(file) || !this._checkSize(file))
            return;

        this.data.sending = true;

        let fileName = file.name;
        this.data.file = {
            name: fileName,
            extName: fileName.indexOf('.')!==-1?fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase():undefined,
            size: file.size
        };


        /**
         * @event sending 发送前触发
         * @property {object} sender 事件发送对象
         * @property {object} data 待发送的数据
         */
        this.$emit('sending', {
            sender: this,
            data: this.data.data,
        });

        if (typeof FormData === 'undefined')
            this.$refs.form.submit();
        else {
            const xhr = new XMLHttpRequest();
            const formData = new FormData(this.$refs.form);

            xhr.open('POST', this.data.url);

            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    /**
                    * @event progress 发送中触发
                    * @property {object} sender 事件发送对象
                    * @property {object} data 待发送的数据
                    */
                    this.$emit('progress', {
                        sender: this,
                        data: { loaded: event.loaded, total: event.total },
                    });
                }
            }.bind(this);

            xhr.onreadystatechange = () => {
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        this._onLoad(xhr.responseText,xhr.responseXML)
                    }else{
                        if (!this.data.sending)
                            return;
                        this.data.sending = false;
                        this.data.file=null;
                        this.$emit('error', {
                            sender: this,
                            name: 'ResponseError',
                            message: 'No responseText!',
                        });
                    }
                }
            }
            xhr.send(formData);
        }
    },
    /**
     * @method _onLoad() 接收数据回调
     * @private
     * @return {void}
     */
    _onLoad(responseText,responseXML) {
        const $iframe = this.$refs.iframe;
        const file = this.data.file;

        if (!this.data.sending)
            return;
        this.data.sending = false;
        this.data.file=null;

        const xml = {};

        if(!!responseText||!!responseXML){
            //ajax上传时数据处理
            xml.responseText = responseText;
            xml.responseXML = responseXML;
        }else{
            if ($iframe.contentWindow) {
                xml.responseText = $iframe.contentWindow.document.body ? $iframe.contentWindow.document.body.innerText : null;
                xml.responseXML = $iframe.contentWindow.document.XMLDocument ? $iframe.contentWindow.document.XMLDocument : $iframe.contentWindow.document;
            } else if ($iframe.contentDocument) {
                xml.responseText = $iframe.contentDocument.document.body ? $iframe.contentDocument.document.body.innerText : null;
                xml.responseXML = $iframe.contentDocument.document.XMLDocument ? $iframe.contentDocument.document.XMLDocument : $iframe.contentDocument.document;
            }
        }

        if (!xml.responseText) {
            /**
             * @event error 上传错误时触发
             * @property {object} sender 事件发送对象
             * @property {object} name ResponseError
             * @property {object} message 错误信息
             */
            return this.$emit('error', {
                sender: this,
                name: 'ResponseError',
                message: 'No responseText!',
            });
        }

        /**
         * @event complete 上传完成时触发
         * @property {object} sender 事件发送对象
         * @property {object} xml 返回的xml
         */
        this.$emit('complete', {
            sender: this,
            xml,
        });

        /**
         * @event success 上传成功时触发
         * @property {object} sender 事件发送对象
         * @property {object} data 返回的数据
         */
        this.$emit('success', {
            sender: this,
            data: this._parseData(xml, this.data.dataType),
            file: file,
        });
    },
    /**
     * @method _parseData(xml, type) 解析接收的数据
     * @private
     * @param  {object} xml 接收的xml
     * @param  {object} type 数据类型
     * @return {object|string} 解析后的数据
     */
    _parseData(xml, type) {
        if (type === 'text')
            return xml.responseText;
        else if (type === 'xml')
            return xml.responseXML;
        else if (type === 'json') {
            let data = xml.responseText;
            try {
                data = JSON.parse(data);
            } catch (e) {}

            return data;
        // danger，暂时不开启
        // } else if (type === 'script')
        //     return eval(xml.responseText);
        } else
            return xml.responseText;
    },
});

export default Uploader;
