// only use in "use client"

export const getData = (key: string) => {
  return localStorage.getItem(key);
};

export const setData = (key: string, value: any) => {
  const strValue = JSON.stringify(value);
  localStorage.setItem(key, strValue);
};

export const removeData = (key: string) => {
  localStorage.removeItem(key);
};

export const clearData = () => {
  localStorage.clear();
};
