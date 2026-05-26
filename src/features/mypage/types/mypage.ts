export interface QuickAction {
  id: number;
  label: string;
  path: string;
}

export interface MyPageMenuItem {
  id: number;
  label: string;
  path: string;
}

export interface MyPageResponse {
  userName: string;
  quickActions: QuickAction[];
  menus: MyPageMenuItem[];
}