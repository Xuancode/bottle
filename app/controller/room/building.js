/*
 * @Author: xuanpl
 * @Date: 2020-06-13 14:44:49
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-13 15:58:43
 * @Description: file content
 * @FilePath: /bottle/app/controller/room/building.js
 */
'use strict';

const Controller = require('egg').Controller
const createBuildingRule = {
  address: {
    type: 'string',
    required: true
  },
  latitude: {
    type: 'string',
    required: true
  },
  longitude: {
    type: 'string',
    required: true
  },
  tel: {
    type: 'string',
    required: true
  },
  img: {
    type: 'object',
    required: true
  }
}
const imgRule = {
  urls: {
    type: 'string',
    required: true
  },
  label: {
    type: 'string',
    required: false
  },
  photo_type: {
    type: 'number',
    required: true
  }
}

class BuildingController extends Controller {
  async create() {
    const { ctx } = this
    ctx.validate(createBuildingRule, ctx.request.body)
    ctx.validate(imgRule, ctx.request.body.img)
    let { label, address, remark, latitude, longitude, tel, img, union_id } = ctx.request.body

    let buildingData = { label, address, remark, latitude, longitude, tel }
    buildingData = ctx.helper.fliterUndefinedParams(buildingData)
    const buildingRes = await ctx.service.building.createBuilding(buildingData, img, union_id)

    ctx.body = { ...this.app.resCode['SUCCESS'], data: buildingRes }
  }
  async index() {
    const { ctx } = this
  }
  // async canSee() {
  //   const { ctx } = this
  //   const token = await ctx.helper.resolveToken(ctx.request.header.authorization.split(' ')[1])
  //   const uid = token.uid
  //   const { type, countType } = ctx.request.query
  //   let userRes = await ctx.model.User.findOne({ where: { user_id: uid } })
  //   const isFocus = await ctx.service.askWechat.getFocusStatusByUser(userRes, type)
  //   if (isFocus) {
  //     ctx.body = { ...this.app.resCode['SUCCESS'], data: isFocus }
  //   } else {
  //     // 查询访问该页面多少次了（按所有210类型算，目前仅有211）
  //     const typeArr = ['211']
  //     const readTimes = await ctx.service.loginRecord.unauthTimes(userRes, typeArr)
  //     if (readTimes > 2) {
  //       ctx.body = { ...this.app.resCode['SUCCESS&NOT'], data: { times: readTimes } }
  //     } else {
  //       ctx.body = { ...this.app.resCode['SUCCESS'], data: { times: readTimes } }
  //     }
  //   }
  // }
}

module.exports = BuildingController