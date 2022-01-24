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
          <el-tooltip class="item" effect="dark" content="终端状态" placement="top-start">
            <el-select v-model="queryParams.terminalStatus" placeholder="选择终端状态(默认全部)" style="width:150px">
              <el-option
                v-for="item in terminalStatusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryParams.nameValue"
            placeholder="请输入终端编号"
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
            size="mini"
            icon="el-icon-download"
            @click="downloadCsv('批量导入终端模板.xlsx')">
            下载模板
          </el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-folder-add"
            @click="bulkImport()">
            批量导入
          </el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="merchantsList">
        <el-table-column :show-overflow-tooltip="true" label="终端编号" align="center" prop="id"/>
        <el-table-column :show-overflow-tooltip="true" label="绑定商户" align="center" prop="merchantName"/>
        <el-table-column :show-overflow-tooltip="true" label="终端密钥" align="center" prop="secretKey" />
        <el-table-column :show-overflow-tooltip="true" label="终端状态" align="center" prop="terminalStatusStr" />
        <el-table-column :show-overflow-tooltip="true" label="设备状态" align="center" prop="deviceStatusStr" />
        <el-table-column :show-overflow-tooltip="true" label="备注" align="center" prop="memo" />
        <el-table-column
          label="操作"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="GenerateCode(scope.row)">生成二维码</el-button>
            <el-button
              v-if="scope.row.terminalStatus==1"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.page"
        :limit.sync="queryParams.rows"
        @pagination="getList"
      />
    </el-col>
    <addForm
      ref="addForm"
      :merchant-list="merchantIdList"
      @handleFilter="handleFilter"/>
    <bulkImport
      ref="bulkImport"
      :merchant-list="merchantIdList"
      @handleFilter="handleFilter"/>
    <codeShow
      ref="codeShow"/>
  </div>
</template>

<script>
    import { listPageUnionPayTerminal,deleteUnionPayTerminal } from "@/api/system/terminalManagement";
    import { listAllUnionPayMerchant } from "@/api/system/merchants";
    import { getToken } from "@/utils/auth";
    import addForm from './addForm'
    import bulkImport from './bulkImport'
    import codeShow from './codeShow'
    export default {
        name: "TerminalManagement",
        components: { addForm,bulkImport,codeShow },
        data() {
            return {
                terminalStatusList: [
                    { id: -1, name: '全部' },
                    { id: 1, name: '已启用' },
                    { id: 0, name: '未启用' }
                ],
                listLoading:false,
                merchantIdList:[],

                dialogStatus:'',
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
                merchantsList: null,
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
                    merchantId: "",
                    nameValue: "",
                    orderBy: "id asc",
                    organizeId: "123",
                    page: 1,
                    rows: 10,
                    terminalStatus: -1
                },
                // 表单校验
                rules: {
                    realName: [
                        { required: true, message: "管理员名称不能为空", trigger: "blur" }
                    ],
                    phoneNumber: [
                        {
                            required: true,
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
            GenerateCode(row) {
                this.$refs.codeShow.resetForm()
                this.$refs.codeShow.showDialog()
                this.$nextTick().then(res=>{
                    this.$refs.codeShow.changeSubmitForm(row)
                    this.$refs.codeShow.unionPayUnionPayMerchantGenerateUnionPayMerchantQRCodeFun()
                })
            },
            bulkImport(){
                this.$refs.bulkImport.resetForm(this.merchantIdList)
                this.$refs.bulkImport.showDialog()
            },
            handleFilter() {
                this.getList()
            },
            handleAdd() {
                this.$refs.addForm.resetForm()
                this.$refs.addForm.showDialog()
            },
            downloadCsv(fileName) {
                // downloadCsv(fileName)
            },
            TreeListControl() {
                return listAllUnionPayMerchant().then(response => {
                    this.merchantIdList = response.data
                })
                    .catch(error => {
                        this.listLoading = false
                    })
            },
            // handleAdd() {
            //     this.$refs.addForm.resetForm()
            //     this.$refs.addForm.showDialog()
            //     this.dialogStatus = 'create'
            // },
            /** 查询用户列表 */
            getList() {
                this.loading = true;
                listPageUnionPayTerminal(this.queryParams).then(response => {
                        this.merchantsList = response.data.rows;
                        this.total = response.data.total;
                        this.loading = false;
                    }
                );
            },

            /** 搜索按钮操作 */
            handleQuery() {
                this.queryParams.page = 1;
                this.getList();
            },
            /** 重置按钮操作 */
            resetQuery() {
                this.dateRange = [];
                this.queryParams = {
                    merchantId: "",
                    nameValue: "",
                    orderBy: "id asc",
                    organizeId: "123",
                    page: 1,
                    rows: 10,
                    terminalStatus: -1
                }
                this.handleQuery();
            },




            /** 删除按钮操作 */
            handleDelete(row) {
                const id = row.id ;
                const realNames = row.name ;
                this.$confirm('该操作将永久删除该终端设备，是否继续操作？', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return deleteUnionPayTerminal({id:id});
                }).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                }).catch(() => {});
            },


        }
    };
</script>
