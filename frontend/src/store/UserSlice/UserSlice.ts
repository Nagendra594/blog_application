import { createSlice } from "@reduxjs/toolkit";
import { UserModel } from "../../models/UserModel";
import { APIResponseModel } from "../../types/APIResponseModel";
import { getUser } from "../../services/UserServices/userServices";
export interface UserSliceType extends UserModel {
    error: string | null,
    loading: boolean

}
const initialState: UserSliceType = {
    userid: "",
    username: "",
    email: "",
    role: null,
    error: null,
    loading: false
}

const UserSlice = createSlice({
    name: "UserData",
    initialState,
    reducers: {
        setUser(state, action) {

            return { ...state, ...action.payload };

        },
        reset() {
            return initialState;
        }
    }
})


export const fetchUserThunk = () => {
    return async (dispatch: any) => {
        dispatch(userActions.setUser({ loading: true, error: null }));
        const response: APIResponseModel<UserModel> = await getUser();
        if (response.status === 401 || response.status === 403) {
            dispatch(userActions.setUser({ loading: false, error: "UnAuthenticated" }));
            return;
        }

        if (response.status !== 200) {
            dispatch(userActions.setUser({ loading: false, error: "Failed to fetch user" }));
            return;
        }
        const user: UserModel = response.data!;
        dispatch(userActions.setUser({ ...user, loading: false, error: null }));
    }
}

export const userReducer = UserSlice.reducer;
export const userActions = UserSlice.actions;