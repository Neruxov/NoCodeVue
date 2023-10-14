<template>
    <div class="grid grid-rows-3 grid-cols-2 grid-areas-1 gap-2.5 bg-neutral-950 text-white overflow-hidden w-full h-full absolute p-3">
        <div class="grid-area-a bg-neutral-900 overflow-auto p-5 rounded-xl relative">
            <h1 class="font-bold text-5xl text-center">Задача №{{ id }} - {{ title }}</h1>
            <div class="text-xl pt-5" v-html="description"></div>

            <h3 class="text-2xl font-bold pt-5 mb-1">Пример вводных данных</h3>
            <code>{{ testInput }}</code>

            <h3 class="text-2xl font-bold pt-5 mb-1">Пример выходных данных</h3>
            <code>{{ testOutput }}</code>
        </div>
        <div class="grid-area-b bg-neutral-900 overflow-auto p-5 rounded-xl relatice">
            <button class="w-full p-2.5 text-2xl font-bold bg-purple-800 rounded-xl mb-5">Сдать решение</button>
        </div>
        <div class="grid-area-c bg-neutral-900 overflow-auto p-5 rounded-xl relative">

            <Listbox v-model="selectedLanguage">
                <div class="relative mt-1">
                    <ListboxButton 
                    class="relative w-full cursor-default rounded-lg bg-neutral-800 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                    >
                    <span class="block truncate text-white">{{ selectedLanguage.name }}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                        class="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                        />
                    </span>
                    </ListboxButton>

                    <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                    >
                    <ListboxOptions
                        class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                                'block truncate',
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
                    </transition>
                </div>
                </Listbox>

            <div id="editor" class="font-code"></div>
        </div>
    </div>
</template>

<style scoped>
.grid-areas-1 {
    grid-template-areas:
        "a c"
        "a c"
        "b c";
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
export default {
    data() {
        return {
            code: '',
            tests: [],
            currentTest: 0
        }
    },

    props: {
        id: Number,
        title: String,
        description: String,
        testInput: String,
        testOutput: String,
        solution: Map,
    },
}
</script>

<script setup>
import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const languages = [
  { name: 'Python' },
  { name: 'Java' },
  { name: 'C++' }
]

const selectedLanguage = ref(languages[0])
</script>
