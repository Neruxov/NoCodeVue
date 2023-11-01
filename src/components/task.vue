<template>
    <div class="bg-neutral-950 text-white overflow-auto md:overflow-hidden w-full h-full absolute">
        <div class="flex justify-center">
            <div class="font-bold md:ml-3 md:mr-3 md:mt-3 bg-neutral-900 flex justify-between gap-5 p-3 w-full md:w-[60%] md:rounded-xl">
                <div v-if="prevTask == null" class="w-[40%] text-right"></div>
                <button @click="redirectTo('/task/' + prevTask.id)" v-if="prevTask != null"
                        class="w-[40%] text-left">
                    ← {{ prevTask.id }}. {{ prevTask.title }}
                </button>

                <button class="w-[20%] text-center" @click="redirectTo('/tasks')">К списку задач</button>
                
                <button @click="redirectTo('/task/' + nextTask.id)" v-if="nextTask != null"
                        class="w-[40%] text-right">
                    {{ nextTask.id }}. {{ nextTask.title }} →
                </button>
                <div v-if="nextTask == null" class="w-[40%] text-right"></div>
            </div>
        </div>

        <div class="md:grid md:grid-rows-3 md:grid-cols-2 grid-areas-1 gap-2.5 bg-neutral-950 text-white overflow-auto md:overflow-hidden w-full h-full md:h-[calc(100%-3.8rem)] absolute md:p-3">
            <div class="grid-area-a bg-neutral-900 overflow-auto md:rounded-xl justify-between flex flex-col relative">         
                <div>
                    <div class="bg-neutral-925 p-3 pl-4 flex gap-3">
                        <button class="text-gray-300 hover:text-white"
                                v-for="tab in tabs"
                                :class="selectedTab.id == tab.id ? 'text-white' : ''"
                                @click="changeTab(tab)"
                                >{{ tab.name }}</button>
                    </div>

                    <div class="p-5">
                        <div v-if="selectedTab.id == 'solution'">
                            <p v-if="explanation == null" class="pb-1 text-gray-300">Объяснение отсутствует.</p>
                            <div v-if="explanation != null" 
                                class="text-xl pb-3" 
                                v-html="explanation">
                            </div>
                            
                            <p v-if="solutions.length == 0" class="text-gray-300">Решения отсутствуют.</p>
                            <div v-if="solutions.length > 0">
                                <div class="bg-neutral-875 p-2 pl-4 pr-4 flex rounded-t-xl justify-between">
                                    <div class="flex gap-3">
                                        <button class="text-gray-300 hover:text-white"
                                                v-for="solution in solutions"
                                                :class="solution.language == selectedSolution.language ? 'text-white' : ''"
                                                @click="changeSolution(solution)"
                                        >{{ languageNames[solution.language] }}</button>
                                    </div>
                                    <button class="text-neutral-400 hover:text-white"
                                            @click="copyText(selectedSolution.source)">Скопировать</button>
                                </div>
                                <div class="p-2 bg-neutral-925 rounded-b-xl font-code"
                                    v-html="selectedSolutionColorized"></div>
                            </div>
                        </div>

                        <div v-if="selectedTab.id == 'task'">
                            <h1 class="font-bold text-4xl">{{ id }}. {{ title }}</h1>
                            <div v-if="tags.length > 0" class="mt-3 flex gap-1.5">
                                <span v-for="tag in tags" 
                                    class="rounded-2xl pl-2 pr-2 pt-1 pb-1 text-sm"
                                    :class="tagStyles[tag]">{{ tagNames[tag] }}</span>
                            </div>

                            <div class="text-xl pt-3" v-html="description"></div>

                            <div class="flex justify-between pt-3 mb-1">
                                <h3 class="text-2xl font-bold">Пример вводных данных</h3>
                                <button class="text-neutral-400 hover:text-white"
                                                @click="copyText(exampleInput)">Скопировать</button>
                            </div>
                            <pre>{{ exampleInput }}</pre>

                            <div class="flex justify-between pt-3 mb-1">
                                <h3 class="text-2xl font-bold">Пример выходных данных</h3>
                                <button class="text-neutral-400 hover:text-white"
                                                @click="copyText(exampleOutput)">Скопировать</button>
                            </div>
                            <pre>{{ exampleOutput }}</pre>
                        </div>
                    </div>
                </div>

                <Footer class="mb-5 hidden md:block"></Footer>
            </div>

            <div class="grid-area-b bg-neutral-900 overflow-auto p-5 md:rounded-xl h-[66%] md:h-auto">
                <Listbox v-model="selectedLanguage" @update:model-value="changeEditorLanguage">
                    <div class="relative mt-1">
                        <ListboxButton 
                        class="relative w-full cursor-default rounded-lg bg-neutral-925 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-purple-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm"
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
                            class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-925 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10 absolute">
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

                <div id="editor" class="font-code w-full h-[calc(100%-3.3rem)] mt-2 pt-2 pb-2 rounded-xl bg-neutral-925 relative z-0"></div>
            </div>
            <div class="grid-area-c bg-neutral-900 overflow-auto p-5 md:rounded-xl">
                <button class="w-full p-2.5 text-2xl font-bold rounded-xl mb-5" 
                        :class="judging ? 'bg-purple-900' : 'bg-purple-800 hover:bg-purple-700'"
                        @click="submitSolution" :disabled="judging">{{ judging ? "Проверка..." : "Сдать решение" }}</button>

                <div class="flex" v-if="tests.length > 0">
                    <div class="bg-neutral-925 p-2 pb-1 pt-1 w-[7rem] rounded-xl overflow-auto">
                        <button class="w-full mb-1.5 mt-1.5 h-[3rem] text-xl font-bold rounded-xl justify-center flex items-center"
                                :class="selectedTest.id == test.id ? activeTestColors[test.result] : testColors[test.result]"
                                v-for="test in tests"
                                @click="selectTest(test)"
                                >{{ testResults[test.result] }}</button>
                    </div>
                    <div class="pl-5 w-[calc(100%-7rem)]">
                        <div class="flex justify-between">
                            <h3 class="text-xl font-bold">Вводные данные</h3>
                            <button class="text-neutral-400 hover:text-white"
                                            @click="copyText(selectedTest.input)">Скопировать</button>
                        </div>
                        <pre>{{ selectedTest.input }}</pre>

                        <div class="mt-2 flex justify-between">
                            <h3 class="text-xl font-bold">Правильный вывод</h3>
                            <button class="text-neutral-400 hover:text-white"
                                            @click="copyText(selectedTest.correctOutput)">Скопировать</button>
                        </div>
                        <pre>{{ selectedTest.correctOutput }}</pre>

                        <h3 class="mt-2 text-xl font-bold">Ваш вывод</h3>
                        <pre>{{ selectedTest.output }}</pre>

                        <h3 class="mt-2 text-xl font-bold">Использованная память</h3>
                        <pre>{{ selectedTest.memoryUsage }} MB</pre>

                        <h3 class="mt-2 text-xl font-bold">Время работы</h3>
                        <pre>{{ selectedTest.timeUsage }} s</pre>
                    </div>
                </div>
            </div>

        
            <Footer class="block md:hidden bg-neutral-900 pb-5"></Footer>
        </div>
    </div>
