import axios from "axios";
import { Size } from "./Player";

export default class Animations {
    size: Size;
    api: string;
    url: string;
    image: HTMLImageElement;
    constructor(size: Size) {
        this.api = "https://api.thecatapi.com/v1/images/search";
        this.url = undefined;
        this.image = undefined;
        this.size = size;
    }
    getPlayerImage() {
        axios.get(this.api).then((response) => {
            this.url = response.data[0].url;
            this.image = new Image(this.size.width - 10, this.size.height - 10);
            this.image.src = this.url;
        });
    }
}
