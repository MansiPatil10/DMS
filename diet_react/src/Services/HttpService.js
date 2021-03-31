import axios from 'axios';
import jwt_decode from "jwt-decode";
import AuthenticationService from './AuthenticationService';
const BASE_URL = "http://localhost:8080/diet/api/";

class HttpService{
    
    post(url,data){
        this.setupAxiosInterceptors();
        return axios.post(BASE_URL+url,data);
    }

    get(url){
        this.setupAxiosInterceptors();
        return axios.get(BASE_URL+url);
    }

    put(url,data){
        this.setupAxiosInterceptors();
        return axios.put(BASE_URL+url,data);
    }

    delete(url){
        this.setupAxiosInterceptors();
        return axios.delete(BASE_URL+url);
    }


    setupAxiosInterceptors(token){
        axios.interceptors.request.use(
            (config) => {
                if(AuthenticationService.isUserLoggedIn()){
                    if(this.isTokenExpired()){
                        AuthenticationService.logout();
                        this.props.history.push('/login');
                    }else{
                        let uData = JSON.parse(localStorage.getItem('userdata'))
                        config.headers.authorization = this.createJWToken(uData.token);
                    }
                }
                return config
            }
        )
    }

    createJWToken(token){
        return 'Bearer '+token;
    }

    isTokenExpired(){
        let tokenData = JSON.parse(AuthenticationService.getSessionData());
        if(tokenData.token !== undefined && tokenData.token !== ''){
            let token = tokenData.token;
            const { exp } = jwt_decode(token);
            const expirationTime = (exp * 1000) - 60000;
            if (Date.now() >= expirationTime) {
                return true;
            }else{
                return false;
            }
        }
    }
}

export default new HttpService()