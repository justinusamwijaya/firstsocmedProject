<template>
    <b-row class="loginContainer">
      <div class="errorWrapper">
        <errorHandlers v-for="(error,i) in errors" :key="i" :message="error.msg" />
      </div>
      <b-col class="info" cols=12 md=6>
        <div>
            <p>Your </p> 
            <p>Experience </p> 
            <p>Begins Now </p>   
        </div>
      </b-col>
      <b-col class="LoginSection" cols=12 md=6>
        <div class="loginSectionContainer">
          <div class="logo">
            <img src="../../assets/logo.png" alt="">
          </div>
          <div class="brand">
            Bukumuka
          </div>
          <div v-if="!loginForm && !signUpForm">
            <div class="loginButton">
              <button @click="LoginForm()">Login</button>
            </div>
            <div class="loginButton">
              <button @click="SignupForm()">Signup</button>
            </div>
          </div>
          <form v-if="signUpForm" @submit="submitSignup($event)">
              username
              <input v-model="usernameSignup" class="formInput" type="text">
              email
              <input v-model="emailSignup" class="formInput" type="text">
              password
              <input v-model="passwordSignup" class="formInput" type="password">
              <button class="formbutton" type="submit">submit</button>
              <button class="formbutton" type="button" @click="cancelForm()">cancel</button>
          </form>
          <form v-if="loginForm" @submit="submitLogin($event)">
              username or email
              <input v-model="userLogin" class="formInput" type="text">
              password
              <input v-model="passwordLogin" class="formInput" type="password">
              <button class="formbutton" type="submit">submit</button>
              <button class="formbutton" type="button" @click="cancelForm()">cancel</button>
          </form>
        </div>
      </b-col>
    </b-row>
</template>
<script>
import axios from 'axios'
import errorHandlers from '../subComponents/errorHandlers.vue'
export default {
  name: 'loginForm',
  components:{ errorHandlers },
  data(){
    return {
      loginForm:false,
      signUpForm:false,
      usernameSignup:'',
      emailSignup:'',
      passwordSignup:'',
      userLogin:'',
      passwordLogin:'',
      errors:[],
    }
  },
  methods:{
    LoginForm:function(){
      this.loginForm = true
    },
    SignupForm:function(){
      this.signUpForm = true;
    },
    cancelForm:function(){
      this.loginForm = false
      this.signUpForm = false
    },
    submitLogin:function(event){
      this.errors = []
      event.preventDefault();
      let userLogin = {
        user:this.userLogin,
        password:this.passwordLogin,
      }
      axios.post('http://localhost:3000/login',userLogin)
      .then(result =>{
        localStorage.setItem('token', result.data.token)
        localStorage.setItem('username',result.data.username)
        localStorage.setItem('id', result.data.id)
        this.$store.state.username = result.data.username
        this.$store.state.loggedIn = true
      })
      .catch(error =>{
        if(error.response.data.msg){
          this.errors.push(error.response.data)
        }else{
          this.errors=error.response.data.errors
        }
      })
        
    },
    submitSignup:function(event){
      event.preventDefault();
      this.errors = []
      let newUser = {
          username: this.usernameSignup,
          email: this.emailSignup,
          password: this.passwordSignup
      }
      axios.post('http://localhost:3000/signup', newUser )
      .then(() =>{
          this.loginForm = true
          this.signUpForm = false
      })
      .catch(error =>{
          this.errors = error.response.data.errors
      })
    }
  }
}
</script>
<style lang="scss" scoped>
$primaryColor : #0697cb;

.loginContainer{
  z-index:6000;
  position:fixed;
  width:100%;
  height:100%;
  margin:0;
  padding:0;
  .logo{
    margin-bottom:4rem;
    max-height:40%;
    max-width:40%;
    img{
      max-width:100%;
      max-height:100%;
    }
  }
  .brand{
    font-size:5rem;
    margin-bottom:5rem;
  }
  .info{
    padding:5rem;
    display:flex;
    justify-content: flex-end;
    text-align: right;
    font-size:5rem;
    background-color:$primaryColor;
    color:white;
  }
  .LoginSection{
    padding:5rem;
    display:flex;
    align-items: center;
    justify-content: center;
    background-color:white;
    color:$primaryColor;
    flex-wrap:wrap;
    .loginSectionContainer{
      text-align:center;  
      font-size:1.5rem;
      button{
        cursor: pointer;
        font-size: 1.5rem;
        border-radius:2rem;
        margin:.3rem;
        width:100%;
        height:4rem;
        color:$primaryColor;
        background:none;
        border:1px solid $primaryColor;
        &:active, &:focus{
            outline:none;
        }
        &:hover{
          background-color:$primaryColor;
          color:white;
        }
      }
      form{
        .formInput{
            text-align:center; 
            width:100%;
            border-radius:2rem;
            margin:.3rem;
            height:3rem;
            border:1px solid $primaryColor;
            padding:1.5rem;
            font-size:1.3rem;
            &:active, &:focus{
                outline:none;
            }
        }
        .formbutton{
            margin-top:1rem;
            width: 30%;
        }
      }
    }
  }
  .errorWrapper{
    position:absolute;
    width: 100%;
    top: 2rem;
  }
}

@media(max-width: 767px){
  .info{
    font-size:2rem !important;
    height:30%;
  }
  .brand{
    font-size:3rem !important;
  }
  .LoginSection{
    height:70%;
    align-items:flex-start !important;
  }
  button{
    font-size: 1.2rem !important;
  }
  .logo{
    max-width:20% !important;
    max-height:20% !important;
  }
}
</style>
