import api from "./api"

export const register = async (formData)=>{
  return api.post("/auth/register", formData)
};

export const loginUser = async (formData)=>{
  return api.post("/auth/login", formData, {
    withCredentials:true,
  })
};