<template>
    <div v-if="!deleted" class="singlePost card">
        <p class="name">{{username}}</p>
        <p class="timePost">created in: {{createdAt}}</p>
        <div v-if="username === loggedUser">
            <a class="edit" @click="editFormFunction()">edit</a>
            <a class="delete" @click="deletePromptFunction()">delete</a>
        </div>
        <div class="contents">
            <p v-if="!editForm && !deletePrompt">{{updateInput}}</p>
            <form v-if="editForm" method="post" @submit="editPost($event)">
                <div @input="onPostInput($event)" contenteditable="true" style="min-height:150px;" content="type something here..">{{content}}</div>
                <button class="editButton" id="submitPost" type="submit">edit</button>
                <button class="cancelEditButton" @click="cancel()">cancel</button>
            </form>
            <div v-if="deletePrompt">
                delete post?
                <button class="editButton" @click="deletePost()">yes</button>
                <button class="cancelEditButton" @click="cancel()">no</button>
            </div>
        </div>
        <div class="likeSection">
            <p v-if="likesAmmount > 0">{{likesAmmount}} like<span v-if="likesAmmount > 1">s</span></p>
            <a v-if="!likedthePost" class="heart notLiked" @click="addLike()"><i class="far fa-heart"></i></a>
            <a v-if="likedthePost" class="heart liked" @click="removeLike()"><i class="far fa-heart"></i></a>
        </div>
        <div class="commentSection">
            <div class="commentInputPanel">
                comments
                <form style="margin-top:1rem;" method="post" @submit="addComment($event)">
                    <input v-model="addCommentInput" type="text" placeholder="add a new comment...">
                </form>
            </div>
            <div v-if="commentList.length > 2" class="seeMore">
                <a @click="toggleSeeComment()">see {{collapseComment ? "less" : "all"}} comments {{collapseComment ? '' : `(${commentList.length})`}}</a>
            </div>
            <comment v-if="commentList.length < 3 || collapseComment" v-for="comment in commentList" :key="comment._id" :name="comment.uploader.username" :content="comment.content" :createdAt="comment.createdAt" :commentId="comment._id"/>
            <comment v-if="commentList.length > 2 && !collapseComment"  v-for="comment in latestComment" :key="comment._id" :name="comment.uploader.username" :content="comment.content" :createdAt="comment.createdAt" :commentId="comment._id"/>
        </div>

    </div>
