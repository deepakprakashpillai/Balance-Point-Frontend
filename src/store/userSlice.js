import { createSlice} from "@reduxjs/toolkit";

const initialState = {
    userData : {
        id : null,
    first_name: '',
      last_name: '',
      email: '',
      username: null,
      date_joined: '',
      gender: '',
      phone_number: '',
      age: 0,
      dob: ''
    },
    assessmentData : {
        "id": null,
        "height": 0,
        "weight": '',
        "goal": '',
        "target_weight": 0,
        "activity_level": '',
        "exercise_frequency": 0,
        "exercise_type": '',
        "exercise_duration": 0,
        "rmr": 0,
        "bmi": 0,
        "average_sleep_time": null,
        "sleep_quality_rating": null,
        "sleep_issues": null,
        "average_water_intake": null,
        "stress_level": null,
        "mood_frequency": null,
        "mood_improvement_goal": null,
        "smokes": true,
        "alcohol_consumption": '',
        "mindfulness_practices": true,
        "screen_time": null,
        "main_wellness_goal": null,
        "self_motivation": null,
        "biggest_challenge": null,
        "user": null
        },
    loading : false,
    error : null
}
const userSlice = createSlice({
    name : 'user',
    initialState, 
    reducers : {
        setUserData(state,action){
            state.userData = action.payload;
        },
        setAssessmentData(state,action){
            state.assessmentData = action.payload;
        },
        clearUserData(state){
            state = initialState;
        },
        setLoading(state,action){
            state.loading = action.payload
        },
        setError(state,action){
            state.error = action.payload
        }
    },
})

export const {setUserData,clearUserData,setLoading,setError,setAssessmentData} = userSlice.actions;
export default userSlice.reducer;