</template>

<style scoped>
.grid-areas-1 {
    grid-template-areas:
        "a b"
        "a b"
        "a c";
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
code, pre {
    font-family: Cascadia Code;
    background-color: rgb(32, 32, 32);
    border-radius: 0.5rem;
    padding: 0.25rem;
    font-size: 1rem;
}

pre {
    padding: 0.4rem;
}

a {
    font-weight: bold;
}
</style>

<script setup>
import router from '../router'
import { onMounted, ref } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import loader from "@monaco-editor/loader"
import { tagNames, tagStyles } from '../constants'
import Footer from './footer.vue'

const props = defineProps({
    id: Number,
})

const title = ref("loading...")
const description = ref("loading...")
const exampleInput = ref("loading...")
const exampleOutput = ref("loading...")
const explanation = ref("loading...")
const tags = ref([])

const solutions = ref([])
const selectedSolution = ref({})
const selectedSolutionColorized = ref(null)

const languageNames = {
    'PYTHON': 'Python',
    'JAVA': 'Java',
    'CPP': 'C++'
}

const languages = [
    { name: 'Python', data: 'PYTHON' },
    { name: 'Java', data: 'JAVA' },
    { name: 'C++', data: 'CPP' }
]
const selectedLanguage = ref(languages[0])

const judging = ref(false)

const testColors = {
    ACCEPTED: 'bg-green-700 hover:bg-green-600',
    WRONG_ANSWER: 'bg-red-700 hover:bg-red-600',
    RUNTIME_ERROR: 'bg-red-700 hover:bg-red-600',
    COMPILATION_ERROR: 'bg-red-700 hover:bg-red-600',
    MEMORY_LIMIT: 'bg-red-700 hover:bg-red-600',
    TIME_LIMIT: 'bg-cyan-700 hover:bg-cyan-600',
    SECURITY_VIOLATION: 'bg-yellow-700 hover:bg-yellow-600',
}

const activeTestColors = {
    ACCEPTED: 'bg-green-800',
    WRONG_ANSWER: 'bg-red-800',
    RUNTIME_ERROR: 'bg-red-800',
    COMPILATION_ERROR: 'bg-red-800',
    MEMORY_LIMIT: 'bg-red-800',
    TIME_LIMIT: 'bg-cyan-800',
    SECURITY_VIOLATION: 'bg-yellow-800',
}

const testResults = {
    ACCEPTED: 'OK',
    WRONG_ANSWER: 'WA',
    RUNTIME_ERROR: 'RE',
    COMPILATION_ERROR: 'CE',
    TIME_LIMIT: 'TL',
    MEMORY_LIMIT: 'ML',
    SECURITY_VIOLATION: 'SV',
}

const tests = ref([])
const selectedTest = ref({})

const tabs = [
    { name: 'Условие', id: 'task' },
    { name: 'Решение', id: 'solution' },
]
const selectedTab = ref(tabs[0])

let editor = null

const editorSettings = {
    value: '',
    language: 'python',
    theme: 'vs-dark-v2',
    fontFamily: 'Cascadia Code',
    automaticLayout: true,
    fontSize: 16,
    minimap: {
        enabled: false
    }
}

const nextTask = ref({})
const prevTask = ref({})

const loadTasks = async () => {
    fetch('https://judger.neruxov.xyz/api/v1/tasks/get-all')
        .then(response => response.json())
        .then(data => {
            const index = data.findIndex(task => task.id == props.id)
            if (index == -1) {
                router.push({ name: '404' })
                return
            }

            if (index == 0) {
                prevTask.value = null
            } else {
                prevTask.value = data[index - 1]
            }

            if (index == data.length - 1) {
                nextTask.value = null
            } else {
                nextTask.value = data[index + 1]
            }
        }).catch(err => {
            console.log(err)
        })
}

const redirectTo = (href) => {
    window.location.href = href
}

const loadTask = async () => {
    fetch('https://judger.neruxov.xyz/api/v1/tasks/get?id=' + props.id).then(response => {
        if (response.status != 200) throw new Error('Task not found')
        return response.json();
    }).then(data => {
        title.value = data.title;
        description.value = data.description;
        exampleInput.value = data.exampleInput;
        exampleOutput.value = data.exampleOutput;
        explanation.value = data.explanation;
        tags.value = data.tags;

        const solutionsNew = []
        for (const [key, value] of Object.entries(data.solutions)) {
            solutionsNew.push({
                language: key,
                source: value,
            })
        }

        solutions.value = solutionsNew
        selectedSolution.value = solutionsNew[0]

        if (selectedSolution.value == null) {
            selectedSolutionColorized.value = ""
        }

        document.title = 'NoCode | ' + data.title
    }).catch(error => {
        console.log(error);
        router.push({ name: '404' })
    });
}

const submitSolution = async () => {
    if (judging.value) return
    if (editor.getValue().length == 0) return

    judging.value = true

    fetch('https://judger.neruxov.xyz/api/v1/judger/judge', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            language: selectedLanguage.value.data,
            source: editor.getValue(),
            taskId: props.id,
        })
    }).then((response) => {
        return response.json()
    }).then((response) => {
        let id = 0
        const testsModified = response.tests.map((test) => {
            return {
                id: id++,
                result: test.result,
                input: test.input,
                output: test.output,
                correctOutput: test.correctOutput,
                memoryUsage: test.memoryUsage,
                timeUsage: test.timeUsage,
            }
        })

        tests.value = testsModified
        selectedTest.value = testsModified[0]

        judging.value = false
    })
}

