<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
<!--      <el-col :span="4" :xs="24">-->
<!--        <div class="head-container">-->
<!--          <el-input-->
<!--            v-model="deptName"-->
<!--            placeholder="请输入部门名称"-->
<!--            clearable-->
<!--            size="small"-->
<!--            prefix-icon="el-icon-search"-->
<!--            style="margin-bottom: 20px"-->
<!--          />-->
<!--        </div>-->
<!--        <div class="head-container">-->
<!--          <el-tree-->
<!--            :data="deptOptions"-->
<!--            :props="defaultProps"-->
<!--            :expand-on-click-node="false"-->
<!--            :filter-node-method="filterNode"-->
<!--            ref="tree"-->
<!--            default-expand-all-->
<!--            @node-click="handleNodeClick"-->
<!--          />-->
<!--        </div>-->
<!--      </el-col>-->
      <!--操作员数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
          <el-form-item label="操作员名称" prop="userName">
            <el-input
              v-model="queryParams.nameValue"
              placeholder="请输入操作员名称"
              clearable
              size="small"
              style="width: 240px"

            />
          </el-form-item>
<!--          <el-form-item label="手机号码" prop="phoneNumber">-->
<!--            <el-input-->
<!--              v-model="queryParams.phoneNumber"-->
<!--              placeholder="请输入手机号码"-->
<!--              clearable-->
<!--              size="small"-->
<!--              style="width: 240px"-->
<!--              @keyup.enter.native="handleQuery"-->
<!--            />-->
<!--          </el-form-item>-->
<!--          <el-form-item label="状态" prop="status">-->
<!--            <el-select-->
<!--              v-model="queryParams.status"-->
<!--              placeholder="操作员状态"-->
<!--              clearable-->
<!--              size="small"-->
<!--              style="width: 240px"-->
<!--            >-->
<!--              <el-option-->
<!--                v-for="dict in statusOptions"-->
<!--                :key="dict.dictValue"-->
<!--                :label="dict.dictLabel"-->
<!--                :value="dict.dictValue"-->
<!--              />-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="创建时间">-->
<!--            <el-date-picker-->
<!--              v-model="dateRange"-->
<!--              size="small"-->
<!--              style="width: 240px"-->
<!--              value-format="yyyy-MM-dd"-->
<!--              type="daterange"-->
<!--              range-separator="-"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--            ></el-date-picker>-->
<!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
            >新增</el-button>
          </el-col>
<!--          <el-col :span="1.5">-->
<!--            <el-button-->
<!--              type="success"-->
<!--              plain-->
<!--              icon="el-icon-edit"-->
<!--              size="mini"-->
<!--              :disabled="single"-->
<!--              @click="handleUpdate"-->
<!--              v-hasPermi="['system:user:edit']"-->
<!--            >修改</el-button>-->
<!--          </el-col>-->
          <!-- <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:user:remove']"
            >删除</el-button>
          </el-col> -->
          <!-- <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['system:user:import']"
            >导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
            >导出</el-button>
          </el-col> -->
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
<!--          <el-table-column label="操作员编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />-->
          <el-table-column label="操作员账号" align="center" key="userName" prop="userName" v-if="columns[0].visible" :show-overflow-tooltip="true" width="150" />
          <el-table-column label="操作员昵称" align="center" key="nickName" prop="nickName" v-if="columns[1].visible" :show-overflow-tooltip="true" width="150" />
          <el-table-column label="角色名称" align="center" key="roleName" prop="roleName" v-if="columns[2].visible" :show-overflow-tooltip="true" width="150" />
