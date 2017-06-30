[{
    id:'/#dCDVA',
    name:'rishabh',
    room:'room'
}]

//ES6 classes
class Users{
        constructor(){
        this.users=[];        
        }
        addUser(id,name,room){
            var user={id,name,room};
            this.users.push(user);
            return user;
    }
}

var me =new Person()