const changeEditorLanguage = async () => {
    localStorage.setItem('sl-' + props.id + '-' + editor.getModel().getLanguageId().toLowerCase(), editor.getValue())

    monaco.editor.setModelLanguage(editor.getModel(), selectedLanguage.value.data.toLowerCase())
    
    if (localStorage.getItem('sl-' + props.id + '-' + selectedLanguage.value.data.toLowerCase()) != null) {
        editor.setValue(localStorage.getItem('sl-' + props.id + '-' + selectedLanguage.value.data.toLowerCase()))
    } else {
        setTemplate(selectedLanguage.value.data)
    }
}

const selectTest = async (test) => {
    selectedTest.value = test
}

const changeTab = async (tab) => {
    selectedTab.value = tab
}

const changeSolution = async (solution) => {
    selectedSolution.value = solution
    colorizeCode(selectedSolution.value.source, selectedSolution.value.language.toLowerCase()).then(response => {
        selectedSolutionColorized.value = response
    })
}

const copyText = async (code) => {
    navigator.clipboard.writeText(code)
}

onMounted(async () => {
    loadTasks()
    loadTask()
    loader.init().then((monaco) => {
        const theme = {
            "base": "vs-dark",
            "inherit": true,
            "colors": {
                "editor.background": "#202020"
            },
            "rules": []
        }

        if (localStorage.getItem('sl-' + props.id + '-' + selectedLanguage.value.data.toLowerCase()) != null) {
            editorSettings.value = localStorage.getItem('sl-' + props.id + '-' + selectedLanguage.value.data.toLowerCase())
        } else {
            setTemplate(selectedLanguage.value.data)
        }

        monaco.editor.defineTheme('vs-dark-v2', theme)
        editor = monaco.editor.create(document.getElementById('editor'), editorSettings)

        setTimeout(() => {
            if (selectedSolutionColorized.value == null) {
                colorizeCode(selectedSolution.value.source, selectedSolution.value.language.toLowerCase()).then(response => {
                    selectedSolutionColorized.value = response
                })
            }
        }, 1000)
    })
})

const colorizeCode = async (code, language) => {
    return monaco.editor.colorize(code, language, editorSettings)
}

const setTemplate = async (language) => {
   fetch('https://judger.neruxov.xyz/api/v1/tasks/template?id=' + props.id + '&language=' + language).then(response => {
        if (response.status != 200) throw new Error('Template not found')
        return response.text();
    }).then(data => {
        editor.setValue(data)
    }).catch(error => {
        console.log(error);
        editor.setValue("")
    }); 
}


window.onbeforeunload = function() {
    localStorage.setItem('sl-' + props.id + '-' + selectedLanguage.value.data.toLowerCase(), editor.getValue())
}
</script>
