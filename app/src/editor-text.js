module.exports = class EditorText {
    constructor(element, virtualElement){
        this.element = element;
        this.virtualElement = virtualElement;

        this.element.addEventListener('click', ()=> this.onClick());
        this.element.addEventListener('blur', ()=> this.onBlur());
        this.element.addEventListener('keypress', (e)=> this.onKeypress(e));
        this.element.addEventListener('input', ()=> this.onTextEdit());     
        if(this.element.parentNode.nodeName === 'A' || this.element.parentNode.nodeName === 'BUTTON'  ){            
            this.element.addEventListener('contextmenu', (e)=> this.onCtxMenu(e));
        } 

    }
    onClick(){
        this.element.contentEditable = 'true';
        this.element.focus();
    }
    onCtxMenu(e){
        e.preventDefault();
        this.onClick();     
    }
    onBlur(){
        this.element.removeAttribute('contentEditable')
    }
    onKeypress(e){
        if (e.keyCode === 13) {
            this.element.blur();
        }
    }
    onTextEdit(){
        this.virtualElement.innerHTML = this.element.innerHTML;
    }
}