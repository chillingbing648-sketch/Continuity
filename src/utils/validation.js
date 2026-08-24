export const validateEmail = (email) => {
  if (!email) return "Email is required";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return "Invalid email address";
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return "Phone number is required";
  const cleaned = phone.replace(/[\s\-+()]/g, "");
  if (cleaned.length < 8 || cleaned.length > 15) return "Invalid phone number";
  return null;
};

export const validateRequired = (val, fieldName = "Field") => {
  if (val === null || val === undefined || String(val).trim() === "") {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateNumber = (val, fieldName = "Value", allowNegative = false) => {
  if (val === null || val === undefined || String(val).trim() === "") {
    return `${fieldName} is required`;
  }
  const num = Number(val);
  if (isNaN(num)) return `${fieldName} must be a valid number`;
  if (!allowNegative && num < 0) return `${fieldName} cannot be negative`;
  return null;
};
