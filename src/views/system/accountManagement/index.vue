<template>
  <div class="app-container">
    <!--用户数据-->
    <el-col :span="20" :xs="24">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="商户" placement="top-start">
            <el-select v-model="queryParams.merchantId" placeholder="选择商户(默认全部)" style="width:150px">
              <el-option
                v-for="item in merchantIdList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="人脸状态" placement="top-start">
            <el-select v-model="queryParams.isFace" placeholder="请选择人脸状态">
              <el-option
                v-for="item in isFaceList"
                :key="item.id"
                :label="item.fullName"
                :value="item.id"/>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item prop="realName">
          <el-input
            v-model="queryParams.nameValue"
            placeholder="请输入卡号/其他编码"
            clearable
            size="small"
            style="width: 240px"

          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
          <el-button
            type="primary"
            plain
            size="mini"
            icon="el-icon-folder-add"
            @click="importFileAccountInfoFun">
            批量注册人员
          </el-button>
          <el-button
            type="primary"
            plain
            size="mini"
            icon="el-icon-folder-add"
            @click="batchFaceRegistration">
            批量注册人脸
          </el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="userList">
        <!--          <el-table-column type="selection" width="50" align="center" />-->
        <el-table-column :show-overflow-tooltip="true" label="卡号" width="200px" align="center" prop="cardNumber" sortable="custom"/>
        <el-table-column label="账户名称" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column :show-overflow-tooltip="true" label="人脸状态" width="120px" align="center" prop="isFace">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isFace==1" type="success" plain>已注册</el-button>
            <el-button v-if="scope.row.isFace==0" type="danger" plain>未注册</el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="其他编码" width="200px" align="center" prop="otherCode" sortable="custom"/>
        <el-table-column :show-overflow-tooltip="true" label="所属商户" width="120px" align="center" prop="merchantName"/>
        <el-table-column
          label="操作"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleDetails(scope.row)">
              详情
            </el-button>
            <el-button type="text" size="mini" @click="uploadFacePhoto(scope.row)">
              人脸注册
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="upload-btn-box">
        <input
          ref="faceRegister"
          type="file"
          class="kyc-passin"
          accept=".png,.jpg,"
          @change="faceRegister($event)">
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.rows"
        @pagination="getList"
      />
    </el-col>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="选择商户" prop="name">
              <el-select v-model="form.merchantId" placeholder="请选择">
                <el-option
                  v-for="item in merchantIdList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="卡号" prop="cardNumber">
              <el-input v-model.number="form.cardNumber" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="账户名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" placeholder="请输入" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="身份证号码" prop="idNumber">
              <el-input v-model="form.idNumber" placeholder="请输入" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="其他编码" prop="otherCode">
              <el-input v-model="form.otherCode" placeholder="请输入" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="dialogDetails" title="账户详情" width="500px">
      <el-form label-position="right" label-width="85px" class="details">
        <el-form-item label="卡号">
          {{ details.cardNumber }}
        </el-form-item>
        <el-form-item label="账户名称">
          {{ details.name }}
        </el-form-item>
        <el-form-item label="手机号码">
          {{ details.phoneNumber }}
        </el-form-item>
        <el-form-item label="身份证号码">
          {{details.idNumber }}
        </el-form-item>

        <el-form-item label="其他编码">
          {{ details.otherCode }}
        </el-form-item>

        <el-form-item label="所属商户">
          {{ details.merchantName}}
        </el-form-item>

        <img :src="getImgUrl(details.imageUrl)" class="imgFace">
      </el-form>

    </el-dialog>

    <el-dialog :visible.sync="importFileAccountInfoForm" title="批量注册人员" width="30%">
      <el-form label-position="right" label-width="80px" style="width: 60%;margin: 0 auto">
        <el-form-item label="选择商户" prop="name">
          <el-select v-model="importFileAccountInfo.merchantId" placeholder="请选择">
            <el-option
              v-for="item in merchantIdList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-folder-add"
            style="width:100%"
            @click="uploadFile2">
            上传文件
          </el-button>
        </el-form-item>
      </el-form>
      <div class="upload-btn-box">
        <input
          ref="filElem2"
          type="file"
          class="kyc-passin"
          accept=".xlsx"
          @change="uploadPhoto($event)"
        >
      </div>

    </el-dialog>
    <el-dialog :visible.sync="batchFaceRegistrationForm" title="批量注册人脸" width="30%" @close="closeDialog">
      <el-form label-position="right" label-width="120px" style="width: 80%;margin: 0 auto">
        <el-form-item label="选择商户" prop="name">
          <el-select v-model="faceRegisterBatch.merchantId" placeholder="请选择">
            <el-option
              v-for="item in merchantIdList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="照片命名格式">
          卡号
        </el-form-item>
        <el-form-item label="上传文件">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-folder-add"
            style="width:100%"
            @click="uploadFile">
            上传文件
          </el-button>
          （仅支持.zip文件）
        </el-form-item>
        <div class="upload-btn-box">
          <input
            ref="filElem"
            type="file"
            class="kyc-passin"
            accept=".zip"
            @change="uploadPersonPhoto($event)"
          >
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
    import { listAccountPageByOrg,accountTagDetail,accountListDelete,accountRegister,timeLimitFileListUpload,faceRegister,importFileAccountInfo,faceRegisterBatch } from "@/api/system/accountManagement";
    import { listAllUnionPayMerchant } from "@/api/system/merchants";
    import { getToken } from "@/utils/auth";
    export default {
        name: "AccountManagement",
        data() {
            return {
                faceRegisterBatch: {
                    childOrganizeId: "123",
                    fileName: "",
                    merchantId: "",
                    organizeId: "123"
                },

                batchFaceRegistrationForm: false,
                importFileAccountInfoForm: false,
                importFileAccountInfo: {
                    childOrganizeId: "123",
                    fileName: "",
                    merchantId: "",
                    organizeId: "123"
                },
                dialogDetails:false,
                details:[],
                listLoading:false,
                isFaceList: [
                    // { id: '', fullName: '全部' },
                    { id: 0, fullName: '未注册' },
                    { id: 1, fullName: '已注册' }
                ],
                merchantIdList:[],
                visible: true,
                visible2: true,
                // 遮罩层
                loading: true,
                // 选中数组
                ids: [],
                // 非单个禁用
                single: true,
                // 非多个禁用
                multiple: true,
                // 显示搜索条件
                showSearch: true,
                // 总条数
                total: 0,
                // 用户表格数据
                userList: null,
                // 弹出层标题
                title: "",
                // 部门树选项
                deptOptions: undefined,
                // 是否显示弹出层
                open: false,
                // 是否显示弹出层
                resetPassOpen: false,
                // 部门名称
                deptName: undefined,
                // 默认密码
                initPassword: undefined,
                // 日期范围
                dateRange: [],
                // 状态数据字典
                statusOptions: [],
                // 性别状态字典
                sexOptions: [],
                // 岗位选项
                postOptions: [],
                // 角色选项
                roleOptions: [],
                // 表单参数
                form: {},
                resetPassForm:{},
                // 用户导入参数
                upload: {
                    // 是否显示弹出层（用户导入）
                    open: false,
                    // 弹出层标题（用户导入）
                    title: "",
                    // 是否禁用上传
                    isUploading: false,
                    // 是否更新已经存在的用户数据
                    updateSupport: 0,
                    // 设置上传的请求头部
                    headers: { Authorization: "Bearer " + getToken() },

                },
                // 查询参数
                queryParams: {
                    childOrganizeId: "123",
                    isFace: '',
                    merchantId: "",
                    nameValue: "",
                    orderBy: "accountId",
                    page: 1,
                    recursion: 0,
                    rows: 10,
                    searchType: 0,
                },
                // 表单校验
                rules: {
                    name: [
                        { required: true, message: "账户名称不能为空", trigger: "blur" }
                    ],
                    cardNumber: [
                        { required: true, message: "卡号不能为空", trigger: "blur" }
                    ],

                    phoneNumber: [
                        {
                            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                            message: "请输入正确的手机号码",
                            trigger: "blur"
                        }
                    ]
                }
            };
        },
        watch: {
        },
        created() {
            this.TreeListControl().then(res => {
                this.getList()
            })
        },
        methods: {
            closeDialog() {
                this.getList()
            },
            uploadPersonPhoto(e) {
                this.openFullScreen2()
                this.test(e.target.files[0])
            },
            test(files) {
                var fd = new FormData()
                fd.append('multipartFiles', files)
                timeLimitFileListUpload(fd).then(res => {
                    this.$refs.filElem.value = null
                    this.faceRegisterBatchMethod(res.data[0])
                    this.loading2.close()
                })
            },
            faceRegisterBatchMethod(fileRegisterList) {
                var index = fileRegisterList.oldName.lastIndexOf('\/')
                fileRegisterList.oldName = fileRegisterList.oldName.substring(index + 1, fileRegisterList.oldName.length)
                this.faceRegisterBatch.fileName = fileRegisterList.newName
                // this.faceRegisterBatch.originalImageName = fileRegisterList.oldName
                return faceRegisterBatch(this.faceRegisterBatch)
                    .then(res => {
                        this.batchFaceRegistrationForm = false
                        if (res.data == null) {
                            this.$message({
                                message: '上传成功，请去任务列表查看',
                                type: 'success'
                            })
                        } else {
                            var form = document.createElement('form')
                            const formAction = res.data
                            window.open(formAction, '_self')
                        }
                    })
                    .catch(error => {

                    })
            },
            uploadFile() {
                this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
            },
            batchFaceRegistration() {
                this.faceRegisterBatch.merchantId = this.merchantIdList[0].id
                this.batchFaceRegistrationForm = true
            },
            fileRegister(fileRegisterId) {
                this.importFileAccountInfo.fileName = fileRegisterId
                importFileAccountInfo(this.importFileAccountInfo).then(res => {
                    this.importFileAccountInfoForm = false
                    this.getList()
                    this.loading2.close()
                    const showMessage = '账户批量注册成功'
                    this.$notify({
                        title: '成功',
                        message: showMessage,
                        type: 'success',
                        duration: 2000
                    })
                }).catch(error => {
                    this.loading2.close()
                })
            },
            uploadPhoto(e) {
                this.openFullScreen2()
                var fd = new FormData()
                var length = e.target.files.length
                for (var i = 0; i < length; i++) {
                    fd.append('multipartFiles', e.target.files[i])
                }
                timeLimitFileListUpload(fd).then(res => {
                    this.loading2.close()
                    this.$refs.filElem2.value = null
                    this.importFileAccountInfoForm = false
                    this.fileRegisterList = res.data
                    this.fileRegisterId = this.fileRegisterList[0].newName
                    this.fileRegister(this.fileRegisterList[0].newName)
                })
            },
            uploadFile2() {
                this.$refs.filElem2.dispatchEvent(new MouseEvent('click'))
            },
            resetImportFileAccountInfo() {
                this.importFileAccountInfo = {
                    childOrganizeId: "123",
                    fileName: "",
                    merchantId: "",
                    organizeId: "123"
                }
            },
            importFileAccountInfoFun() {
                // this.AccountInfoError = []
                this.resetImportFileAccountInfo()
                this.importFileAccountInfo.merchantId = this.merchantIdList[0].id
                this.importFileAccountInfoForm = true
            },
            openFullScreen2() {
                this.loading2 = this.$loading({
                    lock: true,
                    text: '文件上传中Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
            },
            faceRegister(e) {
                if (typeof e.target.files[0] !== 'object') {
                    return false
                }
                this.openFullScreen2()
                var fd = new FormData()
                var length = e.target.files.length
                // var aaa = [];
                // fd.append("fd",e.target.files[0])
                for (var i = 0; i < length; i++) {
                    fd.append('multipartFiles', e.target.files[i])
                }
                fd.append('isImageCompress', 1)
                // fd.append('isForever', 1)

                // const faTest = { fd: fd ,isImageCompress:1}
                timeLimitFileListUpload(fd).then(res => {
                    this.$refs.faceRegister.value = null
                    this.fileRegisterList = res.data
                    this.fileRegisterId = this.fileRegisterList[0].newName
                    this.faceRegister2(this.fileRegisterList[0].newName)
                })
            },
            faceRegister2(faceRegisterId) {
                var faceRegisterForm = {
                    accountId: this.accountId,
                    imageName: faceRegisterId,
                    examineType: 0
                }
                faceRegister(faceRegisterForm).then(res => {
                    this.getList()
                    this.loading2.close()
                    let showMessage = ''
                    if (this.isFace === 0) {
                        showMessage = '人脸注册成功'
                    } else {
                        showMessage = '人脸替换成功'
                    }
                    this.$notify({
                        title: '成功',
                        message: showMessage,
                        type: 'success',
                        duration: 2000
                    })
                }).catch(error => {
                    this.loading2.close()
                })
            },
            uploadFacePhoto(row) {
                this.isFace = row.isFace
                this.accountId = row.accountId
                this.$refs.faceRegister.dispatchEvent(new MouseEvent('click'))
            },
            getImgUrl(imgUrl) {
                if (imgUrl == '') {
                    return accountImg
                } else {
                    return imgUrl
                }
            },
            handleDetails(row) {
                this.details = [],
                accountTagDetail({accountId:row.accountId}).then(res => {
                    this.details = res.data
                    // if (this.details.imageName != null) {
                    //     const idList = [this.details.imageName]
                    //     this.$store.dispatch('FileUrl', idList).then(res => {
                    //         this.details.imageUrl = res.data[0].right
                    //     })
                    // }
                    this.dialogDetails = true
                })
            },
            TreeListControl() {
                return listAllUnionPayMerchant().then(response => {
                        this.merchantIdList = response.data
                    })
                    .catch(error => {
                        this.listLoading = false
                    })
            },
            changePass(value){
                this.visible = !(value === 'show'); //切换密码框的显示
                this.$nextTick(function() {//对焦密码框
                    this.$refs['password'].focus()
                })
            },
            changePass2(value){
                this.visible2 = !(value === 'show'); //切换密码框的显示
                this.$nextTick(function() {//对焦密码框
                    this.$refs['password2'].focus()
                })
            },
            /** 查询用户列表 */
            getList() {
                this.loading = true;
                listAccountPageByOrg(this.queryParams).then(response => {
                        this.userList = response.data.rows;
                        this.total = response.data.total;
                        this.loading = false;
                    }
                );
            },

            handleAdd() {
                this.reset()
                this.form.merchantId = this.merchantIdList[0].id
                this.title = '新增账户'
                this.open = true
                // this.$nextTick(() => this.$refs['accountRegisterRequest'].clearValidate())
            },

            // 取消按钮
            cancel() {
                this.open = false;
                this.reset();
            },
            // 表单重置
            reset() {
                this.form = {
                    accountId: "",
                    cardNumber: "",
                    idNumber: '',
                    merchantId: "",
                    name: "",
                    otherCode: "",
                    phoneNumber: '',
                    sex: ""
                };
                this.resetForm("form");
            },
            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.page = 1;
                this.getList();
            },
            resetForm(){
                this.queryParams={
                    childOrganizeId: "123",
                    isFace: '',
                    merchantId: "",
                    nameValue: "",
                    orderBy: "accountId",
                    page: 1,
                    recursion: 0,
                    rows: 10,
                    searchType: 0,
                }
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.resetForm("queryForm");
                this.handleQuery();
            },



            /** 提交按钮 */
            submitForm: function() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        accountRegister(this.form).then(response => {
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                });
            },

            /** 删除按钮操作 */
            handleDelete(row) {
                const id = [row.accountId] ;
                const realNames = row.name ;
                this.$confirm('是否确认删除商户名称为"' + realNames + '"的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return accountListDelete({idList:id});
                }).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                }).catch(() => {});
            },


        }
    };
</script>
<style scoped lang="scss">
  .details {
    position: relative;
  }

  .details .el-form-item {
    margin-bottom: 10px;
  }

  .details .imgFace {
    position: absolute;
    width: 150px;
    height: 150px;
    top: 0px;
    right: 0px;
  }
  .upload-btn-box {
    margin-bottom: 10px;

  button {
    margin-right: 10px;
  }

  input[type=file] {
    display: none;
  }
  }
</style>
