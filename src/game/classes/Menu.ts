export default class Menu {
    path: string;
    html: string;
    constructor(html: string) {
        this.html = html;
    }
    injectHtml() {
        document.body.insertAdjacentHTML("afterbegin", this.html);
    }
}
