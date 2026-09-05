import { jsonStore } from "../persistence/json/game.ts"
import { Games } from "../service/interfaces/persistence.ts";

const dependencies: {
    "games": Games
} = {
    "games": jsonStore
}

export { dependencies }