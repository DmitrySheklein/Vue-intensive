const Editor = require('./editor')
const Vue = require('vue/dist/vue.js');
const UIkit = require('uikit');

window.editor = new Editor();

new Vue({
    el: '#app',
    data() {
        return {
            showLoader: true
        }
    },
    methods: {
        onBtnSave(){
            this.showLoader = true;

            window.editor.save(()=>{
                UIkit.notification({message: 'Успешно сохранено!', status: 'success'})
                this.showLoader = false;
            },
            ()=>{
                UIkit.notification({message: 'Ошибка!', status: 'danger'})
            })
        }
    },
    created() {
        window.editor.open('index.html', ()=>{
            this.showLoader = false;
        })
    },
})