</template>
<script>
import axios from 'axios'
import comment from './comment.vue'
export default {
    name:'post',
    components:{ comment },
    data(){
        return {
            likesAmmount: this.likes.length,
            likedthePost:false,
            loggedUser: localStorage.getItem('username'),
            editForm:false,
            deletePrompt:false,
            deleted:false,
            updateInput:this.content,
            createdAt: '',
            commentList: [],
            addCommentInput: '',
            latestComment:[],
            collapseComment:false,
        }
    },
    created(){
        this.getAllComments()
        let date = new Date(this.timecreated)
        this.createdAt = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
        let checkLiked = this.likes.find(function(object){
            return object.username === localStorage.getItem('username')
        })
        if(checkLiked)this.likedthePost = true
    },
    methods:{
        onPostInput:function(event){
            this.updateInput = event.target.innerText
        },
        getAllComments(){
            axios.get('http://localhost:3000/comments/' + this.idPost)
            .then(commentsFound =>{
                this.commentList = commentsFound.data.commentsFound ? commentsFound.data.commentsFound : []
                this.latestComment = this.commentList ? [ this.commentList[this.commentList.length-2], this.commentList[this.commentList.length-1 ]] : []
            })
            .catch(error=>{
                console.log(error.response)
            })
        },
        addLike:function(){
            axios.put('http://localhost:3000/posts/addlike/'+this.idPost,{},{ headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
            .then(result=>{
                this.likedthePost = true
                this.likesAmmount++
            })
            .catch(error =>{
                console.log(error.response)
            })
        },
        cancel(){
            this.deletePrompt = false
            this.editForm = false
        },
        toggleSeeComment(){
            this.getAllComments()
            this.collapseComment = !this.collapseComment
        },
        removeLike:function(){
            axios.put('http://localhost:3000/posts/removelike/'+this.idPost,{},{ headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
            .then(result=>{
                this.likedthePost = false
                this.likesAmmount--
                console.log(result)
            })
            .catch(error =>{
                console.log(error.response)
            })
        },
        editFormFunction(){
            this.editForm = true
            this.deletePrompt = false
        },
        deletePromptFunction(){
            this.deletePrompt = true
            this.editForm = false
        },
        editPost:function(event){
            event.preventDefault();
            let updatedContent = {
                content: this.updateInput
            }

            axios.put('http://localhost:3000/posts/'+this.idPost, updatedContent, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
            .then(result=>{
                this.cancel()
            })
            .catch(error=>{
                console.log(error.response)
            })
        },
        addComment:function(event){
            event.preventDefault();
            let commentRequirement = {
                content:this.addCommentInput,
                postParentId: this.idPost
            }
            axios.post('http://localhost:3000/comments', commentRequirement, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
            .then(commentMade=>{
                this.addCommentInput = ""
                commentMade.data.result['uploader'] = {
                    username: localStorage.getItem('username')
                }
                this.commentList.push(commentMade.data.result)
                this.latestComment = [ this.commentList[this.commentList.length-2], this.commentList[this.commentList.length-1 ]]
            })
            .catch(error =>{
                console.log(error.response)
            })
        },
        deletePost:function(){
            axios.delete('http://localhost:3000/posts/'+this.idPost,{ headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
            .then(()=>{
                this.deleted = true
            })
            .catch(error=>{
                console.log(error.response)
            })
        }

    },
    props:['username','content','likes', 'idPost', 'timecreated'],
}
</script>
<style lang="scss" scoped>
$hovercolor: rgba(0,0,0,.7);
.singlePost{
    position:relative;
    font-size:1.1rem;
    border-radius:2rem;
    padding:2rem;
    margin-top:3rem;
    width:100%;
    min-height:30rem;
    .name{
        font-size: 1.5rem;
        text-align:center;
    }
    .timePost{
        text-align:center;
    }
    .contents{
        width:100%;
        min-height:2rem;
        padding:3rem;
        font-size:2rem;
    }
    .likeSection{
        width:100%;
        padding:3rem;
        font-size: 1.2rem;
        .heart{
            font-size:1.5rem;
        }
        .liked{
            color:red;
            cursor: pointer;
            &:hover{
                color:rgba(0,0,0,.7);
            }
        }
        .notLiked{
            color:rgba(0,0,0,.7);
            cursor: pointer;
            &:hover{
                color:red;
            }
        }
    }
    .cancelEditButton{
        border:0;
        background:none;
        cursor: pointer;
        &:hover{
            color:$hovercolor;
        }
    }
    .editButton{
        border:0;
        background:none;
        cursor: pointer;
        &:hover{
            color:$hovercolor;
        }
    }
    .edit{
        cursor: pointer;
        font-size:1.3rem;
        position:absolute;
        top:2rem;
        right:14rem;
        &:hover{
            color:$hovercolor;
        }

    }
    .delete{
        cursor: pointer;
        font-size:1.3rem;
        position:absolute;
        top:2rem;
        right:6rem;
        &:hover{
            color:$hovercolor;
        }
    }
    [contenteditable=true]:focus,[contenteditable=true]:active{
        outline:none
    }

    [contenteditable=true]{
        border-radius:2rem;
        padding: 2rem;
        border: .1rem solid rgba(0,0,0,.2);
        cursor: text;
    }
    .commentSection{
        .seeMore{
            padding: 0 2rem;
            a{
                cursor: pointer;
                &:hover{
                    color:rgba(0,0,0,.7)
                }
            }
        }
        .commentInputPanel{
            border-radius: 3rem;
            padding:2rem;
            font-size:1.3rem;
            input{
                width:100%; 
                border:0; 
                border-bottom:1px solid rgba(0,0,0,.3);
                &:active, &:focus{
                    outline:none;
                }
            }
        }
    }
}
@media(max-width: 767px){
 .delete{
    right: 2rem !important
 }
 .edit{
    right: 8rem !important;
 }
}
</style>
