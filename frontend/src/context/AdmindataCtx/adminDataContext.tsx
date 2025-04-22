import { createContext, useState } from "react"
import { UserModel } from "../../models/UserModel"
import { BlogModel } from "../../models/BlogModel"



interface AdminContextType {
    loading: boolean,
    error: string | null,
    data: [UserModel[], BlogModel[]] | [],
    setData: (data: Partial<AdminContextType>) => void,
    reset: () => void
}


export const AdminContext = createContext<AdminContextType>({
    loading: false,
    error: null,
    data: [],
    setData: (data: Partial<AdminContextType>) => { },
    reset: () => { }
})


export const AdminContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<Partial<AdminContextType>>({ loading: false, error: null, data: [] });
    const setAdminData = (data: Partial<AdminContextType>) => {
        setData(prev => {
            return { ...prev, ...data };
        })
    }
    const reset = () => {
        setData({ loading: false, error: null, data: [] });
    }

    return <AdminContext.Provider value={{ loading: data.loading!, error: data.error!, data: data.data!, setData: setAdminData, reset }}>{children}</AdminContext.Provider>
}