
import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Settings, 
  BrainCircuit, 
  Database, 
  Cpu, 
  Layers, 
  FileText,
  Link2
} from 'lucide-react';
import { Requirement, TableGroup } from './types';

export const SIDEBAR_ITEMS = [
  { group: '分类标题', items: [
    { id: 'metrics_mgmt', label: '指标管理', icon: <Database size={18} /> },
    { id: 'smart_interpret', label: '指标解释管理', icon: <BrainCircuit size={18} /> },
    { id: 'metric_binding', label: '指标绑定页面', icon: <Link2 size={18} /> },
  ]},
  { group: '分类标题', items: [
    { id: 'metrics_mgmt_2', label: '指标管理', icon: <FileText size={18} /> },
    { id: 'metrics_app', label: '指标应用', icon: <Cpu size={18} /> },
    { id: 'model_mgmt', label: '模型管理', icon: <Layers size={18} /> },
    { id: 'dim_mgmt', label: '维度管理', icon: <Search size={18} /> },
    { id: 'metrics_topic', label: '指标专题', icon: <Settings size={18} /> },
  ]}
];

export const MOCK_HIVE_TABLES = [
  'ies_life.dim_life_goods_product_info',
  'ies_life.fct_life_order_detail_di',
  'ies_life.dim_life_merchant_info',
  'ies_life.fct_life_live_room_stat_hi',
  'ies_life.dim_life_user_profile_df',
  'ies_life.fct_life_coupon_verify_di',
  'ies_data.dim_v_channel_info',
  'ies_data.fct_v_content_play_stat_di',
  'ies_warehouse.dim_global_region_info',
  'ies_warehouse.fct_revenue_summary_df'
];

export const MOCK_REQUIREMENTS: Requirement[] = [
  { id: '1', name: 'NPS', techOwner: '宋明杰', businessOwner: '王大力', tableCount: 12, status: 'completed', createdAt: '2023-10-24' },
  { id: '2', name: '生财首页 【生财】整体品牌屋设计', techOwner: '张棉棉', businessOwner: '张棉棉', tableCount: 8, status: 'processing', createdAt: '2023-10-23' },
  { id: '3', name: 'bigday归因效果数据建设产品方案-一期', techOwner: '秦丝丝', businessOwner: '秦丝丝', tableCount: 15, status: 'pending', createdAt: '2023-10-22' },
  { id: '4', name: '【生服直播】播后直播诊断能力接入生财有数平台', techOwner: '周礼人', businessOwner: '周礼人', tableCount: 24, status: 'completed', createdAt: '2023-10-21' },
  { id: '5', name: '【热点】热点产品中台-26Q1', techOwner: '张力', businessOwner: '张力', tableCount: 32, status: 'pending', createdAt: '2023-10-20' },
  { id: '6', name: '【生财升级】管理驾驶舱升级内容 【管理驾驶舱】广告', techOwner: '王强', businessOwner: '王强', tableCount: 19, status: 'completed', createdAt: '2023-10-19' },
  { id: '7', name: '春节保供数据监控看板建设', techOwner: '大大', businessOwner: '大大', tableCount: 5, status: 'completed', createdAt: '2023-10-18' },
  { id: '8', name: '【热点】热点日历 P0部分', techOwner: '宋明杰', businessOwner: '周礼人', tableCount: 11, status: 'completed', createdAt: '2023-10-17' },
  { id: '9', name: '【热点】热点下发达人侧/生意经/商机侧 一期', techOwner: '张棉棉', businessOwner: '秦丝丝', tableCount: 22, status: 'completed', createdAt: '2023-10-16' },
  { id: '10', name: '【热点】突发热点审核', techOwner: '秦丝丝', businessOwner: '张力', tableCount: 7, status: 'completed', createdAt: '2023-10-15' },
  { id: '11', name: '【热点】热点下发达人侧/生意经/商机侧 二期', techOwner: '周礼人', businessOwner: '王强', tableCount: 18, status: 'completed', createdAt: '2023-10-14' },
  { id: '12', name: '【部门工作台】业务洞察 二期', techOwner: '张力', businessOwner: '大大', tableCount: 14, status: 'completed', createdAt: '2023-10-13' },
];

export const MOCK_TABLES: TableGroup[] = [
  {
    tableName: 'ies_life.dim_life_goods_product_info',
    description: '生活服务-商品域-商品维表',
    metrics: [
      { id: 'm1', fieldName: '直播间核销金额', devMethod: 'Warehouse', fieldType: 'bigint', referencedPageCount: 10, intelligentInterpretationDetailed: '商家uid (抖音来客)；企业号老商家只有迁移成功后才会有', intelligentInterpretationBrief: '商家账户唯一标识(主键)。包含总户/区域户/门店全层级账户，直接来源上游账户表account_id字段...', isAiGenerated: true, status: 'finished' },
      { id: 'm2', fieldName: '直播场次数', devMethod: 'Warehouse', fieldType: 'bigint', referencedPageCount: 10, intelligentInterpretationDetailed: '商家uid (抖音来客)；企业号老商家只有迁移成功后才会有', intelligentInterpretationBrief: '商家uid (抖音来客)；企业号老商家只有迁移成功后才会有', isAiGenerated: true, status: 'finished' },
      { id: 'm3', fieldName: '直播间成交券数', devMethod: 'Warehouse', fieldType: 'bigint', referencedPageCount: 2, intelligentInterpretationDetailed: '商家uid (抖音来客)；企业号老商家只有迁移成功后才会有', intelligentInterpretationBrief: '商家uid (抖音来客)；企业号老商家只有迁移成功后才会有', isAiGenerated: true, status: 'finished' },
      { id: 'm4', fieldName: '直播间成交转化率', devMethod: 'Warehouse', fieldType: 'bigint', referencedPageCount: 10, intelligentInterpretationDetailed: '商家uid (抖音来客)；企业号老商家只有迁移成功后才会有', intelligentInterpretationBrief: '商家uid (抖音来客)；企业号老商家只有迁移成功后才会有', isAiGenerated: true, status: 'finished' },
      { id: 'm5', fieldName: '直播间退款金额', devMethod: 'Warehouse', fieldType: 'bigint', referencedPageCount: 2, intelligentInterpretationDetailed: '商家uid (抖音来客)；企业号老商家只有迁移成功后才会有', intelligentInterpretationBrief: '商家uid (抖音来客)；企业号老商家只有迁移成功后才会有', isAiGenerated: false, status: 'pending' },
    ]
  }
];
