
export interface Requirement {
  id: string;
  name: string;
  prdUrl?: string;
  techOwner: string;
  businessOwner: string;
  tableCount: number;
  selectedTables?: string[]; // Store the names of selected tables
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
}

export interface MetricField {
  id: string;
  fieldName: string;
  devMethod: 'Warehouse' | 'Server';
  fieldType: string;
  referencedPageCount: number;
  intelligentInterpretationDetailed: string;
  intelligentInterpretationBrief: string;
  isAiGenerated: boolean;
  status: 'pending' | 'editing' | 'finished';
}

export interface TableGroup {
  tableName: string;
  description: string;
  metrics: MetricField[];
}

export type ViewType = 'LIST' | 'DETAIL' | 'BINDING';

export interface User {
  name: string;
  avatar: string;
  id: string;
}
