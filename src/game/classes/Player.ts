export default class Player {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    color: string;
    position: { x: number; y: number };
    velocity: { x: number; y: number };
    gravity: number;
    size: { width: number; height: number };
    onGround: boolean;
    frames: { animationFrame: number; currentFrame: number; lastFrame: number; deltaTime: number };
    jump: { jumpForce: number; jumpTimes: number; framePressed: number; jumpDelay: number };
    playerMovement: {
        speed: number;
        maxSpeed: number;
        stopping: boolean;
        stopped: boolean;
        stoppingPower: number;
        stoppingFrameStart: number;
        stoppingLengthFrames: number;
        dashing: boolean;
        dashCount: number;
        dashMax: number;
        dashForce: number;
        dashFrameStart: number;
        dashLenghtFrames: number;
    };
    keys: {
        left: { key: string; pressed: boolean };
        right: { key: string; pressed: boolean };
        down: { key: string; pressed: boolean };
        dash: { key: string; pressed: boolean };
        jump: { key: string; pressed: boolean };
    };
    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, gravity: number) {
        this.canvas = canvas;
        this.context = context;
        this.frames = { animationFrame: 0, currentFrame: 0, lastFrame: 0, deltaTime: 0 };

        this.color = "red";
        this.position = { x: x, y: y };
        this.velocity = { x: 0, y: 0 };
        this.size = { width: 100, height: 100 };
        this.gravity = gravity;
        this.jump = { jumpForce: 95, jumpTimes: 0, framePressed: 0, jumpDelay: 300 };
        this.playerMovement = {
            speed: 50,
            maxSpeed: 80,
            stopping: false,
            stopped: true,
            stoppingPower: 22,
            stoppingFrameStart: 0,
            stoppingLengthFrames: 62,
            dashing: false,
            dashCount: 0,
            dashMax: 2,
            dashForce: 150,
            dashFrameStart: 0,
            dashLenghtFrames: 250,
        };

        this.onGround = false;

        this.keys = {
            left: { key: "KeyA", pressed: false },
            right: { key: "KeyD", pressed: false },
            dash: { key: "ShiftLeft", pressed: false },
            down: { key: "KeyS", pressed: false },
            jump: { key: "Space", pressed: false },
        };
        window.addEventListener("keydown", (event) => {
            Object.values(this.keys).forEach((action) => {
                if (action.key === event.code) {
                    action.pressed = true;
                }
            });
        });
        window.addEventListener("keyup", (event) => {
            Object.values(this.keys).forEach((action) => {
                if (action.key === event.code) {
                    action.pressed = false;
                }
            });
        });
    }
    handleMovement() {
        // jump
        if (
            this.keys.jump.pressed === true &&
            this.jump.jumpTimes < 2 &&
            this.frames.currentFrame - this.jump.framePressed >= this.jump.jumpDelay
        ) {
            this.jump.framePressed = this.frames.currentFrame;
            this.velocity.y = 0;
            this.velocity.y = -this.jump.jumpForce;
            this.jump.jumpTimes++;
        }

        // dash
        if (
            this.keys.dash.pressed &&
            !this.playerMovement.dashing &&
            this.playerMovement.dashCount < this.playerMovement.dashMax
        ) {
            if (!this.keys.left.pressed && !this.keys.right.pressed) {
                this.playerMovement.dashing = true;
                this.playerMovement.dashFrameStart = this.frames.currentFrame;

                this.velocity.y = 0;
                this.playerMovement.dashCount++;
            }
            if (this.keys.left.pressed) {
                this.playerMovement.dashing = true;
                this.playerMovement.dashFrameStart = this.frames.currentFrame;

                this.velocity.y = 0;
                this.velocity.x = -this.playerMovement.dashForce;
                this.playerMovement.dashCount++;
            }
            if (this.keys.right.pressed) {
                this.playerMovement.dashing = true;
                this.playerMovement.dashFrameStart = this.frames.currentFrame;

                this.velocity.y = 0;
                this.velocity.x = this.playerMovement.dashForce;
                this.playerMovement.dashCount++;
            }
        }
        if (
            this.frames.currentFrame - this.playerMovement.dashFrameStart >= this.playerMovement.dashLenghtFrames / 2 &&
            this.playerMovement.dashing
        ) {
            this.velocity.x = 0;
        }
        if (
            this.frames.currentFrame - this.playerMovement.dashFrameStart >= this.playerMovement.dashLenghtFrames &&
            this.playerMovement.dashing
        ) {
            this.playerMovement.dashing = false;
        }

        // side
        if (this.keys.left.pressed && !this.playerMovement.dashing) {
            if (this.velocity.x > 0 && !this.playerMovement.stopping) {
                this.playerMovement.stoppingFrameStart = this.frames.currentFrame;
                this.playerMovement.stopping = true;
                return;
            } else {
                this.velocity.x -= this.playerMovement.speed * this.frames.deltaTime;
                if (this.velocity.x <= -this.playerMovement.maxSpeed) {
                    this.velocity.x = -this.playerMovement.maxSpeed;
                }
            }
        }
        if (this.keys.right.pressed && !this.playerMovement.dashing) {
            if (this.velocity.x < 0 && !this.playerMovement.stopping) {
                this.playerMovement.stoppingFrameStart = this.frames.currentFrame;
                this.playerMovement.stopping = true;
                return;
            } else {
                this.velocity.x += this.playerMovement.speed * this.frames.deltaTime;
                if (this.velocity.x >= this.playerMovement.maxSpeed) {
                    this.velocity.x = this.playerMovement.maxSpeed;
                }
            }
        }

        // down
        if (
            this.keys.down.pressed &&
            !this.onGround &&
            this.frames.currentFrame - this.jump.framePressed >= this.jump.jumpDelay
        ) {
            if (this.velocity.y < 0) {
                this.velocity.y = 0;
            } else {
                this.velocity.y += this.playerMovement.speed * this.frames.deltaTime;
            }
        }

        // side movement stopping logic
        if (this.velocity.x !== 0) {
            this.playerMovement.stopped = false;
        }
        if (
            !this.keys.left.pressed &&
            !this.keys.right.pressed &&
            !this.playerMovement.stopping &&
            !this.playerMovement.stopped
        ) {
            this.playerMovement.stopping = true;
            this.playerMovement.stoppingFrameStart = this.frames.currentFrame;
        }
        if (this.playerMovement.stopping) {
            this.velocity.x /= this.playerMovement.stoppingPower * this.frames.deltaTime;
        }
        if (
            this.playerMovement.stoppingLengthFrames <=
                this.frames.currentFrame - this.playerMovement.stoppingFrameStart &&
            this.playerMovement.stopping
        ) {
            this.playerMovement.stopping = false;
            this.playerMovement.stopped = true;
            this.velocity.x = 0;
        }
    }
    physics() {
        if (!this.onGround && !this.playerMovement.dashing) {
            this.velocity.y += this.gravity * this.frames.deltaTime;
        }

        this.position.x += this.velocity.x * this.frames.deltaTime;
        this.position.y += this.velocity.y * this.frames.deltaTime;
    }
    draw() {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);

        this.context.fillStyle = "white"; // Set a color for the text
        this.context.font = "16px Arial"; // Set the font and size
        const text = `Position: (${this.position.x.toFixed(0)}, ${this.position.y.toFixed(0)}), onGround: (${this.onGround})`;
        // Position the text within the rectangle
        this.context.fillText(text, this.position.x + 10, this.position.y + 20);
        this.context.fillText(
            `Velocity: (${this.velocity.x.toFixed(1)}, ${this.velocity.y.toFixed(1)})`,
            this.position.x + 10,
            this.position.y + 40
        );
        this.context.fillText(
            `stopping: (${this.playerMovement.stopping})`,
            this.position.x + 10,
            this.position.y + 60
        );
        this.context.fillText(`dashing: (${this.playerMovement.dashing})`, this.position.x + 10, this.position.y + 80);
        this.context.fillText(`left: (${this.keys.left.pressed})`, this.position.x + 10, this.position.y + 100);
    }
}
