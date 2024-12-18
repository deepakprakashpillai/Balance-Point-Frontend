import { setLoading, setError, setUserData, setAssessmentData,setIsLoggedIn } from "./userSlice";
import axios from "axios";

export const fetchUserData = () => async (dispatch) => {
    const token = localStorage.getItem('access'); // Ensure this matches the correct key for the access token

    if (!token) {
        dispatch(setError("No token found"));
        return; 
    }

    dispatch(setLoading(true));

    try {
        const user_response = await axios.get("http://127.0.0.1:8000/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch(setUserData(user_response.data));
        console.log(user_response.data)
        const assessment_response = await axios.get(`http://127.0.0.1:8000/user/assessment/${user_response.data.id}`,{
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        dispatch(setAssessmentData(assessment_response.data))
         

    } catch (error) {
        if (error.response) {
            console.error(error.response.data); 
        } else {
            console.error(error.message);  
        }
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
        dispatch(setIsLoggedIn(true))
    }
};
