<template>
  <div class="upload-file">
    <template v-if="!disabled">
      <el-upload
        ref="upload"
        :action="uploadFileUrl"
        :before-upload="handleBeforeUpload"
        :limit="limit"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        :on-success="handleUploadSuccess"
        :on-progress="handleProgress"
        :show-file-list="false"
        :headers="headers"
        :data="additional"
      >
        <!-- 上传按钮 -->
        <el-button v-if="size === 'big'" class="upload-btn mr-12">
          <i class="el-icon-upload fs-30 mr-8" />
          <span class="fs-18">{{ label }}</span>
        </el-button>
        <el-button v-if="size === 'small'" class="upload-btn mr-8" size="mini">
          <i class="el-icon-upload fs-16" />
          <span class="fs-14">{{ label }}</span>
        </el-button>
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
    </template>
    <!-- 进度条 -->
    <transition name="fade">
      <div v-if="uploadingProgressFlag" class="f-c pb-8">
        <div>{{ uploadingFileName }}</div>
        <el-progress class="progress" :percentage="uploadingPercentage" :stroke-width="5" />
      </div>
    </transition>

    <!-- 文件列表 -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <li v-for="(file, index) in fileList" :key="`file-${index}`" class="el-upload-list__item ele-upload-list__item-content">
        <el-link :underline="false" @click="downloadFile(file.filePath, file.fileName)">
          <i class="el-icon-document" />
          <span>{{ file.fileName }}</span>
        </el-link>
        <i v-if="!disabled" class="el-icon-close" style="color: #41464C" @click="handleDelete(index)" />
      </li>
    </transition-group>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

/**
 *  v2.2 文件上传组件
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
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => [
        'doc',
        'docx',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
        'txt',
        'pdf',
        'png',
        'jpg'
      ]
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
    },
    // 按钮大小
    size: {
      type: String,
      default: 'small'
    },
    // 按钮文字
    label: {
      type: String,
      default: '选取文件'
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
      // 上传中进度条标识
      uploadingProgressFlag: false,
      // 上传中进度条进度
      uploadingPercentage: 0,
      // 上传中文件名
      uploadingFileName: '',
      forbiddenCharacters: ['：', '？', '，', '！', '；']
    }
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize)
    }
  },
  watch: {
    value: {
      handler(val) {
        this.fileList = val ? JSON.parse(val) : []
      },
      deep: true,
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
      this.uploadingFileName = file.name
      return true
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`)
    },
    // 上传失败
    handleUploadError(err) {
      this.uploadingProgressFlag = false
      this.$emit('error', err)
      this.$message.error(err || '上传失败, 请重试')
      this.$refs.upload.clearFiles()
    },
    // 上传成功回调，但 code 不是 200 时也是上传失败的
    handleUploadSuccess(res) {
      this.uploadingPercentage = 100
      // setTimeout避免进度太快导致进度条直接不显示
      setTimeout(() => {
        this.uploadingProgressFlag = false
      }, 500)
      const { code, msg } = res
      if (code === 200) {
        this.$message.success('上传成功')
        const result = {
          ...res.data,
          fileSize: this.additional.fileSize
        }
        this.fileList.push(result)
        this.$emit('input', JSON.stringify(this.fileList))
        this.$emit('success', JSON.stringify(this.fileList))
      } else {
        this.handleUploadError(msg)
      }
    },
    // 进度状态回调
    handleProgress(event) {
      const { percent } = event
      this.uploadingProgressFlag = true
      if (percent !== 100) {
        this.uploadingPercentage = parseInt(percent)
      } else {
        this.uploadingPercentage = 99
      }
    },
    // 删除文件
    handleDelete(index) {
      this.fileList.length > 0 && this.fileList.splice(index, 1)
      this.$emit(
        'input',
        JSON.stringify(this.fileList.length > 0 ? this.fileList : undefined)
      )
      this.$emit('remove', this.fileList.length > 0 ? this.fileList : undefined)
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

.fade-enter-active,
.fade-leave-active {
  transition: all 1s ease;
}
.fade-enter-from,
.fade-leave-to {
  color: black;
  opacity: 0;
}
.el-upload__tip {
  b {
    color: #ff4949;
  }
}
</style>
