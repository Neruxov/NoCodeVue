<template>
    <div class="grid grid-cols-1 md:grid-cols-2 grid-areas-1 gap-2.5 bg-neutral-950 text-white overflow-auto md:overflow-hidden w-full h-full absolute p-3">
        <div class="grid-area-a bg-neutral-900 overflow-auto p-5 rounded-xl">
            <h1 class="font-bold text-5xl text-center">Задача №{{ id }} - {{ title }}</h1>
            <div class="text-xl pt-5" v-html="description"></div>

            <h3 class="text-2xl font-bold pt-5 mb-1">Пример вводных данных</h3>
            <code>{{ testInput }}</code>

            <h3 class="text-2xl font-bold pt-5 mb-1">Пример выходных данных</h3>
            <code>{{ testOutput }}</code>
        </div>
        <div class="grid-area-b bg-neutral-900 overflow-auto p-5 rounded-xl">
            <button class="w-full p-2.5 text-2xl font-bold bg-purple-800 rounded-xl mb-5" @click="submit">Сдать решение</button>
            <div class="flex">
                <div class="bg-neutral-800 p-2 pb-1 pt-1 w-[7rem] rounded-xl">
                    <button class="w-full mb-1.5 mt-1.5 h-[3rem] bg-green-700 text-xl font-bold rounded-xl justify-center flex items-center">OK</button>
                    <button class="w-full mb-1.5 mt-1.5 h-[3rem] bg-red-600 text-xl font-bold rounded-xl justify-center flex items-center">WA</button>
                    <button class="w-full mb-1.5 mt-1.5 h-[3rem] bg-cyan-700 text-xl font-bold rounded-xl justify-center flex items-center">TL</button>
                </div>
                <div class="pl-5">
                    <h3 class=" text-xl font-bold">Вводные данные</h3>
                    <code>Hello, World!</code>

                    <h3 class="mt-2 text-xl font-bold">Вводные данные</h3>
                    <code>Hello, World!</code>

                    <h3 class="mt-2 text-xl font-bold">Ваш вывод</h3>
                    <code>Hello, World!</code>
                </div>
            </div>
        </div>
        <div class="grid-area-c bg-neutral-900 overflow-auto p-5 rounded-xl">

            <Listbox v-model="selectedLanguage" @update:model-value="changeEditorLanguage">
                <div class="relative mt-1">
                    <ListboxButton 
                    class="relative w-full cursor-default rounded-lg bg-neutral-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm"
                    >
                    <span class="block truncate text-white text-base font-medium">{{ selectedLanguage.name }}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                        class="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                        />
                    </span>
                    </ListboxButton>

                    <ListboxOptions
                        class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10 absolute">
                        <ListboxOption
                        v-slot="{ active, selected }"
                        v-for="language in languages"
                        :key="language.name"
                        :value="language"
                        as="template">
                        <li
                            :class="[
                            active ? 'bg-neutral-700 text-white' : 'text-gray-300',
                            'relative cursor-default select-none py-2 pl-10 pr-4',
                            ]">
                            <span
                            :class="[
                                selected ? 'font-medium' : 'font-normal',
                                'block truncate text-base',
                            ]"
                            >{{ language.name }}</span>
                            <span
                            v-if="selected"
                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-500"
                            >
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                        </li>
                        </ListboxOption>
                    </ListboxOptions>
                </div>
            </Listbox>

            <div id="editor" class="font-code w-full h-[calc(100%-3.3rem)] mt-2 pt-2 pb-2 rounded-xl bg-neutral-800 relative z-0"></div>
        </div>
    </div>
</template>

<style scoped>
.grid-areas-1 {
    grid-template-areas:
        "a c"
        "a c"
        "b c";
    grid-template-rows: repeat(3, minmax(0, 1fr));
}

@media (max-width: 768px) {
    .grid-areas-1 {
        grid-template-areas:
            "a"
            "b"
            "c";
        grid-template-rows: 66% 33% 100%;
    }
}

.grid-area-a {
    grid-area: a;
}

.grid-area-b {
    grid-area: b;
}

.grid-area-c {
    grid-area: c;
}
</style>

<style>
code {
    font-family: Cascadia Code;
    background-color: rgb(38, 38, 38);
    border-radius: 0.5rem;
    padding: 0.25rem;
}
</style>

<script>
import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import loader from "@monaco-editor/loader";

export default {
    data() {
        return {}
    },

    props: {
        id: Number,
        title: String,
        description: String,
        testInput: String,
        testOutput: String,
        solution: Map,
    },

    methods: {
        submit() {
            console.log(this.selectedLanguage)
        },

        changeEditorLanguage() {
            alert(this.selectedLanguage.data)
        }
    },

    async mounted() {
        loader.init().then((monaco) => {
            monaco.editor.create(document.getElementById('editor'), {
                language: 'python',
                theme: 'vs-dark',
                automaticLayout: true,
                fontSize: 16,
                minimap: {
                    enabled: false
                }
            })

            fetch('/src/assets/vs-dark-v2.json').then((res) => {
                return res.json()
            }).then((theme) => {
                monaco.editor.defineTheme('vs-dark-v2', theme)
                monaco.editor.setTheme('vs-dark-v2')
            })
        })
    },
}
</script>

<script setup>
const languages = [
    { name: 'Python', data: 'PYTHON' },
    { name: 'Java', data: 'JAVA' },
    { name: 'C++', data: 'CPP' }
]

const selectedLanguage = ref(languages[0])
</script>
