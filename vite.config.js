import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
    plugins: [
        wasm(),
        commonjs()
    ],
    root: 'src'
})