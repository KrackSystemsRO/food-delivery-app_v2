import authorizedAxios from "../../../apps/mobile/src/utils/request/authorizedRequest";

export const getUserDetails = async () => {
  try {
    const response = await authorizedAxios.get("/user");
    return response.data;
  } catch (error) {
    console.info("You are not logged in yet.");
    return error;
  }
};
