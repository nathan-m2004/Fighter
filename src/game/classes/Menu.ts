export default class Menu {
    path: string;
    html: string;
    button: { [key: string]: { id: string; bool: boolean } };
    constructor(html: string) {
        this.html = html;
        this.button;
    }
    injectHtml() {
        document.body.insertAdjacentHTML("afterbegin", this.html);
    }
    buttonHandle() {
        for (const button of Object.values(this.button)) {
            const element = document.getElementById(button.id);
            if (!element) return;
            element.addEventListener("click", (event) => {
                event.stopPropagation();
                if (button.bool) {
                    button.bool = false;
                    document.getElementById(button.id).classList.remove("active");
                } else {
                    button.bool = true;
                    document.getElementById(button.id).classList.add("active");
                }
            });
        }
    }
}
