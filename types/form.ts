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


// 비밀번호 찾기
export type TFindPasswordFormError = {
  login_id?: string[];
  nickname?: string[];
};

// 비밀번호 재설정
export type TResetPasswordFormError = {
  newPassword?: string[];
  confirmPassword?: string[];
};