<template>
  <div class="f-c">
    <Toolbar :editor="editor" :default-config="toolbarConfig" :mode="mode" />
    <Editor v-model="html" class="o-a" :default-config="editorConfig" :mode="mode" :style="setEditorStyle()" @onCreated="onCreated" @onChange="onChange" />
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

import { getToken } from '@/utils/auth'

/**
 * v1.0 富文本编辑器组件
 */
export default {
  name: 'VEditor',
  components: { Editor, Toolbar },
  props: {
    text: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '350px'
    },
    mode: {
      type: String,
      default: 'simple'
    }
  },
  data() {
    return {
      editor: null,
      html: '',
      toolbarConfig: {
        excludeKeys: ['insertVideo']
      },
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          uploadImage: {
            fieldName: 'file',
            maxFileSize: 10 * 1024 * 1024,
            allowedFileTypes: ['image/*'],
            server: process.env.VUE_APP_BASE_API + '/file/upload', // 上传的图片服务器地址,
            headers: {
              Authorization: 'Bearer ' + getToken()
            },
            onSuccess: this.onImageUploadSuccess,
            onFailed: this.onImageUploadFailed,
            onError: this.onImageUploadError,
            customInsert: this.customImageInsert
          }
        }
      },
      imageResult: {}
    }
  },
  watch: {
    text: {
      handler(value) {
        this.html = value
      },
      immediate: true
    }
  },
  mounted() {},
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    onChange() {
      this.$emit('change', this.html)
    },
    onImageUploadFailed(file, res) {
      this.$message.error(`${file.name} 上传失败`, res)
    },
    onImageUploadError(file, err, res) {
      this.$message.error(`${file.name} 上传失败`, err, res)
    },
    onImageUploadSuccess(file, res) {
      const { code, msg } = res
      if (code === 200) {
        this.$message.success('上传成功')
        this.imageResult = {
          uid: file.uid,
          url: file.url,
          ...res.data
        }
      } else {
        this.$message.error(msg)
      }
    },
    customImageInsert(file, insertFn) {
      insertFn(file.data.filePath)
    },
    setEditorStyle() {
      return {
        height: this.height
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.w-e-full-screen-container {
  z-index: 1000;
}
</style>
