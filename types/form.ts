export type TSignUpFormError = {
  login_id?: string[];  
  password?: string[];
  nickname?: string[];
};

export type TLoginFormError = {
  login_id?: string[];  
  password?: string[];
};

// 아이디 찾기
export type TFindIdFormError = {
  nickname?: string[];
};