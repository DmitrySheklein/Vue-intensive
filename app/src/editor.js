require('./iframe-load');
const axios = require('axios')
const DOMhelper = require('./dom-helper');
const EditorText = require('./editor-text');
const EditorMeta = require('./editor-meta');
const EditorImage = require('./editor-images');

module.exports = class Editor {
    constructor(){
        this.iframe = document.querySelector('iframe');
    }
    open(page, cb){
        this.currentPage = page;

        axios.get('../../' + page + `?rnd=${Math.random()}`)
        .then(res =>DOMhelper.parseStrToDom(res.data))
        .then(DOMhelper.wrapTextNodes)
        .then(DOMhelper.wrapImages)
        .then((dom)=>{
            this.virtualDom = dom;
            return dom;
        })
        .then(DOMhelper.serializeDomToString)
        .then((html)=>axios.post('./api/saveTempPage.php',{html}))
        .then(()=> this.iframe.load('../asgdsaggl0099.html'))
        .then((html)=>axios.post('./api/removeHtmlPage.php', {name: 'asgdsaggl0099.html'}))
        .then(()=> this.enableEditing())
        .then(()=> this.injectStyle())
        .then(cb)
    }
    enableEditing(){
        this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach((el)=>{
            const id = el.getAttribute('nodeid');
            const virtualElement = this.virtualDom.body.querySelector(`[nodeid="${id}"]`);
            new EditorText(el, virtualElement);
        })
        this.iframe.contentDocument.body.querySelectorAll('[editableimgid]').forEach((el)=>{
            const id = el.getAttribute('editableimgid');
            const virtualElement = this.virtualDom.body.querySelector(`[editableimgid="${id}"]`);
            new EditorImage(el, virtualElement);
        })        
        this.editorMeta = new EditorMeta(this.virtualDom);
    }
    injectStyle(){
        const style = this.iframe.contentDocument.createElement('style');
        style.innerHTML = `
            text-editor:hover {
                outline: 3px solid orange;
                outline-offset: 8px;
            }
            text-editor:focus {
                outline: 3px solid red;
                outline-offset: 8px;
            }
            [editableimgid]:hover {
                outline: 3px solid red;
            }
        `
        this.iframe.contentDocument.head.appendChild(style);
    }

    save(onSuccess, onError){
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DOMhelper.unwrapTextNodes(newDom)
        DOMhelper.unWrapImages(newDom)
        const html = DOMhelper.serializeDomToString(newDom);
        axios.post('./api/savePage.php', {pageName: this.currentPage, html })     
            .then(onSuccess)
            .catch(onError)
    }
}