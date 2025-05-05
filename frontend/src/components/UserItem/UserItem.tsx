import { Button, CircularProgress, TableCell, TableRow, Typography } from "@mui/material"
import { useState } from "react"
import DeleteIcon from "@mui/icons-material/Delete";
import { UserModel } from "../../models/UserModel";
import { APIResponseModel } from "../../types/APIResponseModel";
import { deleteAUser } from "../../services/UserServices/userServices";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { fetchAdminDataThunk } from "../../store/AdminDataSlice/AdminDataSlice";

interface UserItemProps {
    user: UserModel,
}

const UserItem: React.FC<UserItemProps> = ({ user }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const deleteHandler = async (id: string) => {
        setLoading(true);
        setError(null);
        const response: APIResponseModel<null> = await deleteAUser(id);
        if (response.status !== 200) {
            setError("Error deleting user");
        }
        setLoading(false);
        dispatch(fetchAdminDataThunk());
        return;
    }
    return <TableRow>
        {error && <Typography>{error}</Typography>}
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.email}</TableCell>

        <TableCell>
            <Button
                onClick={() => deleteHandler(user.userid)}
                variant="contained"
                color="error"
                disabled={loading}
                data-testid="delete"
            >
                {loading ? <CircularProgress /> : <DeleteIcon />}
            </Button>

        </TableCell>
    </TableRow>
}

export default UserItem