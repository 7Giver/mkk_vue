<template>
  <div class="app-container">
    <!--用户数据-->
    <el-col :span="20" :xs="24">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item prop="realName">
          <el-input
            v-model="queryParams.nameValue"
            placeholder="请输入商户名称"
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
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="merchantsList">
        <!--          <el-table-column type="selection" width="50" align="center" />-->
        <el-table-column :show-overflow-tooltip="true" label="商户ID" align="center" prop="id"/>
        <el-table-column :show-overflow-tooltip="true" label="商户名称" align="center" prop="name"/>
        <el-table-column :show-overflow-tooltip="true" label="接口地址" align="center" prop="interfaceAddr" />
        <el-table-column :show-overflow-tooltip="true" label="绑定终端" align="center" >
          <template slot-scope="scope">
            <div>已启用{{ scope.row.enabledTotal }}台</div>
            <div>未启用{{ scope.row.disabledTotal }}台</div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="商户简介" align="center" prop="memo" />
        <el-table-column
          label="操作"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="GenerateCode(scope.row)">生成二维码</el-button>
            <el-button
              v-if="scope.row.userId !== 1"
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
      :dialog-status="dialogStatus"
      @handleFilter="handleQuery"/>
    <codeShow
      ref="codeShow"/>
  </div>
</template>

<script>
    import { listPageUnionPayMerchant ,deleteUnionPayMerchant } from "@/api/system/merchants";
    import { getToken } from "@/utils/auth";
    import addForm from './addForm'
    import codeShow from './codeShow'
    export default {
        name: "Merchants",
        components: { addForm , codeShow},
        data() {
            return {
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
                    nameValue: "",
                    orderBy: "id asc",
                    organizeId: "",
                    page: 1,
                    rows: 10
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
            this.getList();
        },
        methods: {
            handleAdd() {
                this.$refs.addForm.resetForm()
                this.$refs.addForm.showDialog()
                this.dialogStatus = 'create'
            },
            GenerateCode(row) {
                this.$refs.codeShow.resetForm()
                this.$refs.codeShow.showDialog()
                this.$nextTick().then(res=>{
                    this.$refs.codeShow.changeSubmitForm(row)
                    this.$refs.codeShow.unionPayUnionPayMerchantGenerateUnionPayMerchantQRCodeFun()
                })
            },
            /** 查询用户列表 */
            getList() {
                this.loading = true;
                listPageUnionPayMerchant(this.queryParams).then(response => {
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
                this.resetForm("queryForm");
                this.handleQuery();
            },




            /** 删除按钮操作 */
            handleDelete(row) {
                const id = row.id ;
                const realNames = row.name ;
                this.$confirm('是否确认删除商户名称为"' + realNames + '"的数据项?', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return deleteUnionPayMerchant({id:id});
                }).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                }).catch(() => {});
            },


        }
    };
</script>
