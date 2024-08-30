// only use in "use client"

export const getData = (key: string) => {
  return localStorage.getItem(key);
};

export const setData = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const removeData = (key: string) => {
  localStorage.removeItem(key);
};

export const clearData = () => {
  localStorage.clear();
};
