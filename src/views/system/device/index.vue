<template>
  <div class="app-container">
    <!--用户数据-->
    <el-col :span="20" :xs="24">
      <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="商户" placement="top-start">
            <el-select v-model="queryParams.sceneId" placeholder="选择商户(默认全部)" style="width:150px">
              <el-option
                v-for="item in merchantIdList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-tooltip class="item" effect="dark" content="设备状态" placement="top-start">
            <el-select v-model="queryParams.online" placeholder="选择设备状态(默认全部)" style="width:150px">
              <el-option
                v-for="item in deviceStatusList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-tooltip>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryParams.nameValue"
            placeholder="请输入设备编号"
            clearable
            size="small"
            style="width: 240px"

          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="merchantsList">
        <el-table-column :show-overflow-tooltip="true" label="设备编号" align="center" prop="deviceId"/>
        <el-table-column :show-overflow-tooltip="true" label="设备名称" align="center" prop="deviceName"/>
        <el-table-column :show-overflow-tooltip="true" label="绑定商户" align="center" prop="merchantName"/>
        <el-table-column :show-overflow-tooltip="true" label="绑定终端" align="center" prop="terminalNo"/>
        <el-table-column :show-overflow-tooltip="true" label="设备状态" align="center" prop="onLineStateStr"/>
        <el-table-column :show-overflow-tooltip="true" label="设备当前/最后连接时间" align="center" width="320">
          <template slot-scope="{row}">{{row.deviceTime}}/{{row.lastTime}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="后台/设备参数版本" align="center" width="200">
          <template slot-scope="{row}">{{row.parameterVersion}}/{{row.deviceParameterVersion}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="最大/实际下发流水号" align="center" width="160">
          <template slot-scope="{row}">{{row.faceChangeMaxIndex}}/{{row.faceSerialNumber}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="应该/实际下发人数" align="center" width="160">
          <template slot-scope="{row}">{{row.needDownPeople}}/{{row.isDownloadPeople}}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="设备未上传记录数" align="center" width="140">
          <template slot-scope="{row}">{{row.remainRecordCount}}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="160"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleAdd(scope.row)">编辑</el-button>
            <el-button
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
      :merchant-list="merchantIdList"
      @handleFilter="handleQuery"/>

  </div>
</template>

<script>
    import { listDeviceState , deleteDeviceById } from "@/api/system/device";
    import { listAllUnionPayMerchant } from "@/api/system/merchants";
    import { getToken } from "@/utils/auth";
    import addForm from './addForm'

    export default {
        name: "Device",
        components: { addForm },
        data() {
            return {
                merchantIdList:[],
                terminalIdList:[],
                deviceStatusList: [
                    { id: -1, name: '全部' },
                    { id: 1, name: '已启用' },
                    { id: 0, name: '未启用' }
                ],
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
                    childOrganizeId: "123",
                    deviceTypes: [],
                    manufacturerCode: 1,
                    nameValue: "",
                    online: -1,
                    orderBy: "deviceId",
                    page: 1,
                    recursion: 0,
                    rows: 10,
                    type: 1,
                    viewType: 0,
                    sceneId:''
                },
                // 表单校验
                rules: {

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
            TreeListControl() {
                return listAllUnionPayMerchant().then(response => {
                    this.merchantIdList = response.data
                })
                    .catch(error => {
                        this.listLoading = false
                    })
            },
            handleAdd(row) {
                this.$refs.addForm.resetForm(row)
                this.$refs.addForm.listAvailableUnionPayTerminalFun()
                this.$refs.addForm.showDialog()
                this.dialogStatus = 'update'
            },

            /** 查询用户列表 */
            getList() {
                this.loading = true;
                listDeviceState(this.queryParams).then(response => {
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
                this.queryParams = {
                    childOrganizeId: "123",
                    deviceTypes: [],
                    manufacturerCode: 1,
                    nameValue: "",
                    online: -1,
                    orderBy: "deviceId",
                    page: 1,
                    recursion: 0,
                    rows: 10,
                    type: 1,
                    viewType: 0,
                    sceneId:''
                }
                this.handleQuery();
            },

            /** 删除按钮操作 */
            handleDelete(row) {
                const idList = [row.deviceId] ;
                const realNames = row.deviceName ;
                this.$confirm('该操作将永久删除该设备，是否继续操作？', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return deleteDeviceById({idList:idList});
                }).then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                }).catch(() => {});
            },


        }
    };
</script>
