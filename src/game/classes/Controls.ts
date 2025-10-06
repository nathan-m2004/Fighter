export type InputState = {
    key: string;
    gamepadKey: number;
    gamepadAxe: { index: number; negative: boolean };
    pressed: boolean;
    startFramehold: number;
    timeHoldingDelta: number;
};

export type Keys = {
    lightAttack: InputState;
    left: InputState;
    right: InputState;
    up: InputState;
    down: InputState & { delayToLeavePlataform: number };
    dash: InputState;
    jump: InputState;
};

export default class Controls {
    gamepad: { index: any };
    keys: Keys;
    constructor() {
        this.gamepad = { index: undefined };
        this.keys = {
            left: {
                key: "KeyA",
                gamepadKey: undefined,
                gamepadAxe: { index: 0, negative: true },
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
            },
            right: {
                key: "KeyD",
                gamepadKey: undefined,
                gamepadAxe: { index: 0, negative: false },
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
            },
            up: {
                key: "KeyW",
                gamepadKey: undefined,
                gamepadAxe: { index: 1, negative: true },
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
            },
            down: {
                key: "KeyS",
                gamepadKey: undefined,
                gamepadAxe: { index: 1, negative: false },
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
                delayToLeavePlataform: 1.12,
            },
            dash: {
                key: "ShiftLeft",
                gamepadKey: 9,
                gamepadAxe: undefined,
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
            },
            jump: {
                key: "Space",
                gamepadKey: 0,
                gamepadAxe: undefined,
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
            },
            lightAttack: {
                key: "KeyJ",
                gamepadKey: 3,
                gamepadAxe: undefined,
                pressed: false,
                startFramehold: 0,
                timeHoldingDelta: 0,
            },
        };
        window.addEventListener("keydown", (event) => {
            Object.values(this.keys).forEach((action) => {
                if (action.key === event.code && this.gamepad.index === undefined) {
                    if (!action.pressed) {
                        action.timeHoldingDelta = 0;
                        action.startFramehold = 0;
                        action.pressed = true;
                    }
                }
            });
        });
        window.addEventListener("keyup", (event) => {
            Object.values(this.keys).forEach((action) => {
                if (action.key === event.code) {
                    action.pressed = false;
                    action.timeHoldingDelta = 0;
                }
            });
        });
    }
    countTimeHoldingKey(frames: { deltaTime: number }) {
        Object.values(this.keys).forEach((action) => {
            if (action.pressed) {
                action.timeHoldingDelta += frames.deltaTime;
            }
        });
    }
    gamepadUpdate(frames: { currentFrame: number }) {
        const gamepad = navigator.getGamepads()[this.gamepad.index];
        if (!gamepad) return;

        for (const key of Object.keys(this.keys) as Array<keyof Keys>) {
            const button = this.keys[key];

            if (button.gamepadKey !== undefined) {
                if (gamepad.buttons[button.gamepadKey].pressed) {
                    if (!button.pressed) {
                        button.timeHoldingDelta = 0;
                        button.startFramehold = frames.currentFrame;
                    }
                    button.pressed = true;
                } else {
                    button.pressed = false;
                    button.timeHoldingDelta = 0;
                }
            }

            if (button.gamepadAxe !== undefined) {
                if (
                    button.gamepadAxe.negative
                        ? gamepad.axes[button.gamepadAxe.index] <= -0.1
                        : gamepad.axes[button.gamepadAxe.index] >= 0.1
                ) {
                    if (!button.pressed) {
                        button.timeHoldingDelta = 0;
                        button.startFramehold = frames.currentFrame;
                    }
                    button.pressed = true;
                } else {
                    button.pressed = false;
                    button.timeHoldingDelta = 0;
                }
            }
        }
    }
}
