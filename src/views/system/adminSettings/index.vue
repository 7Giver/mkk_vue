<template>
  <div class="app-container">
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item prop="realName">
            <el-input
              v-model="queryParams.nameValue"
              placeholder="请输入管理员名称"
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

        <el-table v-loading="loading" :data="userList">
<!--          <el-table-column type="selection" width="50" align="center" />-->
          <el-table-column label="用户名称" align="center" key="userName" prop="realName" :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" align="center" key="phoneNumber" prop="phoneNumber"  width="120" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
              >重置密码</el-button>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="管理员名称" prop="realName">
              <el-input v-model="form.realName" placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="手机号码" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="设置密码" prop="password">
<!--              <el-input v-model="form.password" placeholder="请输入密码" type="password" />-->
              <el-input v-if="visible" v-model="form.password" placeholder="请输入密码" type="password" ref="password">
                <i slot="suffix"  class="el-icon-view" @click="changePass('show')"></i>
              </el-input>
              <el-input v-else type="text" v-model="form.password" ref="password">
                <i slot="suffix"  class="el-icon-view" @click="changePass('hide')"></i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="确认密码" prop="password2">
<!--              <el-input v-model="form.password2" placeholder="请输入密码" type="password" />-->

              <el-input v-if="visible2" v-model="form.password2" placeholder="请输入密码" type="password" ref="password2">
                <i slot="suffix"  class="el-icon-view" @click="changePass2('show')"></i>
              </el-input>
              <el-input v-else type="text" v-model="form.password2" ref="password2">
                <i slot="suffix"  class="el-icon-view" @click="changePass2('hide')"></i>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>



    <!-- 重置密码对话框 -->
    <el-dialog title="重置密码" :visible.sync="resetPassOpen" width="600px" append-to-body>
      <el-form ref="form" :model="resetPassForm" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="新密码" prop="password">
                 <el-input v-model="resetPassForm.password" placeholder="请输入密码" type="text" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" :offset="6">
            <el-form-item label="确认密码" prop="password3">
              <el-input v-model="resetPassForm.password3" placeholder="请输入密码" type="text" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitResetPwd">确 定</el-button>
        <el-button @click="cancelResetPwd">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listUser, delUser, addUser, resetUserPwd,} from "@/api/system/adminSettings";
import { getToken } from "@/utils/auth";
import { validatePass } from "@/utils/validate";

export default {
  name: "AdminSettings",
  data() {
      var validatePass2 = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请再次输入密码'));
          } else if (value !== this.form.password) {
              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };
      var validatePass3 = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请再次输入密码'));
          } else if (value !== this.resetPassForm.password) {
              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };
    return {
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
          nameValue:'',
          orderBy: 'phoneNumber',
          page: 1,
          rows :10,
      },
      // 列信息
      // columns: [
      //   { key: 0, label: `用户编号`, visible: true },
      //   { key: 1, label: `用户名称`, visible: true },
      //   { key: 2, label: `用户昵称`, visible: true },
      //   { key: 3, label: `部门`, visible: true },
      //   { key: 4, label: `手机号码`, visible: true },
      //   { key: 5, label: `状态`, visible: true },
      //   { key: 6, label: `创建时间`, visible: true }
      // ],
      // 表单校验
      rules: {
        realName: [
          { required: true, message: "管理员名称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码为4-20位数字,字母,或特殊字符", validator: validatePass, trigger: "blur" }
        ],
          password2: [
              { required: true, validator: validatePass2, trigger: 'blur' }
          ],
          password3: [
              { required: true, validator: validatePass3, trigger: 'blur' }
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
      listUser(this.addDateRange(this.queryParams)).then(response => {
          this.userList = response.data.rows;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
      cancelResetPwd(){
          this.resetPassOpen = false;
          this.resetResetPass();
      },
    // 表单重置
    reset() {
      this.form = {
          password: "",
          password2: "",
          phoneNumber: "",
          userId: "",
          realName: "",
      };
      this.resetForm("form");
    },
    resetResetPass(){
      this.resetPassForm = {
          userId:'',
          password:'',
          password3:''
      }
        this.resetForm("resetPassForm");
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

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增管理员";
    },

    /** 重置密码按钮操作 */
    handleResetPwd(row) {
        this.resetResetPass();
        this.resetPassOpen = true;
        this.resetPassForm.userId = row.userId
      // this.$prompt('请输入"' + row.realName + '"的新密码', "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消"
      // }).then(({ value }) => {
      //     resetUserPwd(row.userId, value).then(response => {
      //       this.msgSuccess("修改成功，新密码是：" + value);
      //     });
      //   }).catch(() => {});
    },
      submitResetPwd(){
          resetUserPwd(this.resetPassForm).then(response => {
              this.msgSuccess("修改成功");
              this.resetPassOpen = false
          });
      },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            addUser(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId ;
      const realNames = row.realName ;
      this.$confirm('是否确认删除用户编号为"' + realNames + '"的数据项?', "警告", {
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


  }
};
</script>
