/*
 * @Descripttion:
 * @version:
 * @Author: liuwl
 * @Date: 2021-05-26 13:50:22
 * @LastEditTime: 2021-08-17 15:37:58
 */
import $request from "./request.js";

var url = "/rms_zj/api/";
//用户登录
export function isUser(data) {
  return $request({
    url: url + "rmsUser/isUser",
    method: "post",
    data: data,
  });
}
//用户管理配置分页查询
export function userOrgRoleQry(data) {
  return $request({
    url: url + "rmsUser/userOrgRoleQry",
    method: "post",
    data: data,
  });
}
//用户管理检查用户名是否重复
export function qryRmsUserByUserCode(data) {
  return $request({
    url: url + "rmsUser/qryRmsUserByUserCode",
    method: "post",
    data: data,
  });
}
//用户管理配置新增
export function addRmsUser(data) {
  return $request({
    url: url + "rmsUser/addRmsUser",
    method: "post",
    data: data,
  });
}
//用户管理根据ID查询信息
export function userQry(data) {
  return $request({
    url: url + "rmsUser/userQry/" + data,
    method: "post",
    data: data,
  });
}
//用户管理修改信息
export function updateRmsUser(data) {
  return $request({
    url: url + "rmsUser/updateRmsUser",
    method: "post",
    data: data,
  });
}
//用户管理删除信息
export function deleteUser(data) {
  return $request({
    url: url + "rmsUser/deleteUser",
    method: "post",
    data: data,
  });
}
//用户管理重置密码
export function resetPassword(data) {
  return $request({
    url: url + "rmsUser/resetPassword",
    method: "post",
    data: data,
  });
}
//角色列表分页查询
export function qryRoleByPage(data) {
  return $request({
    url: url + "rmsRole/qryRoleByPage",
    method: "post",
    data: data,
  });
}
//查找全部角色集合
export function qryRmsRole() {
  return $request({
    url: url + "rmsRole/qryRmsRole",
    method: "get",
  });
}
//添加角色
export function addRole(data) {
  return $request({
    url: url + "rmsRole/addRole",
    method: "post",
    data: data,
  });
}
//删除角色
export function deleteRole(data) {
  return $request({
    url: url + "rmsRole/deleteRole",
    method: "post",
    data: data,
  });
}
//根据ID查找角色
export function selectRoleById(data) {
  return $request({
    url: url + "rmsRole/selectRoleById/" + data,
    method: "get",
    data: data,
  });
}
//修改角色
export function updateRole(data) {
  return $request({
    url: url + "rmsRole/updateRole",
    method: "post",
    data: data,
  });
}
// 查找角色权限
export function findRoleAuthority(data) {
  return $request({
    url: url + "rmsRole/findRoleAuthority/" + data,
    method: "get",
    data: data,
  });
}
// 更改角色权限
export function addAuthority(data) {
  return $request({
    url: url + "rmsRole/addAuthority",
    method: "post",
    data: data,
  });
}
//定时任务调度通用
export function allMethod(data) {
  return $request({
    url: url + "quartz/allMethod",
    method: "post",
    data: data,
  });
}
// 静态数据分页查询
export function qryBsStaticData(data) {
  return $request({
    url: url + "bsStaticData/qryBsStaticData",
    method: "post",
    data: data,
  });
}
// 静态数据删除
export function delBsStaticData(data) {
  return $request({
    url: url + "bsStaticData/delBsStaticData",
    method: "post",
    data: data,
  });
}
// 静态数据删除缓存
export function delRedis(data) {
  return $request({
    url: url + "bsStaticData/delRedis",
    method: "post",
    data: data,
  });
}
// 静态数据通过Id查找
export function qryBsById(data) {
  return $request({
    url: url + "bsStaticData/qryBsById/" + data,
    method: "get",
    data: data,
  });
}
// 静态数据新增
export function addBsStaticData(data) {
  return $request({
    url: url + "bsStaticData/addBsStaticData",
    method: "post",
    data: data,
  });
}
// 静态数据修改
export function updateBsStaticData(data) {
  return $request({
    url: url + "bsStaticData/updateBsStaticData",
    method: "post",
    data: data,
  });
}
// 通过codeType查询静态数据
export function getStaticDataByCodeType(data) {
  return $request({
    url: url + "bsStaticData/getStaticDataByCodeType/" + data,
    method: "get",
    data: data,
  });
}
//分页展示指标同步任务记录
export function getRecordList(data) {
  return $request({
    url: url + "record/getRecordList",
    method: "post",
    data: data,
  });
}
//分页展示指标同步历史明细
export function getRecordHistoryList(data) {
  return $request({
    url: url + "record/getRecordHistoryList",
    method: "post",
    data: data,
  });
}
//众包酬金结算数据分页展示
export function getAdviceData(data) {
  return $request({
    url: url + "record/getAdviceData",
    method: "post",
    data: data,
  });
}
// 获取指标类型
export function getFactorCodeAndName(data) {
  return $request({
    url: url + "record/getFactorCodeAndName",
    method: "get",
    data: data,
  });
}
// 分页展示录入数据
export function getDataList(data) {
  return $request({
    url: url + "dataEntry/getDataList",
    method: "post",
    data: data,
  });
}
// 分页展示上传数据
export function getUploadDataList(data) {
  return $request({
    url: url + "dataEntry/getUploadDataList",
    method: "post",
    data: data,
  });
}
// 下载上传数据
export function downLoadDataList(data) {
  return $request({
    url: url + "dataEntry/downLoadDataList",
    method: "post",
    data: data,
    responseType: "blob",
  });
}
// 下载Excel模板
export function downLoadMould(data) {
  return $request({
    url: url + "dataEntry/downLoadMould",
    method: "post",
    data: data,
    responseType: "blob",
  });
}
// 导入/上传Excel
export function importExcel(fileName, modeId, userId, tabName, formData) {
  return $request({
    url: url + "dataEntry/importExcel?fileName=" + fileName + "&modeId=" + modeId + "&userId=" + userId + "&tabName=" + tabName,
    method: "post",
    data: formData,
  });
}
// 数据录入日志查看
export function getLogData(data) {
  return $request({
    url: url + "dataEntry/getLogData?tabName=" + data,
    method: "post",
    data: data,
  });
}
// 折算系数分页查询
export function getCoefficientListByPage(data) {
  return $request({
    url: url + "bsCoefficient/getCoefficientListByPage",
    method: "post",
    data: data,
  });
}
// 新增折算系数
export function addCoefficient(data) {
  return $request({
    url: url + "bsCoefficient/addCoefficient",
    method: "post",
    data: data,
  });
}
// 折算系数通过Id查找
export function selectCoefficientById(data) {
  return $request({
    url: url + "bsCoefficient/selectCoefficientById?id=" + data,
    method: "get",
    data: data,
  });
}
// 折算系数修改
export function updateCoefficientById(data) {
  return $request({
    url: url + "bsCoefficient/updateCoefficientById",
    method: "post",
    data: data,
  });
}
// 折算系数删除
export function deleteCoefficient(data) {
  return $request({
    url: url + "bsCoefficient/deleteCoefficient",
    method: "post",
    data: data,
  });
}
// 指标管理分页查询
export function qryBsKpiByPage(data) {
  return $request({
    url: url + "bsKpi/qryBsKpiByPage",
    method: "post",
    data: data,
  });
}
// 指标管理删除
export function delBsKpi(data) {
  return $request({
    url: url + "bsKpi/delBsKpi",
    method: "post",
    data: data,
  });
}
// 指标管理新增
export function addBsKpi(data) {
  return $request({
    url: url + "bsKpi/addBsKpi",
    method: "post",
    data: data,
  });
}
// 指标管理查询规则
export function getAllRule(data) {
  return $request({
    url: url + "bsKpi/getAllRule",
    method: "post",
    data: data,
  });
}
// 指标管理根据Id查询
export function qryBsKpiById(data) {
  return $request({
    url: url + "bsKpi/qryBsKpiById/" + data,
    method: "get",
    data: data,
  });
}
// 指标管理修改指标
export function updateBsKpi(data) {
  return $request({
    url: url + "bsKpi/updateBsKpi",
    method: "post",
    data: data,
  });
}
// 指标管理复制指标
export function copyBsKpi(data) {
  return $request({
    url: url + "bsKpi/copyBsKpi",
    method: "post",
    data: data,
  });
}
// 获取包类型
export function findAllPackage(data) {
  return $request({
    url: url + "bsCoefficient/findAllPackage",
    method: "get",
    data: data,
  });
}
// 指标规则关系管理分页查询
export function getIndexRule(data) {
  return $request({
    url: url + "indexRuleManage/getIndexRule",
    method: "post",
    data: data,
  });
}
// 规则管理分页查询
export function getRule(data) {
  return $request({
    url: url + "ruleInfo/getRule",
    method: "post",
    data: data,
  });
}
// 规则管理逻辑删除
export function removeRule(data) {
  return $request({
    url: url + "ruleInfo/removeRule",
    method: "post",
    data: data,
  });
}
// 规则管理复制
export function copyRule(data) {
  return $request({
    url: url + "ruleInfo/copyRule",
    method: "post",
    data: data,
  });
}
// 规则管理新增
export function addRule(data) {
  return $request({
    url: url + "ruleInfo/addRule",
    method: "post",
    data: data,
  });
}
// 规则管理根绝ID查询
export function getRuleById(data) {
  return $request({
    url: url + "ruleInfo/getRuleById?id=" + data,
    method: "post",
    data: data,
  });
}
// 规则管理修改
export function updateRule(data) {
  return $request({
    url: url + "ruleInfo/updateRule",
    method: "post",
    data: data,
  });
}
// 规则管理查询历史规则
export function getHistoryRule(data) {
  return $request({
    url: url + "ruleInfo/getHistoryRule",
    method: "post",
    data: data,
  });
}
// 对象管理分页获取数据
export function qryRuleObject(data) {
  return $request({
    url: url + "ruleObject/qryRuleObject",
    method: "post",
    data: data,
  });
}
// 因子管理分页获取数据
export function qryAdviceByPage(data) {
  return $request({
    url: url + "factor/qryAdviceByPage",
    method: "post",
    data: data,
  });
}
// 因子管理逻辑删除
export function deleteFactor(data) {
  return $request({
    url: url + "factor/deleteFactor",
    method: "post",
    data: data,
  });
}
// 因子管理新增
export function addFactor(data) {
  return $request({
    url: url + "factor/addFactor",
    method: "post",
    data: data,
  });
}
// 因子管理根据Id查找
export function selectDataById(data) {
  return $request({
    url: url + "factor/selectDataById?id=" + data,
    method: "post",
    data: data,
  });
}
// 因子管理修改
export function updateFactor(data) {
  return $request({
    url: url + "factor/updateFactor",
    method: "post",
    data: data,
  });
}
// 因子管理查找对象名称
export function findAllObjectName(data) {
  return $request({
    url: url + "factor/findAllObjectName",
    method: "get",
    data: data,
  });
}
// 因子管理查找因子名称列表
export function findFactorNames(data) {
  return $request({
    url: url + "factor/findFactorNames",
    method: "get",
    data: data,
  });
}
// 指标模板管理分页查询
export function qryBsTemplateByPage(data) {
  return $request({
    url: url + "bsTemplate/qryBsTemplateByPage",
    method: "post",
    data: data,
  });
}
// 指标模板管理删除
export function delBsTemplate(data) {
  return $request({
    url: url + "bsTemplate/delBsTemplate",
    method: "post",
    data: data,
  });
}
// 指标模板管理复制
export function copyBsTemplate(data) {
  return $request({
    url: url + "bsTemplate/copyBsTemplate",
    method: "post",
    data: data,
  });
}
// 指标模板管理新增
export function addBsTemplate(data) {
  return $request({
    url: url + "bsTemplate/addBsTemplate",
    method: "post",
    data: data,
  });
}
// 指标模板管理根据ID查询
export function qryBsTemplateById(data) {
  return $request({
    url: url + "bsTemplate/qryBsTemplateById/" + data,
    method: "get",
    data: data,
  });
}
// 指标模板管理修改
export function modBsTemplate(data) {
  return $request({
    url: url + "bsTemplate/modBsTemplate",
    method: "post",
    data: data,
  });
}
// 指标模板管理计算
export function calBsTemplate(data) {
  return $request({
    url: url + "bsTemplate/calBsTemplate?templateId=" + data,
    method: "post",
    data: data,
  });
}
// 指标模板管理新增查询关联指标
export function getKpiName(data) {
  if (data === null) {
    return $request({
      url: url + "bsKpi/getKpiName",
      method: "get",
      data: data,
    });
  } else {
    return $request({
      url: url + "bsKpi/getKpiName?packageType=" + data,
      method: "get",
      data: data,
    });
  }
}
// 酬金计算模板计算查询
export function qryBsTemplateCalculateByPage(data) {
  return $request({
    url: url + "bsCalculate/qryBsTemplateCalculateByPage",
    method: "post",
    data: data,
  });
}
// 酬金计算计算明细查询
export function qryBsTemplateCalculateDetailByPage(data) {
  return $request({
    url: url + "bsCalculate/qryBsTemplateCalculateDetailByPage",
    method: "post",
    data: data,
  });
}
// 酬金计算计算结果汇总查询
export function qrybsStaffCalculateCollectByPage(data) {
  return $request({
    url: url + "bsCalculate/qrybsStaffCalculateCollectByPage",
    method: "post",
    data: data,
  });
}
// 酬金计算计算结果汇总导出
export function exportBsStaffCalculateCollect(data) {
  return $request({
    url: url + "bsCalculate/exportBsStaffCalculateCollect/" + data,
    method: "get",
    data: data,
    responseType: "blob",
  });
}
// 酬金计算计算结果明细导出
export function exportBsStaffCalculateDetail(data) {
  return $request({
    url: url + "bsCalculate/exportBsStaffCalculateDetail/" + data,
    method: "get",
    data: data,
    responseType: "blob",
  });
}
