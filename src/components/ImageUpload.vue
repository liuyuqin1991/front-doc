<template>
  <div class="upload-file">
    <el-upload
      ref="upload"
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :on-remove="handleDelete"
      :headers="headers"
      list-type="picture-card"
      :data="additional"
      :disabled="disabled"
      :style="{ '--upload-card-display': uploadCardDisplay }"
    >
      <!-- 上传按钮 -->
      <i slot="default" class="el-icon-plus" />
      <div slot="file" slot-scope="{file}" class="w--100 h--100">
        <el-image v-if="file.filePath" class="el-upload-list__item-thumbnail file-image" :src="file.filePath" fit="cover" :preview-src-list="[file.filePath]" />
        <div v-if="!disabled" class="file-image-icon" @click="handleDelete(file)">
          <i class="el-icon-delete" />
        </div>
      </div>
    </el-upload>
    <!-- 上传提示 -->
    <slot v-if="showTip && !disabled" name="tip">
      <span class="el-upload__tip mr-12">
        {{ tip ? `${tip}，` : '' }}
        大小限制：
        <b>{{ fileSize }}MB</b>
        ，
        格式限制：
        <b>{{ fileType.join("/") }}</b>，
        数量限制：
        <b>{{ limit }}</b>
      </span>
    </slot>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

/**
 * v2.3 图片上传组件
 */
export default {
  props: {
    // 值
    value: {
      type: String,
      default: ''
    },
    // 个性化提示，展示在限制文案前
    tip: {
      type: String,
      default: ''
    },
    // 数量限制
    limit: {
      type: Number,
      default: 5
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5
    },
    // 文件限制, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ['png', 'jpg', 'jpeg', 'gif']
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/file/upload', // 上传的图片服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      fileList: [],
      additional: {
        fileSize: 0
      },
      forbiddenCharacters: ['：', '？', '，', '！', '；']
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize)
    },
    uploadCardDisplay() {
      return this.disabled ? 'none' : 'inline-block'
    }
  },
  watch: {
    value: {
      handler(val) {
        this.fileList = val ? JSON.parse(val) : []
      },
      immediate: true
    }
  },
  methods: {
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = ''
        if (file.name.lastIndexOf('.') > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
        }
        const isTypeOk = _.includes(this.fileType, _.toLower(fileExtension))
        // 文件名禁用字符
        let isNameOk = true
        _.forEach(this.forbiddenCharacters, (s) => {
          if (_.includes(file.name, s)) {
            isNameOk = false
          }
        })
        if (!isNameOk) {
          this.$message.error(`文件名称不得包含特殊字符！`)
          return false
        }
        if (!isTypeOk) {
          this.$message.error(
            `文件格式不正确, 请上传${this.fileType.join('/')}格式文件！`
          )
          return false
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const uploadFileSize = _.round(file.size / 1024 / 1024, 6)
        const isLt = uploadFileSize < this.fileSize
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`)
          return false
        }
        this.additional.fileSize = uploadFileSize
      }
      return true
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`)
    },
    // 上传失败
    handleUploadError(err) {
      this.$emit('error', err)
      this.$message.error(err || '上传失败, 请重试')
      this.$refs.upload.clearFiles()
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      const { code, msg } = res
      if (code === 200) {
        this.$message.success('上传成功')
        const result = {
          uid: file.uid,
          filePath: file.filePath,
          ...res.data,
          fileSize: this.additional.fileSize
        }
        const arrTemp = [...this.fileList, result]
        this.$emit('success', JSON.stringify(arrTemp))
        this.$emit('input', JSON.stringify(arrTemp))
      } else {
        this.handleUploadError(msg)
      }
    },
    // 进度状态回调
    handleProgress(event) {
      this.$emit('progress', event.percent)
    },
    // 删除文件
    handleDelete(file) {
      let imageTemp = {}
      const arrTemp = []
      _.forEach(this.fileList, (f) => {
        if (f.fileName === file.fileName) {
          imageTemp = f
        } else {
          arrTemp.push(f)
        }
      })
      this.$emit('remove', imageTemp)
      this.$emit('input', JSON.stringify(arrTemp))
    },
    // 下载文件
    downloadFile(url, fileName) {
      const x = new XMLHttpRequest()
      x.open('GET', url, true)
      x.responseType = 'blob'
      x.onload = function () {
        // 会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
        const url = window.URL.createObjectURL(x.response)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
      }
      x.send()
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-file {
  display: flex;
  flex-direction: column;
  .upload-btn {
    background-color: #f6faff;
    color: #009dd9;
    border: none;
  }
}
.upload-btn > span {
  line-height: 30px;
}
.upload-file-list .el-upload-list__item {
  border: none;
  margin-bottom: 10px;
  position: relative;

  .el-icon-close {
    color: #41464c;
    display: block;
    font-size: 20px;
    top: 8px;
    right: 8px;
  }
}
.upload-file-list .ele-upload-list__item-content {
  padding: 4px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
  margin: 0;
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}

.file-image-icon {
  font-size: 16px;
  color: #fff;
  cursor: pointer;
  position: absolute;
  top: -40px;
  right: 0;
  border-width: 40px;
  border-style: solid;
  border-color: transparent #20a0ff transparent transparent;
  width: 40px;
  height: 40px;

  i {
    position: absolute;
    top: 5px;
    right: -37px;
  }
}

::v-deep .el-upload--picture-card {
  display: var(--upload-card-display);
}

.el-upload__tip {
  b {
    color: #ff4949;
  }
}

.image-slot {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}
</style>
