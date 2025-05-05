import { createSlice } from "@reduxjs/toolkit";
import { UserModel } from "../../models/UserModel";
import { BlogModel } from "../../models/BlogModel";
import { getAllUsers } from "../../services/UserServices/userServices";
import { getBlogs } from "../../services/BlogServices/blogServices";
import { APIResponseModel } from "../../types/APIResponseModel";


export interface AdminSliceType {
    loading: boolean,
    error: string | null,
    data: [UserModel[], BlogModel[]] | [],

}

const initialState: AdminSliceType = {
    loading: false,
    error: null,
    data: [],

}

const AdminDataSlice = createSlice({
    name: "AdminSlice",
    initialState,
    reducers: {
        setData(state, action) {


            return { ...state, ...action.payload };
        },
        reset(state) {
            return initialState;
        }
    }
})
export const fetchAdminDataThunk = () => {

    return async (dispatch: any) => {
        dispatch(adminActions.setData({ loading: true, error: null }));

        const response = await Promise.all([getAllUsers(), getBlogs(null)]);
        const [response1, response2]: [APIResponseModel<UserModel[]>, APIResponseModel<BlogModel[]>] = response;
        const unAuthStatus: number[] = [401, 403];
        console.log(response1);

        if (unAuthStatus.includes(response1.status) || unAuthStatus.includes(response2.status)) {
            dispatch(adminActions.setData({ loading: false, error: "UnAuthenticated" }));
            return;
        }

        if (response1.status !== 200 || response2.status !== 200) {
            dispatch(adminActions.setData({ loading: false, error: "Failed to fetch data" }));
            return;
        }

        dispatch(adminActions.setData({ loading: false, error: null, data: [response1.data!, response2.data!] }));
        return;
    }
}
export const adminReducer = AdminDataSlice.reducer;
export const adminActions = AdminDataSlice.actions;