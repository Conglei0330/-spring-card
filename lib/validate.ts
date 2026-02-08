// 中国大陆手机号验证
export function validatePhone(phone: string): boolean {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phone);
}

// 密码强度验证（6-20位，至少包含字母和数字）
export function validatePassword(password: string): boolean {
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasValidLength = password.length >= 6 && password.length <= 20;

  return hasLetter && hasNumber && hasValidLength;
}
