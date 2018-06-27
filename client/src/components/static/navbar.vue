<template>
    <div>
        <nav>
            <div class="brand">
                <a href="/">Bukumuka</a>
            </div>
            <div v-if="!$store.state.loggedIn" class="rightnav">
                <a class="Loginmenu" @click="toggleLoginModal()"><i class="fas fa-user"></i> <span></span></a>
            </div>
            <div v-else class="rightnav">
                <router-link class="Loginmenu" :to="{path:'profile'}"><i class="fas fa-user"></i> <span style="margin-left:1rem;">{{ $store.state.username }}</span></router-link>
                <a class="Loginmenu" style="margin-left:2rem;" @click="logout()">logout</a>
            </div>
            <div v-if="modalToggle" class="loginModal card">
                <form>
                    username or email
                    <input type="text">
                    password
                    <input type="password" name="" id="">
                    <button type="submit">login</button>
                    <a href="">or signup here</a>
                </form>
            </div>
        </nav>
        <div v-if="modalToggle" class="modalToggleBackground">
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            modalToggle:false,
        }
    },
    methods:{
        toggleLoginModal:function(){
            this.modalToggle = !this.modalToggle
        },
        logout:function(){
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            this.$store.state.loggedIn = false
        },
    },
}
</script>
<style lang="scss" scoped>
$primaryColor : #0697cb;
nav{
    z-index: 5888;
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:6rem;
    background-color:$primaryColor;
    display:flex;
    justify-content: center;
    .brand{
        height:100%;
        padding: 1rem 5rem;
        width:25%;
        display:flex;
        align-items: center;
        justify-content: flex-start;
        a{
            color:white;
            font-size:3rem;
            &:hover{
                text-decoration: none;
            }
        }
    }
    .rightnav{
        position:relative;
        height:100%;
        width:75%;
        padding: 1rem 5rem;
        display:flex;
        align-items: center;
        justify-content: flex-end;
        .Loginmenu{
            font-size:1.7rem;
            color:white;
            cursor: pointer;
            &:hover{
                text-decoration: none;
                color:rgba(255,255,255,.7);
            }
        }
    }
    .loginModal{
        position: fixed;
        right: 6rem;
        top:5.7rem;
        height:50rem;
        width: 40rem;
    }
}
.modalToggleBackground{
    z-index:5887;
    position:fixed;
    background:rgba(0,0,0,.6);
    height:100% !important;
    width:100%;
}

@media(max-width: 767px){
  .Loginmenu{
    font-size: 1rem;
  }
}
</style>
