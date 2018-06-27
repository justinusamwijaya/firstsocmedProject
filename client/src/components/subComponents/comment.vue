<template>
    <div v-if="!deleted" class="commentPanel card">
        <div v-if="!editMode" class="commentHeader">
            <h3>{{name}}</h3>
            <p>{{timeCreated}}</p>
        </div>
        <p v-if="!editMode" style="font-size:1.3rem;">
            {{valueContent}}
        </p>
        <form v-if="editMode" method="post" @submit="editComment($event)">
            <input v-model="valueContent" class="editInput" type="text">
        </form>
        <div v-if="name === loggedUser">
            <button v-if="!deletePrompt" class="commentButton editOne" @click="toggleEditMode()">{{editMode? "cancel" : "edit"}}</button>
            <button v-if="!editMode && !deletePrompt" class="commentButton deleteOne" @click="toggledeletePrompt()">delete</button>
        </div>
        <div v-if="deletePrompt">
            delete comment?
            <button class="commentButton" @click="deleteComment()">yes</button>
            <button class="commentButton" @click="toggledeletePrompt()">no</button>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    data(){
        return {
            timeCreated:'',
            loggedUser:localStorage.getItem('username'),
            editMode:false,
            valueContent:this.content,
            deletePrompt: false,
            deleted:false,
        }
    },
    created(){
        let date = new Date(this.createdAt)
        this.timeCreated = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
    },
    methods:{
        toggleEditMode(){
            this.editMode = !this.editMode
        },
        toggledeletePrompt(){
            this.deletePrompt = !this.deletePrompt
        },
        editComment(event){
            event.preventDefault();
            let updatedComment = {
                content: this.valueContent
            }
            axios.put('http://localhost:3000/comments/'+this.commentId,updatedComment, { headers:{ authorization: 'bearer ' + localStorage.getItem('token') } })
            .then(()=>{
                this.editMode = false
            })
            .catch(error=>{
                console.log(error.response)
            })
        },
        deleteComment(){
            axios.delete('http://localhost:3000/comments/'+this.commentId, { headers:{ authorization: 'bearer ' + localStorage.getItem('token') } })
            .then(()=>{
                this.deleted = true
            })
            .catch(error=>{
                console.log(error.response)
            })
        }
    },
    props:['commentId','name','content','createdAt']

}
</script>
<style lang="scss" scoped>
    .commentPanel{
        position:relative;
        margin-top:1rem;
        border-radius: 3rem;
        padding:2rem 3rem;
        .commentHeader{
            position:relative;
            border-bottom:1px solid rgba(0,0,0,.3);
            p{
                position:absolute;
                top:0;
                right:0;
            }
        }
        .commentButton{
            border:0;
            background:none;
            cursor: pointer;
            &:hover{
                color:rgba(0,0,0,.7)
            }
            &:active,&:focus{
                outline:none;
            }
            &:active{
                color:rgba(0,0,0,.9)
            }
        }
        .deleteOne{
            position:absolute;
            bottom:0;
            right:3rem;
        }
        .editOne{
            position:absolute;
            bottom:0;
            right:7rem;
        }
        .editInput{
            font-size:1.3rem;
            border:0;
            margin:1rem;
            border-bottom:.1rem solid rgba(0,0,0,.7);
            width:100%;
            &:active, &:focus{
                outline: none;
            }
        }
    }
</style>
