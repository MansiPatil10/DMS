import axios from 'axios';
class AuthenticationService{
    
    jwtLogin(username,password){
        return axios.post('http://localhost:8080/diet/api/token/generate-token',{username,password});
    }
    
    setLoginData(userdata){
        localStorage.setItem('userdata', JSON.stringify(userdata));
    }

    getSessionData(){
        return  localStorage.getItem('userdata');
    }

    getDesignation(){
        let sessionData = JSON.parse(localStorage.getItem('userdata'));
        return sessionData !== undefined && sessionData !== null  ? sessionData.designation : null;
    }

    isUserLoggedIn(){
        let user = localStorage.getItem('userdata')
        if(user===null) return false
        return true
    }

    logout(){
        localStorage.removeItem('userdata');
    }
}

export default new AuthenticationService()