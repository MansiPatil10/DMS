import './App.css';
import LoginComponent from './components/login/Login';
import NotFoundComponent from './components/notfound/Notfound';
import HomeComponent from './components/home/Home';
import AppointmentComponent from './components/appointment/Appointment';
import { BrowserRouter as Router,Route, Switch } from 'react-router-dom';
import HeaderComponent from './components/layouts/header/Header';
import FooterComponent from './components/layouts/footer/Footer';
import AuthenticationService from './Services/AuthenticationService.js'
import AuthentationRoutes from './routes/AuthenticatedRoutes';
import LoginRoute from './routes/LoginRoute';
import AddUserComponent from './components/users/add-user/AddUser';
import ListUserComponent from './components/users/list-users/ListUser';
import AddDietComponent from './components/diet-plan/add-diet-plan/AddDiet';
import ListDietComponent from './components/diet-plan/list-diet-plan/ListDiet';
import AddPatientComponent from './components/patient/add-patient/AddPatient';
import ListPatientComponent from './components/patient/list-patient/list-patient';
import AddConsulationComponent from './components/consulation/add-consulation/AddConsulation';
function App() {
  return (
    <div className="App">
      <Router>
        <>
          <HeaderComponent isUserLoggedIn={AuthenticationService.isUserLoggedIn}></HeaderComponent>
          <Switch>
            <LoginRoute path="/" exact component={ LoginComponent }></LoginRoute>
            <LoginRoute path="/login" exact component={ LoginComponent }></LoginRoute>
            <AuthentationRoutes path="/home" exact component={ HomeComponent }></AuthentationRoutes>
            <AuthentationRoutes path="/appointment" exact component={ AppointmentComponent }></AuthentationRoutes>
            <AuthentationRoutes path={["/add-user", "/edit-user/:userId"]} exact component={ AddUserComponent }></AuthentationRoutes>
            <AuthentationRoutes path="/list-user" exact component={ ListUserComponent }></AuthentationRoutes>
            <AuthentationRoutes path={["/add-diet", "/edit-diet/:dietId"]} exact component={ AddDietComponent }></AuthentationRoutes>
            <AuthentationRoutes path="/list-diet" exact component={ ListDietComponent }></AuthentationRoutes>
            <AuthentationRoutes path={["/add-patient", "/edit-patient/:patientId"]} exact component={ AddPatientComponent }></AuthentationRoutes>
            <AuthentationRoutes path="/list-patient" exact component={ ListPatientComponent }></AuthentationRoutes>
            <AuthentationRoutes path={["/add-consulation/:appointmentId"]} exact component={ AddConsulationComponent }></AuthentationRoutes>
            <AuthentationRoutes component={ NotFoundComponent }></AuthentationRoutes>
          </Switch>
          <FooterComponent></FooterComponent>
        </>
      </Router>
      {/* <LoginComponent></LoginComponent> */}
    </div>
  );
}

export default App;