<!--          <el-table-column label="操作员昵称" align="center" key="nickName" prop="nickName" v-if="columns[2].visible" :show-overflow-tooltip="true" />-->
<!--          <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible" :show-overflow-tooltip="true" />-->
<!--          <el-table-column label="手机号码" align="center" key="phoneNumber" prop="phoneNumber" v-if="columns[4].visible" width="120" />-->
          <el-table-column label="状态" align="center" key="status" width="150" v-if="columns[4].visible">
            <template slot-scope="scope">
              <el-tag type="success" effect="plain" v-if="scope.row.status == 0">正常</el-tag>
              <el-tag type="danger" effect="plain" v-else>停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[1].visible" width="160">
            <template slot-scope="scope">
              <el-tag>{{scope.row.createTime}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >修改</el-button>
              <!-- <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:user:remove']"
              >删除</el-button> -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
                v-hasPermi="['system:user:resetPwd']"
              >重置</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" @close="reset">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入操作员昵称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="form.roleId" placeholder="请选择">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.fullName"
                  :value="item.id"
                   :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="归属部门" prop="deptId">-->
<!--              <treeselect v-model="form.deptId" :options="deptOptions" :normalizer="normalizer" :show-count="true" placeholder="请选择归属部门" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-row>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="手机号码" prop="phoneNumber">-->
<!--              <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" maxlength="11" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="邮箱" prop="email">-->
<!--              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入操作员账号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="!form.userId" label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入操作员密码" show-password />
            </el-form-item>
          </el-col>
        </el-row>
       <el-row>
<!--          <el-col :span="12">-->
<!--            <el-form-item label="操作员性别">-->
<!--              <el-select v-model="form.sex" placeholder="请选择">-->
<!--                <el-option-->
<!--                  v-for="dict in sexOptions"-->
<!--                  :key="dict.dictValue"-->
<!--                  :label="dict.dictLabel"-->
<!--                  :value="dict.dictValue"-->
<!--                ></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
         <el-col :span="12">
           <el-form-item label="状态" prop="status">
             <el-radio-group v-model="form.status" size="small">
               <el-radio-button
                 v-for="dict in statusOptions"
                 :key="dict.dictValue"
                 :label="dict.dictValue"
               >{{dict.dictLabel}}</el-radio-button>
             </el-radio-group>
           </el-form-item>
         </el-col>
        </el-row>
       <!-- <el-row> -->
<!--          <el-col :span="12">-->
<!--            <el-form-item label="岗位">-->
<!--              <el-select v-model="form.postIds" multiple placeholder="请选择">-->
<!--                <el-option-->
<!--                  v-for="item in postOptions"-->
<!--                  :key="item.postId"-->
<!--                  :label="item.postName"-->
<!--                  :value="item.postId"-->
<!--                  :disabled="item.status == 1"-->
<!--                ></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-row>-->
<!--          <el-col :span="24">-->
<!--            <el-form-item label="备注">-->
<!--              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 操作员导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的操作员数据
<!--          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>-->
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, delUser, addUser, updateUser, exportUser, resetUserPwd, changeUserStatus, importTemplate } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { deptTreeselect} from "@/api/system/dept";
import { roleList }from '@/api/system/role'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  components: { Treeselect },
  data() {
    return {
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
      // 操作员表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
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
      defaultProps: {
        children: "children",
        label: "fullName"
      },
      // 操作员导入参数
      upload: {
        // 是否显示弹出层（操作员导入）
        open: false,
        // 弹出层标题（操作员导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的操作员数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
          nameValue:undefined,
          deptId:undefined,
          orderBy:'createTime desc',
          page: 1,
          perPage :10,
          phoneNumber:undefined,
          status: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `操作员账号`, visible: true },
        { key: 1, label: `操作员昵称`, visible: true },
        { key: 2, label: `角色名称`, visible: true },
        { key: 3, label: `创建时间`, visible: true },
        { key: 4, label: `状态`, visible: true },
      ],
      // 表单校验
      rules: {
        userName: [
          { required: true,   message: "操作员名称不能为空", trigger: "blur" },
          { pattern: /^[A-Za-z0-9]{3,20}$/, message: '只能英文和数字(3~20位)' }
        ],
        nickName: [
          { required: true, message: "操作员昵称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "操作员密码不能为空", trigger: "blur" }
        ],
        roleId: [
          { required: true, message: "角色不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
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
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getStatusOptionsFun();
    this.getSexOptionsFun();
  },
  methods: {
      /** 转换部门数据结构 */
      normalizer(node) {
          if (node.children && !node.children.length) {
              delete node.children;
          }
          return {
              id: node.id,
              label: node.fullName,
              children: node.children
          };
      },
      getSexOptionsFun(){
          this.sexOptions = [{
              "searchValue": null,
              "createBy": "admin",
              "createTime": "2020-11-20 19:29:49",
              "updateBy": null,
              "updateTime": null,
              "remark": "性别男",
              "params": {},
              "dictCode": 1,
              "dictSort": 1,
              "dictLabel": "男",
              "dictValue": 0,
              "dictType": "sys_user_sex",
              "cssClass": "",
              "listClass": "",
              "isDefault": "Y",
              "status": "0",
              "default": true
          }, {
              "searchValue": null,
              "createBy": "admin",
              "createTime": "2020-11-20 19:29:49",
              "updateBy": null,
              "updateTime": null,
              "remark": "性别女",
              "params": {},
              "dictCode": 2,
              "dictSort": 2,
              "dictLabel": "女",
              "dictValue": 1,
              "dictType": "sys_user_sex",
              "cssClass": "",
              "listClass": "",
              "isDefault": "N",
              "status": "0",
              "default": false
          }, {
              "searchValue": null,
              "createBy": "admin",
              "createTime": "2020-11-20 19:29:49",
              "updateBy": null,
              "updateTime": null,
              "remark": "性别未知",
              "params": {},
              "dictCode": 3,
              "dictSort": 3,
              "dictLabel": "未知",
              "dictValue": "2",
              "dictType": "sys_user_sex",
              "cssClass": "",
              "listClass": "",
              "isDefault": "N",
              "status": "0",
              "default": false
          }]
      },
      //返回显示状态的可选
      getStatusOptionsFun(){
          this.statusOptions = [
              {
                  "searchValue":null,
                  "createBy":"admin",
                  "createTime":"2020-11-20 19:29:49",
                  "updateBy":null,
                  "updateTime":null,
                  "remark":"正常状态",
                  "params":{

                  },
                  "dictCode":6,
                  "dictSort":1,
                  "dictLabel":"正常",
                  "dictValue":"0",
                  "dictType":"sys_normal_disable",
                  "cssClass":"",
                  "listClass":"primary",
                  "isDefault":"Y",
                  "status":"0",
                  "default":true
              },
              {
                  "searchValue":null,
                  "createBy":"admin",
                  "createTime":"2020-11-20 19:29:49",
                  "updateBy":null,
                  "updateTime":null,
                  "remark":"停用状态",
                  "params":{

                  },
                  "dictCode":7,
                  "dictSort":2,
                  "dictLabel":"停用",
                  "dictValue":"1",
                  "dictType":"sys_normal_disable",
                  "cssClass":"",
                  "listClass":"danger",
                  "isDefault":"N",
                  "status":"0",
                  "default":false
              }
          ]
      },
    /** 查询操作员列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.data.dataList;
          this.total = response.data.totalPage;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      deptTreeselect().then(response => {
        this.deptOptions = response.data;
        // this.deptOptions =[{"id":1,"fullName":"华捷技术部","parentId":0,"parentDeptName":null,"sortCode":1,"leader":"吕","phone":"15251699205","email":null,"status":0,"children":[]}]
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.fullName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    // 操作员状态修改
    handleStatusChange(row) {
      let copyRow = this.deepClone(row);
      let text = copyRow.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + copyRow.userName + '"操作员吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeUserStatus(copyRow.userId, copyRow.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
          row.status = !copyRow.status;
        }).catch();
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 表单重置
    reset() {
      // console.log(111);
      this.form = {};
      this.resetForm("form");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.nickNames = selection.map(item => item.userName);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.getTreeselect();
        roleList().then(response => {
        // this.postOptions = response.posts;
        this.roleOptions = response.data;
        this.title = "添加操作员";
        // this.form.status = 0;
        this.$set(this.form, 'status', 0);
        this.open = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.getTreeselect();
      const userId = row.userId || this.ids;
        roleList().then(response => {
          this.form = this.deepClone(row);
          // this.postOptions = response.posts;
          this.roleOptions = response.data;
          // this.form.postIds = response.postIds;
          // this.form.roleIds = response.roleIds;
          this.open = true;
          this.title = "修改操作员";
          this.form.password = "";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            this.msgSuccess("修改成功，新密码是：" + value);
          });
        }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      const nickNames = row.userName || this.nickNames
      console.log(this.userName)
      this.$confirm('是否确认删除操作员名称为"' + nickNames + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delUser(userIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有操作员数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportUser(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "操作员导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
